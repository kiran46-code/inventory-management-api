const test = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const { createApp } = require('../src/server');

const startServer = async () => {
  const { server } = createApp();
  server.listen(0);
  await once(server, 'listening');
  const address = server.address();

  return {
    server,
    baseUrl: `http://127.0.0.1:${address.port}`
  };
};

test('lists products with advanced filtering', async () => {
  const { server, baseUrl } = await startServer();

  try {
    const response = await fetch(`${baseUrl}/api/products?category=electronics&lowStockOnly=true`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.data.length, 1);
    assert.equal(body.data[0].sku, 'ELEC-1001');
  } finally {
    server.close();
  }
});

test('creates low stock alert after stock update', async () => {
  const { server, baseUrl } = await startServer();

  try {
    const stockResponse = await fetch(`${baseUrl}/api/products/prd-002/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: 3 })
    });
    const stockBody = await stockResponse.json();
    assert.equal(stockResponse.status, 200);
    assert.equal(stockBody.isLowStock, true);

    const alertResponse = await fetch(`${baseUrl}/api/alerts/low-stock`);
    const alertBody = await alertResponse.json();
    const alert = alertBody.data.find((entry) => entry.productId === 'prd-002' && entry.status === 'open');

    assert.ok(alert);
    assert.equal(alert.stock, 3);
  } finally {
    server.close();
  }
});

test('returns supplier relationship metrics', async () => {
  const { server, baseUrl } = await startServer();

  try {
    const response = await fetch(`${baseUrl}/api/suppliers/sup-003`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.suppliedProductCount, 2);
    assert.equal(body.lowStockProductCount, 1);
  } finally {
    server.close();
  }
});
