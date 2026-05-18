# Ohouse Brand Book — Layout & Design System

> 추가 업데이트가 들어와도 시각 일관성이 유지되도록, 현재 적용된 레이아웃·디자인 사양을 한 곳에 정리한 레퍼런스. 새 페이지·새 기능을 붙일 땐 이 문서 기준을 먼저 확인.

권위 있는 구현체는 항상 [`shared/shell.css`](../shared/shell.css)와 [`shared/shell.js`](../shared/shell.js). 이 문서는 그 결정의 **요약**이고 둘이 어긋나면 코드가 진실.

---

## 1. 디자인 토큰

[`shared/shell.css`](../shared/shell.css) `:root`에 정의. 모든 컴포넌트가 이 값들을 참조 — 색·간격·라운딩을 바꿔야 하면 여기부터 손댐.

### 색

| 변수 | 값 | 용처 |
|---|---|---|
| `--bg` | `#ffffff` | 페이지·사이드바 기본 배경 |
| `--bg-soft` | `#fafafa` | 옅은 강조 배경 (거의 미사용) |
| `--bg-mute` | `#F5F5F5` | **회색 블록의 단일 기준** — 모드 토글, 활성 메뉴 pill, 도구 카드, 호버 배경 |
| `--border` | `#e5e7eb` | 일반 보더 |
| `--border-soft` | `#ececec` | 옅은 보더, 카드 호버 |
| `--text` | `#111827` | 본문·헤더 기본 텍스트 (레거시 토큰) |
| `--text-dim` | `#4b5563` | 본문 보조 |
| `--text-mute` | `#b8b8b8` | 푸터 등 약한 텍스트 |
| `--nav-mute` | `rgba(8, 19, 26, 0.6)` | 사이드바 메뉴 일반 텍스트 (비활성) |
| 콘텐츠 헤더 | `#08131A` (인라인) | H1·H3 헤딩 컬러 |
| 콘텐츠 본문 | `rgba(8, 19, 26, 0.5)` (인라인) | 본문 p 텍스트 |
| 섹션 타이틀 | `rgba(0, 0, 0, 0.3)` (인라인) | 사이드바 카테고리 라벨 (Overview, Identity…) |
| 브랜드 블루 | `#00A1FF` | 로고 심볼 (SVG에 직접 박힘) |

### 간격

| 변수 | 값 | 용처 |
|---|---|---|
| `--sidebar-w` | `320px` | 사이드바 고정 너비 |
| `--sidebar-pad-x` | `20px` | 사이드바 좌우 패딩 |
| `--content-max` | `920px` | 본문 최대 폭 (`shell-content`) |
| `--content-pad-x` | `80px` | 본문 좌우 패딩 |
| `--content-pad-top` | `100px` | 본문 상단 패딩 — 토글/H1/TOC 박스 top이 모두 Y=100에서 정렬 |

### 라운딩

| 변수 | 값 | 용처 |
|---|---|---|
| `--radius-sm` | `8px` | 사이드바 네비 pill, 작은 칩 |
| `--radius` | `12px` | **콘텐츠 이미지(`.about-banner`)**, 도구 카드 아이콘 박스 |
| `--radius-lg` | `24px` | 레거시 (현재 본문 이미지엔 미사용) |

### 트랜지션

| 변수 | 값 | 용처 |
|---|---|---|
| `--transition` | `0.15s ease` | 모든 hover·토글·모드 전환 |

---

## 2. 레이아웃 골조

```
┌────────────────────┬───────────────────────────────────┬──────────┐
│                    │                                   │          │
│   .shell-sidebar   │           .shell-main             │ .shell-  │
│   (fixed, 320px)   │  margin-left: 320, pad-top: 100   │   toc    │
│   container-type:  │                                   │ (fixed,  │
│   inline-size      │  ┌ .shell-content (max 920px)     │  180px)  │
│                    │  │   - Content block 1            │          │
│   ┌ Brand mark     │  │   - Content block 2            │          │
│   │  (Y=16,        │  │   - …                          │          │
│   │   h=28 fixed)  │  └─                               │          │
│   ├ Mode toggle    │                                   │          │
│   │  (Y=100) ──────┼──align──── H1 box top ─────align──┼── TOC ───┤
│   ├ Nav / Tools    │   (Y=100)                         │  (Y=100) │
│   ├ Foot links     │                                   │          │
│   └ Copyright      │                                   │          │
└────────────────────┴───────────────────────────────────┴──────────┘
```

