// NOTE: Multi-model cross-verification (multiple AIs "voting") was intentionally
// removed and deferred. The previous implementation was fabricated output. This
// version uses real AST-based static analysis via Acorn parser. Multi-model
// verification will only be reintroduced once the single pipeline (real parser
// -> single LLM explanation) is proven accurate and trustworthy.

/* ============================================
   AI Development Companion - Code Analyzer
   Real Static Analysis + AI Explanation
   ============================================ */

class CrossVerify {
  constructor() {
    this.container = null;
    this.isAnalyzing = false;
    this.findings = [];
    this.sampleCode = `function loadUser(id) {
  var result = fetch('/api/user/' + id);
  var data = result.json();
  
  if (data.role = 'admin') {
    localStorage.setItem('session', data);
    console.log('Admin loaded');
  }
  
  for (var i = 0; i < data.items.length; i++) {
    setTimeout(function() {
      processItem(data.items[i]);
    }, 100);
  }
  
  return data;
  console.log('done');
}`;
  }

  init() {
    this.container = document.getElementById('panel-crossverify');
    if (!this.container) return;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Code Analyzer</h2>
          <p class="panel-subtitle">Real static analysis powered by AST parsing + AI explanation</p>
        </div>
      </div>

      <div class="cv-layout">
        <div class="cv-input-section">
          <div class="cv-code-area glass-card" style="padding: var(--space-lg); border-radius: var(--radius-lg);">
            <div class="cv-code-header">
              <h3 class="text-sm" style="color: var(--text-secondary);">Code to Analyze</h3>
              <div class="cv-code-actions">
                <button class="btn" id="cv-paste-sample">Load Sample</button>
                <button class="btn btn-primary" id="cv-analyze-btn">
                  <span>&#9889;</span> Run Analysis
                </button>
              </div>
            </div>
            <textarea class="cv-code-input glass-input" id="cv-code-input"
              placeholder="Paste your JavaScript code here for analysis..."
              spellcheck="false"
              style="font-family: var(--font-mono); font-size: var(--font-size-sm); min-height: 200px; resize: vertical; line-height: 1.6; padding: var(--space-md); border-radius: var(--radius-md);">${this.sampleCode}</textarea>
          </div>
        </div>

        <div class="cv-settings-section">
          <details class="glass-card" style="padding: var(--space-lg); border-radius: var(--radius-lg);">
            <summary style="cursor: pointer; color: var(--text-secondary); font-size: var(--font-size-sm); font-weight: 500;">&#9881; AI Explanation Settings</summary>
            <div style="margin-top: var(--space-md);">
              <div style="margin-bottom: var(--space-md);">
                <label class="text-xs text-secondary" style="display: block; margin-bottom: var(--space-xs);">Explanation Provider</label>
                <select id="cv-provider-select" class="glass-input" style="padding: var(--space-sm) var(--space-md); border-radius: var(--radius-md); width: 100%; font-size: var(--font-size-sm);">
                  <option value="none">None (static analysis only)</option>
                  <optgroup label="Free Providers (No Payment Required)">
                    <option value="groq">Groq (Llama 3.1 70B)</option>
                    <option value="gemini">Google Gemini (1.5 Flash)</option>
                    <option value="mistral">Mistral (Small)</option>
                    <option value="cerebras">Cerebras (Llama 3.1 70B)</option>
                  </optgroup>
                  <optgroup label="Paid Providers">
                    <option value="claude">Claude (Anthropic)</option>
                    <option value="chatgpt">ChatGPT (OpenAI)</option>
                  </optgroup>
                </select>
                <p id="cv-provider-help" class="text-xs text-tertiary" style="margin-top: var(--space-xs); font-style: italic;"></p>
              </div>
              <div style="margin-bottom: var(--space-md);">
                <label class="text-xs text-secondary" style="display: block; margin-bottom: var(--space-xs);">API Key</label>
                <input type="password" id="cv-api-key" class="glass-input" placeholder="Enter your API key"
                  style="padding: var(--space-sm) var(--space-md); border-radius: var(--radius-md); width: 100%; font-size: var(--font-size-sm);" />
              </div>
              <p class="text-xs text-tertiary" style="font-style: italic;">API key stored locally in browser only. Never sent to our servers.</p>
            </div>
          </details>
        </div>

        <div class="cv-results-section" id="cv-results-section" style="display: none;">
          <div class="glass-card" style="padding: var(--space-xl); border-radius: var(--radius-lg);">
            <h3 class="text-sm" style="color: var(--accent-cyan); margin-bottom: var(--space-lg);">Analysis Results</h3>
            <div id="cv-results-content"></div>
            <div id="cv-results-summary" style="margin-top: var(--space-lg); padding-top: var(--space-md); border-top: 1px solid rgba(255,255,255,0.1);"></div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.loadSettings();
  }

