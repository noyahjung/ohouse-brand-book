# Ohouse Brand Book

오늘의집의 브랜드 정체성·시선·결정의 맥락을 외부에 공개적으로 정리해 둔 브랜드 웹.

- 공개 URL: <https://noyahjung.github.io/ohouse-brand-book/>
- 시스템 개요·로드맵: [`docs/brand-book.md`](docs/brand-book.md)

## 구조

```
index.html                ← About / Mission (진입점)
symbol.html
visual-principles.html
tone-of-voice.html
color.html
overview.html
assets/
  icon · 2d · 3d · motion · pattern · photographic
  overview_asset/         ← 헤로·섹션 배너 이미지
walkthrough/              ← Visual Principles에 임베드되는 정적 슬라이드쇼
shared/
  shell.{js,css}          ← 헤더 + 사이드바 셸
```

## 관련 프로젝트

3D 에셋 라이브러리(디자이너용 커스터마이저 + 재질 모드)는 별도 프로젝트로 사내망 전용 배포. Brand Book의 Visual Principles 페이지는 자가완결된 `walkthrough/` 슬라이드쇼만 임베드하며, 사내 3D 라이브러리에는 의존하지 않는다.
