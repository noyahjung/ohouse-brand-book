// ──────────────────────────────────────────────────────────
// shell.js — Brand Book shell. Renders a single left sidebar
// (logo at top, nav in middle, copyright at bottom) into every
// page. The top header bar has been removed; brand mark now lives
// inside the sidebar to match the editorial reference layout.
// Pages declare their identity via two attributes on <main>:
//   data-page  — id matched against NAV to mark the active link
//   data-depth — folder depth from the repo root (0 root, 1 for
//                /voice|/asset|/walkthrough, 2 for /identity/*/*,
//                3 for /asset/graphic/*/*).
//
// NAV node kinds:
//   - flat leaf  { id, label, href }  (in a section with no title)
//   - leaf       { id, label, href }  (under a titled section)
//   - subgroup   { kind: 'subgroup', label, items: [...] }
//   - toggle     { kind: 'toggle',   id, label, children: [...] }
// Toggle open/closed state persists in localStorage; toggles whose
// subtree contains the active page auto-expand on load. Sidebar
// scroll position persists in sessionStorage so navigating between
// pages doesn't reset the sidebar to the top.
// ──────────────────────────────────────────────────────────

const NAV = [
  {
    title: 'Overview',
    items: [
      { id: 'home', label: '홈', href: 'index.html' },
    ],
  },
  {
    title: 'Identity',
    items: [
      {
        kind: 'toggle', id: 'logo', label: '로고',
        children: [
          { id: 'logo-guide',     label: '사용 가이드',    href: 'identity/logo/guide.html' },
          { id: 'logo-cases',     label: '사용사례',       href: 'identity/logo/cases.html' },
          { id: 'logo-resources', label: '리소스 사용하기', href: 'identity/logo/resources.html' },
        ],
      },
      {
        kind: 'toggle', id: 'color', label: '컬러',
        children: [
          { id: 'color-guide',     label: '사용 가이드',    href: 'identity/color/guide.html' },
          { id: 'color-cases',     label: '사용사례',       href: 'identity/color/cases.html' },
          { id: 'color-resources', label: '리소스 사용하기', href: 'identity/color/resources.html' },
        ],
      },
    ],
  },
  {
    title: 'Ton of Voice',
    items: [
      { id: 'voice-principles', label: '보이스 원칙',    href: 'voice/principles.html' },
      { id: 'voice-cases',      label: '사용사례',       href: 'voice/cases.html' },
      { id: 'voice-resources',  label: '리소스 사용하기', href: 'voice/resources.html' },
    ],
  },
  {
    title: 'Asset',
    items: [
      { id: 'visual-principles', label: '비주얼 원칙', href: 'asset/visual-principles.html' },
      {
        kind: 'toggle', id: 'graphic', label: '그래픽',
        children: [
          { id: 'graphic-principles', label: '그래픽 원칙', href: 'asset/graphic/principles.html' },
          {
            kind: 'toggle', id: 'graphic-icon', label: '아이콘',
            children: [
              { id: 'icon-guide',     label: '사용 가이드',    href: 'asset/graphic/icon/guide.html' },
              { id: 'icon-cases',     label: '사용사례',       href: 'asset/graphic/icon/cases.html' },
              { id: 'icon-resources', label: '리소스 사용하기', href: 'asset/graphic/icon/resources.html' },
            ],
          },
          {
            kind: 'toggle', id: 'graphic-2d', label: '2D 그래픽 에셋',
            children: [
              { id: '2d-guide',     label: '사용 가이드',    href: 'asset/graphic/2d/guide.html' },
              { id: '2d-cases',     label: '사용사례',       href: 'asset/graphic/2d/cases.html' },
              { id: '2d-resources', label: '리소스 사용하기', href: 'asset/graphic/2d/resources.html' },
            ],
          },
          {
            kind: 'toggle', id: 'graphic-3d', label: '3D 그래픽 에셋',
            children: [
              { id: '3d-guide',     label: '사용 가이드',    href: 'asset/graphic/3d/guide.html' },
              { id: '3d-cases',     label: '사용사례',       href: 'asset/graphic/3d/cases.html' },
              { id: '3d-resources', label: '리소스 사용하기', href: 'asset/graphic/3d/resources.html' },
            ],
          },
          {
            kind: 'toggle', id: 'graphic-photo-icon', label: '사진 아이콘 에셋',
            children: [
              { id: 'photo-icon-guide',     label: '사용 가이드',    href: 'asset/graphic/photo-icon/guide.html' },
              { id: 'photo-icon-cases',     label: '사용사례',       href: 'asset/graphic/photo-icon/cases.html' },
              { id: 'photo-icon-resources', label: '리소스 사용하기', href: 'asset/graphic/photo-icon/resources.html' },
            ],
          },
        ],
      },
      {
        kind: 'toggle', id: 'photo', label: '포토',
        children: [
          { id: 'photo-guide',     label: '사용 가이드',    href: 'asset/photo/guide.html' },
          { id: 'photo-cases',     label: '사용사례',       href: 'asset/photo/cases.html' },
          { id: 'photo-resources', label: '리소스 사용하기', href: 'asset/photo/resources.html' },
        ],
      },
      {
        kind: 'toggle', id: 'pattern', label: '패턴',
        children: [
          { id: 'pattern-guide',     label: '사용 가이드',    href: 'asset/pattern/guide.html' },
          { id: 'pattern-cases',     label: '사용사례',       href: 'asset/pattern/cases.html' },
          { id: 'pattern-resources', label: '리소스 사용하기', href: 'asset/pattern/resources.html' },
        ],
      },
    ],
  },
];

