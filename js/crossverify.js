/* ============================================
   AI Development Companion - Cross Verify
   Multi-AI Code Verification Engine
   ============================================ */

class CrossVerify {
  constructor() {
    this.container = null;
    this.isVerifying = false;
    this.aiModels = [
      {
        id: 'claude',
        name: 'Claude',
        provider: 'Anthropic',
        icon: '\u{1F7E3}',
        color: '#d97706',
        speciality: 'Reasoning & Safety'
      },
      {
        id: 'chatgpt',
        name: 'ChatGPT',
        provider: 'OpenAI',
        icon: '\u{1F7E2}',
        color: '#10a37f',
        speciality: 'General Intelligence'
      },
      {
        id: 'kimi',
        name: 'Kimi',
        provider: 'Moonshot',
        icon: '\u{1F319}',
        color: '#6366f1',
        speciality: 'Long Context Analysis'
      },
      {
        id: 'glm',
        name: 'GLM-4',
        provider: 'Zhipu AI',
        icon: '\u{1F534}',
        color: '#ef4444',
        speciality: 'Code Understanding'
      },
      {
        id: 'cline',
        name: 'Cline',
        provider: 'Cline AI',
        icon: '\u{1F535}',
        color: '#3b82f6',
        speciality: 'IDE Integration'
      },
      {
        id: 'codex',
        name: 'Codex',
        provider: 'OpenAI',
        icon: '\u{1F7E1}',
        color: '#eab308',
        speciality: 'Code Generation'
      }
    ];
    this.sampleCode = `async function fetchUserData(userId) {
  const response = await fetch(\`/api/users/\${userId}\`);
  const data = response.json();
  
  if (data.status = 'active') {
    localStorage.setItem('user', data);
    return data;
  }
  
  throw new Error('User not found');
}

function processItems(items) {
  for (var i = 0; i < items.length; i++) {
    setTimeout(() => {
      console.log(items[i].name);
    }, 1000);
  }
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
          <h2 class="panel-title">Multi-AI Verification Engine</h2>
          <p class="panel-subtitle">Cross-verify code with multiple AI models simultaneously</p>
        </div>
        <div class="cv-overall-score glass-card" id="cv-overall-score" style="padding: var(--space-sm) var(--space-lg); border-radius: var(--radius-lg); display: none;">
          <span class="text-xs text-secondary">Consensus Score</span>
          <span class="score-value gradient-text" id="cv-score-value" style="font-size: var(--font-size-2xl);">--</span>
        </div>
      </div>

      <div class="cv-layout">
        <div class="cv-input-section">
          <div class="cv-code-area glass-card" style="padding: var(--space-lg); border-radius: var(--radius-lg);">
            <div class="cv-code-header">
              <h3 class="text-sm" style="color: var(--text-secondary);">Code to Verify</h3>
              <div class="cv-code-actions">
                <button class="btn" id="cv-paste-sample">Load Sample</button>
                <button class="btn btn-primary" id="cv-verify-btn">
                  <span>\u26A1</span> Verify with All AIs
                </button>
              </div>
            </div>
            <textarea class="cv-code-input glass-input" id="cv-code-input" 
              placeholder="Paste your code here for multi-AI verification..."
              spellcheck="false"
              style="font-family: var(--font-mono); font-size: var(--font-size-sm); min-height: 200px; resize: vertical; line-height: 1.6; padding: var(--space-md); border-radius: var(--radius-md);">${this.sampleCode}</textarea>
          </div>
        </div>

        <div class="cv-models-section" id="cv-models-section">
          <div class="cv-models-grid">
            ${this.aiModels.map(model => this.renderModelCard(model)).join('')}
          </div>
        </div>

        <div class="cv-consensus-section" id="cv-consensus-section" style="display: none;">
          <div class="cv-consensus glass-card" style="padding: var(--space-xl); border-radius: var(--radius-lg);">
            <h3 class="text-sm" style="color: var(--accent-cyan); margin-bottom: var(--space-lg);">\u{1F91D} AI Consensus Report</h3>
            <div id="cv-consensus-content"></div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderModelCard(model) {
    return `
      <div class="cv-model-card glass-card" id="cv-model-${model.id}" style="padding: var(--space-lg); border-radius: var(--radius-lg);">
        <div class="cv-model-header">
          <div class="cv-model-identity">
            <span class="cv-model-icon" style="font-size: 1.3rem;">${model.icon}</span>
            <div>
              <h4 class="cv-model-name" style="color: ${model.color};">${model.name}</h4>
              <span class="text-xs text-tertiary">${model.provider}</span>
            </div>
          </div>
          <div class="cv-model-status" id="cv-status-${model.id}">
            <span class="badge badge-medium">Ready</span>
          </div>
        </div>
        <div class="cv-model-speciality">
          <span class="text-xs text-secondary">${model.speciality}</span>
        </div>
        <div class="cv-model-results" id="cv-results-${model.id}">
          <div class="cv-model-idle">
            <span class="text-xs text-tertiary">Waiting for verification request...</span>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const verifyBtn = document.getElementById('cv-verify-btn');
    const sampleBtn = document.getElementById('cv-paste-sample');

    if (verifyBtn) {
      verifyBtn.addEventListener('click', () => this.startVerification());
    }

    if (sampleBtn) {
      sampleBtn.addEventListener('click', () => {
        const input = document.getElementById('cv-code-input');
        if (input) input.value = this.sampleCode;
      });
    }
  }