- 상단 고정 헤더 바 **없음**.
- 사이드바와 본문 사이 **divider 없음** — 같은 흰 배경 위에서 자연스럽게 이어짐.
- 사이드바의 모드 토글, 본문 H1, TOC의 박스 윗 가장자리가 모두 **Y=100**에서 정렬.

---

## 3. 사이드바

### 컨테이너

```css
.shell-sidebar {
  position: fixed; top: 0; left: 0; bottom: 0;
  width: var(--sidebar-w);                   /* 320 */
  background: var(--bg);
  container-type: inline-size;               /* 브랜드 마크 cqi 단위의 호스트 */
  padding: 16px var(--sidebar-pad-x) 28px;   /* top 16 / x 20 / bottom 28 */
  display: flex; flex-direction: column;
  overflow-y: auto;
}
```

- `container-type: inline-size`는 브랜드 마크가 `cqi` 단위로 사이드바 폭에 비례해 축소되기 위한 호스트 선언.
- 사이드바 padding-top(16) + 브랜드 박스 height(28) + 브랜드 margin-bottom(56) = **100px** → 모드 토글 top이 정확히 Y=100.

### 브랜드 마크 (`.shell-sidebar-brand`)

```
[icon]  오늘의집  브랜드센터
```

- **구조**: `favicon.svg` 아이콘 + `<span>오늘의집</span>` (700) + `<span>브랜드센터</span>` (500)
- **반응형(컨테이너 쿼리)** — 사이드바 content-box 폭 280px(=320 − 40)일 때 100% 사이즈, 좁아지면 비례 축소:
  - 아이콘: `clamp(20px, 10cqi, 28px)`
  - 텍스트: `clamp(15px, 7.5cqi, 21px)`
  - 아이콘-텍스트 gap: `clamp(6px, 3.2cqi, 9px)`
  - "오늘의집"-"브랜드센터" gap: `clamp(4px, 2.15cqi, 6px)`
- **height: 28px 고정** — 마크가 축소돼도 박스 높이가 일정해서 모드 토글의 Y 정렬(=100)이 깨지지 않음
- `margin: 0 0 56px` — 브랜드 마크 ↔ 모드 토글 간격 56px
- `white-space: nowrap`으로 두 줄 wrap 방지

### 모드 토글 (`.shell-mode-toggle`)

가이드 / 도구 두 모드를 전환하는 pill 형 segmented control.

```css
.shell-mode-toggle {
  display: flex;
  background: var(--bg-mute);            /* #F5F5F5 */
  border-radius: 999px;
  padding: 3px;
  margin: 0 0 25px;                      /* 토글 ↔ 첫 섹션(Overview) 간격 25 */
}
.shell-mode-btn {
  font-size: 13px; font-weight: 500;
  color: var(--text-mute);
  padding: 6px 14px;
  border-radius: 999px;
}
.shell-mode-btn.active {
  background: var(--bg);
  color: var(--text);
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
```

- 라벨: **가이드** / **도구🔒** — "도구" 옆에 자물쇠 SVG(11px)
- 전체 폭으로 채움 (인셋 없음)
- 선택된 모드는 `localStorage['ohouse-bb-sidebar-mode']`에 저장

### Guide 모드 — `.shell-sidebar-nav`

페이지 인덱스 트리. NAV 구조는 [`shared/shell.js`](../shared/shell.js)의 `const NAV` 참조.

#### 노드 종류

| 종류 | 표현 |
|---|---|
| 섹션 헤더 | `section.title` 있는 그룹. 라벨만 표시, 클릭 불가 |
| 리프 링크 | `{ id, label, href }` — 실 페이지 이동 |
| 토글 그룹 | `{ kind:'toggle', id, label, children }` — 클릭 시 자식 펼침/접힘 |
| 서브그룹 | `{ kind:'subgroup', label, items }` — 라벨 + 들여쓰기 (현재 NAV에선 미사용) |

