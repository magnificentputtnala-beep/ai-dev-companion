/* ============================================
   AI Development Companion - Knowledge Base
   Coding Language Memory & Library Scanner
   ============================================ */

class KnowledgeBase {
  constructor() {
    this.container = null;
    this.activeLanguage = null;
    this.scanningActive = false;
    this.languages = [
      {
        id: 'python',
        name: 'Python',
        icon: '\u{1F40D}',
        color: '#3776ab',
        version: '3.12',
        paradigm: 'Multi-paradigm',
        typing: 'Dynamic, Strong',
        fundamentals: ['Indentation-based syntax', 'Duck typing', 'List comprehensions', 'Generators & iterators', 'Decorators', 'Context managers', 'GIL (Global Interpreter Lock)', 'Multiple inheritance with MRO'],
        patterns: ['Factory Pattern', 'Singleton via module', 'Iterator Protocol', 'Context Manager Protocol', 'Descriptor Protocol', 'Metaclasses'],
        stdlib: ['os', 'sys', 'json', 'pathlib', 'asyncio', 'typing', 'dataclasses', 'functools', 'collections', 'itertools'],
        mistakes: ['Mutable default arguments', 'Late binding closures', 'Circular imports', 'Not using virtual environments', 'Bare except clauses', 'Using == for None comparison'],
        bestPractices: ['Use type hints (PEP 484)', 'Follow PEP 8 style guide', 'Use context managers for resources', 'Prefer composition over inheritance', 'Use dataclasses for data containers', 'Write docstrings (PEP 257)']
      },
      {
        id: 'javascript',
        name: 'JavaScript',
        icon: '\u{1F4DC}',
        color: '#f7df1e',
        version: 'ES2024',
        paradigm: 'Multi-paradigm, Event-driven',
        typing: 'Dynamic, Weak',
        fundamentals: ['Prototypal inheritance', 'Closures & scope chains', 'Event loop & microtasks', 'Promises & async/await', 'Destructuring', 'Modules (ESM & CJS)', 'Proxy & Reflect', 'WeakMap/WeakSet'],
        patterns: ['Module Pattern', 'Observer Pattern', 'Pub/Sub', 'Revealing Module', 'Middleware Pattern', 'Functional Composition'],
        stdlib: ['Array methods', 'Promise API', 'Fetch API', 'URL API', 'AbortController', 'Intl', 'structuredClone', 'WeakRef', 'FinalizationRegistry'],
        mistakes: ['Implicit type coercion (== vs ===)', 'this binding confusion', 'Memory leaks from closures', 'Callback hell', 'Not handling Promise rejections', 'Modifying objects during iteration'],
        bestPractices: ['Use strict equality (===)', 'Prefer const over let', 'Use optional chaining (?.)', 'Handle all Promise rejections', 'Use ESM imports', 'Avoid global state']
      },
      {
        id: 'typescript',
        name: 'TypeScript',
        icon: '\u{1F4D8}',
        color: '#3178c6',
        version: '5.3',
        paradigm: 'Multi-paradigm, Typed',
        typing: 'Static, Structural',
        fundamentals: ['Structural type system', 'Generics & constraints', 'Union & intersection types', 'Conditional types', 'Mapped types', 'Template literal types', 'Type narrowing', 'Declaration merging'],
        patterns: ['Branded Types', 'Discriminated Unions', 'Builder Pattern with types', 'Type-safe Event Emitter', 'Phantom Types', 'Opaque Types'],
        stdlib: ['Utility types (Partial, Required, Pick, Omit)', 'Record', 'ReturnType', 'Parameters', 'Awaited', 'Satisfies operator'],
        mistakes: ['Using any instead of unknown', 'Not enabling strict mode', 'Type assertions without validation', 'Overusing enums (use const objects)', 'Ignoring compiler errors', 'Not using discriminated unions'],
        bestPractices: ['Enable strict mode', 'Use unknown over any', 'Prefer interfaces for objects', 'Use branded types for IDs', 'Leverage type inference', 'Use satisfies for validation']
      },
      {
        id: 'java',
        name: 'Java',
        icon: '\u2615',
        color: '#ed8b00',
        version: '21 LTS',
        paradigm: 'Object-oriented',
        typing: 'Static, Strong',
        fundamentals: ['JVM architecture', 'Garbage collection', 'Generics with erasure', 'Interfaces & abstract classes', 'Records', 'Sealed classes', 'Pattern matching', 'Virtual threads'],
        patterns: ['Factory Method', 'Builder Pattern', 'Strategy Pattern', 'Dependency Injection', 'Repository Pattern', 'Event Sourcing'],
        stdlib: ['java.util.stream', 'java.util.concurrent', 'java.net.http', 'java.nio', 'java.time', 'java.util.Optional'],
        mistakes: ['NullPointerException from unchecked nulls', 'Raw type usage with generics', 'Mutable shared state in threads', 'Not closing resources (use try-with-resources)', 'Overusing inheritance', 'Ignoring checked exceptions'],
        bestPractices: ['Use Optional for nullable returns', 'Prefer composition over inheritance', 'Use Stream API for collections', 'Enable null analysis annotations', 'Use records for value objects', 'Follow SOLID principles']
      },
      {
        id: 'cpp',
        name: 'C++',
        icon: '\u2699\uFE0F',
        color: '#00599c',
        version: 'C++23',
        paradigm: 'Multi-paradigm',
        typing: 'Static, Strong',
        fundamentals: ['RAII (Resource Acquisition Is Initialization)', 'Move semantics', 'Smart pointers', 'Templates & concepts', 'Constexpr evaluation', 'Ranges library', 'Coroutines', 'Modules'],
        patterns: ['CRTP', 'Policy-based design', 'PIMPL idiom', 'Rule of 0/3/5', 'SFINAE', 'Tag dispatching'],
        stdlib: ['<memory>', '<algorithm>', '<ranges>', '<format>', '<expected>', '<span>', '<optional>', '<variant>'],
        mistakes: ['Use-after-free', 'Buffer overflows', 'Memory leaks', 'Undefined behavior', 'Dangling references', 'Object slicing'],
        bestPractices: ['Use smart pointers (unique_ptr, shared_ptr)', 'Prefer value semantics', 'Use RAII for all resources', 'Enable compiler warnings (-Wall -Wextra)', 'Use std::span over raw pointers', 'Leverage constexpr']
      },
      {
        id: 'go',
        name: 'Go',
        icon: '\u{1F439}',
        color: '#00add8',
        version: '1.22',
        paradigm: 'Concurrent, Imperative',
        typing: 'Static, Strong',
        fundamentals: ['Goroutines & channels', 'Interface satisfaction (implicit)', 'Defer/Panic/Recover', 'Slices vs arrays', 'Struct embedding', 'Generics (type parameters)', 'Context propagation', 'Error wrapping'],
        patterns: ['Functional options', 'Table-driven tests', 'Worker pool', 'Fan-out/Fan-in', 'Circuit breaker', 'Middleware chains'],
        stdlib: ['net/http', 'context', 'sync', 'encoding/json', 'io', 'testing', 'log/slog', 'errors'],
        mistakes: ['Goroutine leaks', 'Race conditions (missing mutex)', 'Nil pointer dereference', 'Not checking errors', 'Closing channels from receiver', 'Copying sync primitives'],
        bestPractices: ['Always handle errors', 'Use context for cancellation', 'Run go vet and staticcheck', 'Use defer for cleanup', 'Design small interfaces', 'Prefer channels for coordination']
      },
      {
        id: 'rust',
        name: 'Rust',
        icon: '\u{1F980}',
        color: '#ce422b',
        version: '1.75',
        paradigm: 'Systems, Functional',
        typing: 'Static, Strong, Affine',
        fundamentals: ['Ownership & borrowing', 'Lifetimes', 'Traits & trait objects', 'Pattern matching', 'Error handling (Result/Option)', 'Async/await', 'Macros (declarative & procedural)', 'Zero-cost abstractions'],
        patterns: ['Builder Pattern', 'Newtype Pattern', 'Typestate Pattern', 'Interior Mutability', 'Visitor Pattern', 'Extension Traits'],
        stdlib: ['std::collections', 'std::sync', 'std::io', 'std::fs', 'std::fmt', 'std::iter', 'std::future', 'std::error'],
        mistakes: ['Fighting the borrow checker', 'Overusing clone()', 'Not using ? operator', 'Unnecessary unsafe blocks', 'Ignoring compiler warnings', 'Not leveraging enums for state'],
        bestPractices: ['Use clippy for linting', 'Leverage the type system for correctness', 'Prefer &str over String for parameters', 'Use Result for fallible operations', 'Write documentation tests', 'Use cargo fmt for formatting']
      },
      {
        id: 'csharp',
        name: 'C#',
        icon: '\u{1F48E}',
        color: '#68217a',
        version: '12',
        paradigm: 'Object-oriented, Functional',
        typing: 'Static, Strong',
        fundamentals: ['LINQ', 'Async/await with Task', 'Nullable reference types', 'Pattern matching', 'Records', 'Span<T> and Memory<T>', 'Source generators', 'Primary constructors'],
        patterns: ['Dependency Injection', 'Repository Pattern', 'CQRS', 'Mediator Pattern', 'Options Pattern', 'Specification Pattern'],
        stdlib: ['System.Linq', 'System.Threading.Tasks', 'System.Collections.Generic', 'System.Text.Json', 'System.Net.Http', 'Microsoft.Extensions.DI'],
        mistakes: ['Async void methods', 'Not disposing IDisposable', 'Deadlocks from .Result/.Wait()', 'Mutable structs', 'Not using nullable reference types', 'String concatenation in loops'],
        bestPractices: ['Enable nullable reference types', 'Use async all the way', 'Prefer records for DTOs', 'Use dependency injection', 'Follow .NET naming conventions', 'Use Span<T> for performance']
      },
      {
        id: 'ruby',
        name: 'Ruby',
        icon: '\u{1F48E}',
        color: '#cc342d',
        version: '3.3',
        paradigm: 'Object-oriented, Functional',
        typing: 'Dynamic, Strong',
        fundamentals: ['Everything is an object', 'Blocks, Procs & Lambdas', 'Mixins via modules', 'Open classes', 'Method missing', 'Symbol vs String', 'Fiber & Ractor', 'Pattern matching'],
        patterns: ['Mixin Pattern', 'DSL Building', 'Convention over Configuration', 'Concern Pattern', 'Service Objects', 'Decorator Pattern'],
        stdlib: ['Enumerable', 'Comparable', 'IO', 'Net::HTTP', 'JSON', 'OpenStruct', 'Benchmark', 'Logger'],
        mistakes: ['Monkey patching core classes', 'N+1 queries in Rails', 'Not using frozen string literals', 'Overusing metaprogramming', 'Global variables', 'Not handling exceptions properly'],
        bestPractices: ['Use frozen_string_literal: true', 'Follow Ruby style guide', 'Use RBS or Sorbet for types', 'Prefer composition over inheritance', 'Write tests first (TDD)', 'Use Bundler for dependencies']
      },
      {
        id: 'swift',
        name: 'Swift',
        icon: '\u{1F426}',
        color: '#f05138',
        version: '5.9',
        paradigm: 'Multi-paradigm, Protocol-oriented',
        typing: 'Static, Strong',
        fundamentals: ['Optionals & unwrapping', 'Protocol-oriented programming', 'Value types vs Reference types', 'ARC (Automatic Reference Counting)', 'Generics & associated types', 'Actors & structured concurrency', 'Result builders', 'Property wrappers'],
        patterns: ['Protocol Extensions', 'Coordinator Pattern', 'MVVM', 'Dependency Injection', 'Builder Pattern', 'Combine/AsyncSequence'],
        stdlib: ['Foundation', 'Combine', 'SwiftUI', 'Concurrency', 'Collections', 'Observation'],
        mistakes: ['Force unwrapping (!)', 'Retain cycles in closures', 'Massive view controllers', 'Not using value types', 'Overusing singletons', 'Ignoring concurrency safety'],
        bestPractices: ['Use guard for early returns', 'Prefer structs over classes', 'Use weak/unowned in closures', 'Leverage Swift concurrency', 'Use property wrappers', 'Follow Swift API design guidelines']
      },
      {
        id: 'kotlin',
        name: 'Kotlin',
        icon: '\u{1F4A0}',
        color: '#7f52ff',
        version: '1.9',
        paradigm: 'Multi-paradigm',
        typing: 'Static, Strong',
        fundamentals: ['Null safety (?. and !!)', 'Coroutines & Flow', 'Extension functions', 'Data classes', 'Sealed classes', 'Delegation', 'Inline functions', 'Multiplatform'],
        patterns: ['Coroutine Scope Pattern', 'Repository Pattern', 'Use case / Interactor', 'Sealed class state machines', 'Builder DSL', 'Delegate Pattern'],
        stdlib: ['kotlinx.coroutines', 'kotlin.collections', 'kotlin.io', 'kotlin.text', 'kotlinx.serialization', 'kotlin.reflect'],
        mistakes: ['Using !! operator', 'Blocking the main thread', 'Not cancelling coroutines', 'Overusing lateinit', 'Not using sealed classes for state', 'Java-style code in Kotlin'],
        bestPractices: ['Use coroutines for async work', 'Leverage null safety fully', 'Use sealed classes for ADTs', 'Write idiomatic Kotlin (not Java-style)', 'Use data classes for models', 'Prefer immutability (val over var)']
      },
      {
        id: 'php',
        name: 'PHP',
        icon: '\u{1F418}',
        color: '#777bb4',
        version: '8.3',
        paradigm: 'Multi-paradigm',
        typing: 'Dynamic (with type declarations)',
        fundamentals: ['Type declarations & union types', 'Fibers (async)', 'Enums', 'Named arguments', 'Match expression', 'Readonly properties', 'Intersection types', 'First-class callables'],
        patterns: ['MVC', 'Repository Pattern', 'Service Container', 'Middleware Pipeline', 'Event Dispatcher', 'Strategy Pattern'],
        stdlib: ['PDO', 'cURL', 'SPL', 'DateTime', 'Fiber', 'json_*', 'array_*', 'mb_*'],
        mistakes: ['SQL injection (not using prepared statements)', 'Not validating input', 'Mixing business logic in controllers', 'Not using strict_types', 'Ignoring return types', 'Using deprecated functions'],
        bestPractices: ['Declare strict_types=1', 'Use Composer for autoloading', 'Follow PSR standards', 'Use typed properties', 'Write unit tests (PHPUnit)', 'Use static analysis (PHPStan/Psalm)']
      }
    ];
  }

