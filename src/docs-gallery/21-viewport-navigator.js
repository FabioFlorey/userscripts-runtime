/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ VIEWPORT NAVIGATOR DEMO                                                      │
└──────────────────────────────────────────────────────────────────────────────┘
*/

  const navigatorDemoSource =
    demoThumbnail(
      'PAN / ZOOM',
      '#49304f',
      '#f5f5f5'
    );

  let navigatorDemoState = {
    x: 0.22,
    y: 0.18,
    width: 0.42,
    height: 0.34,
    scale: 2.4
  };

  const navigatorDemoViewport =
    UI.element(
      'div',
      {
        style:
          'position:absolute;border:2px solid var(--us-accent);background:color-mix(in srgb,var(--us-accent) 12%,transparent);pointer-events:none;'
      }
    );

  const navigatorDemoCanvas =
    UI.element(
      'div',
      {
        style:
          'position:relative;min-height:220px;overflow:hidden;border:1px solid var(--us-border);background:var(--us-surface-2);'
      },
      UI.element(
        'img',
        {
          attrs: {
            src:
              navigatorDemoSource,
            alt:
              'Viewport navigator demo'
          },
          style:
            'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;'
        }
      ),
      navigatorDemoViewport
    );

  const navigatorDemo =
    UI.viewportNavigator({
      source:
        navigatorDemoSource,
      visible:
        true,
      x:
        navigatorDemoState.x,
      y:
        navigatorDemoState.y,
      width:
        navigatorDemoState.width,
      height:
        navigatorDemoState.height,
      ariaLabel:
        'Viewport navigator demo',
      onPan:
        ({ x, y }) => {

          navigatorDemoState.x =
            x;

          navigatorDemoState.y =
            y;

          navigatorDemo.update({
            ...navigatorDemoState,
            visible:
              navigatorDemoState.scale > 1
          });

          renderNavigatorDemo();

        }
    });

  function renderNavigatorDemo() {

    navigatorDemoViewport.style.left =
      `${navigatorDemoState.x * 100}%`;

    navigatorDemoViewport.style.top =
      `${navigatorDemoState.y * 100}%`;

    navigatorDemoViewport.style.width =
      `${navigatorDemoState.width * 100}%`;

    navigatorDemoViewport.style.height =
      `${navigatorDemoState.height * 100}%`;

  }

  const navigatorDemoRoot =
    UI.createRoot({
      theme:
        THEME,
      children: [
        UI.element(
          'div',
          {
            className:
              'us-grid us-grid-2'
          },
          navigatorDemoCanvas,
          UI.stack(
            [
              navigatorDemo,
              UI.cluster(
                [
                  UI.button({
                    label:
                      'Zoom in',
                    size:
                      'xs',
                    onClick: () => {

                      navigatorDemoState = {
                        ...navigatorDemoState,
                        scale:
                          3.2,
                        width:
                          0.31,
                        height:
                          0.26
                      };

                      navigatorDemo.update({
                        ...navigatorDemoState,
                        visible:
                          true
                      });

                      renderNavigatorDemo();

                    }
                  }),
                  UI.button({
                    label:
                      'Reset',
                    size:
                      'xs',
                    onClick: () => {

                      navigatorDemoState = {
                        x:
                          0,
                        y:
                          0,
                        width:
                          1,
                        height:
                          1,
                        scale:
                          1
                      };

                      navigatorDemo.update({
                        ...navigatorDemoState,
                        visible:
                          false
                      });

                      renderNavigatorDemo();

                    }
                  })
                ],
                {
                  tight:
                    true
                }
              ),
              UI.metaLine([
                'drag the rectangle',
                'click to recenter',
                'controlled state'
              ])
            ],
            {
              tight:
                true
            }
          )
        )
      ]
    });

  document
    .getElementById(
      'viewport-navigator-gallery'
    )
    .appendChild(
      navigatorDemoRoot
    );

  renderNavigatorDemo();
