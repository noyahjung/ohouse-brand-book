// Mapping table: Notion page ID ↔ web file path ↔ asset slug.
// The sync script walks this list. Add new entries here when a
// new Notion page should be reflected on the web; nothing in
// shell.js / shell.css needs to change unless the new page also
// joins the sidebar NAV.

export const PAGES = [
  {
    id:     "365a597878a0810286e7e30c35f37b3c",
    title:  "로고",
    path:   "identity/logo.html",
    slug:   "logo",
    depth:  1,
    page:   "logo",
  },
  {
    id:     "365a597878a081d08150d5c998b65223",
    title:  "컬러",
    path:   "identity/color.html",
    slug:   "color",
    depth:  1,
    page:   "color",
  },
  {
    id:     "365a597878a081afa8e4d82beab1d6c2",
    title:  "톤 오브 보이스",
    path:   "identity/tone-of-voice.html",
    slug:   "tone-of-voice",
    depth:  1,
    page:   "voice",
  },
  {
    id:     "365a597878a0814b96b7fa898e68278f",
    title:  "비주얼 원칙",
    path:   "asset/visual-principles.html",
    slug:   "visual-principles",
    depth:  1,
    page:   "visual-principles",
  },
  {
    id:     "365a597878a08107b46decd73c3b52ba",
    title:  "그래픽 원칙",
    path:   "asset/graphic/principles.html",
    slug:   "graphic-principles",
    depth:  2,
    page:   "graphic-principles",
  },
  {
    id:     "365a597878a08196b269e84cbe164bee",
    title:  "아이콘",
    path:   "asset/graphic/icon.html",
    slug:   "graphic-icon",
    depth:  2,
    page:   "graphic-icon",
  },
  {
    id:     "365a597878a081ef95b8fcdb431ec6d2",
    title:  "2D 그래픽 에셋",
    path:   "asset/graphic/2d.html",
    slug:   "graphic-2d",
    depth:  2,
    page:   "graphic-2d",
  },
  {
    id:     "365a597878a08131bc18e3c46d3ca2cc",
    title:  "3D 그래픽 에셋",
    path:   "asset/graphic/3d.html",
    slug:   "graphic-3d",
    depth:  2,
    page:   "graphic-3d",
  },
  {
    id:     "365a597878a08188b155fac70688da22",
    title:  "사진 아이콘 에셋",
    path:   "asset/graphic/photo-icon.html",
    slug:   "graphic-photo-icon",
    depth:  2,
    page:   "graphic-photo-icon",
  },
  {
    id:     "365a597878a081b4a805fd88c18741f4",
    title:  "포토",
    path:   "asset/photo.html",
    slug:   "photo",
    depth:  1,
    page:   "photo",
  },
  {
    id:     "365a597878a081fc8106eb7baaedd4f8",
    title:  "패턴",
    path:   "asset/pattern.html",
    slug:   "pattern",
    depth:  1,
    page:   "pattern",
  },
];
