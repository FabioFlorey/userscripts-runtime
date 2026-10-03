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
