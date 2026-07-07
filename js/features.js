/* ============================================
   AI Development Companion - Features Showcase
   Platform Capabilities Grid
   ============================================ */

class Features {
  constructor() {
    this.container = null;
  }

  init() {
    this.container = document.getElementById('panel-features');
    if (!this.container) return;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Platform Intelligence</h2>
          <p class="panel-subtitle">Advanced AI-powered development capabilities</p>
        </div>
      </div>

      <div class="features-grid">
        ${this.renderFeatureCards()}
      </div>
    `;
  }

  renderFeatureCards() {
    const features = [
      {
        id: 'project-intel',
        icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
        </svg>`,
        title: 'Project Intelligence',
        description: 'Automatically detects project structure, frameworks, dependencies, and architecture patterns.',
        color: 'var(--accent-primary)',
        details: [
          { label: 'Language', value: 'TypeScript 5.3' },
          { label: 'Framework', value: 'Next.js 14' },
          { label: 'Architecture', value: 'Feature-based modules' },
          { label: 'Package Manager', value: 'pnpm 8.x' },
          { label: 'Testing', value: 'Vitest + Testing Library' },
          { label: 'Styling', value: 'Tailwind CSS 3.4' }
        ]
      },
      {
        id: 'code-verify',
        icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/>
        </svg>`,
        title: 'Code Verification',
        description: 'Every AI suggestion is verified against your codebase, tests, and type system before presenting.',
        color: 'var(--accent-emerald)',
        stats: [
          { label: 'Suggestions Verified', value: '2,847' },
          { label: 'Errors Caught', value: '156' },
          { label: 'Accuracy Rate', value: '99.2%' }
        ]
      },
      {
        id: 'bug-predict',
        icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`,
        title: 'Predictive Bug Detection',
        description: 'Machine learning models predict where bugs are likely to emerge based on code patterns and history.',
        color: 'var(--accent-amber)',
        predictions: [
          { file: 'services/auth.ts', confidence: 87, risk: 'Type coercion edge case' },
          { file: 'hooks/useSession.ts', confidence: 72, risk: 'Race condition potential' },
          { file: 'api/payments.ts', confidence: 65, risk: 'Missing error boundary' }
        ]
      },
      {
        id: 'dep-doctor',
        icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
        </svg>`,
        title: 'Dependency Doctor',
        description: 'Continuous monitoring of dependencies for vulnerabilities, conflicts, and update recommendations.',
        color: 'var(--accent-rose)',
        deps: [
          { name: 'lodash', status: 'vulnerable', version: '4.17.20', fix: '4.17.21' },
          { name: 'react-query', status: 'outdated', version: '3.39.0', fix: '5.x (TanStack)' },
          { name: 'next', status: 'healthy', version: '14.0.4', fix: null }
        ]
      },
      {
        id: 'arch-guard',
        icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>
          <path d="M10 6.5h4M6.5 10v4M17.5 10v4M10 17.5h4" stroke-dasharray="2 2"/>
        </svg>`,
        title: 'Architecture Guardian',
        description: 'Enforces architectural boundaries and detects violations before they reach code review.',
        color: 'var(--accent-secondary)',
        violations: [
          { rule: 'Layer dependency', from: 'UI -> Data', severity: 'warning' },
          { rule: 'Circular import', from: 'auth <-> session', severity: 'error' }
        ]
      },
      {
        id: 'git-intel',
        icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="3"/><circle cx="6" cy="6" r="2"/><circle cx="18" cy="18" r="2"/>
          <path d="M12 9V6.5a.5.5 0 00-.5-.5H8M12 15v2.5a.5.5 0 00.5.5H16"/>
        </svg>`,
        title: 'Git Intelligence',
        description: 'Pre-commit analysis that identifies risks, breaking changes, and missing tests before you push.',
        color: 'var(--accent-cyan)',
        analysis: [
          { type: 'Risk', text: '3 files with > 200 line changes', level: 'medium' },
          { type: 'Missing', text: 'No tests for new utility function', level: 'high' },
          { type: 'Breaking', text: 'API response shape changed', level: 'critical' }
        ]
      }
    ];

    return features.map(feature => this.renderCard(feature)).join('');
  }

  renderCard(feature) {
    let detailsHtml = '';

    if (feature.details) {
      detailsHtml = `
        <div class="feature-details">
          ${feature.details.map(d => `
            <div class="feature-detail-row">
              <span class="detail-label">${d.label}</span>
              <span class="detail-value">${d.value}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (feature.stats) {
      detailsHtml = `
        <div class="feature-stats">
          ${feature.stats.map(s => `
            <div class="feature-stat">
              <span class="stat-value">${s.value}</span>
              <span class="stat-label">${s.label}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (feature.predictions) {
      detailsHtml = `
        <div class="feature-predictions">
          ${feature.predictions.map(p => `
            <div class="prediction-row">
              <div class="prediction-info">
                <span class="prediction-file">${p.file}</span>
                <span class="prediction-risk">${p.risk}</span>
              </div>
              <div class="prediction-confidence">
                <div class="confidence-bar" style="width: 60px;">
                  <div class="confidence-fill" style="width: ${p.confidence}%; background: ${p.confidence > 80 ? 'var(--accent-rose)' : p.confidence > 70 ? 'var(--accent-amber)' : 'var(--accent-primary)'}"></div>
                </div>
                <span class="text-xs">${p.confidence}%</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (feature.deps) {
      detailsHtml = `
        <div class="feature-deps">
          ${feature.deps.map(d => `
            <div class="dep-row">
              <span class="dep-name">${d.name}</span>
              <span class="dep-version text-xs text-tertiary">${d.version}</span>
              <span class="badge badge-${d.status === 'vulnerable' ? 'critical' : d.status === 'outdated' ? 'medium' : 'low'}">${d.status}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (feature.violations) {
      detailsHtml = `
        <div class="feature-violations">
          ${feature.violations.map(v => `
            <div class="violation-row">
              <span class="badge badge-${v.severity === 'error' ? 'critical' : 'high'}">${v.severity}</span>
              <span class="violation-text">${v.rule}: ${v.from}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (feature.analysis) {
      detailsHtml = `
        <div class="feature-analysis">
          ${feature.analysis.map(a => `
            <div class="analysis-row">
              <span class="badge badge-${a.level === 'critical' ? 'critical' : a.level === 'high' ? 'high' : 'medium'}">${a.type}</span>
              <span class="analysis-text text-xs">${a.text}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    return `
      <div class="feature-card glass-card" data-feature="${feature.id}" style="padding: var(--space-lg); border-radius: var(--radius-lg);">
        <div class="feature-card-header">
          <div class="feature-icon" style="color: ${feature.color};">
            ${feature.icon}
          </div>
          <h3 class="feature-title">${feature.title}</h3>
        </div>
        <p class="feature-description text-sm text-secondary">${feature.description}</p>
        ${detailsHtml}
      </div>
    `;
  }
}