#### 타이포 — "13/Medium/-0.3px" 단일 룰

사이드바의 **모든 텍스트 행**(섹션 헤더 · 리프 링크 · 토글 버튼)은 동일한 타이포·패딩·행 높이를 공유.

| 속성 | 값 |
|---|---|
| font-size | 13px |
| font-weight | 500 (Medium) |
| letter-spacing | -0.3px |
| line-height | 20px |
| padding | `8px 10px` (= 36px 행 높이) |
| border-radius | 8px (호버/액티브 pill) |

색만 차이:

| 상태 | 색 |
|---|---|
| 섹션 헤더 (Overview, Identity…) | `rgba(0, 0, 0, 0.3)` |
| 리프 링크 / 토글 (일반) | `var(--nav-mute)` = `rgba(8, 19, 26, 0.6)` |
| 리프 링크 hover | nav-mute 유지, bg `--bg-mute` |
| **리프 링크 active** | `var(--text)` (100%), bg `--bg-mute`, weight 500 유지 |
| 토글 chevron | nav-mute / 접힘 시 `-90°`, 펼침 시 `0°` |

> `.shell-nav-section`의 `margin: 0` → 모든 행이 균일 간격(36px). 섹션 헤더도 일반 아이템과 같은 X 시작점 + 동일 행 높이.

#### 들여쓰기 단계

- 1단계 (섹션 직속): `padding-left: 10px` (기본)
- 2단계 (토글 자식): `padding-left: 20px` (=10 + 10)
- 3단계 (중첩 토글의 자식): `padding-left: 30px`

#### 상태 보존

- 펼침 상태: `localStorage['ohouse-bb-nav-expanded']` (id 배열)
- 활성 페이지의 조상 토글은 자동 펼침
- 사이드바 스크롤 위치: `sessionStorage['ohouse-bb-sidebar-scroll']`

### Tool 모드 — `.shell-sidebar-tools`

도구 카드 리스트. TOOLS 데이터는 [`shared/shell.js`](../shared/shell.js)의 `const TOOLS`.

#### 도구 카드 (`.shell-tool-card`)

- 컨테이너: `background: var(--bg-mute)`, `border-radius: 14px`, `padding: 12px`, gap 12px
- 아이콘 박스: 48×48, `border-radius: 12px`, 1px border `--border-soft`
- 카드 폭: 사이드바 content area를 풀로 채움 (우측 인셋 없음)
- 라벨: **AI 라이팅 봇** · "쉽게 브랜드 톤을 적용" / **Visual Tool** · "Ton of Voice / Ton of Voice"

### 푸터 (`.shell-sidebar-foot`)

```
오늘의집           (13.5px, muted, 외부 새 탭)
오늘의집 채용       (13.5px, muted, 외부 새 탭)
                  ← 28px 간격
© 2026 Ohouse. All rights reserved.   (11px, muted)
```

---

## 4. 본문 영역

### `.shell-main`

```css
.shell-main {
  margin-left: var(--sidebar-w);                                /* 320 */
  padding: var(--content-pad-top) var(--content-pad-x) 120px;    /* 100 / 80 / 120 */
  min-height: 100vh;
}
.shell-content { max-width: var(--content-max); }              /* 920 */
```

본문 padding-top **100px**은 사이드바의 토글 박스 top과 같은 Y 정렬을 위함 (3절 참조).

### 콘텐츠 블록 (Content Block) 구성

본문은 **콘텐츠 블록의 나열**로 구성. 각 블록은 다음 세 요소의 단순 스택:

```
┌─────────────────────────┐
│ Title  /  Sub-title     │   46px Bold (Block 1) or 26px Bold (Block 2+)
│         ↕ 8px            │
│ Contents (paragraphs)   │   16px Medium @ 50% opacity
│         ↕ 30px           │
│ Image (.about-banner)   │   border-radius: 12px
└─────────────────────────┘
         ↕ 80px
┌─────────────────────────┐
│ … next block            │
```

#### 타이포

