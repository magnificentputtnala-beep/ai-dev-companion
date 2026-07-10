/* ============================================================
   CodeMate - The Analyzer (The Brain)
   Real, deterministic code analysis using the Acorn AST parser.
   NO AI is used here. This never guesses. It parses your code
   into a tree and inspects the actual structure.

   It finds two kinds of things:
   1. BUGS      - real mistakes that will break or misbehave
   2. JUNK      - unnecessary/bloated code that can be removed
   ============================================================ */

const Analyzer = {
  /**
   * Main entry point. Takes a string of JavaScript code,
   * returns { ok, parseError, findings }.
   * Each finding: { kind: 'bug'|'junk', line, ruleId, title, detail, fix }
   */
  analyze(code) {
    if (!code || !code.trim()) {
      return { ok: true, parseError: null, findings: [] };
    }

    let ast;
    try {
      ast = acorn.parse(code, {
        ecmaVersion: 2022,
        sourceType: 'module',
        locations: true,
        allowReturnOutsideFunction: true,
        allowAwaitOutsideFunction: true
      });
    } catch (e) {
      return {
        ok: false,
        parseError: {
          message: e.message,
          line: e.loc ? e.loc.line : null
        },
        findings: []
      };
    }

    const findings = [];
    const asyncStack = [];

    const push = (f) => findings.push(f);

    // Recursively walk every node in the tree
    const walk = (node, parent) => {
      if (!node || typeof node.type !== 'string') return;

      // Track whether we are inside an async function (for missing-await)
      const isAsyncFn =
        (node.type === 'FunctionDeclaration' ||
          node.type === 'FunctionExpression' ||
          node.type === 'ArrowFunctionExpression') && node.async;
      if (isAsyncFn) asyncStack.push(true);

      this._checkNode(node, parent, push, asyncStack);

      // Walk children
      for (const key in node) {
        if (key === 'type' || key === 'loc' || key === 'start' || key === 'end') continue;
        const child = node[key];
        if (Array.isArray(child)) {
          child.forEach((c) => { if (c && typeof c.type === 'string') walk(c, node); });
        } else if (child && typeof child.type === 'string') {
          walk(child, node);
        }
      }

      if (isAsyncFn) asyncStack.pop();
    };

    walk(ast, null);

    // Sort findings by line number
    findings.sort((a, b) => (a.line || 0) - (b.line || 0));
    return { ok: true, parseError: null, findings };
  },

  _line(node) {
    return node.loc ? node.loc.start.line : null;
  },

  _checkNode(node, parent, push, asyncStack) {
    // ---------- BUG RULES ----------

    // BUG 1: using "var" (function-scoped, causes subtle bugs)
    if (node.type === 'VariableDeclaration' && node.kind === 'var') {
      push({
        kind: 'junk',
        line: this._line(node),
        ruleId: 'no-var',
        title: 'Old "var" keyword used',
        detail: 'This uses "var", which behaves in confusing ways. Modern code uses "let" or "const".',
        fix: 'Replace "var" with "const" (or "let" if the value changes).'
      });
    }

    // BUG 2: assignment (=) inside a condition instead of comparison (===)
    if (
      (node.type === 'IfStatement' ||
        node.type === 'WhileStatement' ||
        node.type === 'DoWhileStatement') &&
      node.test &&
      node.test.type === 'AssignmentExpression'
    ) {
      push({
        kind: 'bug',
        line: this._line(node.test),
        ruleId: 'assignment-in-condition',
        title: 'Assignment inside a condition',
        detail: 'This uses "=" (which SETS a value) instead of "===" (which CHECKS a value). This is almost always a mistake and the condition will behave wrong.',
        fix: 'Change "=" to "===" inside the condition.'
      });
    }

    // BUG 3: missing "await" on a promise-returning call inside async function
    if (
      node.type === 'VariableDeclarator' &&
      node.init &&
      node.init.type === 'CallExpression' &&
      node.init.callee &&
      node.init.callee.type === 'MemberExpression' &&
      node.init.callee.property &&
      ['json', 'text', 'blob', 'formData', 'arrayBuffer'].includes(node.init.callee.property.name) &&
      asyncStack.length > 0
    ) {
      push({
        kind: 'bug',
        line: this._line(node.init),
        ruleId: 'missing-await',
        title: 'Missing "await"',
        detail: 'This calls a function that returns a promise (like .json()) but does not "await" it. The variable will hold a pending promise, not the actual data.',
        fix: 'Add "await" before the call, e.g. "await response.json()".'
      });
    }

    // BUG 4: fetch() result used without await
    if (
      node.type === 'VariableDeclarator' &&
      node.init &&
      node.init.type === 'CallExpression' &&
      node.init.callee &&
      node.init.callee.name === 'fetch' &&
      asyncStack.length > 0
    ) {
      push({
        kind: 'bug',
        line: this._line(node.init),
        ruleId: 'missing-await-fetch',
        title: 'fetch() used without "await"',
        detail: 'fetch() returns a promise. Without "await", the variable holds a promise instead of the response.',
        fix: 'Add "await" before fetch(), e.g. "await fetch(url)".'
      });
    }

    // BUG 5: object passed to localStorage.setItem without JSON.stringify
    if (
      node.type === 'CallExpression' &&
      node.callee &&
      node.callee.type === 'MemberExpression' &&
      node.callee.object &&
      node.callee.object.name === 'localStorage' &&
      node.callee.property &&
      node.callee.property.name === 'setItem' &&
      node.arguments.length >= 2 &&
      node.arguments[1].type === 'Identifier'
    ) {
      push({
        kind: 'bug',
        line: this._line(node),
        ruleId: 'object-to-localstorage',
        title: 'Object saved to localStorage without converting',
        detail: 'localStorage can only store text. Saving an object directly stores the useless text "[object Object]".',
        fix: 'Wrap the value in JSON.stringify(), e.g. localStorage.setItem(key, JSON.stringify(data)).'
      });
    }

    // BUG 6: == or != instead of === or !==
    if (
      node.type === 'BinaryExpression' &&
      (node.operator === '==' || node.operator === '!=')
    ) {
      push({
        kind: 'bug',
        line: this._line(node),
        ruleId: 'loose-equality',
        title: 'Loose equality (' + node.operator + ') used',
        detail: 'Using "' + node.operator + '" can give surprising results because it converts types. For example, 0 == "" is true.',
        fix: 'Use "' + node.operator + '=" instead (strict equality).'
      });
    }

    // ---------- JUNK / BLOAT RULES ----------

    // JUNK 1: unreachable code after return/throw/break/continue
    if (node.type === 'BlockStatement' && Array.isArray(node.body)) {
      let stopped = false;
      for (const stmt of node.body) {
        if (stopped) {
          push({
            kind: 'junk',
            line: this._line(stmt),
            ruleId: 'unreachable-code',
            title: 'Dead code that never runs',
            detail: 'This line comes after a return/throw, so the program never reaches it. It is wasted code.',
            fix: 'Delete this line — it can never execute.'
          });
          break;
        }
        if (['ReturnStatement', 'ThrowStatement', 'BreakStatement', 'ContinueStatement'].includes(stmt.type)) {
          stopped = true;
        }
      }
    }

    // JUNK 2: redundant boolean comparison (=== true / === false)
    if (
      node.type === 'BinaryExpression' &&
      (node.operator === '===' || node.operator === '==') &&
      node.right &&
      node.right.type === 'Literal' &&
      typeof node.right.value === 'boolean'
    ) {
      push({
        kind: 'junk',
        line: this._line(node),
        ruleId: 'redundant-boolean',
        title: 'Unnecessary comparison to true/false',
        detail: 'Comparing to ' + node.right.value + ' is extra noise. The value is already true or false on its own.',
        fix: node.right.value
          ? 'Just write "if (x)" instead of "if (x === true)".'
          : 'Just write "if (!x)" instead of "if (x === false)".'
      });
    }

    // JUNK 3: if (cond) return true; else return false;  -> just return cond
    if (
      node.type === 'IfStatement' &&
      node.consequent &&
      node.alternate &&
      this._isReturnBool(node.consequent) !== null &&
      this._isReturnBool(node.alternate) !== null &&
      this._isReturnBool(node.consequent) !== this._isReturnBool(node.alternate)
    ) {
      push({
        kind: 'junk',
        line: this._line(node),
        ruleId: 'if-return-bool',
        title: 'Long way to return true/false',
        detail: 'This whole if/else just returns true or false based on a condition. That can be a single line.',
        fix: 'Replace the whole block with "return <condition>;" (add ! if needed).'
      });
    }

    // JUNK 4: empty block / empty function
    if (
      node.type === 'BlockStatement' &&
      Array.isArray(node.body) &&
      node.body.length === 0 &&
      parent &&
      (parent.type === 'IfStatement' || parent.type === 'ForStatement' || parent.type === 'WhileStatement')
    ) {
      push({
        kind: 'junk',
        line: this._line(node),
        ruleId: 'empty-block',
        title: 'Empty block that does nothing',
        detail: 'This block is empty — it has no code inside. It serves no purpose.',
        fix: 'Remove the empty block, or add the code that was meant to go here.'
      });
    }

    // JUNK 5: console.log left in code
    if (
      node.type === 'CallExpression' &&
      node.callee &&
      node.callee.type === 'MemberExpression' &&
      node.callee.object &&
      node.callee.object.name === 'console' &&
      node.callee.property &&
      node.callee.property.name === 'log'
    ) {
      push({
        kind: 'junk',
        line: this._line(node),
        ruleId: 'leftover-console-log',
        title: 'Leftover console.log',
        detail: 'A console.log is here. These are usually debugging leftovers that should not ship to real users.',
        fix: 'Remove this console.log before shipping (keep it only if you truly need it).'
      });
    }
  },

  // Helper: returns true/false if a statement is "return true/false", else null
  _isReturnBool(node) {
    let stmt = node;
    if (node.type === 'BlockStatement') {
      if (node.body.length !== 1) return null;
      stmt = node.body[0];
    }
    if (
      stmt &&
      stmt.type === 'ReturnStatement' &&
      stmt.argument &&
      stmt.argument.type === 'Literal' &&
      typeof stmt.argument.value === 'boolean'
    ) {
      return stmt.argument.value;
    }
    return null;
  }
};

// Make it usable both in browser and in Node (for testing)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Analyzer;
}
