# Artillery Load Test Results

## Scenario

- Tool: Artillery
- Config: `artillery/inventory-load-test.yml`
- Duration: `30s`
- Arrival rate: `20` virtual users/second
- Endpoints exercised:
  - `GET /health`
  - `GET /api/products?category=electronics&sortBy=price&sortOrder=desc`
  - `GET /api/products?lowStockOnly=true&page=1&pageSize=5`
  - `GET /api/suppliers`
  - `GET /api/alerts/low-stock`

## Results

Run captured locally on `2026-04-22`.

- Total requests: `3000`
- HTTP 200 responses: `3000`
- Error rate: `0.00%`
- Average response time: `0.7ms`
- p95 response time: `1ms`
- p99 response time: `2ms`

The measured average response time is below the required `500ms` threshold.

## Reproduce

1. Start the API with `npm start`
2. Run `npm run load:test`
3. Generate the summary artifact with `npm run load:summary`
