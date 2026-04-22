const http = require('node:http');
const { createStore } = require('./data/store');
const { createInventoryService } = require('./services/inventoryService');
const { createSupplierService } = require('./services/supplierService');
const { badRequest, json, notFound, readJson } = require('./utils/http');

const createApp = () => {
  const store = createStore();
  const inventory = createInventoryService(store);
  const suppliers = createSupplierService(store);

  const requestHandler = async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      const path = url.pathname;
      const params = Object.fromEntries(url.searchParams.entries());

      if (req.method === 'GET' && path === '/health') {
        return json(res, 200, { status: 'ok', timestamp: new Date().toISOString() });
      }

      if (req.method === 'GET' && path === '/api/products') {
        return json(res, 200, inventory.listProducts(params));
      }

      if (req.method === 'POST' && path === '/api/products') {
        const body = await readJson(req);
        if (!body.name || !body.sku || !body.category || !body.supplierId) {
          return badRequest(res, 'name, sku, category, and supplierId are required');
        }
        return json(res, 201, inventory.createProduct(body));
      }

      if (req.method === 'GET' && path.startsWith('/api/products/')) {
        const id = path.split('/')[3];
        const product = inventory.getProduct(id);
        return product ? json(res, 200, product) : notFound(res);
      }

      if (req.method === 'PATCH' && path.startsWith('/api/products/') && path.endsWith('/stock')) {
        const segments = path.split('/');
        const id = segments[3];
        const body = await readJson(req);
        if (body.stock === undefined) {
          return badRequest(res, 'stock is required');
        }
        const updated = inventory.updateStock(id, body.stock);
        return updated ? json(res, 200, updated) : notFound(res);
      }

      if (req.method === 'GET' && path === '/api/alerts/low-stock') {
        return json(res, 200, { data: inventory.listAlerts() });
      }

      if (req.method === 'GET' && path === '/api/suppliers') {
        return json(res, 200, { data: suppliers.listSuppliers() });
      }

      if (req.method === 'POST' && path === '/api/suppliers') {
        const body = await readJson(req);
        if (!body.name || !body.contactEmail) {
          return badRequest(res, 'name and contactEmail are required');
        }
        return json(res, 201, suppliers.createSupplier(body));
      }

      if (req.method === 'GET' && path.startsWith('/api/suppliers/')) {
        const id = path.split('/')[3];
        const supplier = suppliers.getSupplier(id);
        return supplier ? json(res, 200, supplier) : notFound(res);
      }

      return notFound(res);
    } catch (error) {
      if (error instanceof SyntaxError) {
        return badRequest(res, 'Invalid JSON payload');
      }

      return json(res, 500, { error: 'Internal server error', details: error.message });
    }
  };

  const server = http.createServer(requestHandler);

  return { requestHandler, server, store };
};

module.exports = { createApp };