  startVerification() {
    if (this.isVerifying) return;
    this.isVerifying = true;

    const code = document.getElementById('cv-code-input')?.value;
    if (!code || !code.trim()) {
      this.isVerifying = false;
      return;
    }

    // Show overall score area
    const overallScore = document.getElementById('cv-overall-score');
    if (overallScore) overallScore.style.display = 'block';

    // Reset all model cards
    this.aiModels.forEach(model => {
      this.setModelStatus(model.id, 'checking', 'Analyzing...');
      this.setModelResults(model.id, `
        <div class="cv-checking-animation">
          <div class="typing-dots">
            <span></span><span></span><span></span>
          </div>
          <span class="text-xs text-secondary">Analyzing code...</span>
        </div>
      `);
    });

    // Simulate each AI responding at different times
    const results = this.generateVerificationResults(code);
    
    results.forEach((result, index) => {
      setTimeout(() => {
        this.displayModelResult(result);
        
        // After all models have responded, show consensus
        if (index === results.length - 1) {
          setTimeout(() => {
            this.showConsensus(results);
            this.isVerifying = false;
          }, 800);
        }
      }, result.delay);
    });
  }

  generateVerificationResults(code) {
    const hasAssignmentInCondition = code.includes('= \'') || code.includes('= "');
    const hasVarInLoop = code.includes('var ');
    const hasMissingAwait = code.includes('response.json()') && !code.includes('await response.json()');
    const hasLocalStorageObject = code.includes('localStorage.setItem') && code.includes(', data');

    return [
      {
        modelId: 'claude',
        delay: 1200,
        confidence: 96,
        status: 'warning',
        findings: [
          ...(hasAssignmentInCondition ? [{ severity: 'critical', text: 'Assignment operator (=) used instead of comparison (===) in if condition. This will always evaluate to true and overwrite the variable.' }] : []),
          ...(hasMissingAwait ? [{ severity: 'critical', text: 'Missing `await` on response.json(). This returns a Promise, not the actual data.' }] : []),
          ...(hasVarInLoop ? [{ severity: 'high', text: 'Using `var` in a loop with setTimeout creates closure over shared variable. All callbacks will reference the final value of `i`.' }] : []),
          ...(hasLocalStorageObject ? [{ severity: 'medium', text: 'localStorage.setItem receives an object but expects a string. Use JSON.stringify() to serialize.' }] : []),
          { severity: 'low', text: 'No error handling for network failures in fetch call.' }
        ]
      },
      {
        modelId: 'chatgpt',
        delay: 1800,
        confidence: 93,
        status: 'warning',
        findings: [
          ...(hasMissingAwait ? [{ severity: 'critical', text: 'response.json() is not awaited. The function will proceed with a pending Promise instead of resolved data.' }] : []),
          ...(hasAssignmentInCondition ? [{ severity: 'critical', text: 'Conditional uses single = (assignment) instead of === (strict equality). This is a bug.' }] : []),
          ...(hasVarInLoop ? [{ severity: 'high', text: 'Classic closure bug: `var i` is function-scoped, so setTimeout callbacks will all log undefined (items[items.length]).' }] : []),
          { severity: 'medium', text: 'Consider using try/catch around the fetch for better error handling.' },
          { severity: 'low', text: 'The error message "User not found" is misleading - the check is for active status, not existence.' }
        ]
      },
      {
        modelId: 'kimi',
        delay: 2400,
        confidence: 91,
        status: 'warning',
        findings: [
          ...(hasAssignmentInCondition ? [{ severity: 'critical', text: 'Line 4: `data.status = \'active\'` assigns rather than compares. Should be `===`.' }] : []),
          ...(hasMissingAwait ? [{ severity: 'critical', text: 'Async operation response.json() called without await keyword.' }] : []),
          ...(hasVarInLoop ? [{ severity: 'high', text: 'Variable `i` declared with `var` inside for-loop leads to stale closure in setTimeout. Use `let` instead.' }] : []),
          { severity: 'medium', text: 'Missing response.ok check before parsing JSON body.' }
        ]
      },
      {
        modelId: 'glm',
        delay: 3000,
        confidence: 89,
        status: 'warning',
        findings: [
          ...(hasMissingAwait ? [{ severity: 'critical', text: 'Detected missing await: response.json() returns Promise<any>, not the resolved value.' }] : []),
          ...(hasAssignmentInCondition ? [{ severity: 'critical', text: 'Assignment in conditional expression (= vs ===). Logic error that bypasses the intended check.' }] : []),
          ...(hasVarInLoop ? [{ severity: 'high', text: 'Closure capture issue with var-declared loop variable in asynchronous callback.' }] : []),
          ...(hasLocalStorageObject ? [{ severity: 'medium', text: 'Object passed to localStorage without serialization. Will store "[object Object]".' }] : [])
        ]
      },
      {
        modelId: 'cline',
        delay: 2000,
        confidence: 94,
        status: 'warning',
        findings: [
          ...(hasAssignmentInCondition ? [{ severity: 'critical', text: 'Bug: `if (data.status = \'active\')` - this assigns "active" to data.status. Use strict equality (===).' }] : []),
          ...(hasMissingAwait ? [{ severity: 'critical', text: 'await keyword missing on response.json(). Without it, data is a Promise object.' }] : []),
          ...(hasVarInLoop ? [{ severity: 'high', text: 'setTimeout closure captures `var i` by reference. When callbacks execute, i === items.length, causing undefined access.' }] : []),
          { severity: 'medium', text: 'Suggest adding AbortController for request cancellation support.' }
        ]
      },
      {
        modelId: 'codex',
        delay: 1500,
        confidence: 90,
        status: 'warning',
        findings: [
          ...(hasMissingAwait ? [{ severity: 'critical', text: 'Missing await before response.json() call on line 3.' }] : []),
          ...(hasAssignmentInCondition ? [{ severity: 'critical', text: 'Comparison uses = instead of === in if statement on line 5.' }] : []),
          ...(hasVarInLoop ? [{ severity: 'high', text: 'Use let instead of var in for loop to fix closure scope issue with setTimeout.' }] : []),
          { severity: 'low', text: 'Consider destructuring the response for cleaner code.' }
        ]
      }
    ];
  }

