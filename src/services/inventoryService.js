const { createdId } = require('../utils/http');
const { toArray, toBoolean, toNumber } = require('../utils/query');

const withSupplier = (product, suppliers) => ({
  ...product,
  supplier: suppliers.find((supplier) => supplier.id === product.supplierId) || null,
  isLowStock: product.stock <= product.reorderLevel
});

const createInventoryService = (store) => {
  const emitLowStockAlert = (product, reason = 'threshold_reached') => {
    const existing = store.alerts.find(
      (alert) => alert.productId === product.id && alert.status === 'open'
    );

    if (existing) {
      existing.triggerCount += 1;
      existing.stock = product.stock;
      existing.updatedAt = new Date().toISOString();
      return existing;
    }

    const alert = {
      id: createdId('alert'),
      productId: product.id,
      sku: product.sku,
      productName: product.name,
      stock: product.stock,
      reorderLevel: product.reorderLevel,
      status: 'open',
      severity: product.stock === 0 ? 'critical' : 'warning',
      reason,
      triggerCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    store.alerts.unshift(alert);
    return alert;
  };

  const closeLowStockAlert = (productId) => {
    const alert = store.alerts.find((entry) => entry.productId === productId && entry.status === 'open');
    if (alert) {
      alert.status = 'resolved';
      alert.updatedAt = new Date().toISOString();
    }
  };

  const ensureAlerts = () => {
    for (const product of store.products) {
      if (product.stock <= product.reorderLevel) {
        emitLowStockAlert(product, 'inventory_scan');
      } else {
        closeLowStockAlert(product.id);
      }
    }
  };

  const listProducts = (params) => {
    ensureAlerts();

    const query = params || {};
    const q = String(query.q || '').toLowerCase();
    const tags = toArray(query.tags);
    const category = query.category;
    const warehouse = query.warehouse;
    const supplierId = query.supplierId;
    const lowStockOnly = toBoolean(query.lowStockOnly);
    const minPrice = toNumber(query.minPrice);
    const maxPrice = toNumber(query.maxPrice);
    const status = query.status;
    const sortBy = query.sortBy || 'name';
    const sortOrder = query.sortOrder === 'desc' ? 'desc' : 'asc';
    const page = Math.max(1, toNumber(query.page) || 1);
    const pageSize = Math.max(1, Math.min(100, toNumber(query.pageSize) || 10));

    let items = store.products.map((product) => withSupplier(product, store.suppliers));

    items = items.filter((product) => {
      if (q) {
        const searchable = [product.name, product.sku, product.category, product.warehouse, ...product.tags]
          .join(' ')
          .toLowerCase();
        if (!searchable.includes(q)) {
          return false;
        }
      }

      if (category && product.category !== category) {
        return false;
      }

      if (warehouse && product.warehouse !== warehouse) {
        return false;
      }

      if (supplierId && product.supplierId !== supplierId) {
        return false;
      }

      if (status && product.status !== status) {
        return false;
      }

      if (tags.length > 0 && !tags.every((tag) => product.tags.includes(tag))) {
        return false;
      }

      if (lowStockOnly === true && !product.isLowStock) {
        return false;
      }

      if (minPrice !== undefined && product.price < minPrice) {
        return false;
      }

      if (maxPrice !== undefined && product.price > maxPrice) {
        return false;
      }

      return true;
    });

    items.sort((left, right) => {
      const a = left[sortBy];
      const b = right[sortBy];

      if (a === b) {
        return 0;
      }

      if (a === undefined) {
        return 1;
      }

      if (b === undefined) {
        return -1;
      }

      const result = a > b ? 1 : -1;
      return sortOrder === 'desc' ? result * -1 : result;
    });

    const total = items.length;
    const offset = (page - 1) * pageSize;
    const paged = items.slice(offset, offset + pageSize);

    return {
      data: paged,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize))
      }
    };
  };

  const getProduct = (id) => {
    const product = store.products.find((entry) => entry.id === id);
    return product ? withSupplier(product, store.suppliers) : null;
  };

  const createProduct = (input) => {
    const product = {
      id: createdId('prd'),
      name: input.name,
      sku: input.sku,
      category: input.category,
      tags: Array.isArray(input.tags) ? input.tags : [],
      price: Number(input.price),
      stock: Number(input.stock),
      reorderLevel: Number(input.reorderLevel),
      supplierId: input.supplierId,
      warehouse: input.warehouse,
      status: input.status || 'active'
    };

    store.products.push(product);
    if (product.stock <= product.reorderLevel) {
      emitLowStockAlert(product, 'created_below_threshold');
    }
    return withSupplier(product, store.suppliers);
  };

  const updateStock = (id, stock) => {
    const product = store.products.find((entry) => entry.id === id);
    if (!product) {
      return null;
    }

    product.stock = Number(stock);
    if (product.stock <= product.reorderLevel) {
      emitLowStockAlert(product, 'stock_update');
    } else {
      closeLowStockAlert(product.id);
    }

    return withSupplier(product, store.suppliers);
  };

  const listAlerts = () => {
    ensureAlerts();
    return store.alerts;
  };

  return {
    createProduct,
    getProduct,
    listAlerts,
    listProducts,
    updateStock
  };
};

module.exports = { createInventoryService };
