/* ============================================
   AI Development Companion - Main Application
   Navigation, State Management, Orchestration
   ============================================ */

class App {
  constructor() {
    this.currentPanel = 'companion';
    this.aiState = 'idle'; // idle, analyzing, speaking
    this.notifications = [];
    this.notificationId = 0;
    this.modules = {};
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;

    // Initialize navigation
    this.initNavigation();

    // Initialize modules
    this.modules.companion = new Companion();
    this.modules.dashboard = new Dashboard();
    this.modules.terminal = new TerminalIntelligence();
    this.modules.conversation = new Conversation();
    this.modules.features = new Features();
    this.modules.knowledge = new KnowledgeBase();
    this.modules.crossverify = new CrossVerify();

    // Initialize all modules
    Object.values(this.modules).forEach(m => m.init && m.init());

    // Show initial panel
    this.showPanel('companion');

    // Start ambient particles
    this.initAmbientParticles();

    // Start proactive notification system
    this.startNotificationSystem();

    // Add keyboard shortcuts
    this.initKeyboardShortcuts();

    console.log('[AI Companion] Application initialized');
  }

  initNavigation() {
    const dockItems = document.querySelectorAll('.dock-item[data-panel]');
    dockItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const panel = item.getAttribute('data-panel');
        this.showPanel(panel);
        
        // Ripple effect
        this.createRipple(e, item);
      });

      // Tooltip handling
      item.addEventListener('mouseenter', () => {
        item.querySelector('.dock-tooltip')?.classList.add('visible');
      });
      item.addEventListener('mouseleave', () => {
        item.querySelector('.dock-tooltip')?.classList.remove('visible');
      });
    });
  }

  showPanel(panelId) {
    // Update dock active state
    document.querySelectorAll('.dock-item[data-panel]').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-panel') === panelId);
    });

    // Transition panels
    document.querySelectorAll('.panel').forEach(panel => {
      if (panel.id === `panel-${panelId}`) {
        panel.classList.add('active');
        // Trigger panel-specific animations
        this.onPanelShow(panelId);
      } else {
        panel.classList.remove('active');
      }
    });

    this.currentPanel = panelId;
  }

  onPanelShow(panelId) {
    switch (panelId) {
      case 'dashboard':
        this.modules.dashboard?.animateGauges();
        break;
      case 'terminal':
        this.modules.terminal?.startSimulation();
        break;
      case 'companion':
        this.modules.companion?.setActive();
        break;
    }
  }

  setAIState(state) {
    this.aiState = state;
    this.modules.companion?.setState(state);
    document.body.setAttribute('data-ai-state', state);
  }

  // Notification System
  startNotificationSystem() {
    const proactiveMessages = [
      {
        title: 'Potential Issue Detected',
        body: 'The React version in package.json conflicts with the hooks usage in UserProfile.tsx',
        priority: 'high',
        delay: 8000
      },
      {
        title: 'Architecture Observation',
        body: 'Circular dependency detected between services/auth.ts and utils/session.ts',
        priority: 'medium',
        delay: 15000
      },
      {
        title: 'Build Prediction',
        body: 'Next build will likely fail - missing environment variable DATABASE_URL in .env.production',
        priority: 'critical',
        delay: 25000
      },
      {
        title: 'Dependency Update',
        body: 'lodash 4.17.20 has a known prototype pollution vulnerability. Recommend upgrading to 4.17.21+',
        priority: 'high',
        delay: 35000
      },
      {
        title: 'Code Quality',
        body: 'Found 3 unused imports in dashboard/metrics.ts that could be cleaned up',
        priority: 'low',
        delay: 45000
      }
    ];

    proactiveMessages.forEach(msg => {
      setTimeout(() => {
        this.showNotification(msg.title, msg.body, msg.priority);
      }, msg.delay);
    });
  }

  showNotification(title, body, priority = 'medium') {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const id = ++this.notificationId;
    const notification = document.createElement('div');
    notification.className = `notification notification-${priority} glass-notification`;
    notification.setAttribute('data-id', id);
    notification.innerHTML = `
      <div class="notification-title">${title}</div>
      <div class="notification-body">${body}</div>
      <div class="notification-time">Just now</div>
    `;

    notification.addEventListener('click', () => {
      notification.style.animation = 'notificationSlideOut 0.3s ease-in forwards';
      setTimeout(() => notification.remove(), 300);
    });

    container.appendChild(notification);

    // Auto-dismiss after 8 seconds for non-critical
    if (priority !== 'critical') {
      setTimeout(() => {
        if (notification.parentElement) {
          notification.style.animation = 'notificationSlideOut 0.3s ease-in forwards';
          setTimeout(() => notification.remove(), 300);
        }
      }, 8000);
    }

    this.notifications.push({ id, title, body, priority, timestamp: Date.now() });
  }

  // Ambient Particles
  initAmbientParticles() {
    const container = document.getElementById('ambient-particles');
    if (!container) return;

    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.setProperty('--particle-x', `${(Math.random() - 0.5) * 200}px`);
      particle.style.setProperty('--particle-y', `${(Math.random() - 0.5) * 200}px`);
      particle.style.animationDuration = `${8 + Math.random() * 12}s`;
      particle.style.animationDelay = `${Math.random() * 8}s`;
      particle.style.animation = `particleFloat ${8 + Math.random() * 12}s ease-in-out infinite`;
      particle.style.animationDelay = `${Math.random() * 8}s`;
      particle.style.width = `${1 + Math.random() * 2}px`;
      particle.style.height = particle.style.width;
      container.appendChild(particle);
    }
  }

  // Ripple Effect
  createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      border-radius: 50%;
      background: rgba(99, 102, 241, 0.3);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  // Keyboard Shortcuts
  initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1': e.preventDefault(); this.showPanel('companion'); break;
          case '2': e.preventDefault(); this.showPanel('dashboard'); break;
          case '3': e.preventDefault(); this.showPanel('terminal'); break;
          case '4': e.preventDefault(); this.showPanel('conversation'); break;
          case '5': e.preventDefault(); this.showPanel('features'); break;
          case '6': e.preventDefault(); this.showPanel('knowledge'); break;
          case '7': e.preventDefault(); this.showPanel('crossverify'); break;
        }
      }
    });
  }
}

// Initialize on DOM ready
const app = new App();
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
