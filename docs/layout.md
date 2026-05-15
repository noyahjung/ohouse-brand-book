# Ohouse Brand Book — Layout & Design System

> 추가 업데이트가 들어와도 시각 일관성이 유지되도록, 현재 적용된 레이아웃·디자인 사양을 한 곳에 정리한 레퍼런스. 새 페이지·새 기능을 붙일 땐 이 문서 기준을 먼저 확인.

권위 있는 구현체는 항상 [`shared/shell.css`](../shared/shell.css)와 [`shared/shell.js`](../shared/shell.js). 이 문서는 그 결정의 **요약**이고 둘이 어긋나면 코드가 진실.

---

## 1. 디자인 토큰

[`shared/shell.css`](../shared/shell.css) `:root`에 정의. 모든 컴포넌트가 이 값들을 참조 — 색·간격·라운딩을 바꿔야 하면 여기부터 손댐.

### 색

| 변수 | 값 | 용처 |
|---|---|---|
| `--bg` | `#ffffff` | 페이지·사이드바·푸터 기본 배경 |
| `--bg-soft` | `#fafafa` | 옅은 강조 배경 (현재 거의 미사용) |
| `--bg-mute` | `#f5f5f7` | **회색 블록의 단일 기준** — 모드 토글, 활성 메뉴 블록, 도구 카드 배경에 일관 적용 |
| `--border` | `#e5e7eb` | 일반 보더 |
| `--border-soft` | `#ececec` | 옅은 보더, 카드 호버 배경 |
| `--text` | `#111827` | 본문·헤더 기본 텍스트 |
| `--text-dim` | `#4b5563` | 본문 보조 텍스트 (현재 거의 미사용) |
| `--text-mute` | `#b8b8b8` | 사이드바 비활성 링크, 도구 설명, 푸터 |
| `--accent` | `#111827` | 본문 링크 색 (`<a>` 기본) |
| `--accent-soft` | `rgba(17,24,39,0.06)` | 레거시. 현 활성 메뉴 블록은 `--bg-mute`를 쓰므로 새 컴포넌트엔 가급적 비사용 |
| 브랜드 블루 | `#00A1FF` | 로고/심볼 컬러. CSS 변수 아님 — SVG에 직접 박혀 있음 (`logo.svg`, `favicon.svg`) |

### 간격

| 변수 | 값 | 용처 |
|---|---|---|
| `--sidebar-w` | `300px` | 사이드바 고정 너비 |
| `--content-max` | `920px` | 본문 최대 폭 (`shell-content`) |
| `--content-pad-x` | `80px` | 본문 좌우 패딩 |
| `--content-pad-top` | `64px` | 본문 상단 패딩. 사이드바 상단 패딩과 `+4px` 관계로 묶임 (H1의 half-leading 보정) |

### 라운딩

| 변수 | 값 | 용처 |
|---|---|---|
| `--radius-sm` | `8px` | 작은 칩·태그류 |
| `--radius` | `12px` | 도구 카드 아이콘 박스 등 중간 |
| `--radius-lg` | `24px` | **본문 banner 이미지 (`.about-banner`)** — 24px 통일 |

### 트랜지션

| 변수 | 값 | 용처 |
|---|---|---|
| `--transition` | `0.15s ease` | 모든 hover·토글·모드 전환 |

---

## 2. 레이아웃 골조

```
┌────────────────────┬─────────────────────────────────────────┐
│                    │                                         │
│   .shell-sidebar   │           .shell-main                   │
│   (fixed, 300px)   │   (margin-left: 300px)                  │
│                    │                                         │
│   ┌ Brand mark     │   ┌ .shell-content (max 920px)          │
│   ├ Mode toggle    │   │   - Hero (h1 + lead)                │
│   ├ Nav / Tools    │   │   - Banner image                    │
│   │   (flex: 1)    │   │   - Sections (h2/h3/p/figure)       │
│   ├ Foot links     │   │                                     │
│   └ Copyright      │   └─                                    │
│                    │                                         │
└────────────────────┴─────────────────────────────────────────┘
```

- 상단 고정 헤더 바 **없음**. 브랜드 마크는 사이드바 안에 위치.
- 사이드바와 본문 사이 **divider 없음** — 같은 흰 배경 위에서 자연스럽게 이어짐.

