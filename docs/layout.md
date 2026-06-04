# Ohouse Brand Book — Layout & Design System

> 추가 업데이트가 들어와도 시각 일관성이 유지되도록, 현재 적용된 레이아웃·디자인 사양을 한 곳에 정리한 레퍼런스. 새 페이지·새 기능을 붙일 땐 이 문서 기준을 먼저 확인.

권위 있는 구현체는 항상 [`shared/shell.css`](../shared/shell.css)와 [`shared/shell.js`](../shared/shell.js). 이 문서는 그 결정의 **요약**이고 둘이 어긋나면 코드가 진실.

---

## 1. 디자인 토큰

[`shared/shell.css`](../shared/shell.css) `:root`에 정의.

### 색

| 변수 / 인라인 값 | 값 | 용처 |
|---|---|---|
| `--bg` | `#ffffff` | 페이지·사이드바 기본 배경 |
| `--bg-soft` | `#fafafa` | 이미지 placeholder 배경 (`.about-banner`) |
| `--bg-mute` | `#F5F5F5` | 회색 블록 단일 기준 — 모드 토글 트랙, 활성 메뉴 pill, 도구 카드, 다운로드 버튼, 호버 |
| `--border-soft` | `#ececec` | 미세 보더, divider |
| `--text` | `#111827` | 레거시 검정 |
| `--text-mute` | `#b8b8b8` | 푸터 등 약한 텍스트 |
| `--nav-mute` | `rgba(8, 19, 26, 0.6)` | 사이드바 메뉴 일반 텍스트 (비활성) |
| 콘텐츠 헤딩 | `#08131A` (인라인) | H1·H2·H3·H4 헤딩 컬러 |
| 콘텐츠 본문 | `rgba(8, 19, 26, 0.5)` (인라인) | 본문 `<p>` 텍스트 |
| 사이드바 섹션 타이틀 | `rgba(0, 0, 0, 0.3)` (인라인) | "Overview" / "Identity" / "Asset" |
| 다운로드 버튼 텍스트 | `#08131A` (인라인) | `.content-download` |
| 브랜드 블루 | `#00A1FF` | 로고 심볼 (SVG에 직접 박힘) |

### 간격

| 변수 | 값 | 용처 |
|---|---|---|
| `--sidebar-w` | `240px` | 사이드바 고정 너비 |
| `--sidebar-pad-x` | `0px` | 사이드바 내부 좌우 패딩 (자식별 자체 패딩 사용) |
| `--sidebar-left` | `26px` | 사이드바를 윈도우 좌측 끝에서 띄우는 인셋 |
| `--content-max` | `920px` | 본문 최대 폭 (`.shell-content`) |
| `--content-pad-x` | `80px` | 본문 좌우 패딩 (`.shell-main` right; left는 27px override) |
| `--content-pad-top` | `90px` | 본문 H1 박스 top — H1 글자의 cap-top이 Y=100에 와서 사이드바 토글 박스 top과 정렬됨 |

### 라운딩

| 변수 | 값 | 용처 |
|---|---|---|
| `--radius-sm` | `8px` | 사이드바 네비 pill, 작은 칩 |
| `--radius` | `12px` | 본문 이미지(`.about-banner`), 도구 카드 아이콘 박스, **다운로드 버튼(`.content-download`)** |
| `--radius-lg` | `24px` | 레거시 (현재 사용처 없음) |

### 트랜지션

| 변수 | 값 | 용처 |
|---|---|---|
| `--transition` | `0.15s ease` | 모든 hover·토글·모드 전환 |

---

## 2. 레이아웃 골조