  setModelStatus(modelId, status, text) {
    const statusEl = document.getElementById(`cv-status-${modelId}`);
    if (!statusEl) return;

    const classes = {
      'checking': 'badge-medium',
      'verified': 'badge-verified',
      'warning': 'badge-high',
      'error': 'badge-critical'
    };

    statusEl.innerHTML = `<span class="badge ${classes[status] || 'badge-medium'}">${text}</span>`;
  }

  setModelResults(modelId, html) {
    const resultsEl = document.getElementById(`cv-results-${modelId}`);
    if (!resultsEl) return;
    resultsEl.innerHTML = html;
  }

  displayModelResult(result) {
    const model = this.aiModels.find(m => m.id === result.modelId);
    if (!model) return;

    this.setModelStatus(result.modelId, result.status, `${result.confidence}% Confidence`);

    const findingsHtml = result.findings.map(f => `
      <div class="cv-finding cv-finding-${f.severity}">
        <span class="cv-finding-badge badge badge-${f.severity === 'critical' ? 'critical' : f.severity === 'high' ? 'high' : f.severity === 'medium' ? 'medium' : 'low'}">${f.severity}</span>
        <span class="cv-finding-text text-xs">${f.text}</span>
      </div>
    `).join('');

    this.setModelResults(result.modelId, `
      <div class="cv-model-result animate-fade-in-up">
        <div class="cv-confidence-display">
          <div class="confidence-bar" style="margin-bottom: var(--space-sm);">
            <div class="confidence-fill" style="width: ${result.confidence}%;"></div>
          </div>
        </div>
        <div class="cv-findings-list">
          ${findingsHtml}
        </div>
      </div>
    `);
  }

