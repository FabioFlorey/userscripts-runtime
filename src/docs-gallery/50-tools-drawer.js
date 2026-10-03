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
