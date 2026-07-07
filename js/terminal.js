/* ============================================
   AI Development Companion - Terminal Intelligence
   Simulated Terminal, Root Cause Analysis
   ============================================ */

class TerminalIntelligence {
  constructor() {
    this.container = null;
    this.outputLines = [];
    this.simulationStarted = false;
    this.currentLineIndex = 0;
  }

  init() {
    this.container = document.getElementById('panel-terminal');
    if (!this.container) return;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Terminal Intelligence</h2>
          <p class="panel-subtitle">Real-time terminal monitoring with AI-powered root cause analysis</p>
        </div>
        <div class="terminal-controls">
          <button class="btn" id="btn-restart-sim">
            <span>&#x1F504;</span> Restart Demo
          </button>
        </div>
      </div>

      <div class="terminal-layout">
        <div class="terminal-main">
          <div class="terminal-window glass-terminal">
            <div class="terminal-titlebar">
              <div class="terminal-dots">
                <span class="dot dot-red"></span>
                <span class="dot dot-yellow"></span>
                <span class="dot dot-green"></span>
              </div>
              <span class="terminal-title">zsh - project build</span>
              <div class="terminal-tabs">
                <span class="terminal-tab active">Build</span>
                <span class="terminal-tab">Tests</span>
                <span class="terminal-tab">Docker</span>
              </div>
            </div>
            <div class="terminal-body" id="terminal-output">
              <div class="terminal-prompt">
                <span class="prompt-user">dev</span><span class="prompt-at">@</span><span class="prompt-host">workspace</span>
                <span class="prompt-path">~/project</span>
                <span class="prompt-symbol">$</span>
                <span class="prompt-command">npm run build</span>
              </div>
            </div>
          </div>
        </div>

        <div class="terminal-analysis">
          <div class="analysis-panel glass-card" id="analysis-panel" style="border-radius: var(--radius-lg); padding: var(--space-lg);">
            <div class="analysis-header">
              <div class="analysis-icon animate-pulse">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5" fill="none"/>
                  <path d="M10 6v4l2.5 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </div>
              <span class="text-sm" style="color: var(--text-secondary);">AI Analysis</span>
            </div>
            <div class="analysis-content" id="analysis-content">
              <p class="text-sm text-tertiary" style="font-style: italic;">Waiting for terminal output to analyze...</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind restart button
    const restartBtn = document.getElementById('btn-restart-sim');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => this.restartSimulation());
    }
  }

  startSimulation() {
    if (this.simulationStarted) return;
    this.simulationStarted = true;
    this.currentLineIndex = 0;
    this.runBuildSimulation();
  }

  restartSimulation() {
    this.simulationStarted = false;
    this.currentLineIndex = 0;
    const output = document.getElementById('terminal-output');
    if (output) {
      output.innerHTML = `
        <div class="terminal-prompt">
          <span class="prompt-user">dev</span><span class="prompt-at">@</span><span class="prompt-host">workspace</span>
          <span class="prompt-path">~/project</span>
          <span class="prompt-symbol">$</span>
          <span class="prompt-command">npm run build</span>
        </div>
      `;
    }
    const analysisContent = document.getElementById('analysis-content');
    if (analysisContent) {
      analysisContent.innerHTML = '<p class="text-sm text-tertiary" style="font-style: italic;">Waiting for terminal output to analyze...</p>';
    }
    setTimeout(() => this.startSimulation(), 500);
  }

  runBuildSimulation() {
    const lines = [
      { text: '> next build', type: 'info', delay: 300 },
      { text: '', type: 'blank', delay: 100 },
      { text: '   Creating an optimized production build...', type: 'info', delay: 800 },
      { text: '', type: 'blank', delay: 200 },
      { text: '   Compiled successfully.', type: 'success', delay: 1200 },
      { text: '', type: 'blank', delay: 100 },
      { text: '   Linting and checking validity of types...', type: 'info', delay: 600 },
      { text: '', type: 'blank', delay: 400 },
      { text: 'error TS2345: Argument of type \'string | undefined\' is not assignable', type: 'error', delay: 800 },
      { text: '  to parameter of type \'string\'.', type: 'error-cont', delay: 100 },
      { text: '', type: 'blank', delay: 50 },
      { text: '  src/services/auth.ts:47:23', type: 'error-location', delay: 200 },
      { text: '', type: 'blank', delay: 50 },
      { text: '    47 |   const token = getSession(userId);', type: 'code', delay: 150 },
      { text: '       |                       ^^^^^^^', type: 'pointer', delay: 100 },
      { text: '', type: 'blank', delay: 50 },
      { text: 'error TS2532: Object is possibly \'undefined\'.', type: 'error', delay: 600 },
      { text: '', type: 'blank', delay: 50 },
      { text: '  src/components/Dashboard/UserProfile.tsx:23:5', type: 'error-location', delay: 200 },
      { text: '', type: 'blank', delay: 50 },
      { text: '    23 |   const name = user.profile.displayName;', type: 'code', delay: 150 },
      { text: '       |               ^^^^^^^^^^^^', type: 'pointer', delay: 100 },
      { text: '', type: 'blank', delay: 300 },
      { text: 'Found 2 errors in 2 files.', type: 'error-summary', delay: 400 },
      { text: '', type: 'blank', delay: 100 },
      { text: 'Build failed with exit code 1', type: 'error', delay: 300 },
    ];

    this.typeLines(lines, 0);
  }

  typeLines(lines, index) {
    if (index >= lines.length) {
      // Build failed - show analysis
      setTimeout(() => this.showRootCauseAnalysis(), 1000);
      return;
    }

    const line = lines[index];
    setTimeout(() => {
      this.addOutputLine(line.text, line.type);
      this.typeLines(lines, index + 1);
    }, line.delay);
  }

  addOutputLine(text, type) {
    const output = document.getElementById('terminal-output');
    if (!output) return;

    const lineEl = document.createElement('div');
    lineEl.className = `terminal-line terminal-${type} animate-fade-in`;
    lineEl.textContent = text;
    output.appendChild(lineEl);
    output.scrollTop = output.scrollHeight;
  }

  showRootCauseAnalysis() {
    const analysisContent = document.getElementById('analysis-content');
    if (!analysisContent) return;

    // First show "analyzing" state
    analysisContent.innerHTML = `
      <div class="analysis-thinking">
        <div class="thinking-dots">
          <span class="thinking-dot"></span>
          <span class="thinking-dot"></span>
          <span class="thinking-dot"></span>
        </div>
        <span class="text-xs text-secondary">Analyzing build output...</span>
      </div>
    `;

    // Set companion to analyzing state
    if (typeof app !== 'undefined') {
      app.setAIState('analyzing');
    }

    setTimeout(() => {
      if (typeof app !== 'undefined') {
        app.setAIState('speaking');
      }

      analysisContent.innerHTML = `
        <div class="root-cause-analysis animate-fade-in-up">
          <div class="rca-header">
            <span class="badge badge-high">Build Failure</span>
            <span class="badge badge-verified">Root Cause Found</span>
          </div>

          <div class="rca-section">
            <h4 class="rca-label">Why</h4>
            <p class="rca-text">The recent PR #247 changed the <code>getSession()</code> function signature to accept <code>string | undefined</code> but the calling code in auth.ts still passes potentially undefined values without a null check.</p>
          </div>

          <div class="rca-section">
            <h4 class="rca-label">Where</h4>
            <p class="rca-text"><code>src/services/auth.ts:47</code> and <code>src/components/Dashboard/UserProfile.tsx:23</code></p>
          </div>

          <div class="rca-section">
            <h4 class="rca-label">What Changed</h4>
            <p class="rca-text">PR #247 (merged 2 hours ago) made the user session nullable to support guest users. The TypeScript strict mode now catches the type mismatch.</p>
          </div>

          <div class="rca-section">
            <h4 class="rca-label">Impact</h4>
            <p class="rca-text">Build blocked. CI/CD pipeline halted. No deployment possible until resolved.</p>
          </div>

          <div class="rca-section">
            <h4 class="rca-label">Recommended Fix</h4>
            <div class="rca-fix glass-subtle" style="border-radius: var(--radius-md); padding: var(--space-md); margin-top: var(--space-sm);">
              <code class="rca-code">
                <span class="code-comment">// auth.ts:47 - Add null check</span><br>
                <span class="code-keyword">const</span> token = userId ? <span class="code-fn">getSession</span>(userId) : <span class="code-keyword">null</span>;<br><br>
                <span class="code-comment">// UserProfile.tsx:23 - Optional chaining</span><br>
                <span class="code-keyword">const</span> name = user?.profile?.displayName ?? <span class="code-string">'Guest'</span>;
              </code>
            </div>
          </div>

          <div class="rca-section">
            <div class="rca-confidence">
              <div class="flex justify-between items-center">
                <h4 class="rca-label">Confidence</h4>
                <span class="text-sm" style="color: var(--accent-emerald);">96%</span>
              </div>
              <div class="confidence-bar" style="margin-top: var(--space-sm);">
                <div class="confidence-fill" style="width: 96%;"></div>
              </div>
            </div>
          </div>

          <div class="rca-verification mt-md">
            <div class="verification-status">
              <span class="badge badge-verified">&#x2705; Verified Fix</span>
              <p class="text-xs text-secondary mt-sm">Applied fix locally, rebuild succeeded, all 47 tests pass.</p>
            </div>
          </div>

          <div class="rca-actions mt-md">
            <button class="btn btn-primary">Apply Fix</button>
            <button class="btn">View Full Diff</button>
            <button class="btn">Dismiss</button>
          </div>
        </div>
      `;

      setTimeout(() => {
        if (typeof app !== 'undefined') {
          app.setAIState('idle');
        }
      }, 3000);
    }, 2500);
  }
}
