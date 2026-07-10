/* ============================================================
   CodeMate - App logic
   Ties together: audience mode, the Analyzer (the brain),
   teacher-style explanations, and an OPTIONAL free AI layer.

   Honesty rule:
   - Bugs & junk are found by the Analyzer (real, deterministic).
   - The AI (if you add a key) ONLY rephrases the explanation in a
     friendlier way. It never invents problems.
   ============================================================ */

const App = {
  audience: 'vibe', // 'vibe' or 'dev'
  lastFindings: [],

  sampleCode: `async function loadUser(id) {
  var result = fetch('/api/user/' + id);
  var data = result.json();

  if (data.role = 'admin') {
    localStorage.setItem('session', data);
  }

  return data;
  console.log('user loaded');
}`,

  init() {
    // Audience toggle
    document.querySelectorAll('.audience button').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.audience = btn.dataset.mode;
        document.querySelectorAll('.audience button').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        // Re-render explanations in the new tone if we already have results
        if (this.lastFindings.length) this.renderFindings(this.lastFindings);
      });
    });

    // Buttons
    document.getElementById('check-btn').addEventListener('click', () => this.run());
    document.getElementById('sample-btn').addEventListener('click', () => {
      document.getElementById('code').value = this.sampleCode;
    });

    // Prefill sample
    document.getElementById('code').value = this.sampleCode;

    // Restore saved AI settings
    const provider = localStorage.getItem('cm-provider') || 'none';
    const key = localStorage.getItem('cm-key') || '';
    document.getElementById('provider').value = provider;
    document.getElementById('api-key').value = key;
    this.updateProviderHint();

    document.getElementById('provider').addEventListener('change', () => {
      localStorage.setItem('cm-provider', document.getElementById('provider').value);
      this.updateProviderHint();
    });
    document.getElementById('api-key').addEventListener('change', () => {
      localStorage.setItem('cm-key', document.getElementById('api-key').value);
    });
  },

  updateProviderHint() {
    const p = document.getElementById('provider').value;
    const hints = {
      none: 'No AI needed — the bug detection above works 100% on its own.',
      groq: 'Get a FREE key (no card) at console.groq.com',
      gemini: 'Get a FREE key (no card) at aistudio.google.com'
    };
    document.getElementById('provider-hint').textContent = hints[p] || '';
    document.getElementById('key-wrap').style.display = p === 'none' ? 'none' : 'block';
  },

  async run() {
    const code = document.getElementById('code').value;
    const result = Analyzer.analyze(code);
    const out = document.getElementById('results');

    // Parse error
    if (!result.ok) {
      out.innerHTML = `
        <div class="parse-error">
          <h3>Your code has a syntax error</h3>
          <p>${this.esc(result.parseError.message)}${result.parseError.line ? ' (around line ' + result.parseError.line + ')' : ''}</p>
        </div>`;
      return;
    }

    this.lastFindings = result.findings;
    this.renderSummary(result.findings);
    this.renderFindings(result.findings);

    // Optional AI enhancement
    const provider = document.getElementById('provider').value;
    const key = document.getElementById('api-key').value;
    if (provider !== 'none' && key && result.findings.length > 0) {
      this.enhanceWithAI(code, result.findings, provider, key);
    }
  },

  renderSummary(findings) {
    const bugs = findings.filter((f) => f.kind === 'bug').length;
    const junk = findings.filter((f) => f.kind === 'junk').length;
    const el = document.getElementById('summary');
    el.style.display = 'flex';
    el.innerHTML = `
      <div class="stat bugs"><div class="num">${bugs}</div><div class="lbl">Bugs to fix</div></div>
      <div class="stat junk"><div class="num">${junk}</div><div class="lbl">Junk to cut</div></div>
      <div class="stat clean"><div class="num">${bugs + junk === 0 ? '✓' : (bugs + junk)}</div><div class="lbl">${bugs + junk === 0 ? 'All clean' : 'Total found'}</div></div>
    `;
  },

  renderFindings(findings) {
    const out = document.getElementById('results');

    if (findings.length === 0) {
      out.innerHTML = `
        <div class="clean-state">
          <div class="big">🎉</div>
          <h3>${this.audience === 'vibe' ? 'Nice — your code looks clean!' : 'No issues detected.'}</h3>
          <p>${this.audience === 'vibe'
            ? "I didn't spot any bugs or junk. You're good to go."
            : 'Static analysis found no bugs, dead code, or redundant patterns.'}</p>
        </div>`;
      return;
    }

    const cards = findings.map((f, i) => {
      const exp = this.teacherExplain(f);
      return `
        <div class="finding ${f.kind}" style="animation-delay:${i * 0.05}s" id="finding-${i}">
          <div class="finding-top">
            <span class="tag ${f.kind}">${f.kind === 'bug' ? 'Bug' : 'Junk'}</span>
            <span class="finding-line">line ${f.line || '?'}</span>
            <span class="finding-title-main">${this.esc(f.title)}</span>
          </div>
          <div class="finding-detail">${this.esc(exp)}</div>
          <div class="finding-fix"><span class="fix-icon">➜</span><span>${this.esc(f.fix)}</span></div>
          <div class="source-tag">Detected by: real code analysis (not AI guessing)</div>
          <div class="ai-slot" id="ai-slot-${i}"></div>
        </div>`;
    }).join('');

    out.innerHTML = `<div class="findings">${cards}</div>`;
  },

  // Teacher layer — SAME real finding, tone adapts to audience
  teacherExplain(f) {
    if (this.audience === 'vibe') {
      // Friendly, plain, encouraging
      return f.detail;
    }
    // Developer: concise + rule id
    return `${f.detail} [${f.ruleId}]`;
  },

  async enhanceWithAI(code, findings, provider, key) {
    // Show loading in each AI slot
    findings.forEach((_, i) => {
      const slot = document.getElementById('ai-slot-' + i);
      if (slot) slot.innerHTML = `<div class="ai-block"><span class="ai-label">Explained by AI…</span><p><span class="spinner"></span>Thinking…</p></div>`;
    });

    const audienceInstruction = this.audience === 'vibe'
      ? 'The user is a beginner / non-technical "vibe coder". Explain very simply, kindly, no jargon, like a friendly teacher. One or two short sentences each.'
      : 'The user is an experienced developer. Be concise and technical. One sentence each.';

    const findingsList = findings.map((f, i) =>
      `${i + 1}. [${f.kind}] line ${f.line}: ${f.title} — ${f.detail}`
    ).join('\n');

    const prompt = `You are a supportive senior engineer sitting beside a developer.
${audienceInstruction}

Here is their code:
\`\`\`javascript
${code}
\`\`\`

A real static analyzer found these issues (do NOT invent new ones, only explain THESE):
${findingsList}

For EACH numbered issue, write one short conversational explanation starting with the number.
Format exactly as: "1. <explanation>" on its own line.`;

    try {
      const text = await this.callAI(prompt, provider, key);
      if (!text) throw new Error('empty');
      // Split AI response by leading numbers
      const parts = text.split(/\n(?=\d+\.)/);
      findings.forEach((_, i) => {
        const slot = document.getElementById('ai-slot-' + i);
        if (!slot) return;
        const match = parts.find((p) => p.trim().startsWith((i + 1) + '.'));
        const clean = match ? match.replace(/^\s*\d+\.\s*/, '').trim() : '';
        slot.innerHTML = clean
          ? `<div class="ai-block"><span class="ai-label">Explained by AI (${provider})</span><p>${this.esc(clean)}</p></div>`
          : '';
      });
    } catch (e) {
      // Graceful: AI failed, but real findings are still shown above
      findings.forEach((_, i) => {
        const slot = document.getElementById('ai-slot-' + i);
        if (slot) slot.innerHTML = '';
      });
      console.warn('AI explanation failed (findings still shown):', e.message);
    }
  },

  async callAI(prompt, provider, key) {
    if (provider === 'groq') {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
        body: JSON.stringify({
          model: 'llama-3.1-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 800
        })
      });
      if (!r.ok) throw new Error('Groq ' + r.status);
      const d = await r.json();
      return d.choices?.[0]?.message?.content;
    }
    if (provider === 'gemini') {
      const r = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + key,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );
      if (!r.ok) throw new Error('Gemini ' + r.status);
      const d = await r.json();
      return d.candidates?.[0]?.content?.parts?.[0]?.text;
    }
    return null;
  },

  esc(s) {
    const d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
