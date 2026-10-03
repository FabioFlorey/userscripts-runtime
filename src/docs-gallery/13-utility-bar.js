  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ DENSE UTILITY BAR                                                           │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  const utilityRoot =
    UI.createRoot({
      theme:
        THEME
    });

  utilityRoot.classList.add(
    'utility-gallery-root'
  );

  function makeResearchUtilityBar(
    fixed = false
  ) {

    return UI.utilityBar({
      fixed,
      ariaLabel:
        'Research utility bar',
      children: [

        UI.pill(
          'RESEARCH',
          'ACCENT',
          {
            dot:
              false
          }
        ),

        UI.utilityGroup({
          label:
            'Query',
          children: [

            UI.inputControl({
              type:
                'search',
              size:
                'xs',
              placeholder:
                'keywords or "phrase"',
              ariaLabel:
                'Query'
            })

          ]
        }),

        UI.utilityGroup({
          label:
            'Operators',
          children: [

            UI.inputGroup({
              prefix:
                'site:',
              control:
                UI.inputControl({
                  type:
                    'text',
                  size:
                    'xs',
                  placeholder:
                    'example.com',
                  mono:
                    true
                })
            }),

            UI.inputGroup({
              prefix:
                'filetype:',
              control:
                UI.inputControl({
                  type:
                    'text',
                  size:
                    'xs',
                  placeholder:
                    'pdf,json',
                  mono:
                    true
                })
            }),

            UI.inputGroup({
              prefix:
                'intitle:',
              control:
                UI.inputControl({
                  type:
                    'text',
                  size:
                    'xs',
                  placeholder:
                    'index of'
                })
            })

          ]
        }),

        UI.utilityGroup({
          label:
            'Dates',
          children: [

            UI.inputGroup({
              prefix:
                'after:',
              control:
                UI.inputControl({
                  type:
                    'date',
                  size:
                    'xs',
                  value:
                    '2026-01-01'
                })
            }),

            UI.inputGroup({
              prefix:
                'before:',
              control:
                UI.inputControl({
                  type:
                    'date',
                  size:
                    'xs',
                  value:
                    '2026-12-31'
                })
            })

          ]
        }),

        UI.utilityGroup({
          label:
            'Preset',
          children: [

            UI.selectControl({
              size:
                'xs',
              value:
                'documents',
              options: [
                ['documents', 'Documents'],
                ['data', 'Data'],
                ['directories', 'Directories'],
                ['recent', 'Recent']
              ]
            }),

            UI.pill(
              'GitHub',
              'PAGE',
              {
                onClick: () => {

                  notify(
                    'Quick filter',
                    'Example quick pill clicked.'
                  );

                }
              }
            ),

            UI.pill(
              'Docs',
              'PAGE',
              {
                onClick: () => {

                  notify(
                    'Quick filter',
                    'Example quick pill clicked.'
                  );

                }
              }
            )

          ]
        }),

        UI.element(
          'div',
          {
            className:
              'us-spacer'
          }
        ),

        UI.button({
          label:
            'Reset',
          size:
            'xs'
        }),

        UI.button({
          label:
            'Search',
          size:
            'xs',
          variant:
            'primary'
        })

      ]
    });

  }

  utilityRoot.appendChild(
    makeResearchUtilityBar(
      false
    )
  );

  let fixedUtilityBar = null;

  utilityRoot.appendChild(
    UI.element(
      'div',
      {
        className:
          'us-row us-row-wrap'
      },

      UI.button({
        label:
          'Pin bar to viewport',
        size:
          'xs',
        onClick: (event) => {

          if (fixedUtilityBar) {

            fixedUtilityBar.remove();
            fixedUtilityBar = null;

            event.currentTarget.textContent =
              'Pin bar to viewport';

            return;

          }

          fixedUtilityBar =
            makeResearchUtilityBar(
              true
            );

          overlayRoot.appendChild(
            fixedUtilityBar
          );

          event.currentTarget.textContent =
            'Remove pinned bar';

          notify(
            'Utility bar mounted',
            'The fixed bar intentionally overlays the host header. Site-specific scripts decide whether and how to offset the page underneath.'
          );

        }
      }),

      UI.pill(
        'responsive / wraps',
        'INFO'
      ),

      UI.pill(
        'site-independent',
        'SUCCESS'
      )

    )
  );

  document
    .getElementById(
      'utility-gallery'
    )
    .appendChild(
      utilityRoot
    );