```
26  240               27                                  TOC 240
┌──┬─────────────┬─────────────────────────────────┬──────────────┐
│  │             │                                 │              │
│  │ .shell-     │           .shell-main           │  .shell-toc  │
│  │  sidebar    │   margin-left: sidebar+left     │  (fixed,     │
│  │  (fixed)    │   padding: 90 / 27 / 120        │   180px)     │
│  │ container-  │                                 │              │
│  │  type:      │  ┌ .shell-content (max 920)     │              │
│  │  inline-    │  │   - H1 (overview, 46/Bold)   │              │
│  │  size       │  │   - p / image                │              │
│  │             │  │   - <hr.content-divider>     │              │
│  │ ┌ Brand     │  │   - H1 (대분류)              │              │
│  │ ├ Mode      │  │   - p / image / button       │              │
│  │ │  toggle   │  │   - H2 (소분류)              │              │
│  │ ├ Nav/Tools │  │   - .content-cols (2-grid)   │              │
│  │ ├ Foot      │  │     · .content-card          │              │
│  │ └ Copyright │  │     · figure + button        │              │
│  │             │  └─                             │              │
└──┴─────────────┴─────────────────────────────────┴──────────────┘
```

- 상단 고정 헤더 없음 / 사이드바 ↔ 본문 사이 divider 없음.
- **사이드바 모드 토글 박스 top, 본문 H1 글자 cap-top, TOC "On this page" 라벨 cap-top 세 가지가 모두 Y=100에서 정렬.** (자세한 계산은 6절)

---

## 3. 사이드바

### 컨테이너

```css
.shell-sidebar {
  position: fixed;
  top: 0; left: var(--sidebar-left);   /* 26 */
  bottom: 0;
  width: var(--sidebar-w);             /* 240 */
  padding: 16px 0 28px;                /* 좌우 0 → 토글·active pill이 240 풀폭 */
  container-type: inline-size;
}
```

- `container-type: inline-size` 호스트 — 브랜드 마크가 `cqi`로 사이드바 폭에 비례 축소.
- 사이드바가 윈도우 좌측에서 **26px** 띄움.
- 사이드바 padding-top(16) + brand height(28 고정) + brand margin-bottom(56) = **100** → 모드 토글 박스 top.

### 브랜드 마크 (`.shell-sidebar-brand`)

```
[hexagon icon]  오늘의집  브랜드센터
```

- favicon.svg 아이콘 + `<span>오늘의집</span>` (700) + `<span>브랜드센터</span>` (500)
- **height: 28px 고정** (마크가 작아져도 토글 정렬 유지)
- 반응형 (content-box 폭 ~240 기준 cqi):
  - 아이콘 `clamp(20px, 10cqi, 28px)`
  - 텍스트 `clamp(15px, 7.5cqi, 21px)`
  - 갭 `clamp(6px, 3.2cqi, 9px)` / 텍스트 갭 `clamp(4px, 2.15cqi, 6px)`
- margin-bottom: 56px (→ 모드 토글까지의 간격)

### 모드 토글 (`.shell-mode-toggle`)

```
[ 가이드 ] [ 도구 🔒 ]
```

- `width: 240px` (사이드바 풀폭), 배경 `#F5F5F5`, padding 4, radius 999
- 버튼: 14px Medium, `padding: 9px 18px`, gap 6
- 비활성 텍스트 컬러 `rgba(8,19,26,0.3)`, 활성 `#08131A` 100% (배경 `#ffffff`, shadow 없음)
- "도구" 옆 자물쇠 SVG 13×13
- margin-bottom: 25px (→ 첫 섹션 헤더까지의 간격)

### 가이드 모드 네비 (`.shell-sidebar-nav`)

플랫한 NAV. 모든 행이 동일한 **13px Medium / -0.3px / 20 line / padding 8×10 / radius 8** 사양. 색만 상태별로 다름.

| 상태 | 색 | 비고 |
|---|---|---|
| 섹션 헤더 | `rgba(0,0,0,0.3)` | "Overview" / "Identity" / "Asset" |
| 리프 / 토글 (일반) | `var(--nav-mute)` = `rgba(8,19,26,0.6)` | |
| hover | nav-mute 유지, bg `--bg-mute` | |
| **active** | `var(--text)` (100%), bg `--bg-mute` | active pill이 240 풀폭 |
| 토글 chevron | nav-mute / 접힘 시 -90° 회전 | |