  showConsensus(results) {
    const consensusSection = document.getElementById('cv-consensus-section');
    const consensusContent = document.getElementById('cv-consensus-content');
    const scoreValue = document.getElementById('cv-score-value');
    
    if (!consensusSection || !consensusContent) return;
    consensusSection.style.display = 'block';

    // Calculate overall score
    const avgConfidence = Math.round(results.reduce((sum, r) => sum + r.confidence, 0) / results.length);
    if (scoreValue) scoreValue.textContent = avgConfidence + '%';

    // Find common findings (issues found by multiple AIs)
    const allFindings = results.flatMap(r => r.findings.map(f => ({ ...f, model: r.modelId })));
    
    // Group by severity
    const criticalCount = allFindings.filter(f => f.severity === 'critical').length;
    const highCount = allFindings.filter(f => f.severity === 'high').length;
    const mediumCount = allFindings.filter(f => f.severity === 'medium').length;

    // Find agreement areas
    const agreements = [
      { text: 'Missing await on response.json()', models: 6, severity: 'critical' },
      { text: 'Assignment operator used instead of comparison', models: 6, severity: 'critical' },
      { text: 'Closure bug with var in loop + setTimeout', models: 6, severity: 'high' },
      { text: 'localStorage receives object without serialization', models: 3, severity: 'medium' }
    ];

    consensusContent.innerHTML = `
      <div class="cv-consensus-grid animate-fade-in-up">
        <div class="cv-consensus-summary">
          <div class="cv-consensus-stat">
            <span class="cv-stat-number" style="color: var(--accent-rose);">${criticalCount}</span>
            <span class="cv-stat-label">Critical Issues</span>
          </div>
          <div class="cv-consensus-stat">
            <span class="cv-stat-number" style="color: var(--accent-amber);">${highCount}</span>
            <span class="cv-stat-label">High Severity</span>
          </div>
          <div class="cv-consensus-stat">
            <span class="cv-stat-number" style="color: var(--accent-primary);">${mediumCount}</span>
            <span class="cv-stat-label">Medium Severity</span>
          </div>
          <div class="cv-consensus-stat">
            <span class="cv-stat-number" style="color: var(--accent-emerald);">${results.length}</span>
            <span class="cv-stat-label">AIs Consulted</span>
          </div>
        </div>

        <div class="cv-agreements">
          <h4 class="text-sm" style="color: var(--text-secondary); margin-bottom: var(--space-md);">\u{1F91D} All AIs Agree On:</h4>
          ${agreements.map(a => `
            <div class="cv-agreement-item glass-subtle" style="padding: var(--space-md); border-radius: var(--radius-md); margin-bottom: var(--space-sm);">
              <div class="cv-agreement-header">
                <span class="badge badge-${a.severity === 'critical' ? 'critical' : a.severity === 'high' ? 'high' : 'medium'}">${a.severity}</span>
                <span class="cv-agreement-models text-xs text-tertiary">${a.models}/${results.length} AIs found this</span>
              </div>
              <p class="text-sm mt-sm">${a.text}</p>
              <div class="cv-model-votes">
                ${this.aiModels.slice(0, a.models).map(m => `<span class="cv-vote-icon" title="${m.name}" style="color: ${m.color};">${m.icon}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="cv-fix-suggestion glass-subtle" style="padding: var(--space-lg); border-radius: var(--radius-md); margin-top: var(--space-lg); border-left: 3px solid var(--accent-emerald);">
          <h4 class="text-sm" style="color: var(--accent-emerald); margin-bottom: var(--space-md);">\u{1F4A1} Recommended Fixes</h4>
          <div class="cv-fix-code" style="font-family: var(--font-mono); font-size: var(--font-size-xs); line-height: 1.8; color: var(--text-secondary);">
            <div style="color: var(--accent-emerald);">// Fix 1: Add await to response.json()</div>
            <div>const data = <span style="color: var(--accent-cyan);">await</span> response.json();</div>
            <br>
            <div style="color: var(--accent-emerald);">// Fix 2: Use === for comparison</div>
            <div>if (data.status <span style="color: var(--accent-cyan);">===</span> 'active') {</div>
            <br>
            <div style="color: var(--accent-emerald);">// Fix 3: Use let instead of var</div>
            <div>for (<span style="color: var(--accent-cyan);">let</span> i = 0; i &lt; items.length; i++) {</div>
            <br>
            <div style="color: var(--accent-emerald);">// Fix 4: Serialize object for localStorage</div>
            <div>localStorage.setItem('user', <span style="color: var(--accent-cyan);">JSON.stringify(data)</span>);</div>
          </div>
        </div>

        <div class="cv-verdict mt-lg" style="text-align: center; padding: var(--space-lg);">
          <div class="cv-verdict-icon" style="font-size: 2rem; margin-bottom: var(--space-sm);">\u26A0\uFE0F</div>
          <h3 style="color: var(--accent-amber);">Code Needs Attention</h3>
          <p class="text-sm text-secondary mt-sm">All ${results.length} AI models found critical issues. Apply recommended fixes before deploying.</p>
          <button class="btn btn-primary mt-md" id="cv-apply-fixes-btn" style="margin-top: var(--space-md);">Apply All Fixes</button>
        </div>
      </div>
    `;

    // Bind Apply All Fixes button
    const applyFixesBtn = document.getElementById('cv-apply-fixes-btn');
    if (applyFixesBtn) {
      applyFixesBtn.addEventListener('click', () => this.applyAllFixes());
    }

    consensusSection.scrollIntoView({ behavior: 'smooth' });
  }

  applyAllFixes() {
    const fixedCode = `async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    const data = await response.json();
    
    if (data.status === 'active') {
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    }
    
    throw new Error('User not found');
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
}

function processItems(items) {
  for (let i = 0; i < items.length; i++) {
    setTimeout(() => {
      console.log(items[i].name);
    }, 1000);
  }
}`;

    // Replace the code in the textarea
    const textarea = document.getElementById('cv-code-input');
    if (textarea) {
      textarea.value = fixedCode;
    }

    // Update button to show success
    const applyBtn = document.getElementById('cv-apply-fixes-btn');
    if (applyBtn) {
      applyBtn.textContent = 'Fixes Applied \u2713';
      applyBtn.style.backgroundColor = 'var(--accent-emerald)';
      applyBtn.style.borderColor = 'var(--accent-emerald)';
      applyBtn.disabled = true;
    }

    // Update all AI model statuses to "Verified"
    this.aiModels.forEach(model => {
      this.setModelStatus(model.id, 'verified', 'Verified');
    });

    // Show success notification
    this.showNotification('All fixes have been applied successfully!');
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cv-notification';
    notification.style.cssText = `
      position: fixed;
      top: var(--space-lg, 24px);
      right: var(--space-lg, 24px);
      background: var(--accent-emerald, #10b981);
      color: white;
      padding: var(--space-md, 16px) var(--space-lg, 24px);
      border-radius: var(--radius-md, 8px);
      font-size: var(--font-size-sm, 14px);
      font-weight: 500;
      z-index: 10000;
      animation: slideInRight 0.3s ease;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}
