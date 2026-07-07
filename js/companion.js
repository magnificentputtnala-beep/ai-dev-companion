/* ============================================
   AI Development Companion - Companion Avatar
   AI Visualization, States, Personality
   ============================================ */

class Companion {
  constructor() {
    this.state = 'idle'; // idle, analyzing, speaking
    this.container = null;
    this.messageQueue = [];
    this.isProcessingMessages = false;
    this.voiceMode = 'text'; // text, voice, both
    this.observationTimer = null;
  }

  init() {
    this.container = document.getElementById('companion-container');
    if (!this.container) return;

    this.renderOrb();
    this.renderStatusBar();
    this.renderMessageArea();
    this.renderVoiceModeToggle();
    this.startProactiveObservations();
    this.setState('idle');
  }

  renderOrb() {
    const orbSection = this.container.querySelector('.companion-orb-section');
    if (!orbSection) return;

    orbSection.innerHTML = `
      <div class="orb-wrapper animate-floating">
        <div class="orb-container" id="ai-orb">
          <div class="orb-core"></div>
          <div class="orb-inner-ring"></div>
          <div class="orb-outer-ring"></div>
          <div class="orb-particles" id="orb-particles"></div>
          <div class="orb-waveform" id="orb-waveform">
            <div class="wave-bar" style="--delay: 0s; --wave-height: 24px;"></div>
            <div class="wave-bar" style="--delay: 0.1s; --wave-height: 32px;"></div>
            <div class="wave-bar" style="--delay: 0.2s; --wave-height: 28px;"></div>
            <div class="wave-bar" style="--delay: 0.3s; --wave-height: 36px;"></div>
            <div class="wave-bar" style="--delay: 0.15s; --wave-height: 20px;"></div>
            <div class="wave-bar" style="--delay: 0.25s; --wave-height: 30px;"></div>
            <div class="wave-bar" style="--delay: 0.05s; --wave-height: 26px;"></div>
          </div>
        </div>
        <div class="orb-label">
          <span class="status-dot online"></span>
          <span class="orb-status-text">Online & Monitoring</span>
        </div>
      </div>
    `;

    // Generate orb particles
    this.generateOrbParticles();
  }

