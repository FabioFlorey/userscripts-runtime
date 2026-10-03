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
  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ ACTION BUTTON GALLERY                                                        │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  const actionGalleryHost =
    document.getElementById(
      'action-gallery'
    );

  const actionGalleryRoot =
    UI.createRoot({
      theme:
        THEME,
      children: []
    });

  actionGalleryRoot.classList.add(
    'action-catalog-runtime'
  );

  const groupedActions =
    new Map();

  for (
    const [name, action] of
    Object.entries(UI.ACTIONS)
  ) {

    const group =
      action.group ||
      'Other';

    if (!groupedActions.has(group)) {
      groupedActions.set(group, []);
    }

    groupedActions.get(group).push([
      name,
      action
    ]);

  }

  for (
    const [group, actions] of
    groupedActions
  ) {

    const grid =
      UI.element(
        'div',
        {
          className:
            'action-catalog-grid'
        }
      );

    for (
      const [name, action] of
      actions
    ) {

      grid.appendChild(
        UI.element(
          'div',
          {
            className:
              'action-catalog-item',
            title:
              `${name} → ${action.icon}`
          },
          UI.actionButton(
            name,
            {
              onClick: () => {

                UI.showActionToast(
                  name,
                  {
                    root:
                      overlayRoot,
                    theme:
                      THEME,
                    tone:
                      'INFO',
                    message:
                      `Action: ${name}`
                  }
                );

              }
            }
          ),
          UI.element(
            'span',
            {
              className:
                'action-catalog-label',
              text:
                action.label
            }
          )
        )
      );

    }

    actionGalleryRoot.appendChild(
      UI.element(
        'section',
        {
          className:
            'action-catalog-group'
        },
        UI.element(
          'div',
          {
            className:
              'action-catalog-title',
            text:
              group
          }
        ),
        grid
      )
    );

  }

  const iconDetails =
    UI.element(
      'details',
      {
        className:
          'icon-catalog',
        attrs: {
          open:
            true
        }
      },
      UI.element(
        'summary',
        {
          text:
            'Raw shared icon vocabulary'
        }
      )
    );

  const iconGrid =
    UI.element(
      'div',
      {
        className:
          'icon-catalog-grid'
      }
    );

  for (
    const iconName of
    Object.keys(UI.ICONS)
  ) {

    iconGrid.appendChild(
      UI.element(
        'div',
        {
          className:
            'action-catalog-item'
        },
        UI.iconButton(
          iconName,
          {
            title:
              iconName
          }
        ),
        UI.element(
          'span',
          {
            className:
              'action-catalog-label',
            text:
              iconName
          }
        )
      )
    );

  }

  iconDetails.appendChild(
    iconGrid
  );

  actionGalleryRoot.appendChild(
    iconDetails
  );

  actionGalleryHost.appendChild(
    actionGalleryRoot
  );
  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ FEEDBACK / ALERT GALLERY                                                     │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  const TONES = [
    'NEUTRAL',
    'PAGE',
    'INPUT',
    'ACCENT',
    'TRACE',
    'DEBUG',
    'INFO',
    'SUCCESS',
    'WARNING',
    'ERROR',
    'CRITICAL'
  ];

  const feedbackRoot =
    UI.createRoot({
      theme:
        THEME
    });

  feedbackRoot.classList.add(
    'feedback-gallery-root'
  );

  feedbackRoot.appendChild(
    UI.element(
      'div',
      {
        className:
          'catalog-subtitle',
        text:
          'Pills / log levels / surface tones'
      }
    )
  );

  feedbackRoot.appendChild(
    UI.element(
      'div',
      {
        className:
          'feedback-tone-grid'
      },
      TONES.map(
        (tone) => UI.pill(
          tone.toLowerCase(),
          tone
        )
      )
    )
  );

  feedbackRoot.appendChild(
    UI.element(
      'div',
      {
        className:
          'catalog-subtitle',
        text:
          'Inline alerts'
      }
    )
  );

  feedbackRoot.appendChild(
    UI.element(
      'div',
      {
        className:
          'feedback-alert-grid'
      },
      TONES.map(
        (tone) => UI.alertBox({
          tone,
          title:
            tone.toLowerCase(),
          message:
            'Shared semantic tone for alerts, pills, toasts and control state.'
        })
      )
    )
  );

  const feedbackActions =
    UI.element(
      'div',
      {
        className:
          'us-row us-row-wrap'
      },

      UI.button({
        label:
          'Screen info',
        onClick: () => {

          UI.showAlert({
            root:
              overlayRoot,
            theme:
              THEME,
            tone:
              'INFO',
            title:
              'Screen alert',
            message:
              'This alert is injected at the top of the viewport.'
          });

        }
      }),

      UI.button({
        label:
          'Toast success',
        onClick: () => {

          UI.showToast({
            root:
              overlayRoot,
            theme:
              THEME,
            tone:
              'SUCCESS',
            title:
              'Saved',
            message:
              'Short feedback belongs in a toast.'
          });

        }
      }),

      UI.button({
        label:
          'Warning dialog',
        onClick: () => {

          UI.openAlertDialog({
            root:
              overlayRoot,
            theme:
              THEME,
            tone:
              'WARNING',
            title:
              'Confirm attention',
            message:
              'A click-triggered alert can use the same semantic tone inside a modal.'
          });

        }
      }),

      UI.pill(
        'clickable critical pill',
        'CRITICAL',
        {
          onClick: () => {

            UI.showAlert({
              root:
                overlayRoot,
              theme:
                THEME,
              tone:
                'CRITICAL',
              title:
                'Critical',
              message:
                'Pills can be interactive without becoming generic buttons.'
            });

          }
        }
      )

    );

  feedbackRoot.appendChild(
    UI.element(
      'div',
      {
        className:
          'catalog-subtitle',
        text:
          'Click-triggered feedback'
      }
    )
  );

  feedbackRoot.appendChild(
    feedbackActions
  );

  feedbackRoot.appendChild(
    UI.element(
      'div',
      {
        className:
          'catalog-subtitle',
        text:
          'Action menu with shared icons'
      }
    )
  );

  feedbackRoot.appendChild(
    UI.actionMenu(
      [
        'COPY',
        'OPEN',
        'DOWNLOAD',
        'COPY_XPATH',
        'SETTINGS'
      ],
      {
        ariaLabel:
          'Example action menu',
        onSelect:
          (descriptor) => {

            UI.showActionToast(
              descriptor,
              {
                root:
                  overlayRoot,
                theme:
                  THEME,
                tone:
                  'INFO',
                message:
                  'Menu and toast reuse the same action icon.'
              }
            );

          }
      }
    )
  );

  document
    .getElementById(
      'feedback-gallery'
    )
    .appendChild(
      feedbackRoot
    );
  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ COMPLETE INPUT GALLERY                                                       │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  const inputRoot =
    UI.createRoot({
      theme:
        THEME
    });

  inputRoot.classList.add(
    'input-gallery-root'
  );

  const inputGrid =
    UI.element(
      'div',
      {
        className:
          'input-catalog-grid'
      }
    );

  function addInputField(
    label,
    control,
    hint = null,
    className = ''
  ) {

    const wrapped =
      UI.field(
        label,
        control,
        {
          hint,
          className
        }
      );

    inputGrid.appendChild(
      wrapped
    );

    return wrapped;

  }

  addInputField(
    'Text',
    UI.inputControl({
      type:
        'text',
      placeholder:
        'plain text'
    })
  );

  addInputField(
    'Search',
    UI.inputControl({
      type:
        'search',
      placeholder:
        'search terms'
    })
  );

  addInputField(
    'Password',
    UI.inputControl({
      type:
        'password',
      value:
        'example-only'
    })
  );

  addInputField(
    'Email',
    UI.inputControl({
      type:
        'email',
      placeholder:
        'name@example.com'
    })
  );

  addInputField(
    'URL',
    UI.inputControl({
      type:
        'url',
      placeholder:
        'https://example.com',
      mono:
        true
    })
  );

  addInputField(
    'Telephone',
    UI.inputControl({
      type:
        'tel',
      placeholder:
        '+39 …'
    })
  );

  addInputField(
    'Number',
    UI.inputControl({
      type:
        'number',
      min:
        0,
      max:
        100,
      step:
        1,
      value:
        42
    })
  );

  addInputField(
    'Date',
    UI.inputControl({
      type:
        'date',
      value:
        '2026-10-03'
    })
  );

  addInputField(
    'Date & time',
    UI.inputControl({
      type:
        'datetime-local',
      value:
        '2026-10-03T14:30'
    })
  );

  addInputField(
    'Month',
    UI.inputControl({
      type:
        'month',
      value:
        '2026-10'
    })
  );

  addInputField(
    'Week',
    UI.inputControl({
      type:
        'week',
      value:
        '2026-W40'
    })
  );

  addInputField(
    'Time',
    UI.inputControl({
      type:
        'time',
      value:
        '14:30'
    })
  );

  addInputField(
    'Color',
    UI.inputControl({
      type:
        'color',
      value:
        '#62c49a',
      ariaLabel:
        'Accent color'
    }),
    'Native color picker.'
  );

  addInputField(
    'Range / slider',
    UI.rangeControl({
      min:
        0,
      max:
        100,
      step:
        1,
      value:
        64,
      suffix:
        '%',
      ariaLabel:
        'Example range'
    })
  );

  addInputField(
    'File',
    UI.inputControl({
      type:
        'file',
      accept:
        'image/*,.json',
      multiple:
        true,
      ariaLabel:
        'Choose files'
    }),
    'Supports accept and multiple.'
  );

  addInputField(
    'Single select',
    UI.selectControl({
      value:
        'auto',
      options: [
        ['auto', 'Auto'],
        ['strict', 'Strict'],
        ['relaxed', 'Relaxed']
      ]
    })
  );

  addInputField(
    'Multiple select',
    UI.selectControl({
      multiple:
        true,
      visibleRows:
        4,
      value: [
        'html',
        'json'
      ],
      options: [
        ['html', 'HTML'],
        ['json', 'JSON'],
        ['xml', 'XML'],
        ['text', 'Text']
      ]
    })
  );

  addInputField(
    'Checkboxes',
    UI.element(
      'div',
      {
        className:
          'us-choice-group'
      },
      UI.checkboxControl({
        label:
          'Observe',
        checked:
          true
      }),
      UI.checkboxControl({
        label:
          'Persist'
      })
    )
  );

  addInputField(
    'Radio group',
    UI.radioGroup({
      name:
        'gallery-mode',
      value:
        'auto',
      items: [
        {
          label:
            'Auto',
          value:
            'auto'
        },
        {
          label:
            'Manual',
          value:
            'manual'
        },
        {
          label:
            'Off',
          value:
            'off'
        }
      ]
    })
  );

  addInputField(
    'Switch',
    UI.switchControl({
      checked:
        true,
      ariaLabel:
        'Example switch'
    }),
    'Composed checkbox presentation.'
  );

  addInputField(
    'Segmented choice',
    UI.segmentedControl({
      value:
        'auto',
      items: [
        {
          label:
            'Auto',
          value:
            'auto'
        },
        {
          label:
            'On',
          value:
            'on'
        },
        {
          label:
            'Off',
          value:
            'off'
        }
      ]
    }),
    'Composed single-choice control.'
  );

  addInputField(
    'Textarea',
    UI.textareaControl({
      value:
        'Investigation notes…',
      rows:
        4
    }),
    null,
    'input-catalog-span-2'
  );

  const datalistId =
    'runtime-gallery-suggestions';

  const datalist =
    UI.element(
      'datalist',
      {
        id:
          datalistId
      },
      UI.element(
        'option',
        {
          attrs: {
            value:
              'github.com'
          }
        }
      ),
      UI.element(
        'option',
        {
          attrs: {
            value:
              'arxiv.org'
          }
        }
      ),
      UI.element(
        'option',
        {
          attrs: {
            value:
              'example.com'
          }
        }
      )
    );

  const datalistControl =
    UI.element(
      'div',
      {},
      UI.inputControl({
        type:
          'text',
        list:
          datalistId,
        placeholder:
          'type for suggestions'
      }),
      datalist
    );

  addInputField(
    'Datalist / autocomplete',
    datalistControl
  );

  addInputField(
    'Readonly',
    UI.inputControl({
      type:
        'text',
      value:
        'read-only value',
      readOnly:
        true
    })
  );

  addInputField(
    'Disabled',
    UI.inputControl({
      type:
        'text',
      value:
        'disabled value',
      disabled:
        true
    })
  );

  addInputField(
    'Prefixed operator',
    UI.inputGroup({
      prefix:
        'site:',
      control:
        UI.inputControl({
          type:
            'text',
          placeholder:
            'example.com',
          mono:
            true
        })
    }),
    'Useful for compact query/operator bars.'
  );

  addInputField(
    'Suffix / units',
    UI.inputGroup({
      suffix:
        'ms',
      control:
        UI.inputControl({
          type:
            'number',
          value:
            250,
          min:
            0
        })
    })
  );

  addInputField(
    'Prefix + suffix',
    UI.inputGroup({
      prefix:
        '±',
      suffix:
        '%',
      control:
        UI.inputControl({
          type:
            'number',
          value:
            10
        })
    })
  );

  const validationGrid =
    UI.element(
      'div',
      {
        className:
          'input-catalog-grid input-catalog-span-3'
      },

      UI.field(
        'Info state',
        UI.inputControl({
          value:
            'informational',
          tone:
            'INFO'
        })
      ),

      UI.field(
        'Success state',
        UI.inputControl({
          value:
            'valid',
          tone:
            'SUCCESS'
        })
      ),

      UI.field(
        'Warning state',
        UI.inputControl({
          value:
            'check this',
          tone:
            'WARNING'
        })
      ),

      UI.field(
        'Error state',
        UI.inputControl({
          value:
            'invalid',
          tone:
            'ERROR'
        })
      ),

      UI.field(
        'Critical state',
        UI.inputControl({
          value:
            'blocked',
          tone:
            'CRITICAL'
        })
      ),

      UI.field(
        'Input surface',
        UI.inputControl({
          value:
            'input tone',
          tone:
            'INPUT'
        })
      )

    );

  inputGrid.appendChild(
    validationGrid
  );

  inputRoot.appendChild(
    inputGrid
  );

  inputRoot.appendChild(
    UI.alertBox({
      tone:
        'TRACE',
      title:
        'Native input coverage',
      message:
        'Hidden inputs are intentionally not rendered; submit/reset/button-style inputs use the runtime button system instead.'
    })
  );

  document
    .getElementById(
      'input-gallery'
    )
    .appendChild(
      inputRoot
    );
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
  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ FILES / ASSET HOVER / PROGRESS                                               │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function demoThumbnail(
    label,
    background,
    foreground = '#f5f5f5'
  ) {

    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
        <rect width="320" height="320" fill="${background}"/>
        <path d="M0 255 L88 165 L142 219 L196 147 L320 270 L320 320 L0 320 Z" fill="${foreground}" opacity=".15"/>
        <circle cx="90" cy="88" r="30" fill="${foreground}" opacity=".18"/>
        <text x="20" y="292" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="${foreground}">${label}</text>
      </svg>`;

    return (
      'data:image/svg+xml;charset=UTF-8,' +
      encodeURIComponent(svg)
    );

  }

  const demoAssets = [
    {
      type:
        'image',
      name:
        'photo-01.jpg',
      meta: [
        '1600×1600',
        '412 KB'
      ],
      thumbnail:
        demoThumbnail(
          'IMAGE 01',
          '#662847'
        ),
      url:
        demoThumbnail(
          'IMAGE 01',
          '#662847'
        )
    },
    {
      type:
        'video',
      name:
        'clip-02.mp4',
      meta: [
        '00:14',
        'Large'
      ],
      thumbnail:
        demoThumbnail(
          'VIDEO 02',
          '#243f63'
        ),
      url:
        demoThumbnail(
          'VIDEO 02',
          '#243f63'
        )
    },
    {
      type:
        'image',
      name:
        'photo-03.png',
      meta: [
        '2048×1365',
        '1.2 MB'
      ],
      thumbnail:
        demoThumbnail(
          'IMAGE 03',
          '#345a45'
        ),
      url:
        demoThumbnail(
          'IMAGE 03',
          '#345a45'
        )
    }
  ];

  const assetHoverController =
    UI.attachAssetHoverTray(
      document.getElementById(
        'asset-hover-target'
      ),
      () => demoAssets,
      {
        root:
          overlayRoot,
        theme:
          THEME,
        title:
          'Page assets',
        placement:
          'bottom',
        selectable:
          true,
        onOpen:
          (item) => {

            UI.showActionToast(
              'OPEN',
              {
                root:
                  overlayRoot,
                theme:
                  THEME,
                tone:
                  'INFO',
                message:
                  `Open: ${item.name}`
              }
            );

          },
        onDownload:
          (item) => {

            UI.showActionToast(
              'DOWNLOAD',
              {
                root:
                  overlayRoot,
                theme:
                  THEME,
                tone:
                  'SUCCESS',
                message:
                  `Download: ${item.name}`
              }
            );

          },
        onDownloadSelected:
          (items) => {

            UI.showActionToast(
              'DOWNLOAD',
              {
                root:
                  overlayRoot,
                theme:
                  THEME,
                tone:
                  'SUCCESS',
                title:
                  'Download selected',
                message:
                  `${items.length} selected asset${items.length === 1 ? '' : 's'}`
              }
            );

          }
      }
    );

  const filePickerRoot =
    UI.createRoot({
      theme:
        THEME,
      children: [
        UI.filePicker({
          label:
            'Drop files here',
          description:
            'Images, video, JSON or text. Multiple selection is enabled.',
          accept:
            'image/*,video/*,.json,.txt',
          multiple:
            true,
          maxFiles:
            8,
          maxSize:
            25 * 1024 * 1024,
          onReject:
            (rejected) => {

              UI.showAlert({
                root:
                  overlayRoot,
                theme:
                  THEME,
                tone:
                  'WARNING',
                title:
                  'File rejected',
                message:
                  `${rejected.length} file${rejected.length === 1 ? '' : 's'} did not match the picker rules.`
              });

            }
        })
      ]
    });

  document
    .getElementById(
      'file-picker-gallery'
    )
    .appendChild(
      filePickerRoot
    );

  const progressDemo =
    UI.progressBar(
      68,
      {
        label:
          'Processing files',
        tone:
          'ACCENT'
      }
    );

  const segmentedProgressDemo =
    UI.segmentedProgress(
      [
        {
          label:
            'Complete',
          value:
            34,
          tone:
            'SUCCESS'
        },
        {
          label:
            'Active',
          value:
            27,
          tone:
            'INFO'
        },
        {
          label:
            'Queued',
          value:
            19,
          tone:
            'WARNING'
        }
      ],
      {
        label:
          'Segmented progress',
        max:
          100
      }
    );

  const uploadQueueDemo =
    UI.uploadQueue(
      [
        new File(
          ['alpha'],
          'alpha.txt',
          {
            type:
              'text/plain'
          }
        ),
        new File(
          ['bravo-bravo'],
          'bravo.txt',
          {
            type:
              'text/plain'
          }
        )
      ],
      {
        title:
          'Upload queue',
        concurrency:
          1,
        upload:
          async (
            file,
            {
              signal,
              reportProgress
            }
          ) => {

            const total =
              Math.max(
                1,
                file.size
              );

            for (
              const ratio of
              [0.25, 0.5, 0.75, 1]
            ) {

              if (signal.aborted) {
                throw new DOMException(
                  'Upload cancelled',
                  'AbortError'
                );
              }

              await new Promise(
                (resolve) =>
                  setTimeout(
                    resolve,
                    120
                  )
              );

              reportProgress(
                Math.round(
                  total *
                  ratio
                ),
                total
              );

            }

            return {
              ok:
                true
            };

          }
      }
    );

  const progressRoot =
    UI.createRoot({
      theme:
        THEME,
      children: [

        UI.progressGroup([
          {
            value:
              68,
            label:
              'Processing files',
            tone:
              'ACCENT'
          },
          {
            value:
              100,
            label:
              'Completed',
            tone:
              'SUCCESS'
          },
          {
            value:
              42,
            label:
              'Waiting for input',
            tone:
              'WARNING'
          },
          {
            value:
              null,
            label:
              'Loading metadata',
            tone:
              'INFO',
            indeterminate:
              true
          }
        ]),

        UI.element(
          'div',
          {
            className:
              'us-row us-row-wrap'
          },
          UI.spinner({
            tone:
              'ACCENT',
            label:
              'Loading'
          }),
          UI.pill(
            'spinner',
            'PAGE',
            {
              dot:
                false
            }
          ),
          UI.button({
            label:
              'Advance demo',
            size:
              'xs',
            onClick: () => {

              const current =
                Number(
                  progressDemo
                    .querySelector(
                      '.us-progress-track'
                    )
                    ?.getAttribute(
                      'aria-valuenow'
                    ) ||
                  0
                );

              progressDemo.setValue(
                current >= 100
                  ? 0
                  : current + 10
              );

            }
          })
        ),

        progressDemo,

        segmentedProgressDemo,

        uploadQueueDemo,

        UI.stack(
          [
            UI.metaLine([
              'skeleton variants',
              'text'
            ]),
            UI.skeleton({
              variant:
                'text',
              lines:
                3
            })
          ],
          {
            tight:
              true
          }
        )

      ]
    });

  progressRoot.classList.add(
    'progress-gallery-root'
  );

  document
    .getElementById(
      'progress-gallery'
    )
    .appendChild(
      progressRoot
    );

  const demoNotepadStorage =
    UI.storageAdapter({
      get:
        (
          key,
          fallback
        ) => {

          const value =
            localStorage.getItem(
              key
            );

          return value == null
            ? fallback
            : value;

        },
      set:
        (
          key,
          value
        ) => {

          localStorage.setItem(
            key,
            String(value)
          );

        },
      remove:
        (key) => {

          localStorage.removeItem(
            key
          );

        }
    });

  let notepadController = null;

  function openDemoNotepad() {

    if (
      notepadController?.element?.isConnected
    ) {

      notepadController
        .element
        .focus();

      return;

    }

    notepadController =
      UI.openNotepad({
        root:
          overlayRoot,
        theme:
          THEME,
        title:
          'Notepad',
        storage:
          demoNotepadStorage,
        key:
          'userscript-runtime:demo-notepad',
        defaultValue:
          'Notes saved through a storage adapter.',
        onClose: () => {
          notepadController = null;
        }
      });

  }

  const notepadRoot =
    UI.createRoot({
      theme:
        THEME,
      children: [

        UI.element(
          'div',
          {
            className:
              'us-row us-row-wrap'
          },

          UI.actionButton(
            'NOTEPAD',
            {
              title:
                'Open notepad',
              onClick:
                openDemoNotepad
            }
          ),

          UI.button({
            label:
              'Open notepad',
            size:
              'xs',
            onClick:
              openDemoNotepad
          }),

          UI.pill(
            'drag · resize · min/max · autosave',
            'INFO'
          )

        )

      ]
    });

  document
    .getElementById(
      'notepad-gallery'
    )
    .appendChild(
      notepadRoot
    );

  const selectionDemo =
    document.getElementById(
      'selection-demo'
    );

  const showAnnotationToast =
    (annotation) => {

      const action =
        annotation.type === 'underline'
          ? 'UNDERLINE_TEXT'
          : annotation.type === 'note'
            ? 'ADD_NOTE'
            : 'HIGHLIGHT_TEXT';

      const message =
        annotation.type === 'highlight'
          ? `Highlighted with ${annotation.color}`
          : annotation.type === 'note'
            ? 'Annotation note attached as a tooltip'
            : 'Selection underlined';

      UI.showActionToast(
        action,
        {
          root:
            overlayRoot,
          theme:
            THEME,
          tone:
            'INFO',
          message
        }
      );

    };

  const showAnnotationClearToast =
    ({ removed }) => {

      UI.showActionToast(
        'CLEAR_ANNOTATION',
        {
          root:
            overlayRoot,
          theme:
            THEME,
          tone:
            'INFO',
          message:
            removed.length
              ? `Removed ${removed.length} annotation${removed.length === 1 ? '' : 's'}`
              : 'No annotation in selection'
        }
      );

    };

  const selectionToolbarController =
    UI.attachTextSelectionToolbar({
      target:
        selectionDemo,
      root:
        overlayRoot,
      theme:
        THEME,
      onAnnotate:
        showAnnotationToast,
      onClear:
        showAnnotationClearToast
    });

  let pageAnnotationController = null;

  const mountPageAnnotationMode =
    (
      placement = 'floating',
      enabled = false
    ) => {

      pageAnnotationController?.destroy();

      pageAnnotationController =
        UI.attachPageAnnotationMode({
          target:
            document.body,
          root:
            overlayRoot,
          theme:
            THEME,
          placement,
          position:
            'top-right',
          enabled,
          exclude:
            '#selection-demo',
          controlClassName:
            'gallery-annotation-launcher',
          label:
            'Annotate page',
          onAnnotate:
            showAnnotationToast,
          onClear:
            showAnnotationClearToast
        });

      return pageAnnotationController;

    };

  mountPageAnnotationMode(
    'floating',
    false
  );

  const annotationModeRoot =
    UI.createRoot({
      theme:
        THEME,
      children: [

        UI.stack(
          [

            UI.cluster(
              [

                UI.button({
                  icon:
                    'HIGHLIGHT',
                  label:
                    'Floating button',
                  size:
                    'xs',
                  onClick: () =>
                    mountPageAnnotationMode(
                      'floating',
                      true
                    )
                }),

                UI.button({
                  label:
                    'Top bar',
                  size:
                    'xs',
                  onClick: () =>
                    mountPageAnnotationMode(
                      'header',
                      true
                    )
                }),

                UI.button({
                  label:
                    'Bottom bar',
                  size:
                    'xs',
                  onClick: () =>
                    mountPageAnnotationMode(
                      'footer',
                      true
                    )
                })

              ],
              {
                tight:
                  true
              }
            ),

            UI.metaLine([
              'page-wide mode',
              'select text anywhere',
              'demo paragraph remains local'
            ])

          ],
          {
            tight:
              true
          }
        )

      ]
    });

  document
    .getElementById(
      'annotation-mode-gallery'
    )
    .appendChild(
      annotationModeRoot
    );

  const utilityDemoParams =
    new URLSearchParams(
      location.search
    );

  if (
    utilityDemoParams.has(
      'selection'
    )
  ) {

    const textNode =
      Array.from(
        selectionDemo.childNodes
      ).find(
        (node) =>
          node.nodeType ===
            Node.TEXT_NODE &&
          node.nodeValue.trim()
      );

    if (textNode) {

      const start =
        Math.max(
          0,
          textNode.nodeValue.indexOf(
            'Select any part'
          )
        );

      const end =
        Math.min(
          textNode.nodeValue.length,
          start + 45
        );

      const range =
        document.createRange();

      range.setStart(
        textNode,
        start
      );

      range.setEnd(
        textNode,
        end
      );

      const selection =
        globalThis.getSelection();

      selection.removeAllRanges();
      selection.addRange(
        range
      );

      selectionToolbarController?.show();

    }

  }

  if (
    utilityDemoParams.has(
      'notepad'
    )
  ) {

    notepadRoot
      .querySelector(
        '.us-action-button'
      )
      ?.click();

  }

  if (
    utilityDemoParams.has(
      'carousel'
    )
  ) {

    UI.openAssetCarousel(
      demoAssets,
      {
        root:
          overlayRoot,
        theme:
          THEME,
        index:
          0
      }
    );

  }

  if (
    utilityDemoParams.has(
      'assets'
    )
  ) {

    assetHoverController?.show();

    if (
      utilityDemoParams.has(
        'pin'
      )
    ) {
      assetHoverController?.pin();
    }

  }
  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ INLINE AUGMENTATION                                                          │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  const resultSlot =
    document.getElementById(
      'result-inline'
    );

  resultSlot.appendChild(
    UI.inlineRoot({
      theme:
        THEME,
      children: [

        UI.badge(
          'FILE',
          'ACCENT'
        ),

        UI.iconButton(
          'COPY',
          {
            title:
              'Copy asset URL',
            onClick: () => {

              copy(
                MEDIA_URL,
                'Asset URL copied'
              );

            }
          }
        ),

        UI.copyCommandButton({
          command:
            DEMO_COMMAND,
          title:
            'Copy command'
        })

      ]
    })
  );

  const articleSlot =
    document.getElementById(
      'article-inline'
    );

  const articleInfoButton =
    UI.iconButton(
      'EYE',
      {
        title:
          'Open details'
      }
    );

  articleSlot.appendChild(
    UI.inlineRoot({
      theme:
        THEME,
      children: [
        UI.inlineInspector(
          [
            {
              icon:
                'COPY',
              title:
                'Copy text',
              onClick: () => {
                copy(
                  'component state boundary',
                  'Selection copied'
                );
              }
            },
            {
              icon:
                'SEARCH',
              title:
                'Inspect'
            }
          ],
          {
            ariaLabel:
              'Article context tools'
          }
        ),
        articleInfoButton
      ]
    })
  );
  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ HOVER TOOLBARS                                                               │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  UI.attachHoverToolbar(
    document.getElementById(
      'result-1'
    ),
    [
      {
        icon:
          'SEARCH',
        title:
          'Open result tools'
      },
      {
        icon:
          'COPY',
        title:
          'Copy URL',
        onClick: () => {

          copy(
            MEDIA_URL,
            'URL copied'
          );

        }
      },
      {
        icon:
          'EXTERNAL',
        title:
          'Open'
      }
    ],
    {
      root:
        overlayRoot,
      theme:
        THEME,
      label:
        'result',
      placement:
        'right'
    }
  );

  UI.attachHoverToolbar(
    document.getElementById(
      'social-media'
    ),
    [
      {
        icon:
          'DOWNLOAD',
        title:
          'Download asset'
      },
      {
        icon:
          'EXTERNAL',
        title:
          'Open asset'
      },
      {
        icon:
          'COPY',
        title:
          'Copy URL',
        onClick: () => {

          copy(
            MEDIA_URL,
            'Asset URL copied'
          );

        }
      },
      {
        icon:
          'TERMINAL',
        title:
          'Copy command',
        onClick: () => {

          copy(
            DEMO_COMMAND,
            'Command copied'
          );

        }
      }
    ],
    {
      root:
        overlayRoot,
      theme:
        THEME,
      label:
        'asset',
      placement:
        'top'
    }
  );

  UI.attachHoverToolbar(
    document.getElementById(
      'video-target'
    ),
    [
      {
        icon:
          'PLAY',
        title:
          'Play / pause'
      },
      {
        icon:
          'LAYERS',
        title:
          'Options'
      },
      {
        icon:
          'TERMINAL',
        title:
          'Copy command',
        onClick: () => {

          copy(
            DEMO_COMMAND,
            'Command copied'
          );

        }
      },
      {
        icon:
          'FULLSCREEN',
        title:
          'Fullscreen'
      }
    ],
    {
      root:
        overlayRoot,
      theme:
        THEME,
      label:
        'player',
      placement:
        'top'
    }
  );
  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ POPOVERS AND TOOLTIPS                                                        │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  UI.attachPopover(
    articleInfoButton,
    UI.popover({
      title:
        'Selection details',
      children: [

        UI.keyValueList([
          {
            label:
              'Type',
            value:
              'text'
          },
          {
            label:
              'Length',
            value:
              '31 chars'
          },
          {
            label:
              'Context',
            value:
              'article body'
          }
        ]),

        UI.callout(
          'Small contextual tools are usually better than opening a full dashboard.',
          'INFO'
        )

      ]
    }),
    {
      root:
        overlayRoot,
      theme:
        THEME,
      placement:
        'bottom'
    }
  );

  UI.attachTooltip(
    document.getElementById(
      'article-term'
    ),
    'A tooltip can annotate a host-page element without changing its layout.',
    {
      root:
        overlayRoot,
      theme:
        THEME,
      placement:
        'top'
    }
  );
  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ SETTINGS POPOVER                                                             │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function eachRuntimeRoot(callback) {

    for (
      const root of
      document.querySelectorAll(
        '[data-userscript-root]'
      )
    ) {

      callback(root);

    }

  }

  function applyRuntimeTheme(value) {

    eachRuntimeRoot(
      (root) => {

        root.setAttribute(
          'data-us-theme',
          value
        );

      }
    );

  }

  function applyRuntimeContrast(enabled) {

    eachRuntimeRoot(
      (root) => {

        if (enabled) {

          root.setAttribute(
            'data-us-contrast',
            'high'
          );

        } else {

          root.removeAttribute(
            'data-us-contrast'
          );

        }

      }
    );

  }

  function applyRuntimeScale(value) {

    const scale =
      String(value);

    eachRuntimeRoot(
      (root) => {

        if (scale === '125') {

          root.removeAttribute(
            'data-us-scale'
          );

        } else {

          root.setAttribute(
            'data-us-scale',
            scale
          );

        }

      }
    );

  }

  function applyRuntimeDensity(value) {

    eachRuntimeRoot(
      (root) => {

        root.setAttribute(
          'data-us-density',
          value
        );

      }
    );

  }

  function applyRuntimeMotion(reduced) {

    eachRuntimeRoot(
      (root) => {

        if (reduced) {

          root.setAttribute(
            'data-us-motion',
            'off'
          );

        } else {

          root.removeAttribute(
            'data-us-motion'
          );

        }

      }
    );

  }

  function applyRuntimeTexture(enabled) {

    eachRuntimeRoot(
      (root) => {

        if (enabled) {

          root.setAttribute(
            'data-us-texture',
            'grain'
          );

        } else {

          root.removeAttribute(
            'data-us-texture'
          );

        }

      }
    );

  }

  function applyRuntimeFont(value) {

    eachRuntimeRoot(
      (root) => {

        if (value === 'hyperlegible') {

          root.removeAttribute(
            'data-us-font'
          );

        } else {

          root.setAttribute(
            'data-us-font',
            value
          );

        }

      }
    );

  }

  function applyRuntimeReadingSpacing(value) {

    eachRuntimeRoot(
      (root) => {

        if (value === 'relaxed') {

          root.setAttribute(
            'data-us-reading',
            'relaxed'
          );

        } else {

          root.removeAttribute(
            'data-us-reading'
          );

        }

      }
    );

  }

  const settingsLauncher =
    UI.floatingAction({
      icon:
        'SETTINGS',
      title:
        'Userscript settings',
      position:
        'bottom-left'
    });

  overlayRoot.appendChild(
    settingsLauncher
  );

  UI.attachTooltip(
    settingsLauncher,
    'Settings',
    {
      root:
        overlayRoot,
      theme:
        THEME,
      placement:
        'top'
    }
  );

  const panelSide =
    UI.element(
      'select',
      {
        className:
          'us-select us-select-xs',
        attrs: {
          'aria-label':
            'Default panel side'
        }
      },
      UI.element(
        'option',
        {
          text:
            'Right',
          attrs: {
            value:
              'right'
          }
        }
      ),
      UI.element(
        'option',
        {
          text:
            'Left',
          attrs: {
            value:
              'left'
          }
        }
      )
    );

  const settingsSurface =
    UI.popover({
      title:
        'Userscript settings',
      children: [

        UI.settingsGroup({
          title:
            'Appearance',
          children: [

            UI.settingRow({
              label:
                'Theme',
              description:
                'Theme used by injected controls.',
              control:
                UI.segmentedControl({
                  value:
                    THEME,
                  items: [
                    {
                      label:
                        'Dark',
                      value:
                        'dark'
                    },
                    {
                      label:
                        'Light',
                      value:
                        'light'
                    }
                  ],
                  onChange:
                    applyRuntimeTheme
                })
            }),

            UI.settingRow({
              label:
                'Body font',
              description:
                'Choose the reading font independently from Pixelify titles.',
              control:
                UI.selectControl({
                  size:
                    'xs',
                  value:
                    'hyperlegible',
                  ariaLabel:
                    'Body font',
                  options: [
                    ['hyperlegible', 'Hyperlegible'],
                    ['arial', 'Arial'],
                    ['system', 'System']
                  ],
                  onChange: (
                    event,
                    node
                  ) => {
                    applyRuntimeFont(
                      node.value
                    );
                  }
                })
            }),

            UI.settingRow({
              label:
                'Text spacing',
              description:
                'Optional looser reading rhythm without changing control density.',
              control:
                UI.selectControl({
                  size:
                    'xs',
                  value:
                    'standard',
                  ariaLabel:
                    'Text spacing',
                  options: [
                    ['standard', 'Standard'],
                    ['relaxed', 'Relaxed']
                  ],
                  onChange: (
                    event,
                    node
                  ) => {
                    applyRuntimeReadingSpacing(
                      node.value
                    );
                  }
                })
            }),

            UI.settingRow({
              label:
                'High contrast',
              description:
                'Increase text and border separation.',
              control:
                UI.switchControl({
                  checked:
                    false,
                  ariaLabel:
                    'High contrast',
                  onChange:
                    applyRuntimeContrast
                })
            }),

            UI.settingRow({
              label:
                'UI size',
              description:
                'Scale userscript text without changing the host page.',
              control:
                UI.segmentedControl({
                  value:
                    '125',
                  ariaLabel:
                    'UI size',
                  items: [
                    {
                      label:
                        '100%',
                      value:
                        '100'
                    },
                    {
                      label:
                        '125%',
                      value:
                        '125'
                    },
                    {
                      label:
                        '150%',
                      value:
                        '150'
                    }
                  ],
                  onChange:
                    applyRuntimeScale
                })
            }),

            UI.settingRow({
              label:
                'Density',
              description:
                'Choose normal or tighter controls.',
              control:
                UI.segmentedControl({
                  value:
                    'comfortable',
                  items: [
                    {
                      label:
                        'Normal',
                      value:
                        'comfortable'
                    },
                    {
                      label:
                        'Compact',
                      value:
                        'compact'
                    }
                  ],
                  onChange:
                    applyRuntimeDensity
                })
            })

          ]
        }),

        UI.settingsGroup({
          title:
            'Behavior',
          children: [

            UI.settingRow({
              label:
                'Reduce motion',
              description:
                'Disable runtime transitions and animations.',
              control:
                UI.switchControl({
                  checked:
                    false,
                  ariaLabel:
                    'Reduce motion',
                  onChange:
                    applyRuntimeMotion
                })
            }),

            UI.settingRow({
              label:
                'Surface texture',
              description:
                'Optional subtle grain on detached runtime surfaces.',
              control:
                UI.switchControl({
                  checked:
                    false,
                  ariaLabel:
                    'Surface texture',
                  onChange:
                    applyRuntimeTexture
                })
            }),

            UI.settingRow({
              label:
                'Default panel side',
              description:
                'Example select control for user preferences.',
              control:
                panelSide
            })

          ]
        })

      ]
    });

  UI.attachPopover(
    settingsLauncher,
    settingsSurface,
    {
      root:
        overlayRoot,
      theme:
        THEME,
      placement:
        'top'
    }
  );
  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ FLOATING LAUNCHER + DRAWER                                                   │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  const launcher =
    UI.floatingAction({
      icon:
        'TARGET',
      title:
        'Open userscript tools',
      position:
        'bottom-right'
    });

  overlayRoot.appendChild(
    launcher
  );

  UI.attachTooltip(
    launcher,
    'Page tools',
    {
      root:
        overlayRoot,
      theme:
        THEME,
      placement:
        'top'
    }
  );

  let activeDrawer = null;

  launcher.addEventListener(
    'click',
    () => {

      if (activeDrawer) {

        activeDrawer.close();
        activeDrawer = null;

        return;

      }

      const toolBody =
        UI.element(
          'div',
          {
            className:
              'us-tool-section'
          }
        );

      const renderToolSection =
        (key) => {

          toolBody.replaceChildren();

          if (key === 'page') {

            toolBody.append(
              UI.element(
                'div',
                {
                  className:
                    'us-tool-section-heading',
                  text:
                    'Page context'
                }
              ),

              UI.keyValueList([
                {
                  label:
                    'Host',
                  value:
                    location.hostname ||
                    'local docs'
                },
                {
                  label:
                    'Title',
                  value:
                    document.title
                },
                {
                  label:
                    'Media nodes',
                  value:
                    '2'
                },
                {
                  label:
                    'Capture',
                  value:
                    UI.status(
                      'active',
                      'OK'
                    )
                }
              ]),

              UI.actionStrip([
                UI.action(
                  'COPY_LINK',
                  {
                    onClick: () => {

                      copy(
                        location.href,
                        'Page URL copied'
                      );

                    }
                  }
                ),
                UI.action(
                  'CAPTURE_VIEWPORT'
                ),
                UI.action(
                  'REFRESH'
                )
              ], {
                ariaLabel:
                  'Page actions'
              })
            );

            return;

          }

          if (key === 'assets') {

            toolBody.append(
              UI.element(
                'div',
                {
                  className:
                    'us-tool-section-heading',
                  text:
                    'Current asset'
                }
              ),

              UI.mediaSource({
                label:
                  'Resolved source',
                url:
                  MEDIA_URL,
                command:
                  DEMO_COMMAND
              }),

              UI.mediaControls({
                url:
                  MEDIA_URL,
                progress:
                  67,
                time:
                  '-00:14',
                qualities: [
                  'Auto',
                  'Large',
                  'Medium'
                ],
                quality:
                  'Large',
                command:
                  DEMO_COMMAND
              }),

              UI.actionStrip([
                'INSPECT_MEDIA',
                'MEDIA_VARIANTS',
                'SAVE_MEDIA',
                UI.action(
                  'COPY_MEDIA_URL',
                  {
                    onClick: () => {

                      copy(
                        MEDIA_URL,
                        'Asset URL copied'
                      );

                    }
                  }
                )
              ], {
                ariaLabel:
                  'Asset actions'
              })
            );

            return;

          }

          if (key === 'requests') {

            const requestButton =
              UI.button({
                label:
                  'Request details',
                size:
                  'xs',
                variant:
                  'primary',
                onClick: () => {

                  UI.openModal({
                    root:
                      overlayRoot,
                    theme:
                      THEME,
                    title:
                      'Request details',
                    children: [

                      UI.keyValueList([
                        {
                          label:
                            'Method',
                          value:
                            'GET'
                        },
                        {
                          label:
                            'Status',
                          value:
                            UI.badge(
                              '200',
                              'SUCCESS'
                            )
                        },
                        {
                          label:
                            'Type',
                          value:
                            'document'
                        },
                        {
                          label:
                            'Duration',
                          value:
                            '84 ms'
                        }
                      ]),

                      UI.commandBlock(
                        DEMO_COMMAND
                      )

                    ]
                  });

                }
              });

            toolBody.append(
              UI.element(
                'div',
                {
                  className:
                    'us-tool-section-heading',
                  text:
                    'Recent traffic'
                }
              ),

              UI.metricStrip([
                {
                  label:
                    'Requests',
                  value:
                    '17'
                },
                {
                  label:
                    'Errors',
                  value:
                    '0'
                }
              ]),

              UI.dataTable({
                columns: [
                  {
                    key:
                      'method',
                    label:
                      'Method',
                    width:
                      '64px'
                  },
                  {
                    key:
                      'type',
                    label:
                      'Type',
                    width:
                      '82px'
                  },
                  {
                    key:
                      'time',
                    label:
                      'Time'
                  }
                ],
                rows: [
                  {
                    method:
                      'GET',
                    type:
                      'document',
                    time:
                      '84 ms'
                  },
                  {
                    method:
                      'GET',
                    type:
                      'stylesheet',
                    time:
                      '91 ms'
                  },
                  {
                    method:
                      'GET',
                    type:
                      'image',
                    time:
                      '129 ms'
                  }
                ]
              }),

              UI.element(
                'div',
                {
                  className:
                    'us-row us-row-wrap'
                },
                requestButton,
                UI.actionStrip([
                  'FILTER_REQUESTS',
                  'PAUSE_CAPTURE',
                  'REFRESH_REQUESTS'
                ], {
                  ariaLabel:
                    'Request actions'
                })
              )
            );

            return;

          }

          if (key === 'dom') {

            toolBody.append(
              UI.element(
                'div',
                {
                  className:
                    'us-tool-section-heading',
                  text:
                    'DOM tools'
                }
              ),

              UI.callout(
                'Contextual DOM operations stay generic; the consuming script decides which element to act on.',
                'INFO'
              ),

              UI.actionStrip([
                'PICK_ELEMENT',
                'INSPECT_ELEMENT',
                'COPY_SELECTOR',
                'COPY_XPATH',
                'SHOW_ELEMENT',
                'HIDE_ELEMENT',
                'REMOVE_ELEMENT',
                'RESTORE_ELEMENT',
                'INSPECT_LAYERS'
              ], {
                ariaLabel:
                  'DOM actions'
              })
            );

            return;

          }

          toolBody.append(
            UI.element(
              'div',
              {
                className:
                  'us-tool-section-heading',
                text:
                  'Export'
              }
            ),

            UI.keyValueList([
              {
                label:
                  'Session',
                value:
                  'docs-001',
                mono:
                  true
              },
              {
                label:
                  'State',
                value:
                  UI.status(
                    'ready',
                    'OK'
                  )
              }
            ]),

            UI.commandBlock(
              DEMO_COMMAND
            ),

            UI.actionStrip([
              'SHIELD',
              'DOCUMENT',
              'COPY_COMMAND'
            ], {
              ariaLabel:
                'Export actions'
            })
          );

        };

      const navigation =
        UI.toolNav({
          active:
            'page',
          items: [
            {
              key:
                'page',
              label:
                'Page',
              icon:
                'HOME'
            },
            {
              key:
                'assets',
              label:
                'Assets',
              icon:
                'MEDIA',
              badge:
                UI.badge('2')
            },
            {
              key:
                'requests',
              label:
                'Requests',
              icon:
                'REQUESTS',
              badge:
                UI.badge('17')
            },
            {
              key:
                'dom',
              label:
                'DOM',
              icon:
                'CODE'
            },
            {
              key:
                'export',
              label:
                'Export',
              icon:
                'SHIELD'
            }
          ],
          onChange:
            renderToolSection
        });

      renderToolSection(
        'page'
      );

      activeDrawer =
        UI.openDrawer({
          root:
            overlayRoot,
          theme:
            THEME,
          title:
            'Page tools',
          children: [

            UI.chromeStrip([
              UI.terminalLabel(
                '[runtime@page] ~/tools',
                {
                  cursor:
                    true
                }
              )
            ]),

            navigation,

            UI.divider(),

            toolBody

          ],
          onClose: () => {
            activeDrawer = null;
          }
        });

    }
  );
  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ SMALL VIDEO POPOVER                                                          │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  const videoSlot =
    document.getElementById(
      'video-inline'
    );

  const videoInfoButton =
    UI.iconButton(
      'LAYERS',
      {
        title:
          'Show player options'
      }
    );

  videoSlot.appendChild(
    UI.inlineRoot({
      theme:
        THEME,
      children: [
        UI.badge(
          'Large',
          'ACCENT'
        ),
        UI.badge('FILE'),
        videoInfoButton
      ]
    })
  );

  const docsParams =
    new URLSearchParams(
      location.search
    );

  if (docsParams.has('settings')) {
    settingsLauncher.click();
  }

  if (docsParams.has('tools')) {
    launcher.click();
  }


  if (location.hash) {

    const target =
      document.querySelector(
        location.hash
      );

    if (target) {

      const scrollToTarget =
        () => {

          target.scrollIntoView({
            block:
              'start'
          });

        };

      requestAnimationFrame(
        () =>
          requestAnimationFrame(
            scrollToTarget
          )
      );

      globalThis.setTimeout(
        scrollToTarget,
        120
      );

    }

  }


  UI.attachPopover(
    videoInfoButton,
    UI.popover({
      title:
        'Available versions',
      children: [

        UI.dataTable({
          mono:
            true,
          columns: [
            {
              key:
                'quality',
              label:
                'Quality',
              width:
                '88px'
            },
            {
              key:
                'size',
              label:
                'Size',
              width:
                '92px'
            },
            {
              key:
                'path',
              label:
                'Path'
            }
          ],
          rows: [
            {
              quality:
                'Large',
              bitrate:
                '2.4 MB',
              path:
                '/assets/demo-large.jpg'
            },
            {
              quality:
                'Medium',
              bitrate:
                '1.3 MB',
              path:
                '/assets/demo-medium.jpg'
            },
            {
              quality:
                'Small',
              bitrate:
                '620 KB',
              path:
                '/assets/demo-small.jpg'
            }
          ]
        })

      ]
    }),
    {
      root:
        overlayRoot,
      theme:
        THEME,
      placement:
        'bottom'
    }
  );

})();