들여쓰기 — 1단계 padding-left 10, 2단계 20, 3단계 30 (각 단계 +10).

NAV 구조 ([`shell.js`](../shared/shell.js)의 `const NAV` 참조):

```
Overview
  홈                       → index.html
Identity
  로고                     → identity/logo.html
  컬러                     → identity/color.html
  톤 오브 보이스           → identity/tone-of-voice.html
Asset
  비주얼 원칙              → asset/visual-principles.html
  그래픽 v (토글)
    그래픽 원칙            → asset/graphic/principles.html
    아이콘                 → asset/graphic/icon.html
    2D 그래픽 에셋         → asset/graphic/2d.html
    3D 그래픽 에셋         → asset/graphic/3d.html
    사진 아이콘 에셋       → asset/graphic/photo-icon.html
  포토                     → asset/photo.html
  패턴                     → asset/pattern.html
```

각 leaf는 **단일 long-scroll 페이지**(이전 guide/cases/resources 분리 → 통합). 페이지 안의 챕터는 우측 TOC로 앵커 이동.

### 도구 모드 (`.shell-sidebar-tools`)

도구 카드 리스트 (`const TOOLS`).
- 카드: bg `--bg-mute`, radius 14, padding 12, gap 12
- 아이콘 박스 48×48, radius 12, 1px border `--border-soft`
- 도구 모드 진입 시 본문도 자동 교체 — `toolModeHtml(depth)`가 `.shell-content`를 도구 페이지(Title 툴 모드 / Contents 꺼내 쓰는 브랜드 툴 모음 / `tool_thumbnail.png`)로 치환. 가이드로 돌아가면 원본 HTML 복원.

### 푸터 (`.shell-sidebar-foot`)

```
오늘의집           (13.5px, muted, 외부 새 탭)
오늘의집 채용       (13.5px, muted, 외부 새 탭)
                  ← 28px 간격
© 2026 Ohouse. All rights reserved.   (11px, muted)
```

좌우 padding 10 (사이드바 padding-x가 0이라 footer 텍스트가 가장자리에 붙지 않도록 자체 인셋).

---

## 4. 본문 영역

### `.shell-main`

```css
.shell-main {
  margin-left: calc(var(--sidebar-w) + var(--sidebar-left));  /* 240 + 26 = 266 */
  padding: var(--content-pad-top) var(--content-pad-x) 120px; /* 90 / 80 / 120 */
  padding-left: 27px;                                          /* 사이드바와의 간격 */
}
.shell-content { max-width: var(--content-max); }              /* 920 */
```

좌측은 사이드바 바로 옆 27px(콘텐츠 - 사이드바 간격), 우측은 `--content-pad-x` 80px (TOC 영역 확보).

### 콘텐츠 블록 (Content Block) 구성

본문은 **대분류 챕터의 나열**. 각 대분류는 `<h1>`. 그 안에 본문(`<p>`), 이미지(`<figure class="about-banner">`), 소분류(`<h2>` / `<h3>`), 2-grid 구성(`.content-cols`) 등이 들어감.

```
[H1 페이지 오버뷰]
[lead p]
[image]

<hr class="content-divider">

[H1 대분류 (사용 가이드)]
[p]
[image]
[button]

[H2 소분류 (앱 아이콘 & SNS 프로필)]
[p]
[image]
[button]

<hr class="content-divider">

[H1 다음 대분류 …]
```

#### 타이포 (Figma Play Book 컴포넌트 시트 적용)