const EXPANDED_KEY = 'ohouse-bb-nav-expanded';
const SCROLL_KEY   = 'ohouse-bb-sidebar-scroll';
const MODE_KEY     = 'ohouse-bb-sidebar-mode';

// Tool mode placeholder catalogue. Two rough cards for now;
// real tools (writing bot, visual tool, …) get wired up later.
const TOOLS = [
  {
    id: 'writing-bot',
    title: '라이팅 봇',
    desc: '카피·문구의 톤을 점검하고 다듬어 주는 보조 도구.',
    iconBg: '#ffffff',
    icon: '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
          '<circle cx="15" cy="20" r="9" fill="#34D399"/>' +
          '<circle cx="25" cy="20" r="9" fill="#10B981" opacity="0.75"/>' +
          '</svg>',
    href: '#',
  },
  {
    id: 'visual-tool',
    title: 'Visual Tool',
    desc: '비주얼 자산을 정리하고 빠르게 꺼내 쓰는 워크플로우.',
    iconBg: '#111111',
    icon: '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
          '<path d="M10 9 L20 31 L30 9" stroke="#ffffff" stroke-width="5.5" ' +
          'stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
          '</svg>',
    href: '#',
  },
];

// Single SVG path for the chevron — CSS rotates it -90° when the
// toggle is collapsed so we don't ship two icon files.
const CHEVRON_SVG =
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
  '<path d="M19.6587 7.11104C19.9564 6.78454 20.4624 6.76115 20.7889 7.05879C21.1154 7.35645 21.1388 7.86246 20.8412 8.18897L12.5912 17.239L12.5768 17.2544C12.4261 17.4111 12.2179 17.5 12 17.5C11.7749 17.5 11.5603 17.4053 11.4087 17.239L3.15874 8.18897C2.8611 7.86246 2.88448 7.35645 3.21099 7.05879C3.5375 6.76115 4.04351 6.78454 4.34116 7.11104L12 15.5125L19.6587 7.11104Z"/>' +
  '</svg>';

function rel(path, depth) {
  return depth > 0 ? '../'.repeat(depth) + path : path;
}

function loadExpanded() {
  try { return new Set(JSON.parse(localStorage.getItem(EXPANDED_KEY) || '[]')); }
  catch { return new Set(); }
}
function saveExpanded(set) {
  try { localStorage.setItem(EXPANDED_KEY, JSON.stringify([...set])); } catch {}
}

function loadMode() {
  try { return localStorage.getItem(MODE_KEY) === 'tool' ? 'tool' : 'guide'; }
  catch { return 'guide'; }
}
function saveMode(m) {
  try { localStorage.setItem(MODE_KEY, m); } catch {}
}

function renderToolCard(tool) {
  return `
    <a class="shell-tool-card" href="${tool.href}">
      <div class="shell-tool-card-icon" style="background:${tool.iconBg};">${tool.icon}</div>
      <div class="shell-tool-card-text">
        <div class="shell-tool-card-title">${tool.title}</div>
        <div class="shell-tool-card-desc">${tool.desc}</div>
      </div>
    </a>
  `;
}

function renderModeToggle(mode) {
  return `
    <div class="shell-mode-toggle" role="tablist">
      <button type="button" role="tab"
              class="shell-mode-btn${mode === 'guide' ? ' active' : ''}"
              data-mode="guide" aria-selected="${mode === 'guide'}">Guide</button>
      <button type="button" role="tab"
              class="shell-mode-btn${mode === 'tool' ? ' active' : ''}"
              data-mode="tool" aria-selected="${mode === 'tool'}">Tool</button>
    </div>
  `;
}

