# Inventory Management API

[![CI-CD](https://img.shields.io/github/actions/workflow/status/kiran46-code/inventory-management-api/ci-cd.yml?branch=main&label=CI%2FCD)](https://github.com/kiran46-code/inventory-management-api/actions/workflows/ci-cd.yml)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Performance](https://img.shields.io/badge/avg%20response%20time-0.7ms-success)](docs/load-test-results.md)
[![API Docs](https://img.shields.io/badge/docs-api%20endpoints-blue)](docs/api-endpoints.md)

Node.js inventory backend with:

- Product inventory APIs
- Automated low-stock alert generation
- Supplier relationship management
- Advanced search and filtering
- GitHub Actions CI/CD
- Artillery load-test assets and documented results

Designed for inventory operations workflows where product availability, supplier visibility, and performance reporting need to be demonstrated together in one repository.

## Quick start

```bash
npm install
npm start
```

The API runs on `http://localhost:3000`.

## Scripts

- `npm start` starts the API
- `npm test` runs the Node test suite
- `npm run load:test` executes the Artillery scenario
- `npm run load:summary` writes a JSON performance summary to `docs/performance-metrics.json`

## Automated Deployment

The workflow in `.github/workflows/ci-cd.yml` runs tests on pushes and pull requests to `main`.
If the repository secret `RENDER_DEPLOY_HOOK_URL` is set, the `deploy` job triggers an automated Render deployment after CI succeeds.

## Performance target

The Artillery test plan is documented in [docs/load-test-results.md](docs/load-test-results.md). The raw run artifact is committed at `artillery/report.json`, and `npm run load:summary` derives a machine-readable summary in `docs/performance-metrics.json`.

## API documentation

Endpoint documentation lives in [docs/api-endpoints.md](docs/api-endpoints.md).
