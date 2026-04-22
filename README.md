# Inventory Management API

Node.js inventory backend with:

- Product inventory APIs
- Automated low-stock alert generation
- Supplier relationship management
- Advanced search and filtering
- GitHub Actions CI/CD
- Artillery load-test assets and documented results

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