// Walk NAV to collect every toggle id between root and the leaf
// matching activeId — used to auto-expand ancestor toggles.
function findAncestorToggles(items, activeId, trail = []) {
  for (const item of items) {
    if (item.id === activeId) return trail;
    if (item.children) {
      const sub = item.kind === 'toggle' ? [...trail, item.id] : trail;
      const found = findAncestorToggles(item.children, activeId, sub);
      if (found) return found;
    }
  }
  return null;
}

function renderNavLink(item, depth, activeId) {
  return `
    <a href="${rel(item.href, depth)}"
       class="shell-nav-link${item.id === activeId ? ' active' : ''}"
       data-leaf-id="${item.id}">
      <span>${item.label}</span>
      ${item.tag ? `<span class="shell-nav-tag">${item.tag}</span>` : ''}
    </a>
  `;
}

function renderToggle(item, depth, activeId, expanded) {
  const isOpen = expanded.has(item.id);
  return `
    <button type="button"
            class="shell-nav-toggle${isOpen ? ' open' : ''}"
            data-toggle="${item.id}"
            aria-expanded="${isOpen}">
      <span>${item.label}</span>
      <span class="shell-nav-chevron">${CHEVRON_SVG}</span>
    </button>
    <div class="shell-nav-children" data-children-of="${item.id}" ${isOpen ? '' : 'hidden'}>
      ${item.children.map(c => renderNavItem(c, depth, activeId, expanded)).join('')}
    </div>
  `;
}

function renderNavItem(item, depth, activeId, expanded) {
  if (item.kind === 'subgroup') {
    return `
      <div class="shell-nav-subgroup">
        <div class="shell-nav-subgroup-title">${item.label}</div>
        ${item.items.map(sub => renderNavItem(sub, depth, activeId, expanded)).join('')}
      </div>
    `;
  }
  if (item.kind === 'toggle') return renderToggle(item, depth, activeId, expanded);
  return renderNavLink(item, depth, activeId);
}

function renderSection(section, depth, activeId, expanded) {
  // No-title section = flat top-level link (e.g. 홈 under Overview
  // would be flat in the old layout, but here Overview has a title
  // so this branch handles backward-compat for any titleless entry).
  if (!section.title) {
    return `
      <div class="shell-nav-section shell-nav-section--flat">
        ${section.items.map(item => renderNavLink(item, depth, activeId)).join('')}
      </div>
    `;
  }
  return `
    <div class="shell-nav-section">
      <div class="shell-nav-section-title">${section.title}</div>
      <div class="shell-nav-section-body">
        ${section.items.map(item => renderNavItem(item, depth, activeId, expanded)).join('')}
      </div>
    </div>
  `;
}

function renderSidebar(depth, activeId) {
  // Pre-expand toggles on the path to the active page
  const expanded = loadExpanded();
  const trail = findAncestorToggles(NAV.flatMap(s => s.items), activeId) || [];
  trail.forEach(id => expanded.add(id));
  saveExpanded(expanded);

  const mode = loadMode();

  const sidebar = document.createElement('aside');
  sidebar.className = 'shell-sidebar';
  sidebar.innerHTML = `
    <a href="${rel('index.html', depth)}" class="shell-sidebar-brand">
      <img src="${rel('logo.svg', depth)}" alt="Ohouse Brand Book">
    </a>
    ${renderModeToggle(mode)}
    <nav class="shell-sidebar-nav" data-mode-content="guide" ${mode !== 'guide' ? 'hidden' : ''}>
      ${NAV.map(section => renderSection(section, depth, activeId, expanded)).join('')}
    </nav>
    <div class="shell-sidebar-tools" data-mode-content="tool" ${mode !== 'tool' ? 'hidden' : ''}>
      ${TOOLS.map(renderToolCard).join('')}
    </div>
    <div class="shell-sidebar-foot">
      <nav class="shell-sidebar-foot-links">
        <a href="https://ohou.se/" target="_blank" rel="noopener noreferrer">오늘의집</a>
        <a href="https://www.bucketplace.com/careers/" target="_blank" rel="noopener noreferrer">오늘의집 채용</a>
      </nav>
      <div class="shell-sidebar-foot-copy">© 2026 Ohouse. All rights reserved.</div>
    </div>
  `;

  // Delegated click handler — toggles (nav groups) + mode switch.
  sidebar.addEventListener('click', (e) => {
    // Mode switch (Guide / Tool segmented control)
    const modeBtn = e.target.closest('[data-mode]');
    if (modeBtn) {
      e.preventDefault();
      const newMode = modeBtn.dataset.mode;
      if (loadMode() === newMode) return;
      saveMode(newMode);
      sidebar.querySelectorAll('.shell-mode-btn').forEach(b => {
        const on = b.dataset.mode === newMode;
        b.classList.toggle('active', on);
        b.setAttribute('aria-selected', on);
      });
      sidebar.querySelectorAll('[data-mode-content]').forEach(el => {
        el.hidden = el.dataset.modeContent !== newMode;
      });
      return;
    }

    // Nav group expand/collapse
    const btn = e.target.closest('[data-toggle]');
    if (!btn) return;
    e.preventDefault();
    const id = btn.dataset.toggle;
    const expandedNow = loadExpanded();
    const children = sidebar.querySelector(`[data-children-of="${id}"]`);
    if (expandedNow.has(id)) {
      expandedNow.delete(id);
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      if (children) children.hidden = true;
    } else {
      expandedNow.add(id);
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      if (children) children.hidden = false;
    }
    saveExpanded(expandedNow);
  });

  // Sidebar scroll persistence within the current tab.
  sidebar.addEventListener('scroll', () => {
    try { sessionStorage.setItem(SCROLL_KEY, String(sidebar.scrollTop)); } catch {}
  }, { passive: true });
  requestAnimationFrame(() => {
    try {
      const saved = parseInt(sessionStorage.getItem(SCROLL_KEY) || '0', 10);
      if (saved > 0) sidebar.scrollTop = saved;
    } catch {}
  });

  return sidebar;
}

