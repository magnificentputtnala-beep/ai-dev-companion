/* ============================================
   AI Development Companion - Conversation Mode
   Chat Interface, Simulated AI Responses
   ============================================ */

class Conversation {
  constructor() {
    this.container = null;
    this.messages = [];
    this.isTyping = false;
    this.conversationContext = {
      projectName: 'my-saas-app',
      framework: 'Next.js 14',
      lastTopic: null
    };
  }

  init() {
    this.container = document.getElementById('panel-conversation');
    if (!this.container) return;
    this.render();
    this.addInitialMessages();
  }

  render() {
    this.container.innerHTML = `
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Conversation</h2>
          <p class="panel-subtitle">Natural language interaction with your AI companion</p>
        </div>
        <div class="conversation-status">
          <span class="status-dot online"></span>
          <span class="text-xs text-secondary">AI Ready</span>
        </div>
      </div>

      <div class="conversation-layout">
        <div class="chat-container glass-card" style="border-radius: var(--radius-lg);">
          <div class="chat-messages" id="chat-messages">
          </div>
          <div class="chat-typing-indicator" id="typing-indicator" style="display: none;">
            <div class="typing-dots">
              <span></span><span></span><span></span>
            </div>
            <span class="text-xs text-tertiary">AI is thinking...</span>
          </div>
          <div class="chat-input-area">
            <div class="chat-input-wrapper glass-subtle" style="border-radius: var(--radius-lg);">
              <input type="text" class="chat-input glass-input" id="chat-input" 
                placeholder="Ask anything about your project..." 
                autocomplete="off"
                style="border: none; background: transparent;">
              <button class="chat-send-btn btn-primary" id="chat-send" style="border-radius: var(--radius-md); padding: var(--space-sm) var(--space-md);">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H1.5a.5.5 0 0 0 0 1h12.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                </svg>
              </button>
            </div>
            <div class="chat-suggestions" id="chat-suggestions">
              <button class="suggestion-chip glass-tag">Can you explain why this failed?</button>
              <button class="suggestion-chip glass-tag">Is there a cleaner approach?</button>
              <button class="suggestion-chip glass-tag">Will this affect production?</button>
              <button class="suggestion-chip glass-tag">Show me another way</button>
            </div>
          </div>
        </div>

        <div class="conversation-sidebar">
          <div class="context-panel glass-card" style="border-radius: var(--radius-lg); padding: var(--space-lg);">
            <h4 class="text-sm mb-md" style="color: var(--text-secondary);">Conversation Context</h4>
            <div class="context-items">
              <div class="context-item">
                <span class="text-xs text-tertiary">Project</span>
                <span class="text-sm">${this.conversationContext.projectName}</span>
              </div>
              <div class="context-item">
                <span class="text-xs text-tertiary">Framework</span>
                <span class="text-sm">${this.conversationContext.framework}</span>
              </div>
              <div class="context-item">
                <span class="text-xs text-tertiary">Session Memory</span>
                <span class="text-sm text-secondary">Active</span>
              </div>
              <div class="context-item">
                <span class="text-xs text-tertiary">Understanding</span>
                <div class="confidence-bar mt-sm" style="width: 100%;">
                  <div class="confidence-fill" style="width: 87%;"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="memory-panel glass-card mt-md" style="border-radius: var(--radius-lg); padding: var(--space-lg);">
            <h4 class="text-sm mb-md" style="color: var(--text-secondary);">Developer Memory</h4>
            <div class="memory-items">
              <div class="memory-item glass-subtle" style="border-radius: var(--radius-sm); padding: var(--space-sm); margin-bottom: var(--space-xs);">
                <span class="text-xs">Prefers functional components</span>
              </div>
              <div class="memory-item glass-subtle" style="border-radius: var(--radius-sm); padding: var(--space-sm); margin-bottom: var(--space-xs);">
                <span class="text-xs">Uses Tailwind CSS</span>
              </div>
              <div class="memory-item glass-subtle" style="border-radius: var(--radius-sm); padding: var(--space-sm); margin-bottom: var(--space-xs);">
                <span class="text-xs">Testing with Vitest</span>
              </div>
              <div class="memory-item glass-subtle" style="border-radius: var(--radius-sm); padding: var(--space-sm); margin-bottom: var(--space-xs);">
                <span class="text-xs">Kebab-case file naming</span>
              </div>
              <div class="memory-item glass-subtle" style="border-radius: var(--radius-sm); padding: var(--space-sm); margin-bottom: var(--space-xs);">
                <span class="text-xs">Prefers Zustand over Redux</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    const suggestions = document.querySelectorAll('.suggestion-chip');

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage(input.value);
        }
      });
    }

    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        this.sendMessage(input?.value);
      });
    }

    suggestions.forEach(chip => {
      chip.addEventListener('click', () => {
        this.sendMessage(chip.textContent);
      });
    });
  }

  addInitialMessages() {
    setTimeout(() => {
      this.addAIMessage("Hey! I've been monitoring your project and everything looks solid. The latest changes to the auth module are clean, though I did notice a potential edge case with the session timeout handler. Want me to explain?");
    }, 500);
  }

  sendMessage(text) {
    if (!text || !text.trim() || this.isTyping) return;

    const input = document.getElementById('chat-input');
    if (input) input.value = '';

    // Add user message
    this.addUserMessage(text.trim());

    // Simulate AI thinking and response
    this.simulateAIResponse(text.trim());
  }

  addUserMessage(text) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const msgEl = document.createElement('div');
    msgEl.className = 'chat-message user-msg animate-fade-in-up';
    msgEl.innerHTML = `
      <div class="msg-content">
        <p>${this.escapeHtml(text)}</p>
      </div>
      <div class="msg-avatar user-avatar">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4z"/>
        </svg>
      </div>
    `;

    container.appendChild(msgEl);
    container.scrollTop = container.scrollHeight;
    this.messages.push({ role: 'user', text });
  }

  addAIMessage(text) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const msgEl = document.createElement('div');
    msgEl.className = 'chat-message ai-msg animate-fade-in-up';
    msgEl.innerHTML = `
      <div class="msg-avatar ai-avatar">
        <div class="mini-orb"></div>
      </div>
      <div class="msg-content">
        <p>${text}</p>
      </div>
    `;

    container.appendChild(msgEl);
    container.scrollTop = container.scrollHeight;
    this.messages.push({ role: 'ai', text });
  }

  simulateAIResponse(userText) {
    this.isTyping = true;
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.style.display = 'flex';

    // Set AI state to analyzing
    if (typeof app !== 'undefined') {
      app.setAIState('analyzing');
    }

    const response = this.generateResponse(userText);
    const thinkingTime = 1500 + Math.random() * 1500;

    setTimeout(() => {
      if (indicator) indicator.style.display = 'none';
      this.isTyping = false;

      if (typeof app !== 'undefined') {
        app.setAIState('speaking');
      }

      this.addAIMessage(response);

      setTimeout(() => {
        if (typeof app !== 'undefined') {
          app.setAIState('idle');
        }
      }, 2000);
    }, thinkingTime);
  }

  generateResponse(input) {
    const lower = input.toLowerCase();

    if (lower.includes('why') && (lower.includes('fail') || lower.includes('error') || lower.includes('broke'))) {
      return "The build failure is caused by a type mismatch introduced in the last PR. The <code>getSession()</code> function now returns <code>string | undefined</code> but the auth service expects a non-nullable string. This happened because the session handling was updated to support guest users without updating all consuming code. I can walk you through the fix if you'd like.";
    }

    if (lower.includes('fix') || lower.includes('solve') || lower.includes('resolve')) {
      return "I've got this. The fix is straightforward - we need optional chaining on the session access and a null check before passing to <code>getSession()</code>. I've already verified the fix locally: build passes, all 47 tests green. Want me to apply it, or would you prefer to review the diff first?";
    }

    if (lower.includes('clean') || lower.includes('better') || lower.includes('another')) {
      return "Sure, here's a cleaner approach. Instead of scattering null checks everywhere, we can create a <code>SafeSession</code> wrapper that handles the nullable case once at the boundary. This follows the Null Object pattern and keeps the rest of your code clean. It also makes testing easier since you can inject a mock session without worrying about null states.";
    }

    if (lower.includes('production') || lower.includes('deploy') || lower.includes('affect')) {
      return "Good question. In its current state, the build won't pass CI, so there's no risk of deploying broken code. However, if someone force-merges or bypasses CI, the runtime error would cause a crash on any page that loads user profile data - that's roughly 80% of authenticated routes. I'd classify this as a high-severity issue that should be fixed before the next release.";
    }

    if (lower.includes('explain') || lower.includes('what') || lower.includes('how')) {
      return "Let me break it down. When PR #247 made sessions nullable to support guest browsing, it changed the return type of <code>getSession()</code>. TypeScript's strict mode then flags every place that assumes a non-null return. The two errors you're seeing are the tip of the iceberg - there are likely 3-4 more places that will surface once these are fixed. I've already mapped them out if you want the full list.";
    }

    if (lower.includes('test') || lower.includes('coverage')) {
      return "Your test coverage for the auth module is at 78%, which is decent but below your project's 85% threshold. The gap is mainly in edge cases around session expiry and the new guest user flow. I can generate targeted test cases for those scenarios - they'd cover the most likely failure paths without bloating the test suite.";
    }

    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return "Hey! Good to have you back. I've been keeping an eye on things while you were away. Quick summary: 2 PRs merged, one introduced a type issue I already flagged, and your dependency health dropped slightly because of a new advisory on lodash. Nothing urgent, but worth addressing when you have a moment.";
    }

    // Default contextual response
    const defaults = [
      "I understand. Based on the current project state, I'd suggest addressing the type safety issues first since they're blocking the build pipeline. After that, the dependency update would be a good next step. Want me to prioritize these for you?",
      "That's a solid approach. I checked against your project's architecture patterns and it aligns well with how you've structured similar modules. One thing to watch: make sure the error boundary wraps the async state correctly, otherwise you might get an unhandled promise rejection in the error case.",
      "I already looked into that. The implementation is compatible with your current setup, but you'll want to update the TypeScript config to enable strict null checks in that module. I can generate the config diff if that would help.",
      "Good thinking. Based on your project history, similar changes have taken about 30 minutes to implement and test. The main risk is the cascade effect on dependent modules - I count 4 files that import from this module. Want me to map out the full impact?"
    ];

    return defaults[Math.floor(Math.random() * defaults.length)];
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