| 단계 | 요소 | 사양 |
|---|---|---|
| **Title** | `.about-hero h1` / `.shell-content h1` | 46px / 700 / `#08131A` / line-height 1.25 / letter-spacing -0.3px |
| **Sub-title** | `.about-section h3` / `.shell-content h3` | 26px / 700 / `#08131A` / line-height 1.2 / letter-spacing -0.3px |
| **Contents** | `.about-lead`, `.about-section p`, `.shell-content p` | 16px / 500 / `rgba(8, 19, 26, 0.5)` / line-height 1.5 / letter-spacing -0.3px |

#### 블록 내·블록 간 간격

| 구간 | 값 | 구현 |
|---|---|---|
| Title → Contents | 8px | `h1/h3 { margin: 0 0 8px }` |
| Contents → Image | 30px | `.about-banner { margin: 30px 0 0 }` |
| Block → Block | 80px | `.about-section { margin-top: 80px }` |
| paragraph 사이 | 8px | `p + p { margin-top: 8px }` |

#### 이미지 (`.about-banner`)

```css
.about-banner {
  width: 100%; max-width: var(--content-max);
  aspect-ratio: 16 / 9;
  background: var(--bg-soft);
  border-radius: 12px;                /* ← 24 → 12 */
  margin: 30px 0 0;                   /* 블록 내 contents → image */
  overflow: hidden;
}
```

- 모든 본문 이미지 라운딩은 **12px**.
- 새 배너 이미지: 1920×1080 webp, quality 80, method 6. 평균 100–200KB.

### HTML 구조 패턴 — 홈 페이지 예시

```html
<main data-page="home" data-depth="0">
  <div class="shell-content">

    <!-- Block 1: Title + Contents + Image -->
    <div class="about-hero">
      <h1>모두가 브랜드를<br>지킬 수 있도록</h1>
      <p class="about-lead">이 라이브러리는…</p>
    </div>
    <figure class="about-banner"><img src="…"></figure>

    <!-- Block 2~N: Sub-title + Contents + Image -->
    <section class="about-section">
      <h2>우리가 보는 것</h2>  <!-- eyebrow, 현재 display:none -->
      <h3>일상의 작은 풍경에서 출발합니다.</h3>
      <p>햇빛이…</p>
      <p>그래서…</p>
      <figure class="about-banner"><img src="…"></figure>
    </section>

    <!-- … -->

  </div>
</main>
```

`.about-section h2`는 마크업으로 남아 있지만 CSS에서 `display: none` — eyebrow 라벨 복원 필요해지면 그때 다시 켤 것.

---

## 5. On-this-page TOC (`.shell-toc`)

본문 우측에 sticky 미니 아웃라인.

```css
.shell-toc {
  position: fixed;
  top: var(--content-pad-top);   /* 100 — H1·토글과 같은 Y */
  right: 40px;
  width: 180px;
}
```

- 뷰포트 ≥ 1381px에서만 표시. 미만에선 `display: none` + `.shell-main.has-toc` 우측 패딩 축소.
- 활성 항목 표시는 IntersectionObserver 기반 scroll spy ([`shell.js`](../shared/shell.js) `setupScrollSpy`).

---

## 6. 정렬 규칙 — "Y=100 라인"

세 박스의 윗 가장자리가 동일 Y에서 시작:

| 요소 | Y 계산 |
|---|---|
| 사이드바 모드 토글 박스 top | `padding-top(16) + brand(28) + brand margin(56) = 100` |
| 본문 H1 박스 top | `--content-pad-top = 100` |
| TOC 박스 top | `top: var(--content-pad-top) = 100` |

새 컴포넌트가 사이드바·본문·TOC의 최상단에 추가될 때, 이 정렬을 깨지 말 것. 브랜드 마크의 박스 height를 28로 고정한 것도 동일한 이유.

---

## 7. 폰트 / 아이콘 / 자산

### 폰트

- 본문: **Pretendard Variable** (jsDelivr CDN)
- 모든 페이지 `<head>`에서 동일 링크로 로드
- 폴백: `'Pretendard Variable', Pretendard, Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif`

### 아이콘 / 로고 자산

