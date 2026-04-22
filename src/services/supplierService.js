const { createdId } = require('../utils/http');

const createSupplierService = (store) => {
  const listSuppliers = () => {
    return store.suppliers.map((supplier) => {
      const suppliedProducts = store.products.filter((product) => product.supplierId === supplier.id);
      const inventoryValue = suppliedProducts.reduce((sum, product) => sum + (product.price * product.stock), 0);

      return {
        ...supplier,
        suppliedProductCount: suppliedProducts.length,
        inventoryValue: Number(inventoryValue.toFixed(2)),
        lowStockProductCount: suppliedProducts.filter((product) => product.stock <= product.reorderLevel).length
      };
    });
  };

  const getSupplier = (id) => listSuppliers().find((supplier) => supplier.id === id) || null;

  const createSupplier = (input) => {
    const supplier = {
      id: createdId('sup'),
      name: input.name,
      contactEmail: input.contactEmail,
      phone: input.phone,
      region: input.region,
      categories: Array.isArray(input.categories) ? input.categories : [],
      rating: Number(input.rating || 0),
      leadTimeDays: Number(input.leadTimeDays || 0),
      onTimeDeliveryRate: Number(input.onTimeDeliveryRate || 0),
      qualityScore: Number(input.qualityScore || 0),
      activeContracts: Number(input.activeContracts || 0)
    };

    store.suppliers.push(supplier);
    return supplier;
  };

  return { createSupplier, getSupplier, listSuppliers };
};

module.exports = { createSupplierService };