| 단계 | 요소 | 사양 |
|---|---|---|
| **Heading 1** | `<h1>` | 46px / 700 / `#08131A` / line 1.25 / -0.3px |
| **Heading 2** | `<h2>` | 26px / 700 / `#08131A` / line 1.2  / -0.3px |
| **Heading 3** | `<h3>` | 26px / 700 / `#08131A` / line 1.2  / -0.3px (H2 alias) |
| **Heading 4** | `<h4>` | 26px / 700 / `#08131A` / line 1.2  / -0.3px (카드 라벨 등) |
| **Body** | `<p>` | 16px / 500 / `rgba(8,19,26,0.5)` / line 1.5 / -0.3px |

> H1과 H2가 같은 컬러·웨이트, **사이즈만 다름**. 페이지 오버뷰 H1은 챕터 H1과 시각적으로 동일(헤딩 사이즈).

#### 간격

| 구간 | 값 | 구현 |
|---|---|---|
| Title → Body | 8px | `h1/h2/h3 { margin-bottom: 8px }` |
| Body → Image | 30px | `.about-banner { margin-top: 30px }` |
| Image → Button | 8px | `.content-download { margin-top: 8px }` |
| 대분류 사이 | 80px | `.shell-content h1 { margin-top: 80px }` (첫 H1 제외) |
| 가로열(`.content-cols`) 사이 | 60px | `.content-cols + .content-cols { margin-top: 60px }` |
| `.content-card` 내 image 그룹 사이 | 30px | `.content-card .about-banner:not(:first-child)` |

### 본문 컴포넌트

#### 이미지 (`.about-banner`)

```css
.about-banner {
  width: 100%; max-width: var(--content-max);
  aspect-ratio: 16 / 9;
  background: var(--bg-soft);
  border-radius: 12px;           /* var(--radius) */
  margin: 30px 0 0;
  overflow: hidden;
}
```

빈 `<figure class="about-banner"></figure>`는 그대로 회색 placeholder. `<img>` 자식이 있으면 16:9 배너.

#### 2-grid (`.content-cols`)

```css
.content-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 30px;
}
.content-cols .about-banner {
  margin: 0;
  aspect-ratio: 1 / 1;          /* 2-grid 안 이미지는 정사각 */
}
```

#### 카드 (`.content-card`) — 2-grid 안에서 image + button 반복

```css
.content-card {
  display: flex; flex-direction: column;
  align-items: flex-start;       /* 버튼은 좌측 정렬 */
  gap: 0;                        /* 간격은 자식 margin이 결정 */
}
.content-card .about-banner { align-self: stretch; }
.content-card .about-banner:not(:first-child) { margin-top: 30px; }
```

> 결과: 카드 안에서 image→button 8px, button→다음 image 30px. 1-grid와 동일 리듬.

#### 다운로드 버튼 (`.content-download`)

Figma Play Book 버튼 컴포넌트:

```css
.content-download {
  display: inline-flex;
  align-items: center; justify-content: center;
  background: #F5F5F5;
  color: #08131A;
  border-radius: 12px;           /* var(--radius) */
  padding: 8px 10px;             /* 세로 8 / 가로 10 */
  font-size: 14px;
  font-weight: 500;              /* Pretendard Medium */
  letter-spacing: -0.3px;
  line-height: 1.4;
  text-decoration: none;
  margin-top: 8px;               /* 직전 이미지와의 간격 (기본) */
}
```

- **단독 요소로 배치** (이전 H4 라벨 + 버튼 묶음은 제거)
- 버튼 텍스트가 라벨 역할 ("KR 브랜드 로고 다운로드", "오늘의집 키친 로고 다운로드" 등)
- `.shell-content a:not(.cta-btn):not(.content-download)` 셀렉터로 본문 링크 underline에서 제외

##### 위계 — 중요 / 일반

본문 액션 버튼은 시각적 위계에 따라 두 카테고리로 구분. **차이는 색상**이며,
프로젝트별로 모양(pill / rounded rect)은 다를 수 있어도 색상 위계는 공통.