  generateOrbParticles() {
    const particlesContainer = document.getElementById('orb-particles');
    if (!particlesContainer) return;

    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.className = 'orb-particle';
      particle.style.setProperty('--angle', `${i * 30}deg`);
      particle.style.setProperty('--delay', `${i * 0.15}s`);
      particle.style.setProperty('--distance', `${40 + Math.random() * 20}px`);
      particlesContainer.appendChild(particle);
    }
  }

  renderStatusBar() {
    const statusSection = this.container.querySelector('.companion-status');
    if (!statusSection) return;

    statusSection.innerHTML = `
      <div class="status-card glass-card">
        <div class="status-row">
          <div class="status-item">
            <span class="status-icon">&#x1F4CA;</span>
            <span class="status-label">Project Health</span>
            <span class="status-value gradient-text">94%</span>
          </div>
          <div class="status-item">
            <span class="status-icon">&#x1F50D;</span>
            <span class="status-label">Issues Found</span>
            <span class="status-value" style="color: var(--accent-amber);">3</span>
          </div>
          <div class="status-item">
            <span class="status-icon">&#x26A1;</span>
            <span class="status-label">AI State</span>
            <span class="status-value" id="ai-state-label">Monitoring</span>
          </div>
        </div>
      </div>
    `;
  }

  renderMessageArea() {
    const messageSection = this.container.querySelector('.companion-messages');
    if (!messageSection) return;

    messageSection.innerHTML = `
      <div class="messages-wrapper">
        <div class="message-list" id="companion-message-list">
          <div class="ai-message glass-card animate-fade-in-up">
            <div class="ai-message-avatar">
              <div class="mini-orb"></div>
            </div>
            <div class="ai-message-content">
              <p class="ai-message-text">Hey, I'm your AI development companion. I'm monitoring your project and will let you know if I spot anything worth addressing. I'm here whenever you need me.</p>
              <span class="ai-message-time">Just now</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderVoiceModeToggle() {
    const voiceSection = this.container.querySelector('.companion-voice-mode');
    if (!voiceSection) return;

    voiceSection.innerHTML = `
      <div class="voice-mode-toggle glass-subtle" style="border-radius: var(--radius-lg); padding: var(--space-md);">
        <span class="voice-mode-label text-xs text-secondary">Communication Mode</span>
        <div class="voice-mode-options">
          <button class="voice-mode-btn active" data-mode="text" title="Text Only">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="2" y="3" width="12" height="2" rx="1"/>
              <rect x="2" y="7" width="8" height="2" rx="1"/>
              <rect x="2" y="11" width="10" height="2" rx="1"/>
            </svg>
          </button>
          <button class="voice-mode-btn" data-mode="voice" title="Voice Only">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a2 2 0 0 1 2 2v5a2 2 0 1 1-4 0V3a2 2 0 0 1 2-2z"/>
              <path d="M4 7a4 4 0 0 0 8 0h1a5 5 0 0 1-4.5 4.975V14h2v1h-5v-1h2v-2.025A5 5 0 0 1 3 7h1z"/>
            </svg>
          </button>
          <button class="voice-mode-btn" data-mode="both" title="Text + Voice">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="4" width="6" height="1.5" rx="0.5"/>
              <rect x="1" y="7" width="4" height="1.5" rx="0.5"/>
              <rect x="1" y="10" width="5" height="1.5" rx="0.5"/>
              <path d="M12 2a1.5 1.5 0 0 1 1.5 1.5v3.5a1.5 1.5 0 1 1-3 0V3.5A1.5 1.5 0 0 1 12 2z"/>
              <path d="M10 6.5a2.5 2.5 0 0 0 5 0h.5a3 3 0 0 1-2.75 2.99V11h1v.5h-3V11h1V9.49A3 3 0 0 1 9.5 6.5H10z"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Add click handlers
    voiceSection.querySelectorAll('.voice-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        voiceSection.querySelectorAll('.voice-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.voiceMode = btn.getAttribute('data-mode');
      });
    });
  }

  setState(state) {
    this.state = state;
    const orb = document.getElementById('ai-orb');
    const stateLabel = document.getElementById('ai-state-label');
    
    if (orb) {
      orb.className = 'orb-container';
      orb.classList.add(`orb-${state}`);
    }

    if (stateLabel) {
      const labels = {
        idle: 'Monitoring',
        analyzing: 'Analyzing...',
        speaking: 'Communicating'
      };
      stateLabel.textContent = labels[state] || 'Online';
      stateLabel.style.color = state === 'analyzing' ? 'var(--accent-amber)' : 
                               state === 'speaking' ? 'var(--accent-cyan)' : 'var(--accent-emerald)';
    }

    // Update orb status label
    const statusText = document.querySelector('.orb-status-text');
    if (statusText) {
      const statusLabels = {
        idle: 'Online & Monitoring',
        analyzing: 'Analyzing Code...',
        speaking: 'Communicating'
      };
      statusText.textContent = statusLabels[state] || 'Online';
    }
  }

  setActive() {
    // Trigger a gentle pulse when panel becomes active
    const orb = document.getElementById('ai-orb');
    if (orb) {
      orb.classList.add('orb-greet');
      setTimeout(() => orb.classList.remove('orb-greet'), 2000);
    }
  }

  addMessage(text, isAI = true) {
    const messageList = document.getElementById('companion-message-list');
    if (!messageList) return;

    const messageEl = document.createElement('div');
    messageEl.className = `ai-message glass-card animate-fade-in-up ${!isAI ? 'user-message' : ''}`;
    messageEl.innerHTML = `
      <div class="ai-message-avatar">
        <div class="mini-orb ${!isAI ? 'mini-orb-user' : ''}"></div>
      </div>
      <div class="ai-message-content">
        <p class="ai-message-text">${text}</p>
        <span class="ai-message-time">Just now</span>
      </div>
    `;

    messageList.appendChild(messageEl);
    messageList.scrollTop = messageList.scrollHeight;
  }

  startProactiveObservations() {
    const observations = [
      {
        text: "Hey, I noticed your API response handler doesn't account for the new pagination format. The backend team shipped that change yesterday.",
        delay: 12000
      },
      {
        text: "I think we can avoid a future bug here - the useEffect dependency array in ProfileLoader is missing the userId prop. It will cause stale data after navigation.",
        delay: 22000
      },
      {
        text: "I already checked the TypeScript migration path for that module. The types are compatible, but you'll need to update the jest config to handle .tsx files.",
        delay: 38000
      },
      {
        text: "Quick heads up - the Docker base image you're using (node:16-alpine) reaches end-of-life next month. I'd recommend upgrading to node:20-alpine when you get a chance.",
        delay: 50000
      },
      {
        text: "I verified the solution for the CORS issue. The proxy config needs the changeOrigin flag set to true. I can apply it whenever you're ready.",
        delay: 65000
      }
    ];

    observations.forEach(obs => {
      setTimeout(() => {
        // Brief analyzing state before message
        this.setState('analyzing');
        setTimeout(() => {
          this.setState('speaking');
          this.addMessage(obs.text);
          setTimeout(() => this.setState('idle'), 3000);
        }, 2000);
      }, obs.delay);
    });
  }
}
