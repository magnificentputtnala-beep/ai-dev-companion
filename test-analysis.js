// Test script for CrossVerify AST-based analysis engine
// Run with: NODE_OPTIONS="" node test-analysis.js

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Set up global mocks
global.document = { getElementById: () => null };
global.localStorage = { getItem: () => null, setItem: () => {} };

// Load acorn (UMD will detect Node environment and use exports)
const acorn = require(path.join(__dirname, 'js', 'acorn.min.js'));
global.acorn = acorn;

// Load crossverify using vm to get the class into scope
const crossverifyCode = fs.readFileSync(path.join(__dirname, 'js', 'crossverify.js'), 'utf8');
const script = new vm.Script(crossverifyCode);
script.runInThisContext();

const cv = new CrossVerify();

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  PASS: ${message}`);
    passed++;
  } else {
    console.log(`  FAIL: ${message}`);
    failed++;
  }
}

function findByRule(findings, ruleId) {
  return findings.filter(f => f.ruleId === ruleId);
}

// ============ Test 1: var in a for-of loop ============
console.log('\nTest 1: var in for-of loop');
const test1Code = `
for (var item of items) {
  console.log(item);
}
const x = 10;
`;
const test1 = cv.analyzeCode(test1Code);
assert(findByRule(test1, 'no-var').length > 0, 'Detects var declaration in for-of');
assert(findByRule(test1, 'no-assignment-in-condition').length === 0, 'No false positive for assignment-in-condition');

// ============ Test 2: missing await on response.json() ============
console.log('\nTest 2: missing await on .json()');
const test2Code = `
async function getData() {
  const response = await fetch('/api/data');
  const data = response.json();
  return data;
}
`;
const test2 = cv.analyzeCode(test2Code);
assert(findByRule(test2, 'missing-await').length > 0, 'Detects missing await on response.json()');

// Test 2b: correct async/await (no false positive)
console.log('\nTest 2b: correct async/await (no false positive)');
const test2bCode = `
async function getData() {
  const response = await fetch('/api/data');
  const data = await response.json();
  return data;
}
`;
const test2b = cv.analyzeCode(test2bCode);
assert(findByRule(test2b, 'missing-await').length === 0, 'No false positive when await is present');

// ============ Test 3: assignment in condition (= vs ==) ============
console.log('\nTest 3: assignment-in-condition');
const test3Code = `
function check(x) {
  if (x = 5) {
    console.log('yes');
  }
}
`;
const test3 = cv.analyzeCode(test3Code);
assert(findByRule(test3, 'no-assignment-in-condition').length > 0, 'Detects assignment in if condition');

// Test 3b: proper comparison (no false positive)
console.log('\nTest 3b: proper comparison (no false positive)');
const test3bCode = `
function check(x) {
  if (x === 5) {
    console.log('yes');
  }
}
`;
const test3b = cv.analyzeCode(test3bCode);
assert(findByRule(test3b, 'no-assignment-in-condition').length === 0, 'No false positive for === comparison');

// ============ Test 4: localStorage.setItem with object ============
console.log('\nTest 4: localStorage.setItem with object');
const test4Code = `
function save(user) {
  localStorage.setItem('user', user);
}
`;
const test4 = cv.analyzeCode(test4Code);
assert(findByRule(test4, 'no-object-to-localstorage').length > 0, 'Detects non-string localStorage.setItem');

// Test 4b: localStorage.setItem with JSON.stringify (no false positive)
console.log('\nTest 4b: localStorage.setItem with JSON.stringify (no false positive)');
const test4bCode = `
function save(user) {
  localStorage.setItem('user', JSON.stringify(user));
}
`;
const test4b = cv.analyzeCode(test4bCode);
assert(findByRule(test4b, 'no-object-to-localstorage').length === 0, 'No false positive for JSON.stringify');

// ============ Test 5: var-in-closure ============
console.log('\nTest 5: var-in-closure (loop var captured in setTimeout)');
const test5Code = `
function process(items) {
  for (var i = 0; i < items.length; i++) {
    setTimeout(function() {
      console.log(items[i]);
    }, 100);
  }
}
`;
const test5 = cv.analyzeCode(test5Code);
assert(findByRule(test5, 'var-in-closure').length > 0, 'Detects var-in-closure with setTimeout');

// Test 5b: let in loop (no false positive for var-in-closure)
console.log('\nTest 5b: let in loop (no false positive for var-in-closure)');
const test5bCode = `
function process(items) {
  for (let i = 0; i < items.length; i++) {
    setTimeout(function() {
      console.log(items[i]);
    }, 100);
  }
}
`;
const test5b = cv.analyzeCode(test5bCode);
assert(findByRule(test5b, 'var-in-closure').length === 0, 'No false positive for let in loop');

// ============ Test 6: unreachable code ============
console.log('\nTest 6: unreachable code after return');
const test6Code = `
function example() {
  return 42;
  console.log('never reached');
}
`;
const test6 = cv.analyzeCode(test6Code);
assert(findByRule(test6, 'no-unreachable-code').length > 0, 'Detects unreachable code after return');

// ============ Test 7: Clean code (no false positives) ============
console.log('\nTest 7: Clean code produces no findings');
const test7Code = `
async function fetchUser(id) {
  const response = await fetch('/api/user/' + id);
  const data = await response.json();
  
  if (data.role === 'admin') {
    localStorage.setItem('session', JSON.stringify(data));
    console.log('Admin loaded');
  }
  
  for (let i = 0; i < data.items.length; i++) {
    const item = data.items[i];
    setTimeout(() => {
      processItem(item);
    }, 100);
  }
  
  return data;
}
`;
const test7 = cv.analyzeCode(test7Code);
assert(test7.length === 0, 'Clean code produces zero findings');

// ============ Test 8: The sample code from the UI ============
console.log('\nTest 8: Sample code detects all expected issues');
const test8 = cv.analyzeCode(cv.sampleCode);
assert(findByRule(test8, 'no-var').length > 0, 'Sample: detects var usage');
assert(findByRule(test8, 'missing-await').length > 0, 'Sample: detects missing await');
assert(findByRule(test8, 'no-assignment-in-condition').length > 0, 'Sample: detects assignment in condition');
assert(findByRule(test8, 'no-object-to-localstorage').length > 0, 'Sample: detects object to localStorage');
assert(findByRule(test8, 'var-in-closure').length > 0, 'Sample: detects var-in-closure');
assert(findByRule(test8, 'no-unreachable-code').length > 0, 'Sample: detects unreachable code');

// ============ Summary ============
console.log('\n========================================');
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('========================================');

if (failed > 0) {
  process.exit(1);
}
