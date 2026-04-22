const fs = require('node:fs');
const path = require('node:path');

const reportPath = path.join(__dirname, '..', 'artillery', 'report.json');
const outputPath = path.join(__dirname, '..', 'docs', 'performance-metrics.json');

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const counters = report.aggregate?.counters || {};
const summaries = report.aggregate?.summaries || {};
const responseTime = summaries['http.response_time'] || {};

const summary = {
  generatedAt: new Date().toISOString(),
  source: 'artillery/report.json',
  totals: {
    requests: counters['http.requests'] || 0,
    successResponses: counters['http.responses'] || 0,
    errors: counters['vusers.failed'] || 0
  },
  responseTimeMs: {
    average: responseTime.mean || 0,
    p95: responseTime.p95 || 0,
    p99: responseTime.p99 || 0,
    max: responseTime.max || 0
  },
  passThresholds: {
    averageBelow500ms: (responseTime.mean || 0) < 500
  }
};

fs.writeFileSync(outputPath, `${JSON.stringify(summary, null, 2)}\n`);
console.log(`Wrote ${outputPath}`);