// ─── On-this-page TOC + scroll spy ─────────────────────────
// Right-side mini outline of the headings inside the current page.
// Tracks `<h2>` elements within `.shell-content` (the page's
// section titles), assigns them stable ids for anchor scroll, and
// updates the active TOC item as the user scrolls. The sidebar
// leaf active state is set statically by the HTML's data-page —
// scroll spy does NOT touch the sidebar.

function slugify(text, idx) {
  // Mostly Korean content → fall back to sequential ids.
  return `section-${idx + 1}`;
}

function renderTOC(items) {
  if (items.length < 2) return null;
  const toc = document.createElement('aside');
  toc.className = 'shell-toc';
  toc.innerHTML = `
    <div class="shell-toc-title">On this page</div>
    <nav class="shell-toc-list">
      ${items.map(({ id, label }) => `
        <a class="shell-toc-item" href="#${id}" data-target-id="${id}">
          ${label}
        </a>
      `).join('')}
    </nav>
  `;
  return toc;
}

function setupScrollSpy(toc, headings) {
  if (headings.length < 2) return;

  const tocItems = Array.from(toc.querySelectorAll('.shell-toc-item'));
  const tocById = {};
  tocItems.forEach(el => { tocById[el.dataset.targetId] = el; });

  let activeId = null;
  function setActive(id) {
    if (id === activeId) return;
    activeId = id;
    tocItems.forEach(el => el.classList.remove('active'));
    if (tocById[id]) tocById[id].classList.add('active');
  }

  const visible = new Set();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target.id);
      else visible.delete(entry.target.id);
    }
    if (visible.size === 0) return;
    const topmost = headings
      .filter(h => visible.has(h.id))
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];
    if (topmost) setActive(topmost.id);
  }, { rootMargin: '-15% 0px -70% 0px' });

  headings.forEach(h => observer.observe(h));

  // Initial active = first heading (or hash target if present).
  const hashId = window.location.hash.slice(1);
  if (hashId && tocById[hashId]) setActive(hashId);
  else setActive(headings[0].id);
}

function init() {
  const main = document.querySelector('main[data-page]');
  if (!main) return;
  const pageId = main.dataset.page;
  const depth  = parseInt(main.dataset.depth || '0', 10);

  const sidebar = renderSidebar(depth, pageId);
  document.body.insertBefore(sidebar, main);

  if (!main.classList.contains('shell-main')) {
    main.classList.add('shell-main');
  }

  // Build TOC. First item is always "Overview" pointing to the
  // page's top block (the h1 / about-hero). Subsequent items are
  // the in-page section titles — primarily <h2>, falling back to
  // .principle-row-body h3 on principle-grid pages (color / voice
  // / visual-principles) which don't use h2s.
  const h1 = main.querySelector('.shell-content h1');
  const sectionEls = Array.from(main.querySelectorAll(
    '.shell-content h2, .shell-content .principle-row-body h3'
  ));

  const tocItems = [];
  const targets = [];
  if (h1) {
    if (!h1.id) h1.id = 'overview';
    tocItems.push({ id: h1.id, label: 'Overview' });
    targets.push(h1);
  }
  sectionEls.forEach((h, i) => {
    if (!h.id) h.id = slugify(h.textContent, i);
    tocItems.push({ id: h.id, label: h.textContent.trim() });
    targets.push(h);
  });

  if (tocItems.length >= 2) {
    const toc = renderTOC(tocItems);
    if (toc) {
      main.appendChild(toc);
      main.classList.add('has-toc');
      setupScrollSpy(toc, targets);
    }
  }
}

init();