  init() {
    this.container = document.getElementById('panel-knowledge');
    if (!this.container) return;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Knowledge Base</h2>
          <p class="panel-subtitle">Complete coding language memory with real-time library scanning</p>
        </div>
        <div class="kb-controls">
          <button class="btn" id="kb-scan-btn">
            <span>\u{1F50D}</span> Scan Libraries
          </button>
        </div>
      </div>

      <div class="kb-search-container">
        <input type="text" class="glass-input kb-search" id="kb-search" placeholder="Search languages, patterns, best practices..." autocomplete="off">
      </div>

      <div class="kb-scan-results glass-card" id="kb-scan-results" style="display: none; padding: var(--space-lg); border-radius: var(--radius-lg); margin-bottom: var(--space-lg);">
        <div class="scan-header">
          <h3 class="text-sm" style="color: var(--accent-cyan);">\u{1F50E} Library Scan Results</h3>
          <span class="badge badge-high" id="scan-status">Scanning...</span>
        </div>
        <div class="scan-progress">
          <div class="glass-progress" style="margin: var(--space-md) 0;">
            <div class="glass-progress-fill" id="scan-progress-bar" style="width: 0%;"></div>
          </div>
        </div>
        <div class="scan-findings" id="scan-findings"></div>
      </div>

      <div class="kb-languages-grid" id="kb-languages-grid">
        ${this.renderLanguageCards()}
      </div>

      <div class="kb-detail-panel glass-card" id="kb-detail-panel" style="display: none; padding: var(--space-xl); border-radius: var(--radius-lg); margin-top: var(--space-lg);">
      </div>
    `;

    this.bindEvents();
  }

  renderLanguageCards() {
    return this.languages.map(lang => `
      <div class="kb-language-card glass-card" data-lang="${lang.id}" style="padding: var(--space-lg); border-radius: var(--radius-lg); cursor: pointer;">
        <div class="kb-lang-header">
          <span class="kb-lang-icon" style="font-size: 1.5rem;">${lang.icon}</span>
          <div class="kb-lang-info">
            <h3 class="kb-lang-name" style="color: ${lang.color};">${lang.name}</h3>
            <span class="text-xs text-tertiary">${lang.version} | ${lang.typing}</span>
          </div>
        </div>
        <div class="kb-lang-tags">
          <span class="glass-tag">${lang.paradigm}</span>
        </div>
        <div class="kb-lang-stats">
          <div class="kb-stat">
            <span class="kb-stat-value">${lang.fundamentals.length}</span>
            <span class="kb-stat-label">Fundamentals</span>
          </div>
          <div class="kb-stat">
            <span class="kb-stat-value">${lang.patterns.length}</span>
            <span class="kb-stat-label">Patterns</span>
          </div>
          <div class="kb-stat">
            <span class="kb-stat-value">${lang.stdlib.length}</span>
            <span class="kb-stat-label">Std Libs</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderLanguageDetail(lang) {
    return `
      <div class="kb-detail-header animate-fade-in-up">
        <div class="kb-detail-title">
          <span style="font-size: 2rem;">${lang.icon}</span>
          <div>
            <h2 style="color: ${lang.color}; margin-bottom: 2px;">${lang.name} ${lang.version}</h2>
            <span class="text-sm text-secondary">${lang.paradigm} | ${lang.typing}</span>
          </div>
        </div>
        <button class="btn" id="kb-close-detail">Close</button>
      </div>

      <div class="kb-detail-grid">
        <div class="kb-section glass-subtle" style="padding: var(--space-lg); border-radius: var(--radius-md);">
          <h4 class="kb-section-title">\u{1F4DA} Fundamentals</h4>
          <ul class="kb-list">
            ${lang.fundamentals.map(f => `<li class="kb-list-item">${f}</li>`).join('')}
          </ul>
        </div>

        <div class="kb-section glass-subtle" style="padding: var(--space-lg); border-radius: var(--radius-md);">
          <h4 class="kb-section-title">\u{1F3D7}\uFE0F Common Patterns</h4>
          <ul class="kb-list">
            ${lang.patterns.map(p => `<li class="kb-list-item">${p}</li>`).join('')}
          </ul>
        </div>

        <div class="kb-section glass-subtle" style="padding: var(--space-lg); border-radius: var(--radius-md);">
          <h4 class="kb-section-title">\u{1F4E6} Standard Library</h4>
          <div class="kb-tags-grid">
            ${lang.stdlib.map(s => `<span class="glass-tag">${s}</span>`).join('')}
          </div>
        </div>

        <div class="kb-section glass-subtle" style="padding: var(--space-lg); border-radius: var(--radius-md);">
          <h4 class="kb-section-title">\u26A0\uFE0F Common Mistakes</h4>
          <ul class="kb-list kb-list-warning">
            ${lang.mistakes.map(m => `<li class="kb-list-item">${m}</li>`).join('')}
          </ul>
        </div>

        <div class="kb-section glass-subtle" style="padding: var(--space-lg); border-radius: var(--radius-md);">
          <h4 class="kb-section-title">\u2705 Best Practices</h4>
          <ul class="kb-list kb-list-success">
            ${lang.bestPractices.map(b => `<li class="kb-list-item">${b}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Language card click
    const cards = this.container.querySelectorAll('.kb-language-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const langId = card.getAttribute('data-lang');
        const lang = this.languages.find(l => l.id === langId);
        if (lang) this.showLanguageDetail(lang);
      });
    });

    // Search
    const searchInput = document.getElementById('kb-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filterLanguages(e.target.value);
      });
    }

    // Scan button
    const scanBtn = document.getElementById('kb-scan-btn');
    if (scanBtn) {
      scanBtn.addEventListener('click', () => {
        this.startLibraryScan();
      });
    }
  }

  showLanguageDetail(lang) {
    this.activeLanguage = lang;
    const detailPanel = document.getElementById('kb-detail-panel');
    if (!detailPanel) return;

    detailPanel.style.display = 'block';
    detailPanel.innerHTML = this.renderLanguageDetail(lang);
    detailPanel.scrollIntoView({ behavior: 'smooth' });

    // Bind close button
    const closeBtn = document.getElementById('kb-close-detail');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        detailPanel.style.display = 'none';
        this.activeLanguage = null;
      });
    }
  }

  filterLanguages(query) {
    const grid = document.getElementById('kb-languages-grid');
    if (!grid) return;

    const lower = query.toLowerCase();
    const cards = grid.querySelectorAll('.kb-language-card');

    cards.forEach(card => {
      const langId = card.getAttribute('data-lang');
      const lang = this.languages.find(l => l.id === langId);
      if (!lang) return;

      const searchable = [
        lang.name, lang.paradigm, lang.typing,
        ...lang.fundamentals, ...lang.patterns, ...lang.stdlib,
        ...lang.mistakes, ...lang.bestPractices
      ].join(' ').toLowerCase();

      card.style.display = searchable.includes(lower) ? '' : 'none';
    });
  }

  startLibraryScan() {
    if (this.scanningActive) return;
    this.scanningActive = true;

    const resultsPanel = document.getElementById('kb-scan-results');
    const progressBar = document.getElementById('scan-progress-bar');
    const statusBadge = document.getElementById('scan-status');
    const findingsContainer = document.getElementById('scan-findings');

    if (!resultsPanel) return;
    resultsPanel.style.display = 'block';
    findingsContainer.innerHTML = '';

    const findings = [
      { library: 'lodash@4.17.20', language: 'JavaScript', issue: 'Prototype Pollution vulnerability (CVE-2021-23337)', severity: 'critical', fix: 'Upgrade to 4.17.21+' },
      { library: 'requests@2.28.0', language: 'Python', issue: 'Charset detection dependency vulnerable to ReDoS', severity: 'high', fix: 'Upgrade to 2.31.0+' },
      { library: 'log4j@2.14.1', language: 'Java', issue: 'Remote Code Execution (Log4Shell)', severity: 'critical', fix: 'Upgrade to 2.17.1+' },
      { library: 'axios@0.21.0', language: 'JavaScript', issue: 'Server-Side Request Forgery (SSRF)', severity: 'high', fix: 'Upgrade to 0.21.1+' },
      { library: 'pyyaml@5.3', language: 'Python', issue: 'Arbitrary code execution via yaml.load()', severity: 'critical', fix: 'Use yaml.safe_load() or upgrade to 6.0+' },
      { library: 'fmt@7.1.0', language: 'C++', issue: 'No known vulnerabilities', severity: 'safe', fix: null },
      { library: 'serde@1.0.193', language: 'Rust', issue: 'No known vulnerabilities', severity: 'safe', fix: null },
      { library: 'gin@1.9.1', language: 'Go', issue: 'No known vulnerabilities', severity: 'safe', fix: null }
    ];

    let progress = 0;
    const scanInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(scanInterval);
        statusBadge.textContent = 'Complete';
        statusBadge.className = 'badge badge-verified';
        this.scanningActive = false;
      }
      progressBar.style.width = `${progress}%`;
    }, 300);

    // Add findings progressively
    findings.forEach((finding, index) => {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'scan-finding animate-fade-in-up';
        el.innerHTML = `
          <div class="scan-finding-header">
            <span class="scan-lib-name">${finding.library}</span>
            <span class="badge badge-${finding.severity === 'critical' ? 'critical' : finding.severity === 'high' ? 'high' : 'low'}">${finding.severity}</span>
          </div>
          <div class="scan-finding-body">
            <span class="text-xs text-tertiary">${finding.language}</span>
            <span class="text-xs text-secondary">${finding.issue}</span>
            ${finding.fix ? `<span class="text-xs" style="color: var(--accent-emerald);">\u2192 ${finding.fix}</span>` : ''}
          </div>
        `;
        findingsContainer.appendChild(el);
      }, (index + 1) * 500);
    });
  }
}
