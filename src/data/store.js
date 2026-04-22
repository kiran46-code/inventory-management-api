const { seedProducts, seedSuppliers } = require('./seed');

const createStore = () => {
  const products = seedProducts();
  const suppliers = seedSuppliers();
  const alerts = [];

  return { products, suppliers, alerts };
};

module.exports = { createStore };
