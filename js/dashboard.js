/* ============================================
   AI Development Companion - Software Health Dashboard
   Animated Gauges, Scores, Trends
   ============================================ */

class Dashboard {
  constructor() {
    this.container = null;
    this.scores = [
      { id: 'reliability', label: 'Reliability', value: 92, trend: 'up', color: '#6366f1' },
      { id: 'architecture', label: 'Architecture', value: 87, trend: 'stable', color: '#8b5cf6' },
      { id: 'security', label: 'Security', value: 94, trend: 'up', color: '#22d3ee' },
      { id: 'performance', label: 'Performance', value: 78, trend: 'down', color: '#fbbf24' },
      { id: 'maintainability', label: 'Maintainability', value: 85, trend: 'up', color: '#34d399' },
      { id: 'dependencies', label: 'Dependency Health', value: 71, trend: 'down', color: '#fb7185' },
      { id: 'build-stability', label: 'Build Stability', value: 96, trend: 'stable', color: '#a78bfa' },
      { id: 'bug-prediction', label: 'Bug Prediction', value: 88, trend: 'up', color: '#6366f1' }
    ];
    this.animated = false;
  }

  init() {
    this.container = document.getElementById('panel-dashboard');
    if (!this.container) return;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Software Health Dashboard</h2>
          <p class="panel-subtitle">Real-time project quality metrics and predictions</p>
        </div>
        <div class="dashboard-overall glass-card" style="padding: var(--space-md) var(--space-lg); border-radius: var(--radius-lg);">
          <div class="overall-score">
            <span class="score-value gradient-text" id="overall-score-value">0</span>
            <span class="score-label">Overall Health</span>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        ${this.scores.map(score => this.renderGaugeCard(score)).join('')}
      </div>

      <div class="dashboard-trends mt-lg">
        <h3 class="text-sm" style="color: var(--text-secondary); margin-bottom: var(--space-md);">Trends (Last 7 Days)</h3>
        <div class="trends-grid">
          ${this.scores.map(score => this.renderTrendCard(score)).join('')}
        </div>
      </div>

      <div class="dashboard-insights mt-lg">
        <h3 class="text-sm" style="color: var(--text-secondary); margin-bottom: var(--space-md);">AI Insights</h3>
        <div class="insights-list">
          ${this.renderInsights()}
        </div>
      </div>
    `;
  }

  renderGaugeCard(score) {
    const circumference = 2 * Math.PI * 45;
    const trendIcon = score.trend === 'up' ? '&#9650;' : score.trend === 'down' ? '&#9660;' : '&#9654;';
    const trendClass = `trend-${score.trend}`;

    return `
      <div class="gauge-card glass-card" data-score-id="${score.id}">
        <div class="gauge-svg-container">
          <svg viewBox="0 0 100 100" class="gauge-svg">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(99, 102, 241, 0.08)" stroke-width="6"/>
            <circle cx="50" cy="50" r="45" fill="none" 
              stroke="${score.color}" 
              stroke-width="6" 
              stroke-linecap="round"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${circumference}"
              transform="rotate(-90 50 50)"
              class="gauge-progress"
              data-target="${circumference - (circumference * score.value / 100)}"
              style="transition: stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1); filter: drop-shadow(0 0 4px ${score.color}40);"
            />
          </svg>
          <div class="gauge-value-overlay">
            <span class="gauge-number" data-target="${score.value}">0</span>
            <span class="gauge-percent">%</span>
          </div>
        </div>
        <div class="gauge-label">${score.label}</div>
        <div class="gauge-trend ${trendClass}">
          <span>${trendIcon}</span>
          <span class="text-xs">${score.trend === 'up' ? '+2.3%' : score.trend === 'down' ? '-1.8%' : '0.0%'}</span>
        </div>
      </div>
    `;
  }

  renderTrendCard(score) {
    // Generate sparkline data
    const points = this.generateSparklinePoints(score.value, score.trend);
    const pathD = this.pointsToPath(points);

    return `
      <div class="trend-card glass-subtle" style="border-radius: var(--radius-md); padding: var(--space-sm) var(--space-md);">
        <div class="trend-header">
          <span class="text-xs text-secondary">${score.label}</span>
          <span class="text-xs trend-${score.trend}">${score.value}%</span>
        </div>
        <div class="sparkline-container">
          <svg viewBox="0 0 120 30" class="sparkline" preserveAspectRatio="none">
            <defs>
              <linearGradient id="grad-${score.id}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:${score.color};stop-opacity:0.3"/>
                <stop offset="100%" style="stop-color:${score.color};stop-opacity:0"/>
              </linearGradient>
            </defs>
            <path d="${pathD}" fill="url(#grad-${score.id})" stroke="none"/>
            <path d="${this.pointsToLine(points)}" fill="none" stroke="${score.color}" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
    `;
  }

  renderInsights() {
    const insights = [
      {
        icon: '&#x26A0;&#xFE0F;',
        text: 'Performance score dropped 4 points this week. Main cause: unoptimized database queries in the new reporting module.',
        priority: 'high'
      },
      {
        icon: '&#x2705;',
        text: 'Security score improved after resolving the XSS vulnerability in the comment parser.',
        priority: 'low'
      },
      {
        icon: '&#x1F504;',
        text: 'Dependency health declining due to 3 packages with known vulnerabilities. Recommend running security audit.',
        priority: 'medium'
      },
      {
        icon: '&#x1F4C8;',
        text: 'Build stability remains excellent at 96%. Zero failed builds in the last 48 hours.',
        priority: 'low'
      }
    ];

    return insights.map(insight => `
      <div class="insight-item glass-subtle" style="border-radius: var(--radius-md); padding: var(--space-md); margin-bottom: var(--space-sm);">
        <div class="flex items-center gap-sm">
          <span>${insight.icon}</span>
          <span class="badge badge-${insight.priority}">${insight.priority}</span>
        </div>
        <p class="text-sm mt-sm" style="color: var(--text-secondary); line-height: 1.5;">${insight.text}</p>
      </div>
    `).join('');
  }

  generateSparklinePoints(baseValue, trend) {
    const points = [];
    let value = baseValue - (trend === 'up' ? 5 : trend === 'down' ? -3 : 0);
    
    for (let i = 0; i <= 12; i++) {
      const noise = (Math.random() - 0.5) * 4;
      const trendDelta = trend === 'up' ? 0.4 : trend === 'down' ? -0.3 : 0;
      value = Math.max(50, Math.min(100, value + trendDelta + noise));
      points.push({ x: (i / 12) * 120, y: 30 - ((value - 50) / 50) * 28 });
    }
    return points;
  }

  pointsToPath(points) {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const cp1x = points[i - 1].x + (points[i].x - points[i - 1].x) / 3;
      const cp1y = points[i - 1].y;
      const cp2x = points[i].x - (points[i].x - points[i - 1].x) / 3;
      const cp2y = points[i].y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i].x} ${points[i].y}`;
    }
    // Close the path for fill
    d += ` L ${points[points.length - 1].x} 30 L ${points[0].x} 30 Z`;
    return d;
  }

  pointsToLine(points) {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const cp1x = points[i - 1].x + (points[i].x - points[i - 1].x) / 3;
      const cp1y = points[i - 1].y;
      const cp2x = points[i].x - (points[i].x - points[i - 1].x) / 3;
      const cp2y = points[i].y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i].x} ${points[i].y}`;
    }
    return d;
  }

  animateGauges() {
    if (this.animated) return;
    this.animated = true;

    // Animate gauge progress circles
    setTimeout(() => {
      document.querySelectorAll('.gauge-progress').forEach(circle => {
        const target = circle.getAttribute('data-target');
        circle.style.strokeDashoffset = target;
      });
    }, 100);

    // Animate numbers
    document.querySelectorAll('.gauge-number').forEach(el => {
      const target = parseInt(el.getAttribute('data-target'));
      this.animateNumber(el, 0, target, 1500);
    });

    // Animate overall score
    const overallEl = document.getElementById('overall-score-value');
    if (overallEl) {
      const overall = Math.round(this.scores.reduce((sum, s) => sum + s.value, 0) / this.scores.length);
      this.animateNumber(overallEl, 0, overall, 2000);
    }
  }

  animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };
    
    requestAnimationFrame(update);
  }
}
