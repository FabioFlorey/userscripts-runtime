/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ OVERLAY-FIRST DOCUMENTATION                                                  │
└──────────────────────────────────────────────────────────────────────────────┘
*/

/*
 * This page behaves like a normal third-party site. The code below represents
 * what a Violentmonkey userscript would inject into that page.
 */

(function() {

  'use strict';

  const UI =
    UserscriptUI;

  const THEME =
    document.documentElement.dataset.theme === 'light'
      ? 'light'
      : 'dark';

  const MEDIA_URL =
    'https://cdn.example.net/assets/demo-video.mp4';

  const DEMO_COMMAND =
    `resource-tool --input ${UI.shellQuote(MEDIA_URL)}`;

  const overlayRoot =
    UI.ensureOverlayRoot({
      id:
        'docs-userscript-overlay',
      theme:
        THEME
    });


  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ HELPERS                                                                      │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function notify(title, message) {

    UI.showToast({
      root:
        overlayRoot,
      theme:
        THEME,
      title,
      message
    });

  }

  function copy(value, label = 'Copied') {

    UI.copyText(value)
      .then(() => {

        notify(
          label,
          value
        );

      });

  }