| 카테고리 | 용도 | 클래스 | 배경 | 텍스트 색 | 모양 |
|---|---|---|---|---|---|
| **중요 버튼** | 페이지의 핵심 액션 | `.cta-btn` | `var(--accent)` (#111827) | `#fff` | 999px pill |
| **일반 버튼** | 보조 액션 / 다운로드 | `.content-download` | `#F5F5F5` | `#08131A` | 12px radius |

- **한 페이지에 중요 버튼은 1개를 원칙**으로 두고, 나머지 보조 액션은 모두 일반 버튼.
- 두 버튼이 연속으로 올 때 중요 → 일반 순서가 자연스럽다 (시선 우선순위).
- 사이즈 차이로 위계를 만들지 말 것 — 색상만으로 충분.

자매 프로젝트(`Ohouse_3D_Asset_Library/docs/layout-rules.md` §2)에도
같은 원칙이 기록되어 있다. 그 쪽은 두 클래스가 같은 사각형 모양에 색상만 다른
변형 (`.content-download` = 중요 검정 / `.content-link` = 일반 라이트)으로 구현돼 있다.

##### 여백 규칙 — 직전 요소에 따른 `margin-top`

버튼 위에 무엇이 오는지로 상단 여백을 다르게 둔다. 텍스트와 버튼 사이는
한 호흡 더 두어 액션이 본문에 묻히지 않게 한다.

| 직전 요소 | `margin-top` | 의도 |
|---|---|---|
| `.about-banner` (이미지) | **8px** (기본) | 이미지 캡션처럼 바로 따라붙음 |
| `p` (본문 단락) | **24px** | 텍스트→액션 전환에서 시각적 단락 분리 |

```css
/* 본문 텍스트 직후 버튼은 24px 위 여백 */
.shell-content p + .content-download {
  margin-top: 24px;
}
```

같은 규칙은 다른 인라인 액션 버튼(예: 외부 채널 링크의 `.content-link`)에도 동일 적용.

#### Divider (`.content-divider`)

```css
.content-divider {
  margin: 80px 0;
  border: 0;
  border-top: 1px solid var(--border-soft);
}
```

대분류 챕터 사이를 가르는 가로선. Notion의 `---`에 대응.

---

## 5. On-this-page TOC (`.shell-toc`)

```css
.shell-toc {
  position: fixed;
  top: 96px;                     /* "On this page" 라벨 cap top이 Y=100 */
  right: 40px;
  width: 180px;
}
```

- TOC 셀렉터: `.shell-content h1, h2, h3, .principle-row-body h3`
- **모든 H1은 top-level 항목**, H2/H3는 `shell-toc-item--sub` 클래스로 들여쓰기 (padding-left 28, font 12, mute 컬러)
- scroll spy: IntersectionObserver
- 뷰포트 ≥ 1381px일 때만 표시 / 미만에서 `display: none`

### 앵커 점프

```css
html { scroll-behavior: smooth; scroll-padding-top: 90px; }
```

TOC 항목 클릭 시 헤딩 박스 top이 viewport top + 90에 정렬 → H1 글자의 cap-top이 사이드바 모드 토글 박스 top(Y=100)과 일치.

---

## 6. 정렬 규칙 — "Y=100 라인"

세 요소의 시각적 윗 가장자리가 동일 Y에서 시작:

| 요소 | Y 계산 |
|---|---|
| 사이드바 모드 토글 박스 top | `padding-top(16) + brand(28) + brand margin(56) = 100` |
| 본문 H1 글자 cap-top | `--content-pad-top(90) + H1 line half-leading(~10) ≈ 100` |
| TOC 라벨 cap-top | `.shell-toc { top: 96px } + 라벨 cap-inset(~4) ≈ 100` |
| TOC 앵커 점프 후 헤딩 cap-top | `scroll-padding-top(90) + H1 cap-inset ≈ 100` |

> 새 컴포넌트를 셸 최상단에 추가할 때 이 정렬을 깨지 말 것. 브랜드 마크 박스 height를 28로 고정한 것도 동일한 이유.

---

## 7. 폰트 / 아이콘 / 자산

- **본문 폰트**: Pretendard Variable (jsDelivr CDN)
- **아이콘**:
  - `favicon.svg` (1000×1000) — 사이드바 브랜드 마크 + 브라우저 탭
  - `logo.svg` — 레거시 워드마크 (현재 미사용)
- **모드 토글 자물쇠**: shell.js 인라인 SVG
- **콘텐츠 이미지 자산**: 노션 콘텐츠 동기화 시 `assets/notion/<slug>/` 폴더에 영구 저장 (노션 임시 URL 만료 방지)

---

## 8. 동작 (Persistence & Interactions)

| 상태 | 저장소 | 키 |
|---|---|---|
| 사이드바 모드 (가이드/도구) | `localStorage` | `ohouse-bb-sidebar-mode` |
| 펼친 토글 그룹 id 배열 | `localStorage` | `ohouse-bb-nav-expanded` |
| 사이드바 스크롤 위치 | `sessionStorage` | `ohouse-bb-sidebar-scroll` |

- 모드 전환: 사이드바 콘텐츠 즉시 교체 + `.shell-content` innerHTML 교체(가이드↔도구). 원본 HTML은 `main._guideContentHtml`에 보관해 무손실 복원.
- 토글: 클릭 시 자식 `hidden` 속성 토글 + localStorage 업데이트.
- 활성 페이지의 모든 조상 토글은 자동으로 펼침.

---

## 9. 페이지 ↔ NAV id 매핑

`<main data-page="X" data-depth="Y">` 두 어트리뷰트가 페이지의 정체성:

- `data-page` — NAV 트리 안의 leaf id와 일치하면 그 메뉴가 active
- `data-depth` — 루트로부터의 폴더 깊이 (0 = 루트, 1 = `/identity/`, 2 = `/asset/graphic/`)

---

## 10. 노션 ↔ 웹 매핑 (POC)

콘텐츠를 노션에서 작성 → 빌드 스크립트가 매핑된 HTML 페이지로 변환하는 흐름. 부모 페이지 [`오늘의집 브랜드센터 콘텐츠 작성 페이지`](https://www.notion.so/330a597878a0804b8641e68f93f950e5) 아래에 11개 sub-page가 만들어져 있음.

### 블록 매핑

| Notion 블록 | HTML |
|---|---|
| `# 텍스트` | `<h1>` (대분류) |
| `## 텍스트` | `<h2>` (소분류) |
| `#### 텍스트` | `<h4>` (카드 라벨) |
| 일반 텍스트 / `<span color="gray">` | `<p>` |
| 이미지 블록 | `<figure class="about-banner"><img></figure>` |
| `<columns>` | `<div class="content-cols">` (2-grid) |
| column 내부 image + button 반복 | `<div class="content-card">` |
| `---` divider | `<hr class="content-divider">` |
| Button block | `<a class="content-download" href="…">텍스트</a>` (현재 href는 placeholder) |

### 페이지 ↔ 웹 매핑

| 노션 페이지 | 웹 경로 |
|---|---|
| 로고 | `identity/logo.html` |
| 컬러 | `identity/color.html` |
| 톤 오브 보이스 | `identity/tone-of-voice.html` |
| 비주얼 원칙 | `asset/visual-principles.html` |
| 그래픽 원칙 | `asset/graphic/principles.html` |
| 아이콘 | `asset/graphic/icon.html` |
| 2D 그래픽 에셋 | `asset/graphic/2d.html` |
| 3D 그래픽 에셋 | `asset/graphic/3d.html` |
| 사진 아이콘 에셋 | `asset/graphic/photo-icon.html` |
| 포토 | `asset/photo.html` |
| 패턴 | `asset/pattern.html` |

### 이미지 처리

노션이 주는 S3 URL은 1시간 후 만료되므로, 동기화 시 이미지는 다운로드해서 `assets/notion/<slug>/` 폴더에 영구 저장. 그 다음 HTML의 `<img src="">`에 로컬 경로로 박음.

### 알려진 한계

- 노션 Button block의 외부 URL은 API로 노출되지 않음 → 다운로드 링크는 별도 매핑 필요(현재 `href="#"` placeholder).
- 자유 입력이므로 약속된 블록 종류 외(콜아웃·토글·코드·테이블 등)는 빌드 시 무시되거나 깨질 수 있음 → 화이트리스트 검사 + 경고 출력 필요.
- 자동 빌드 스크립트(`scripts/notion-sync.js`)는 POC 검증 후 추가 예정. 현재는 수동으로 fetch + 변환.

---

## 11. 변경 가이드 (Update Checklist)

새 기능·페이지·컴포넌트를 추가할 때:

1. **토큰 먼저** — 새 색·간격·라운딩이 필요하면 `:root`에 변수로 추가. 인라인 값 박지 말 것.
2. **Y=100 라인 유지** — 사이드바 최상단에 새 요소가 들어가면 정렬 다시 계산 (6절).
3. **회색은 `--bg-mute`(#F5F5F5)** — 모드 토글·활성 블록·도구 카드·다운로드 버튼·호버 모두 동일 회색.
4. **사이드바 텍스트는 13/Medium/-0.3px / 8×10 padding** — 색만 상태별 변경.
5. **콘텐츠 블록 패턴** — H1(대분류) / H2·H3(소분류) / p(본문) / `.about-banner`(이미지) / `.content-cols`(2-grid) / `.content-card`(카드) / `.content-download`(버튼) / `.content-divider`(가로선) 조합.
6. **이미지** — `.about-banner` 클래스, radius 12px, webp q80.
7. **노션 콘텐츠 작성 시** — 약속된 블록 종류만 사용, 이미지는 빌드 때 로컬로 저장.
8. **NAV 추가** — [`shared/shell.js`](../shared/shell.js)의 `NAV`에 id/label/href 추가, 페이지 `data-page` 일치 확인.

---

## 12. 알려진 비표준 / 의도된 일탈

- `--radius-lg`(24px)는 토큰만 남고 사용처 없음. 새 24px 라운딩이 필요해질 때 재활용.
- `.about-section` / `.about-hero h1` 별도 룰은 제거. 모든 페이지가 평면 마크업(`.shell-content > h1, p, figure`)으로 통일.
- `walkthrough/index.html`은 자체 스타일(3D Three.js). 본 디자인 시스템 외 영역.
- `figma-to-claude/` 폴더는 Figma 실험용 격리 작업물. `.gitignore`로 배포·git에서 제외.
- `guide mode.png` / `tool mode.png` (루트) = 사이드바 디자인 레퍼런스 스냅샷.
- `tool_thumbnail.png` = 도구 모드 본문 이미지.
- `assets/notion/logo/` = POC 단계에서 노션 콘텐츠로부터 수집한 로고 이미지들.

---

## 13. 파일 레퍼런스

| 항목 | 경로 |
|---|---|
| 셸 CSS | [`shared/shell.css`](../shared/shell.css) |
| 셸 JS | [`shared/shell.js`](../shared/shell.js) |
| NAV 데이터 | `shared/shell.js` `const NAV` |
| Tool 데이터 | `shared/shell.js` `const TOOLS` |
| 도구 모드 본문 템플릿 | `shared/shell.js` `toolModeHtml(depth)` |
| 사이드바 브랜드 심볼 | [`favicon.svg`](../favicon.svg) |
| 콘텐츠·IA 문서 | [`docs/brand-book.md`](brand-book.md) |
