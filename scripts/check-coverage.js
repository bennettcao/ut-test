const fs = require('fs');
const path = require('path');

const COVERAGE_FILE = path.join(__dirname, '../coverage/coverage-summary.json');
const THRESHOLD = 80;

try {
  const coverage = JSON.parse(fs.readFileSync(COVERAGE_FILE, 'utf8'));
  const total = coverage.total;

  const checks = {
    lines: total.lines.pct,
    statements: total.statements.pct,
    functions: total.functions.pct,
    branches: total.branches.pct
  };

  let failed = false;
  Object.entries(checks).forEach(([key, value]) => {
    if (value < THRESHOLD) {
      console.error(`❌ ${key} coverage (${value}%) is below threshold (${THRESHOLD}%)`);
      failed = true;
    } else {
      console.log(`✅ ${key} coverage: ${value}%`);
    }
  });

  if (failed) {
    process.exit(1);
  }
} catch (error) {
  console.error('Error reading coverage file:', error);
  process.exit(1);
} 