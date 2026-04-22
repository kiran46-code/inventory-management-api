const seedSuppliers = () => ([
  {
    id: 'sup-001',
    name: 'Northwind Supply Co.',
    contactEmail: 'ops@northwind.example',
    phone: '+1-555-1001',
    region: 'North America',
    categories: ['electronics', 'accessories'],
    rating: 4.8,
    leadTimeDays: 4,
    onTimeDeliveryRate: 98,
    qualityScore: 97,
    activeContracts: 3
  },
  {
    id: 'sup-002',
    name: 'FreshHarvest Wholesale',
    contactEmail: 'buyers@freshharvest.example',
    phone: '+1-555-2002',
    region: 'APAC',
    categories: ['grocery'],
    rating: 4.5,
    leadTimeDays: 2,
    onTimeDeliveryRate: 95,
    qualityScore: 94,
    activeContracts: 2
  },
  {
    id: 'sup-003',
    name: 'Prime Industrial Parts',
    contactEmail: 'account@primeindustrial.example',
    phone: '+1-555-3003',
    region: 'Europe',
    categories: ['hardware', 'tools'],
    rating: 4.7,
    leadTimeDays: 6,
    onTimeDeliveryRate: 96,
    qualityScore: 95,
    activeContracts: 4
  }
]);

const seedProducts = () => ([
  {
    id: 'prd-001',
    name: 'Wireless Barcode Scanner',
    sku: 'ELEC-1001',
    category: 'electronics',
    tags: ['scanner', 'warehouse', 'wireless'],
    price: 189.99,
    stock: 6,
    reorderLevel: 10,
    supplierId: 'sup-001',
    warehouse: 'Bengaluru-A1',
    status: 'active'
  },
  {
    id: 'prd-002',
    name: 'USB-C Docking Station',
    sku: 'ELEC-1002',
    category: 'electronics',
    tags: ['dock', 'usb-c', 'desktop'],
    price: 129.5,
    stock: 24,
    reorderLevel: 8,
    supplierId: 'sup-001',
    warehouse: 'Bengaluru-A1',
    status: 'active'
  },
  {
    id: 'prd-003',
    name: 'Organic Oats Pack',
    sku: 'GROC-2001',
    category: 'grocery',
    tags: ['organic', 'food'],
    price: 8.99,
    stock: 18,
    reorderLevel: 12,
    supplierId: 'sup-002',
    warehouse: 'Mumbai-C3',
    status: 'active'
  },
  {
    id: 'prd-004',
    name: 'Safety Gloves',
    sku: 'HARD-3001',
    category: 'hardware',
    tags: ['safety', 'ppe'],
    price: 14.25,
    stock: 4,
    reorderLevel: 15,
    supplierId: 'sup-003',
    warehouse: 'Pune-D2',
    status: 'active'
  },
  {
    id: 'prd-005',
    name: 'Cordless Impact Driver',
    sku: 'TOOL-3002',
    category: 'tools',
    tags: ['power-tool', 'assembly'],
    price: 249,
    stock: 11,
    reorderLevel: 5,
    supplierId: 'sup-003',
    warehouse: 'Pune-D2',
    status: 'active'
  }
]);

module.exports = { seedProducts, seedSuppliers };