---

## 3. 사이드바

### 컨테이너

```css
.shell-sidebar {
  position: fixed; top: 0; left: 0; bottom: 0;
  width: var(--sidebar-w);                          /* 300 */
  background: var(--bg);
  padding: calc(var(--content-pad-top) + 4px) 32px 32px;  /* 68 / 32 / 32 */
  display: flex; flex-direction: column;
  overflow-y: auto;
}
```

L/R 패딩 32px → **내부 콘텐츠 가용 폭 236px**. 이 236px이 사이드바의 모든 폭 계산의 기준.

### 너비 통일 — "228px 룰"

세 요소의 가로 폭은 동일하게 **228px**로 맞춰져 있음 (`236 − 8`):

| 요소 | 구현 |
|---|---|
| 브랜드 로고 이미지 | `width: calc(var(--sidebar-w) - 72px)` |
| 모드 토글 배경 | `margin-right: 8px` |
| 활성 메뉴 회색 블록 | `margin-right: 8px` |

새 컴포넌트를 사이드바에 추가할 때 회색 블록이나 강조 배경을 가진다면 동일한 8px 우측 인셋을 유지해 정렬을 맞출 것.

### 브랜드 마크 (`.shell-sidebar-brand`)

- 가로형 워드마크 SVG 단일 이미지 (`logo.svg`, 170:26 비율)
- `width: 228px`, `height: auto` (≈35px)
- 텍스트 별도로 안 들어감 (SVG에 워드마크가 이미 포함)
- 아래쪽 마진 56px → 다음 요소(모드 토글)와의 간격

### 모드 토글 (`.shell-mode-toggle`)

Guide / Tool 두 모드를 전환하는 pill 형 segmented control.

```css
.shell-mode-toggle {
  display: flex;
  background: var(--bg-mute);
  border-radius: 999px;
  padding: 4px;
  margin: 0 8px 28px 0;        /* 8px 우측 인셋으로 228px 너비 */
}
.shell-mode-btn.active {
  background: var(--bg);
  color: var(--text);
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}
```

선택된 모드는 `localStorage['ohouse-bb-sidebar-mode']`에 저장 — 페이지 이동에도 유지.

### Guide 모드 — `.shell-sidebar-nav`

페이지 인덱스 트리. NAV 구조는 [`shared/shell.js`](../shared/shell.js)의 `const NAV` 참조.

#### 노드 종류

| 종류 | 표현 |
|---|---|
| 섹션 헤더 | `section.title` 있는 그룹. 라벨만 표시, 클릭 불가 |
| 리프 링크 | `{ id, label, href }` — 실 페이지 이동 |
| 토글 그룹 | `{ kind:'toggle', id, label, children }` — 클릭 시 자식 펼침/접힘 |
| 서브그룹 | `{ kind:'subgroup', label, items }` — 라벨 + 들여쓰기 (현재 NAV에선 미사용) |

#### 타이포

| 요소 | 사양 |
|---|---|
| 섹션 헤더 | 14px / 600 / `--text`, no case transform |
| 리프 링크 | 13.5px / 400 / `--text-mute`, padding `6px 0 6px 16px` |
| 리프 링크 hover | color → `--text` |
| **리프 링크 active** | bg `--bg-mute`, color `--text`, weight 600, radius 6px, margin-right 8px |
| 토글 버튼 | 리프 링크와 톤 동일 + 우측 chevron 14×14 |
| 토글 chevron | 접힘 상태에서 `-90°` 회전, 펼침 시 `0°` |

#### 들여쓰기 단계

- 1단계 (섹션 직속): `padding-left: 16px`
- 2단계 (토글 자식): `padding-left: 28px`
- 3단계 (중첩 토글의 자식, 예: 그래픽 → 아이콘 → 사용 가이드): `padding-left: 40px`

#### 상태 보존

- **펼침 상태**: `localStorage['ohouse-bb-nav-expanded']` (id 배열)
- **활성 페이지의 조상 토글은 자동 펼침** (페이지 로드 시 NAV 트리 walk)
- **사이드바 스크롤 위치**: `sessionStorage['ohouse-bb-sidebar-scroll']` (탭 세션 동안 유지)

