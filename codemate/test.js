// Quick test harness - proves the analyzer finds real issues in NEW code
// it has never seen. Run with: NODE_OPTIONS="" node test.js

global.acorn = require('./js/acorn.min.js');
const Analyzer = require('./js/analyzer.js');

const tests = [
  {
    name: 'Test 1: classic AI bugs',
    code: `async function loadUser(id) {
  var result = fetch('/api/user/' + id);
  var data = result.json();
  if (data.role = 'admin') {
    localStorage.setItem('session', data);
  }
  return data;
  console.log('done');
}`
  },
  {
    name: 'Test 2: totally different code, different bugs',
    code: `function isEven(n) {
  if (n % 2 == 0) {
    return true;
  } else {
    return false;
  }
}
var count = 0;`
  },
  {
    name: 'Test 3: clean code (should find little/nothing)',
    code: `const add = (a, b) => a + b;
export function greet(name) {
  return \`Hello, \${name}\`;
}`
  }
];

for (const t of tests) {
  console.log('\n=== ' + t.name + ' ===');
  const res = Analyzer.analyze(t.code);
  if (!res.ok) {
    console.log('  PARSE ERROR: ' + res.parseError.message);
    continue;
  }
  if (res.findings.length === 0) {
    console.log('  (no issues found)');
  }
  for (const f of res.findings) {
    console.log(`  [${f.kind.toUpperCase()}] line ${f.line}: ${f.title} (${f.ruleId})`);
  }
}
