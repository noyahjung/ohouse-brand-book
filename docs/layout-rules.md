# Ohouse Brand Book — 레이아웃 / 디자인 규칙

브랜드북 페이지 전반에 적용되는 레이아웃 시스템. 모든 페이지(`index.html`, `symbol.html`, `tone-of-voice.html`, `visual-principles.html`, `color.html`, `overview.html`, `assets/*.html`)는 동일한 `shared/shell.css` + `shared/shell.js` 셸을 공유한다.

---

## 1. 전체 페이지 구조

```
┌──────────────────┬────────────────────────────────────────┐
│                  │                                        │
│   Sidebar        │   Content area                         │
│   (fixed, 300px) │   (margin-left: 300px, max-width 920)  │
│                  │                                        │
│   · logo top     │   · about-hero (head + body)           │
│   · nav middle   │   · visual (image / stage / iframe)    │
│   · copyright    │   · sections (about / asset / overview)│
│     bottom       │                                        │
└──────────────────┴────────────────────────────────────────┘
```

- 상단 고정 헤더는 **사용하지 않음**. 브랜드 마크는 사이드바 상단으로 흡수.
- 사이드바는 viewport 전체 높이를 차지하고, flex column 으로 로고 / 내비 / 카피라이트를 배치.

---

## 2. 사이드바

| 항목 | 값 |
|---|---|
| `--sidebar-w` | `300px` |
| Top padding | `var(--content-pad-top) + 4px` (콘텐츠 H1 캡-하이트와 정렬) |
| 로고 아이콘 | `28 × 28px` |
| 워드마크 | `19px / 700 / line-height 1` |
| 로고 ↔ 첫 그룹 | `56px` |
| 그룹 ↔ 그룹 | `35px` |
| 최상위 링크 / 그룹 제목 | `14px / 600 / var(--text)` · padding `6px 0` |
| 하위 링크 | `13.5px / 400 / var(--text-mute)` · padding `6px 0 6px 16px` |
| 서브그룹 라벨 | `12px / 500 / var(--text-mute)` |
| 활성 상태 | 텍스트 색만 `var(--text)` + `font-weight 600` (배경 pill 없음) |
| 카피라이트 | 사이드바 하단 핀, `11px / var(--text-mute)` |

---

## 3. 콘텐츠 영역

| 항목 | 값 |
|---|---|
| `--content-max` | `920px` |
| `--content-pad-top` | `64px` |
| `--content-pad-x` | `80px` |
| 하단 padding | `120px` |

- 본문 텍스트와 비주얼(이미지/스테이지/iframe) 모두 `--content-max` 너비까지 확장 → **텍스트 폭과 사진 폭이 항상 동일**.

---

## 4. 콘텐츠 순서

모든 페이지는 다음 흐름을 따른다.

```
breadcrumb (hidden)
↓
about-hero  ─ head + body
↓
visual      ─ about-banner / vl-stage / color-stage / showcase-gallery
↓
section(s)  ─ 각 섹션 내부도 [sub-head → body → image] 순
```

- `index.html`의 `.about-section` 도 `[h3 → p → figure.about-banner]` 순으로 정렬.
- Brand 페이지(`symbol`, `tone-of-voice`, `visual-principles`, `color`)는 헤더/스테이지 순서를 `head → text → interaction(stage)` 으로 재배치.

---

## 5. 타이포그래피 — 3-tier 만 허용

콘텐츠 영역에서 사용하는 텍스트 위계는 단 3 가지.

| Tier | 클래스 | 스타일 |
|---|---|---|
| **Head** | `.about-hero h1` | `38px / 700 / line-height 1.2 / letter-spacing -0.02em` |
| **Sub-head** | `.about-section h3`, `.asset-section h2`, `.principle-row-body h3`, `.overview-section > h2`, `.overview-feature > h2` | `26px / 700 / line-height 1.3 / letter-spacing -0.015em` |
| **Body** | 모든 `p` | `16px / line-height 1.7 / color var(--text-dim)` |

### 제거된 라벨 (CSS `display: none`, HTML은 보존)

```
.shell-breadcrumb            (페이지 라벨)
.about-section > h2          ("우리가 보는 것" 등 eyebrow)
.asset-section-eyebrow       ("Overview", "Form Principles", "Workflow", "Specs")
.principle-row-head          ("01 — SMOOTHING LINE")
.principle-ko                (h3 아래 한 줄 부제)
.principle-expression        ("시각적 표현 · …")
.tov-quote-meta              ("홈 진입 — 응원하는 시선")
.status-note / .status-tag
.asset-tenet-rule            (tenet 제목 아래 32px 짧은 줄)
```

---

## 6. Divider 규칙

가로 hairline 은 **큰 구분점 사이에만** 둔다.

| 위치 | 적용 |
|---|---|
| `.about-section` ↔ `.about-section` | **유지** |
| `.asset-section` ↔ `.asset-section` | **유지** |
| `.overview-section` ↔ `.overview-section` | **유지** |
| `.about-meta` 상단 | **유지** |
| `.asset-tenet` 사이 | 제거 |
| `.principle-row` 사이 | 제거 (그리드도 2-col → 1-col) |
| `.asset-workflow-step` 사이 | 제거 |
| `.asset-tenet-rule` | 제거 |

---

## 7. 이미지 / 시각 영역

| 항목 | 값 |
|---|---|
| `--radius-lg` | `24px` (`.about-banner` 기본 라운드) |
| `.about-banner` | `width 100%`, `max-width var(--content-max)`, `aspect-ratio 16/9`, `margin 0 0 80px` |
| 섹션 내부 이미지 | `.about-section .about-banner { margin: 40px 0 0; }` (텍스트 ↔ 이미지 간격) |
| `.vl-stage`, `.color-stage` | `.about-banner` 와 동일 너비 / 비율 / 위치 |

---

## 8. 컬러 토큰 (변경 부분)

```
--bg          #ffffff
--bg-soft     #fafafa
--bg-mute     #f5f5f7
--border      #e5e7eb
--border-soft #ececec
--text        #111827
--text-dim    #4b5563
--text-mute   #b8b8b8     ← 비활성 nav, 작은 캡션
--accent      #111827
```

---

## 9. 반응형

| Breakpoint | 변화 |
|---|---|
| `<= 1100px` | `--sidebar-w: 220px`, `--content-pad-x: 56px` |
| `<= 900px` | `--content-pad-x: 40px`, `--content-pad-top: 48px` |
| `<= 640px` | 사이드바 `display: none`, 콘텐츠 `padding 32px 20px 56px` |

---

## 10. 변경 시 체크리스트

- 새 페이지를 추가할 때:
  1. `<main data-page="…" data-depth="…">` + `<div class="shell-content">` 셸에 맞춰 작성.
  2. 콘텐츠 순서는 `breadcrumb (선택) → about-hero → visual → section(s)`.
  3. 새 텍스트는 head / sub-head / body 3-tier 중 하나로만 분류.
  4. 새 라벨/캡션이 필요해 보이면, 먼저 `display: none` 대상 클래스에 추가할지 검토.
- 새 sub-head 영역을 만들 때는 `.about-section h3` 또는 `.asset-section h2` 와 같은 셀렉터에 자동 적용되도록 마크업.
- 헤드라인 폰트 사이즈(`.about-hero h1`)를 변경하면, 사이드바 상단 패딩의 `+ 4px` 보정값도 같이 재조정.