  bindEvents() {
    const analyzeBtn = document.getElementById('cv-analyze-btn');
    const sampleBtn = document.getElementById('cv-paste-sample');
    const providerSelect = document.getElementById('cv-provider-select');
    const apiKeyInput = document.getElementById('cv-api-key');

    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => this.runAnalysis());
    }
    if (sampleBtn) {
      sampleBtn.addEventListener('click', () => {
        const input = document.getElementById('cv-code-input');
        if (input) input.value = this.sampleCode;
      });
    }
    if (providerSelect) {
      providerSelect.addEventListener('change', () => {
        this.saveSettings();
        this.updateProviderHelp();
      });
    }
    if (apiKeyInput) {
      apiKeyInput.addEventListener('change', () => this.saveSettings());
    }
  }

  loadSettings() {
    try {
      const provider = localStorage.getItem('cv-provider') || 'none';
      const apiKey = localStorage.getItem('cv-api-key') || '';
      const providerSelect = document.getElementById('cv-provider-select');
      const apiKeyInput = document.getElementById('cv-api-key');
      if (providerSelect) providerSelect.value = provider;
      if (apiKeyInput) apiKeyInput.value = apiKey;
      this.updateProviderHelp();
    } catch (e) {
      // localStorage unavailable
    }
  }

  updateProviderHelp() {
    const provider = document.getElementById('cv-provider-select')?.value || 'none';
    const helpEl = document.getElementById('cv-provider-help');
    if (!helpEl) return;

    const helpTexts = {
      none: '',
      groq: 'Get free key at console.groq.com (no credit card)',
      gemini: 'Get free key at aistudio.google.com (no credit card)',
      mistral: 'Get free key at console.mistral.ai',
      cerebras: 'Get free key at cloud.cerebras.ai',
      claude: 'Requires paid API key from console.anthropic.com',
      chatgpt: 'Requires paid API key from platform.openai.com'
    };

    helpEl.textContent = helpTexts[provider] || '';
  }

  saveSettings() {
    try {
      const provider = document.getElementById('cv-provider-select')?.value || 'none';
      const apiKey = document.getElementById('cv-api-key')?.value || '';
      localStorage.setItem('cv-provider', provider);
      localStorage.setItem('cv-api-key', apiKey);
    } catch (e) {
      // localStorage unavailable
    }
  }

  async runAnalysis() {
    if (this.isAnalyzing) return;
    this.isAnalyzing = true;

    const code = document.getElementById('cv-code-input')?.value;
    if (!code || !code.trim()) {
      this.isAnalyzing = false;
      return;
    }

    const resultsSection = document.getElementById('cv-results-section');
    const resultsContent = document.getElementById('cv-results-content');
    const resultsSummary = document.getElementById('cv-results-summary');
    if (resultsSection) resultsSection.style.display = 'block';
    if (resultsContent) {
      resultsContent.innerHTML = '<div class="text-sm text-secondary">Analyzing code...</div>';
    }

    // Step 1: Run AST-based static analysis
    this.findings = this.analyzeCode(code);

    // Step 2: Attempt AI explanation if configured
    let explanations = null;
    const provider = document.getElementById('cv-provider-select')?.value || 'none';
    const apiKey = document.getElementById('cv-api-key')?.value || '';

    if (provider !== 'none' && apiKey) {
      if (resultsContent) {
        resultsContent.innerHTML = '<div class="text-sm text-secondary">Static analysis complete. Fetching AI explanations...</div>';
      }
      explanations = await this.explainFindings(code, this.findings, provider, apiKey);
    }

    // Step 3: Render results
    this.renderResults(this.findings, explanations, provider);
    this.isAnalyzing = false;
  }

  analyzeCode(code) {
    const findings = [];

    let ast;
    try {
      ast = acorn.parse(code, {
        ecmaVersion: 2022,
        sourceType: 'module',
        locations: true
      });
    } catch (e) {
      findings.push({
        line: e.loc ? e.loc.line : 1,
        column: e.loc ? e.loc.column : 0,
        severity: 'error',
        ruleId: 'parse-error',
        message: `Parse error: ${e.message}`
      });
      return findings;
    }

    // Walk the AST
    this.walkNode(ast, findings, []);
    return findings;
  }

  walkNode(node, findings, ancestors) {
    if (!node || typeof node !== 'object') return;

    const currentAncestors = [...ancestors, node];

    // Rule: no-var
    if (node.type === 'VariableDeclaration' && node.kind === 'var') {
      findings.push({
        line: node.loc.start.line,
        column: node.loc.start.column,
        severity: 'warning',
        ruleId: 'no-var',
        message: `Use 'let' or 'const' instead of 'var'. 'var' has function scope which can lead to unexpected behavior.`
      });
    }

    // Rule: no-assignment-in-condition
    if (
      (node.type === 'IfStatement' || node.type === 'WhileStatement' || node.type === 'ForStatement') &&
      node.test && node.test.type === 'AssignmentExpression'
    ) {
      findings.push({
        line: node.test.loc.start.line,
        column: node.test.loc.start.column,
        severity: 'error',
        ruleId: 'no-assignment-in-condition',
        message: `Assignment (=) used in condition instead of comparison (=== or ==). This assigns a value rather than comparing.`
      });
    }

    // Rule: missing-await
    if (node.type === 'CallExpression' && node.callee && node.callee.type === 'MemberExpression') {
      const prop = node.callee.property;
      const obj = node.callee.object;
      if (prop && (prop.name === 'json' || prop.name === 'text' || prop.name === 'blob') &&
          obj && obj.type === 'Identifier' &&
          (obj.name === 'response' || obj.name === 'res' || obj.name === 'result' || obj.name === 'data')) {
        // Check if parent is AwaitExpression
        const parent = ancestors.length > 0 ? ancestors[ancestors.length - 1] : null;
        if (!parent || parent.type !== 'AwaitExpression') {
          // Check if we are inside an async function (optional - report regardless as the call itself is suspicious)
          findings.push({
            line: node.loc.start.line,
            column: node.loc.start.column,
            severity: 'error',
            ruleId: 'missing-await',
            message: `'.${prop.name}()' returns a Promise and likely needs 'await'. Without it, you get a Promise object instead of the resolved value.`
          });
        }
      }
    }

    // Rule: no-object-to-localstorage
    if (node.type === 'CallExpression' && node.callee && node.callee.type === 'MemberExpression') {
      const obj = node.callee.object;
      const prop = node.callee.property;
      if (obj && obj.type === 'Identifier' && obj.name === 'localStorage' &&
          prop && (prop.name === 'setItem') &&
          node.arguments && node.arguments.length >= 2) {
        const secondArg = node.arguments[1];
        // Check if second arg is an Identifier (not a call to JSON.stringify)
        if (secondArg.type === 'Identifier') {
          findings.push({
            line: node.loc.start.line,
            column: node.loc.start.column,
            severity: 'warning',
            ruleId: 'no-object-to-localstorage',
            message: `localStorage.setItem() expects a string, but '${secondArg.name}' is passed directly. Use JSON.stringify(${secondArg.name}) to serialize the value.`
          });
        }
      }
    }

    // Rule: var-in-closure
    if (node.type === 'ForStatement' && node.init && node.init.type === 'VariableDeclaration' && node.init.kind === 'var') {
      const varNames = node.init.declarations.map(d => d.id && d.id.name).filter(Boolean);
      // Check if body contains setTimeout/setInterval/Promise with a function that references the var
      if (varNames.length > 0) {
        const hasClosureIssue = this.checkClosureInBody(node.body, varNames);
        if (hasClosureIssue) {
          findings.push({
            line: node.loc.start.line,
            column: node.loc.start.column,
            severity: 'error',
            ruleId: 'var-in-closure',
            message: `Loop variable '${varNames[0]}' declared with 'var' is captured in an async closure (setTimeout/setInterval/Promise). All iterations will share the same value. Use 'let' instead.`
          });
        }
      }
    }

    // Rule: no-unreachable-code
    if (node.type === 'BlockStatement' && node.body && Array.isArray(node.body)) {
      let foundTerminator = false;
      for (const stmt of node.body) {
        if (foundTerminator) {
          findings.push({
            line: stmt.loc.start.line,
            column: stmt.loc.start.column,
            severity: 'warning',
            ruleId: 'no-unreachable-code',
            message: `Unreachable code detected after return/throw statement.`
          });
          break; // Only report first unreachable statement
        }
        if (stmt.type === 'ReturnStatement' || stmt.type === 'ThrowStatement') {
          foundTerminator = true;
        }
      }
    }

    // Recurse into child nodes
    for (const key of Object.keys(node)) {
      if (key === 'loc' || key === 'start' || key === 'end') continue;
      const child = node[key];
      if (Array.isArray(child)) {
        for (const item of child) {
          if (item && typeof item === 'object' && item.type) {
            this.walkNode(item, findings, currentAncestors);
          }
        }
      } else if (child && typeof child === 'object' && child.type) {
        this.walkNode(child, findings, currentAncestors);
      }
    }
  }

  checkClosureInBody(node, varNames) {
    if (!node || typeof node !== 'object') return false;

    // Check if this is a setTimeout/setInterval/Promise call with a function arg referencing varNames
    if (node.type === 'CallExpression') {
      const callee = node.callee;
      const isTimerCall = (callee && callee.type === 'Identifier' &&
        (callee.name === 'setTimeout' || callee.name === 'setInterval'));
      const isPromiseCall = (callee && callee.type === 'NewExpression' &&
        callee.callee && callee.callee.name === 'Promise');

      if (isTimerCall && node.arguments && node.arguments.length > 0) {
        const fn = node.arguments[0];
        if (fn.type === 'ArrowFunctionExpression' || fn.type === 'FunctionExpression') {
          if (this.functionReferencesVars(fn.body, varNames)) {
            return true;
          }
        }
      }
    }

    // Recurse but don't enter new function scopes (they would have their own var)
    for (const key of Object.keys(node)) {
      if (key === 'loc' || key === 'start' || key === 'end') continue;
      const child = node[key];
      if (Array.isArray(child)) {
        for (const item of child) {
          if (item && typeof item === 'object' && item.type) {
            if (this.checkClosureInBody(item, varNames)) return true;
          }
        }
      } else if (child && typeof child === 'object' && child.type) {
        if (this.checkClosureInBody(child, varNames)) return true;
      }
    }
    return false;
  }

  functionReferencesVars(node, varNames) {
    if (!node || typeof node !== 'object') return false;
    if (node.type === 'Identifier' && varNames.includes(node.name)) return true;

    for (const key of Object.keys(node)) {
      if (key === 'loc' || key === 'start' || key === 'end') continue;
      const child = node[key];
      if (Array.isArray(child)) {
        for (const item of child) {
          if (item && typeof item === 'object' && item.type) {
            if (this.functionReferencesVars(item, varNames)) return true;
          }
        }
      } else if (child && typeof child === 'object' && child.type) {
        if (this.functionReferencesVars(child, varNames)) return true;
      }
    }
    return false;
  }

  async explainFindings(code, findings, provider, apiKey) {
    if (!findings || findings.length === 0) return null;

    const findingsText = findings.map((f, i) =>
      `${i + 1}. [Line ${f.line}] (${f.severity}) ${f.ruleId}: ${f.message}`
    ).join('\n');

    const prompt = `You are a friendly senior developer doing a code review. Here is some JavaScript code and the static analysis findings. Explain each finding conversationally, like a peer would - for example "hey, line 5 is going to break because...". Be concise but helpful.

CODE:
\`\`\`javascript
${code}
\`\`\`

FINDINGS:
${findingsText}

For each finding, provide a brief, conversational explanation. Format your response as a numbered list matching the finding numbers above.`;

    try {
      if (provider === 'claude') {
        return await this.callClaude(prompt, apiKey);
      } else if (provider === 'chatgpt') {
        return await this.callChatGPT(prompt, apiKey);
      } else if (provider === 'groq') {
        return await this.callGroq(prompt, apiKey);
      } else if (provider === 'gemini') {
        return await this.callGemini(prompt, apiKey);
      } else if (provider === 'mistral') {
        return await this.callMistral(prompt, apiKey);
      } else if (provider === 'cerebras') {
        return await this.callCerebras(prompt, apiKey);
      }
    } catch (e) {
      console.error('AI explanation failed:', e);
      return null;
    }
    return null;
  }

  async callClaude(prompt, apiKey) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.content && data.content.length > 0) {
      return data.content[0].text;
    }
    return null;
  }

  async callChatGPT(prompt, apiKey) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      throw new Error(`ChatGPT API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    }
    return null;
  }

  async callGroq(prompt, apiKey) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    }
    return null;
  }

  async callGemini(prompt, apiKey) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.candidates && data.candidates.length > 0 &&
        data.candidates[0].content && data.candidates[0].content.parts &&
        data.candidates[0].content.parts.length > 0) {
      return data.candidates[0].content.parts[0].text;
    }
    return null;
  }

  async callMistral(prompt, apiKey) {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    }
    return null;
  }

  async callCerebras(prompt, apiKey) {
    const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama3.1-70b',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      throw new Error(`Cerebras API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    }
    return null;
  }

  renderResults(findings, explanations, provider) {
    const resultsContent = document.getElementById('cv-results-content');
    const resultsSummary = document.getElementById('cv-results-summary');
    if (!resultsContent) return;

    if (findings.length === 0) {
      resultsContent.innerHTML = `
        <div style="text-align: center; padding: var(--space-xl);">
          <div style="font-size: 2rem; margin-bottom: var(--space-sm);">&#10003;</div>
          <h3 style="color: var(--accent-emerald);">No Issues Found</h3>
          <p class="text-sm text-secondary">The code passed all static analysis checks.</p>
        </div>
      `;
      if (resultsSummary) resultsSummary.innerHTML = '';
      return;
    }

    const errorCount = findings.filter(f => f.severity === 'error').length;
    const warningCount = findings.filter(f => f.severity === 'warning').length;

    const providerLabel = provider === 'claude' ? 'Claude' :
      provider === 'chatgpt' ? 'ChatGPT' :
      provider === 'groq' ? 'Groq' :
      provider === 'gemini' ? 'Gemini' :
      provider === 'mistral' ? 'Mistral' :
      provider === 'cerebras' ? 'Cerebras' : '';

    const findingsHtml = findings.map((f, i) => {
      const severityColor = f.severity === 'error' ? 'var(--accent-rose, #f43f5e)' : 'var(--accent-amber, #f59e0b)';
      const severityBg = f.severity === 'error' ? 'rgba(244,63,94,0.1)' : 'rgba(245,158,11,0.1)';

      let explanationHtml = '';
      if (explanations && provider !== 'none') {
        explanationHtml = `
          <div style="margin-top: var(--space-sm); padding: var(--space-sm) var(--space-md); background: rgba(56,189,248,0.05); border-left: 2px solid var(--accent-cyan, #38bdf8); border-radius: 0 var(--radius-sm) var(--radius-sm) 0;">
            <span class="text-xs" style="color: var(--accent-cyan);">Explained by: ${providerLabel}</span>
          </div>
        `;
      }

      return `
        <div class="cv-finding-item" style="padding: var(--space-md); margin-bottom: var(--space-md); background: ${severityBg}; border-radius: var(--radius-md); border-left: 3px solid ${severityColor};">
          <div style="display: flex; align-items: center; gap: var(--space-sm); flex-wrap: wrap;">
            <span class="text-xs" style="background: ${severityColor}; color: white; padding: 2px 8px; border-radius: var(--radius-sm); font-weight: 600; text-transform: uppercase;">${f.severity}</span>
            <span class="text-xs" style="color: var(--text-tertiary); font-family: var(--font-mono);">Line ${f.line}:${f.column}</span>
            <span class="text-xs" style="color: var(--text-secondary); font-family: var(--font-mono); background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: var(--radius-sm);">${f.ruleId}</span>
          </div>
          <p class="text-sm" style="margin-top: var(--space-sm); color: var(--text-primary);">${f.message}</p>
          <span class="text-xs text-tertiary" style="margin-top: var(--space-xs); display: inline-block;">Detected by: Static Analysis (Acorn AST)</span>
          ${explanationHtml}
        </div>
      `;
    }).join('');

    // If we have explanations, render them as a block below findings
    let aiExplanationBlock = '';
    if (explanations && provider !== 'none') {
      const escapedExplanations = explanations
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
      aiExplanationBlock = `
        <div style="margin-top: var(--space-lg); padding: var(--space-lg); background: rgba(56,189,248,0.05); border: 1px solid rgba(56,189,248,0.2); border-radius: var(--radius-md);">
          <h4 class="text-sm" style="color: var(--accent-cyan); margin-bottom: var(--space-md);">Explained by: ${providerLabel}</h4>
          <div class="text-sm" style="color: var(--text-secondary); line-height: 1.7;">${escapedExplanations}</div>
        </div>
      `;
    }

    resultsContent.innerHTML = findingsHtml + aiExplanationBlock;

    if (resultsSummary) {
      resultsSummary.innerHTML = `
        <div style="display: flex; gap: var(--space-lg); align-items: center; flex-wrap: wrap;">
          <span class="text-sm" style="color: var(--text-secondary);">Summary:</span>
          <span class="text-sm" style="color: var(--accent-rose, #f43f5e); font-weight: 600;">${errorCount} error${errorCount !== 1 ? 's' : ''}</span>
          <span class="text-sm" style="color: var(--accent-amber, #f59e0b); font-weight: 600;">${warningCount} warning${warningCount !== 1 ? 's' : ''}</span>
          <span class="text-sm text-tertiary">${findings.length} total finding${findings.length !== 1 ? 's' : ''}</span>
        </div>
      `;
    }
  }
}
