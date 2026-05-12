// ──────────────────────────────────────────────────────────
// shell.js — Brand Book shell. Renders a single left sidebar
// (logo at top, nav in middle, copyright at bottom) into every
// page. The top header bar has been removed; brand mark now lives
// inside the sidebar to match the editorial reference layout.
// Pages declare their identity via two attributes on <main>:
//   data-page  — id matched against NAV to mark the active link
//   data-depth — folder depth from the repo root (0 for root,
//                1 for /assets/*, /walkthrough/) so relative
//                URLs resolve correctly under both local server
//                and GitHub Pages.
// ──────────────────────────────────────────────────────────

const NAV = [
  {
    items: [
      { id: 'about', label: 'About', href: 'index.html' },
    ],
  },
  {
    title: 'Brand',
    items: [
      { id: 'symbol',             label: 'Symbol',             href: 'symbol.html' },
      { id: 'visual-principles',  label: 'Visual Principles',  href: 'visual-principles.html' },
      { id: 'tone-of-voice',      label: 'Tone of Voice',      href: 'tone-of-voice.html' },
      { id: 'color',              label: 'Color',              href: 'color.html' },
    ],
  },
  {
    title: 'Assets',
    items: [
      { id: 'overview', label: 'Overview', href: 'overview.html' },
      {
        kind: 'subgroup',
        label: 'Graphic Assets',
        items: [
          { id: 'asset-icon',    label: 'Icon',                        href: 'assets/icon.html' },
          { id: 'asset-2d',      label: '2D Assets',                   href: 'assets/2d.html' },
          { id: 'asset-3d',      label: '3D Assets',                   href: 'assets/3d.html' },
          { id: 'asset-motion',  label: 'Motion Assets',               href: 'assets/motion.html', tag: '개발예정' },
          { id: 'asset-pattern', label: 'Pattern / Background Assets', href: 'assets/pattern.html', tag: '개발예정' },
        ],
      },
      {
        kind: 'subgroup',
        label: 'Image Assets',
        items: [
          { id: 'asset-photographic', label: 'Photographic Assets', href: 'assets/photographic.html' },
        ],
      },
    ],
  },
];

function rel(path, depth) {
  return depth > 0 ? '../'.repeat(depth) + path : path;
}

function renderNavLink(item, depth, activeId) {
  return `
    <a href="${rel(item.href, depth)}"
       class="shell-nav-link${item.id === activeId ? ' active' : ''}">
      <span>${item.label}</span>
      ${item.tag ? `<span class="shell-nav-tag">${item.tag}</span>` : ''}
    </a>
  `;
}

function renderNavItem(item, depth, activeId) {
  if (item.kind === 'subgroup') {
    return `
      <div class="shell-nav-subgroup">
        <div class="shell-nav-subgroup-title">${item.label}</div>
        ${item.items.map(sub => renderNavLink(sub, depth, activeId)).join('')}
      </div>
    `;
  }
  return renderNavLink(item, depth, activeId);
}

function renderSection(section, depth, activeId) {
  // A section with no title is a flat top-level link (e.g. About).
  // A section with a title renders the title as a bold parent label
  // and its items as indented children below — the pattern used in
  // the editorial reference.
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
        ${section.items.map(item => renderNavItem(item, depth, activeId)).join('')}
      </div>
    </div>
  `;
}

function renderSidebar(depth, activeId) {
  const sidebar = document.createElement('aside');
  sidebar.className = 'shell-sidebar';
  sidebar.innerHTML = `
    <a href="${rel('index.html', depth)}" class="shell-sidebar-brand">
      <img src="${rel('logo.svg', depth)}" alt="">
      <span>Ohouse Brand Book</span>
    </a>
    <nav class="shell-sidebar-nav">
      ${NAV.map(section => renderSection(section, depth, activeId)).join('')}
    </nav>
    <div class="shell-sidebar-foot">© 2026 Ohouse. All rights reserved.</div>
  `;
  return sidebar;
}

function init() {
  const main = document.querySelector('main[data-page]');
  if (!main) return;
  const pageId = main.dataset.page;
  const depth  = parseInt(main.dataset.depth || '0', 10);

  document.body.insertBefore(renderSidebar(depth, pageId), main);

  if (!main.classList.contains('shell-main')) {
    main.classList.add('shell-main');
  }
}

init();
