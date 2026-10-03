  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ TOOL NAVIGATION                                                             │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function toolNav(options = {}) {

    const root =
      element(
        'nav',
        {
          className:
            'us-tool-nav',
          attrs: {
            'aria-label':
              options.ariaLabel ||
              'Tool sections'
          }
        }
      );

    let active =
      options.active ??
      options.items?.[0]?.key ??
      null;

    const buttons = [];

    const sync = () => {

      for (const item of buttons) {

        const isActive =
          item.dataset.key ===
          String(active);

        item.classList.toggle(
          'us-tool-nav-item-active',
          isActive
        );

        item.setAttribute(
          'aria-current',
          isActive
            ? 'page'
            : 'false'
        );

      }

    };

    for (
      const [index, item] of
      (options.items || []).entries()
    ) {

      const key =
        item.key ??
        item.label;

      const buttonNode =
        element(
          'button',
          {
            className:
              'us-tool-nav-item',
            attrs: {
              type:
                'button'
            },
            dataset: {
              key
            },
            on: {
              click: () => {

                active =
                  key;

                sync();

                if (typeof options.onChange === 'function') {

                  options.onChange(
                    key,
                    item,
                    root
                  );

                }

              }
            }
          },
          element(
            'span',
            {
              className:
                'us-tool-nav-index',
              text:
                String(
                  index + 1
                ).padStart(
                  2,
                  '0'
                )
            }
          ),
          item.icon
            ? element(
              'span',
              {
                className:
                  'us-tool-nav-icon'
              },
              icon(
                item.icon
              )
            )
            : null,
          element(
            'span',
            {
              className:
                'us-tool-nav-label',
              text:
                item.label
            }
          ),
          item.badge instanceof Node
            ? item.badge
            : null
        );

      buttons.push(
        buttonNode
      );

      root.appendChild(
        buttonNode
      );

    }

    sync();

    return root;

  }
