# Userscripts Runtime

## What this is

This repository contains reusable UI components for userscripts.

You load one JavaScript file, load the CSS files, then create components with `UserscriptUI`.

## Project structure

```text
src/          = files you edit
components/   = generated JS people consume
styles/       = generated base CSS + maintained fonts/themes people consume
docs/         = self-contained GitHub Pages playground
scripts/      = build tooling
```

<details>
<summary>Full project structure</summary>

The numbered files under `src/` are concatenated in filename order by `scripts/build.sh`. The tree below is refreshed automatically when the build runs.

<!-- PROJECT_TREE_START -->
```text
.
├── LICENSE
├── README.md
├── components
│   └── ui.js
├── docs
│   ├── .nojekyll
│   ├── components
│   │   └── ui.js
│   ├── dark.html
│   ├── fonts
│   │   ├── atkinson-hyperlegible-400.ttf
│   │   ├── atkinson-hyperlegible-700.ttf
│   │   ├── pixelify-sans-400.ttf
│   │   ├── pixelify-sans-500.ttf
│   │   ├── pixelify-sans-600.ttf
│   │   └── pixelify-sans-700.ttf
│   ├── gallery.css
│   ├── gallery.js
│   ├── index.html
│   ├── light.html
│   └── styles
│       ├── base.css
│       ├── fonts.css
│       └── themes
│           ├── dark.css
│           └── light.css
├── fonts
│   ├── atkinson-hyperlegible-400.ttf
│   ├── atkinson-hyperlegible-700.ttf
│   ├── pixelify-sans-400.ttf
│   ├── pixelify-sans-500.ttf
│   ├── pixelify-sans-600.ttf
│   └── pixelify-sans-700.ttf
├── scripts
│   └── build.sh
├── src
│   ├── css
│   │   ├── 00-foundation.css
│   │   ├── 05-foundation-layout.css
│   │   ├── 10-shell.css
│   │   ├── 20-panels.css
│   │   ├── 21-buttons-feedback.css
│   │   ├── 22-forms-settings.css
│   │   ├── 30-data-navigation.css
│   │   ├── 31-actions.css
│   │   ├── 40-media.css
│   │   ├── 50-overlays.css
│   │   ├── 60-responsive.css
│   │   ├── 70-visual-contract.css
│   │   ├── 75-media-composition.css
│   │   ├── 76-viewport-navigator.css
│   │   ├── 80-progress-loading.css
│   │   ├── 81-file-picker.css
│   │   ├── 82-asset-tray.css
│   │   ├── 90-asset-carousel.css
│   │   ├── 91-windows.css
│   │   └── 92-annotations.css
│   ├── docs-gallery
│   │   ├── 00-preamble.js
│   │   ├── 10-actions.js
│   │   ├── 11-feedback.js
│   │   ├── 12-forms.js
│   │   ├── 13-utility-bar.js
│   │   ├── 14-visual-primitives.js
│   │   ├── 20-files-assets-progress.js
│   │   ├── 21-viewport-navigator.js
│   │   ├── 30-inline.js
│   │   ├── 31-hover.js
│   │   ├── 32-popovers.js
│   │   ├── 40-settings.js
│   │   ├── 50-tools-drawer.js
│   │   └── 60-context-popover.js
│   └── js
│       ├── 00-constants.js
│       ├── 10-dom.js
│       ├── 20-basic.js
│       ├── 30-forms.js
│       ├── 31-settings.js
│       ├── 40-panels.js
│       ├── 41-data.js
│       ├── 42-actions.js
│       ├── 43-archive.js
│       ├── 50-progress.js
│       ├── 50-segmented-progress.js
│       ├── 51-file-picker.js
│       ├── 51-upload-queue.js
│       ├── 52-asset-tray.js
│       ├── 53-asset-carousel.js
│       ├── 53-asset-hover.js
│       ├── 54-media.js
│       ├── 55-viewport-navigator.js
│       ├── 60-overlays.js
│       ├── 70-annotation-core.js
│       ├── 70-selection-toolbar.js
│       ├── 71-annotation-mode.js
│       ├── 71-storage.js
│       ├── 72-draggable-window.js
│       ├── 73-notepad.js
│       ├── 74-dialogs-feedback.js
│       ├── 80-tool-navigation.js
│       ├── 81-terminal.js
│       ├── 90-shell.js
│       └── 99-export.js
└── styles
    ├── base.css
    ├── fonts.css
    └── themes
        ├── dark.css
        └── light.css

15 directories, 95 files
```
<!-- PROJECT_TREE_END -->

</details>

## How to install

Add the runtime and styles to your userscript header:

```js
// @require  https://<username>.github.io/userscripts-runtime/components/ui.js?v=0.2.13
// @resource UI_BASE  https://<username>.github.io/userscripts-runtime/styles/base.css?v=0.2.13
// @resource UI_DARK  https://<username>.github.io/userscripts-runtime/styles/themes/dark.css?v=0.2.13
// @resource UI_LIGHT https://<username>.github.io/userscripts-runtime/styles/themes/light.css?v=0.2.13
//
// @grant GM_getResourceText
// @grant GM_addStyle
```

Then load the CSS once:

```js
GM_addStyle(
  GM_getResourceText('UI_BASE')
);

GM_addStyle(
  GM_getResourceText('UI_DARK')
);

GM_addStyle(
  GM_getResourceText('UI_LIGHT')
);
```

The JavaScript API is available as:

```js
const UI = UserscriptUI;
```

## Create something

Create a runtime root and put components inside it:

```js
const root =
  UI.createRoot({
    theme: 'dark',
    children: [
      UI.button({
        label: 'Click me',
        onClick() {
          console.log('clicked');
        }
      })
    ]
  });

document.body.appendChild(root);
```

The root keeps the runtime styles scoped away from the rest of the page.

## Change theme

Both theme CSS files are already loaded, so you only need to change the runtime root:

```js
root.dataset.usTheme = 'light';
```

or:

```js
root.dataset.usTheme = 'dark';
```

You can also use:

```js
UI.setTheme(root, 'light');
UI.setTheme(root, 'dark');
```

## Playground

Open the GitHub Pages site to see the components and their states:

```text
https://<username>.github.io/userscripts-runtime/
```

