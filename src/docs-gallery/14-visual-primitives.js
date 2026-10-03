  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ FABIOFLOREY-INSPIRED PATTERNS                                               │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  const inspirationRoot =
    UI.createRoot({
      theme:
        THEME
    });

  inspirationRoot.append(
    UI.chromeStrip([
      UI.terminalLabel(
        '[runtime@page] ~/tools',
        {
          cursor:
            true
        }
      ),
      UI.element(
        'div',
        {
          className:
            'us-spacer'
        }
      ),
      UI.pill(
        'LIVE',
        'SUCCESS'
      ),
      UI.pill(
        '17 requests',
        'PAGE'
      )
    ], {
      ariaLabel:
        'Terminal-style chrome'
    }),

    UI.element(
      'div',
      {
        className:
          'us-grid us-grid-2'
      },

      UI.offsetCard({
        icon:
          'REQUESTS',
        title:
          'Request inspector',
        description:
          'Flat surface with offset feedback instead of glow or heavy elevation.',
        meta: [
          'GET',
          '200',
          '84 ms'
        ],
        onClick: () => {

          notify(
            'Offset card',
            'Interactive cards use border + offset shadow + translation.'
          );

        }
      }),

      UI.offsetCard({
        icon:
          'EXTERNAL',
        title:
          'Open reference',
        description:
          'External destinations get a small directional cue.',
        meta: [
          'external',
          'new tab'
        ],
        href:
          'https://example.com/',
        external:
          true
      })

    ),

    UI.metaLine([
      'session docs-001',
      'theme ' + THEME,
      'scope userscript',
      'overlay active'
    ])
  );

  document
    .getElementById(
      'inspiration-gallery'
    )
    .appendChild(
      inspirationRoot
    );
