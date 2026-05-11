// ──────────────────────────────────────────────────────────
// principles/slides.js — content config for the Visual
// Language interaction (the iframe embedded inside index.html).
//
// This folder is the home for the principles walkthrough's
// content. New 3D assets and visual elements specific to the
// interaction live here so the main 3D customizer stays focused
// on the library catalog.
//
// HOW TO ADD A NEW SLIDE
//   1. Append a row to PRINCIPLES_SLIDES below.
//   2. `asset` references an entry in the ASSETS registry inside
//      3Dassetlibrary.html. If the slide needs a brand-new GLB
//      that shouldn't appear in the main library, register it
//      there with a name like `principles-<topic>` and store the
//      .glb under principles/assets/.
//   3. `color` is one of the body variants in materials.js
//      (frostedBlue, frostedRed, …, blackFriday).
//   4. `view` is a designer-preset key ('1' | '2' | '3') from
//      VIEW_DIRS — or define a per-slide camera in the slide
//      object itself if a future slide needs custom framing.
//   5. Optional flags:
//        rotate  — slow auto-rotation for emotion-driven slides
//        shadow  — show the ground-shadow demo overlay
//        mockUI  — overlay the mock-product-card screenshot
//
// HOW TO ADD A NEW PRINCIPLE-ONLY 3D ASSET
//   1. Drop the .glb under principles/assets/<name>.glb.
//   2. Register it in 3Dassetlibrary.html ASSETS as a normal
//      asset, but pass the principles path to its `url`. Keep
//      it out of the main asset-chip list (it shouldn't appear
//      in the library customizer's left rail).
//   3. Reference it from a slide here.
//
// HOW TO ADD NON-3D ELEMENTS (overlays, motion, illustrations)
//   Co-locate them in this folder (principles/<thing>) and
//   import from here. Keep cross-imports to materials.js in
//   the parent so the visual system stays a single source.
// ──────────────────────────────────────────────────────────

export const PRINCIPLES_SLIDES = [
  { asset: 'box',  color: 'frostedBlue', view: '2', rotate: false, shadow: false },
  { asset: 'gift', color: 'frostedRed',  view: '3', rotate: true,  shadow: false },
  { asset: 'box',  color: 'frostedBlue', view: '2', rotate: false, shadow: false, mockUI: true },
  { asset: 'box',  color: 'frostedBlue', view: '2', rotate: false, shadow: true  },
];