### Tool 모드 — `.shell-sidebar-tools`

도구 카드 리스트. TOOLS 데이터는 [`shared/shell.js`](../shared/shell.js)의 `const TOOLS`.

#### 도구 카드 (`.shell-tool-card`)

```
┌─────────────────────────────────┐
│ ┌──┐  Title (14px 600)          │
│ │ic│  Description (12px muted,  │
│ └──┘   2 lines max)             │
└─────────────────────────────────┘
```

- 컨테이너: `background: var(--bg-mute)`, `border-radius: 14px`, `padding: 12px`, gap 12px
- 아이콘 박스: 48×48, `border-radius: 12px`, 도구별 배경 색은 인라인 style (`iconBg`)
- 아이콘 SVG: 박스의 70% 크기로 중앙 정렬
- Hover: 배경 `--border-soft`로 살짝 진해짐

### 푸터 (`.shell-sidebar-foot`)

```
오늘의집           (13.5px, muted, 외부 새 탭)
오늘의집 채용       (13.5px, muted, 외부 새 탭)
                  ← 28px 간격
© 2026 Ohouse. All rights reserved.   (11px, muted)
```

- 외부 사이트 링크 그룹 (`.shell-sidebar-foot-links`): 세로 stack, 4px gap, 13.5px (메뉴 텍스트와 동일 사이즈)
- 카피라이트 (`.shell-sidebar-foot-copy`): 11px, muted
- 링크 hover: color → `--text`

---

## 4. 본문 영역

### `.shell-main`

```css
.shell-main {
  margin-left: var(--sidebar-w);             /* 300 */
  padding: var(--content-pad-top) var(--content-pad-x) 120px;  /* 64 / 80 / 120 */
  min-height: 100vh;
}
.shell-content { max-width: var(--content-max); }   /* 920 */
```

### 콘텐츠 순서 — "head → text → image"

페이지 본문은 다음 순서를 유지:

1. 헤드 텍스트 (`h1`, lead `.about-lead`)
2. 본문 (paragraphs, `h2/h3`, 인용·표)
3. 이미지 (`figure.about-banner`)

각 about-section / asset-section 안에서도 같은 원칙: **이미지는 텍스트 뒤**. 새 페이지를 만들 땐 이 순서를 깨지 말 것.

### 타이포그래피 단순화

브랜드북은 본문에서 본문 위계를 **3단**으로만 사용:

| 단계 | 요소 | 비고 |
|---|---|---|
| Head | `.about-hero h1` | 페이지 헤드라인 |
| Sub-head | `.about-section h3` · `.asset-section h2` · `.principle-row-body h3` | 섹션 타이틀 |
| Body | `<p>` | 본문 단락 |

그 외 작은 라벨·eyebrow·캡션·태그(`.shell-breadcrumb`, `.asset-section-eyebrow`, `.principle-num` 등)는 CSS에서 `display: none`으로 **숨김 처리**되어 있음 — 마크업은 남아 있어서 추후 디자인 변경 시 복원 가능.

### 배너 이미지 (`.about-banner`)

```css
.about-banner {
  width: 100%;
  max-width: var(--content-max);
  aspect-ratio: 16 / 9;
  margin: 0 0 80px;
  background: var(--bg-soft);
  border-radius: var(--radius-lg);   /* 24px */
  overflow: hidden;
}
```

- 모든 본문 이미지의 라운딩은 `--radius-lg` (24px)로 통일.
- 새 배너 이미지를 추가할 땐 1920×1080 webp, **quality 80, method 6**으로 최적화. 평균 100–200KB. PNG 원본은 정리.

---

## 5. 폰트 / 아이콘 / 자산

### 폰트

- 본문: **Pretendard Variable** (jsDelivr CDN)
- 모든 페이지 `<head>`에서 동일 링크로 로드
- 폴백 체인: `'Pretendard Variable', Pretendard, Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif`

### 아이콘 / 로고 자산

| 파일 | 역할 |
|---|---|
| `logo.svg` (170×26) | 사이드바 브랜드 마크 — 아이콘 + 워드마크 일체형, 브랜드 블루 |
| `favicon.svg` (1000×1000 정사각) | 브라우저 탭 아이콘 — 원본 검은 심볼을 `#00A1FF` 블루로만 교체한 정사각 마크 |
| `shared/icons/chevron-down.svg`, `chevron-right.svg` | 토글 chevron 원본 SVG (현재 shell.js에 인라인 패스로 박혀 있음) |

