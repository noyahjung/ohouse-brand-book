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

// Identity collects single long-scroll pages (로고/컬러/톤오브보이스).
// Asset still expands 그래픽 into a toggle group whose children are
// themselves long-scroll pages (그래픽 원칙/아이콘/2D/3D/사진 아이콘).
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
      { id: 'logo',  label: '로고',         href: 'identity/logo.html' },
      { id: 'color', label: '컬러',         href: 'identity/color.html' },
      { id: 'voice', label: '톤 오브 보이스', href: 'identity/tone-of-voice.html' },
    ],
  },
  {
    title: 'Asset',
    items: [
      { id: 'visual-principles', label: '비주얼 원칙', href: 'asset/visual-principles.html' },
      {
        kind: 'toggle', id: 'graphic', label: '그래픽',
        children: [
          { id: 'graphic-principles', label: '그래픽 원칙',     href: 'asset/graphic/principles.html' },
          { id: 'graphic-icon',       label: '아이콘',          href: 'asset/graphic/icon.html' },
          { id: 'graphic-2d',         label: '2D 그래픽 에셋',  href: 'asset/graphic/2d.html' },
          { id: 'graphic-3d',         label: '3D 그래픽 에셋',  href: 'asset/graphic/3d.html' },
          { id: 'graphic-photo-icon', label: '사진 아이콘 에셋', href: 'asset/graphic/photo-icon.html' },
        ],
      },
      { id: 'photo',   label: '포토', href: 'asset/photo.html' },
      { id: 'pattern', label: '패턴', href: 'asset/pattern.html' },
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
    title: 'AI 라이팅 봇',
    desc: '쉽게 브랜드 톤을 적용',
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
    desc: 'Ton of Voice<br>Ton of Voice',
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

const LOCK_SVG =
  '<svg class="shell-mode-lock" viewBox="0 0 16 16" aria-hidden="true">' +
  '<path d="M8 1.6c-1.85 0-3.35 1.5-3.35 3.35V6.7H4.2c-.78 0-1.4.63-1.4 1.4v5.5c0 .77.62 1.4 1.4 1.4h7.6c.77 0 1.4-.63 1.4-1.4V8.1c0-.77-.63-1.4-1.4-1.4h-.45V4.95C11.35 3.1 9.85 1.6 8 1.6Zm-1.95 3.35c0-1.08.87-1.95 1.95-1.95s1.95.87 1.95 1.95V6.7h-3.9V4.95Z" fill="currentColor"/>' +
  '</svg>';

// Tool-mode default page — shown in the main column whenever the
// sidebar mode toggle is set to "도구". Single content block:
// title + body + image. Path is depth-aware so it works on nested
// pages too.
function toolModeHtml(depth) {
  return `
    <div class="about-hero">
      <h1>툴 모드</h1>
      <p class="about-lead">꺼내 쓰는 브랜드 툴 모음</p>
    </div>
    <figure class="about-banner">
      <img src="${rel('tool_thumbnail.png', depth)}" alt="툴 모드">
    </figure>
  `;
}

function renderModeToggle(mode) {
  return `
    <div class="shell-mode-toggle" role="tablist">
      <button type="button" role="tab"
              class="shell-mode-btn${mode === 'guide' ? ' active' : ''}"
              data-mode="guide" aria-selected="${mode === 'guide'}">가이드</button>
      <button type="button" role="tab"
              class="shell-mode-btn${mode === 'tool' ? ' active' : ''}"
              data-mode="tool" aria-selected="${mode === 'tool'}">도구${LOCK_SVG}</button>
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
      <img class="shell-sidebar-brand-icon" src="${rel('favicon.svg', depth)}" alt="">
      <span class="shell-sidebar-brand-text">
        <span class="shell-sidebar-brand-name">오늘의집</span>
        <span class="shell-sidebar-brand-suffix">브랜드센터</span>
      </span>
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
      ${items.map(({ id, label, level }) => `
        <a class="shell-toc-item${level === 'h1' ? '' : ' shell-toc-item--sub'}"
           href="#${id}" data-target-id="${id}">
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

// Build (or rebuild) the right-side TOC for whatever content
// currently lives inside `main`. Called once on init and again
// each time the main content swaps between guide / tool mode.
function buildToc(main) {
  // Remove the previous TOC, if any.
  const existing = main.querySelector('.shell-toc');
  if (existing) existing.remove();
  main.classList.remove('has-toc');

  // Per the Play Book composition guide every 대분류 is an <h1>
  // (page overview + 사용 가이드 / 사용 사례 / 리소스 사용하기), so
  // the TOC lists *all* h1s as top-level entries. h2/h3 inside a
  // chapter become indented sub-entries.
  const headings = Array.from(main.querySelectorAll(
    '.shell-content h1, .shell-content h2, .shell-content h3, .shell-content .principle-row-body h3'
  ));

  const tocItems = [];
  const targets = [];
  headings.forEach((h, i) => {
    if (!h.id) h.id = slugify(h.textContent, i);
    tocItems.push({
      id: h.id,
      label: h.textContent.trim(),
      level: h.tagName.toLowerCase(),
    });
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

// Swap the main content column between the page's own content
// (guide mode) and the tool-mode default page. The page's original
// HTML is stashed on the main element so guide-mode restoration is
// lossless. TOC rebuilds for whichever content is showing.
function applyMainMode(main, mode, depth) {
  const content = main.querySelector('.shell-content');
  if (!content) return;
  if (mode === 'tool') {
    if (main._guideContentHtml == null) {
      main._guideContentHtml = content.innerHTML;
    }
    content.innerHTML = toolModeHtml(depth);
  } else {
    if (main._guideContentHtml != null) {
      content.innerHTML = main._guideContentHtml;
      main._guideContentHtml = null;
    }
  }
  buildToc(main);
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

  // If tool mode is the persisted state, swap the main content
  // before the first TOC build so we don't render the wrong outline.
  if (loadMode() === 'tool') {
    applyMainMode(main, 'tool', depth);
  } else {
    buildToc(main);
  }

  // Hook the sidebar's mode-toggle click so the main column follows
  // the sidebar mode in lockstep.
  sidebar.addEventListener('click', (e) => {
    const modeBtn = e.target.closest('[data-mode]');
    if (!modeBtn) return;
    // Defer one frame so renderSidebar's own handler has already
    // updated mode storage + sidebar visibility.
    requestAnimationFrame(() => {
      applyMainMode(main, loadMode(), depth);
    });
  });
}

init();