| 파일 | 역할 |
|---|---|
| `logo.svg` (170×26) | 레거시 워드마크 — 현재 사이드바엔 미사용 |
| `favicon.svg` (1000×1000 정사각) | 브랜드 심볼 — 사이드바 마크 아이콘 + 브라우저 탭 |
| `shared/icons/chevron-down.svg`, `chevron-right.svg` | 토글 chevron 원본 (현재 [`shell.js`](../shared/shell.js)에 인라인) |

---

## 8. 동작 (Persistence & Interactions)

| 상태 | 저장소 | 키 |
|---|---|---|
| 사이드바 모드 (가이드/도구) | `localStorage` | `ohouse-bb-sidebar-mode` |
| 펼친 토글 그룹 id 배열 | `localStorage` | `ohouse-bb-nav-expanded` |
| 사이드바 스크롤 위치 | `sessionStorage` | `ohouse-bb-sidebar-scroll` |

- 모드 전환: 페이지 reload 없이 사이드바 콘텐츠 즉시 교체.
- 토글: 클릭 시 자식 `hidden` 속성 토글 + localStorage 업데이트.
- 활성 페이지의 모든 조상 토글은 자동으로 펼침 상태.

---

## 9. 페이지 → NAV id 매핑 규칙

`<main data-page="X" data-depth="Y">` 두 어트리뷰트가 페이지의 정체성:

- `data-page` — NAV 트리 안의 leaf id와 일치하면 그 메뉴가 active 표시됨
- `data-depth` — 루트로부터의 폴더 깊이. relative path 계산에 사용 (0 = 루트, 2 = `/identity/logo/`, 3 = `/asset/graphic/icon/` 등)

새 페이지 추가 시 두 어트리뷰트와 NAV 등록을 함께 처리.

---

## 10. 변경 가이드 (Update Checklist)

새 기능·페이지·컴포넌트를 추가할 때 이 순서로 점검:

1. **토큰 먼저** — 새 색·간격·라운딩이 필요하면 `:root`에 변수로 추가. 인라인 값 박지 말 것.
2. **사이드바 정렬** — 새 사이드바 컴포넌트가 최상단에 들어가면 "Y=100 라인" 유지 (6절).
3. **회색은 `--bg-mute`** — 모드 토글·활성 블록·도구 카드·호버 모두 동일 `#F5F5F5`.
4. **사이드바 텍스트는 13/Medium/-0.3px** — 행 높이/패딩까지 단일 룰. 색만 상태에 따라 변경.
5. **콘텐츠 블록 패턴** — Title/Sub + Contents + Image. 간격 8/30/80 유지.
6. **이미지** — `.about-banner` 클래스, 라운딩 12px, webp q80.
7. **NAV 추가** — [`shared/shell.js`](../shared/shell.js)의 `NAV`에 id/label/href 추가, 페이지 `data-page` 일치 확인.

---

## 11. 알려진 비표준 / 의도된 일탈

- `--radius-lg`(24px)는 토큰만 남고 본문 이미지에선 미사용. 다른 곳에서 24px 라운딩이 필요해질 때 재활용 후보.
- `--bg-soft`(`#fafafa`)는 배너 빈 배경 / 일부 카드 백그라운드에만 등장. 통합 정리 시 후보.
- `walkthrough/index.html`은 자체 스타일(3D Three.js 페이지). 본 디자인 시스템 외 영역이며, Visual Principles 페이지에 iframe으로만 결합.
- `figma-to-claude/` 폴더는 Figma → 코드 실험용 격리 작업물. `.gitignore`로 배포·git에서 제외.
- 루트의 `guide mode.png` / `tool mode.png`는 사이드바 디자인 레퍼런스 스냅샷.

---

## 12. 파일 레퍼런스

| 항목 | 경로 |
|---|---|
| 셸 CSS | [`shared/shell.css`](../shared/shell.css) |
| 셸 JS | [`shared/shell.js`](../shared/shell.js) |
| NAV 데이터 | `shared/shell.js` `const NAV` |
| Tool 데이터 | `shared/shell.js` `const TOOLS` |
| 사이드바 브랜드 심볼 | [`favicon.svg`](../favicon.svg) |
| 콘텐츠·IA 문서 | [`docs/brand-book.md`](brand-book.md) |
| 사이드바 디자인 레퍼런스 | `guide mode.png` / `tool mode.png` (루트) |
