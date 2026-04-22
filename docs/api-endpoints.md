# API Endpoints

Base URL: `http://localhost:3000`

## Health

### `GET /health`

Returns service health and timestamp.

## Products

### `GET /api/products`

Supports advanced search and filtering:

- `q`: free-text search across name, sku, category, warehouse, and tags
- `category`
- `warehouse`
- `supplierId`
- `status`
- `tags`: comma-separated tag list
- `lowStockOnly=true`
- `minPrice`
- `maxPrice`
- `sortBy`: `name`, `price`, `stock`, `category`, `warehouse`
- `sortOrder`: `asc` or `desc`
- `page`
- `pageSize`

### `POST /api/products`

Creates a product and automatically opens a low-stock alert when `stock <= reorderLevel`.

Sample payload:

```json
{
  "name": "Thermal Label Printer",
  "sku": "ELEC-1010",
  "category": "electronics",
  "tags": ["printer", "warehouse"],
  "price": 215,
  "stock": 5,
  "reorderLevel": 8,
  "supplierId": "sup-001",
  "warehouse": "Bengaluru-A1"
}
```

### `GET /api/products/:id`

Returns a single product with embedded supplier details and `isLowStock`.

### `PATCH /api/products/:id/stock`

Updates stock quantity and refreshes the low-stock alert state.

Sample payload:

```json
{
  "stock": 3
}
```

## Low-stock alerts

### `GET /api/alerts/low-stock`

Returns all generated alert records with severity, status, timestamps, and trigger count.

## Suppliers

### `GET /api/suppliers`

Returns suppliers plus relationship metrics:

- `suppliedProductCount`
- `inventoryValue`
- `lowStockProductCount`

### `POST /api/suppliers`

Creates a supplier profile.

Sample payload:

```json
{
  "name": "Urban Retail Imports",
  "contactEmail": "procurement@urbanretail.example",
  "phone": "+1-555-4004",
  "region": "Middle East",
  "categories": ["accessories"],
  "rating": 4.6,
  "leadTimeDays": 5,
  "onTimeDeliveryRate": 97,
  "qualityScore": 96,
  "activeContracts": 1
}
```

### `GET /api/suppliers/:id`

Returns one supplier profile with relationship metrics.