모든 HTML의 favicon은 `favicon.svg`를 가리킴 (`<link rel="icon" type="image/svg+xml" href="…favicon.svg">`).

---

## 6. 동작 (Persistence & Interactions)

| 상태 | 저장소 | 키 |
|---|---|---|
| 사이드바 모드 (Guide/Tool) | `localStorage` | `ohouse-bb-sidebar-mode` |
| 펼친 토글 그룹 id 배열 | `localStorage` | `ohouse-bb-nav-expanded` |
| 사이드바 스크롤 위치 | `sessionStorage` | `ohouse-bb-sidebar-scroll` |

- 모드 전환: 페이지 reload 없이 사이드바 콘텐츠 즉시 교체.
- 토글: 클릭 시 자식 hidden 속성만 토글 + localStorage 업데이트.
- 활성 페이지의 모든 조상 토글은 자동으로 펼침 상태가 됨.

---

## 7. 페이지 → NAV id 매핑 규칙

`<main data-page="X" data-depth="Y">` 두 어트리뷰트가 페이지의 정체성:

- `data-page` — NAV 트리 안의 leaf id와 일치하면 그 메뉴가 active 표시됨
- `data-depth` — 루트로부터의 폴더 깊이. relative path 계산에 사용 (0 = 루트, 2 = `/identity/logo/`, 3 = `/asset/graphic/icon/` 등)

새 페이지 추가 시 두 어트리뷰트와 NAV 등록을 함께 처리할 것.

---

## 8. 변경 가이드 (Update Checklist)

새 기능·페이지·컴포넌트를 추가할 때 이 순서로 점검:

1. **토큰 먼저** — 새 색·간격·라운딩이 필요하면 `:root`에 변수로 추가. 인라인 값 박지 말 것.
2. **228px 너비 룰** — 사이드바 강조 박스는 8px 우측 인셋 유지.
3. **회색은 `--bg-mute` 하나로** — 모드 토글·활성 블록·도구 카드 모두 동일 회색. 새 컴포넌트도 동일 기준.
4. **본문 순서** — 헤드 → 본문 → 이미지. 깨지 말 것.
5. **이미지** — `.about-banner` 클래스 + 라운딩은 `--radius-lg`. 이미지 자체는 webp q80.
6. **NAV 추가** — `shared/shell.js`의 `NAV` 배열에 id/label/href 추가, 페이지 파일의 `data-page`가 일치하는지 확인.
7. **레거시 잔재** — `--accent-soft`, 헤더 바, 사이드바 우측 보더 등 옛 흔적은 다시 끌어다 쓰지 말 것.

---

## 9. 알려진 비표준 / 의도된 일탈

- `--accent-soft` 변수는 정의돼 있지만 새 활성 블록에선 안 씀. 정리해도 무방하나 외부 임베드(walkthrough 등)가 참조 중인지 확인 후 제거.
- `--bg-soft`도 거의 미사용 — banner 빈 배경에만 등장. 통합 정리 시 후보.
- `walkthrough/index.html`은 자체 스타일(3D Three.js 페이지). 본 디자인 시스템 외 영역이며, 시각 일관성 목표가 아님 — Visual Principles 페이지에 iframe으로만 결합.
- `figma-to-claude/` 폴더는 Figma → 코드 실험용 격리 작업물. `.gitignore`로 배포·git에서 제외돼 있음.

---

## 10. 파일 레퍼런스

| 항목 | 경로 |
|---|---|
| 셸 CSS | [`shared/shell.css`](../shared/shell.css) |
| 셸 JS | [`shared/shell.js`](../shared/shell.js) |
| NAV 데이터 | `shared/shell.js` `const NAV` |
| Tool 데이터 | `shared/shell.js` `const TOOLS` |
| 로고 (사이드바) | [`logo.svg`](../logo.svg) |
| Favicon | [`favicon.svg`](../favicon.svg) |
| 콘텐츠·IA 문서 | [`docs/brand-book.md`](brand-book.md) |
