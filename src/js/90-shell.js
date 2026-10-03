  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ APPLICATION SHELL COMPONENTS                                                 │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function header(options = {}) {

    return element(
      'header',
      {
        className:
          'us-app-header us-header'
      },
      element(
        'div',
        {
          className: 'us-header-brand'
        },
        element(
          'span',
          {
            className: 'us-header-mark',
            text: options.mark || 'US'
          }
        ),
        element(
          'span',
          {
            className: 'us-header-title',
            text:
              options.title ||
              'Userscript'
          }
        )
      ),
      options.context
        ? element(
          'span',
          {
            className: 'us-header-context',
            text: options.context
          }
        )
        : null,
      element(
        'div',
        {
          className: 'us-spacer'
        }
      ),
      options.search
        ? element(
          'label',
          {
            className: 'us-header-search'
          },
          icon('SEARCH'),
          element(
            'input',
            {
              attrs: {
                type: 'search',
                placeholder:
                  options.search.placeholder ||
                  'Search',
                'aria-label':
                  options.search.ariaLabel ||
                  'Search'
              },
              on: options.search.onInput
                ? {
                  input:
                    options.search.onInput
                }
                : null
            }
          )
        )
        : null,
      ...(options.actions || [])
    );

  }

  function sidebarSection(options = {}) {

    const root =
      element(
        'section',
        {
          className: 'us-sidebar-section'
        },
        options.title
          ? element(
            'div',
            {
              className: 'us-sidebar-title',
              text: options.title
            }
          )
          : null
      );

    if (options.items?.length) {

      const list =
        element(
          'ul',
          {
            className: 'us-side-nav'
          }
        );

      for (const item of options.items) {

        list.appendChild(
          element(
            'li',
            {},
            element(
              item.href
                ? 'a'
                : 'button',
              {
                className: [
                  'us-side-nav-link',
                  item.active
                    ? 'us-side-nav-link-active'
                    : ''
                ].filter(Boolean).join(' '),
                attrs: item.href
                  ? {
                    href: item.href
                  }
                  : {
                    type: 'button'
                  },
                on: item.onClick
                  ? {
                    click: item.onClick
                  }
                  : null
              },
              item.icon
                ? element(
                  'span',
                  {
                    className: 'us-side-nav-icon'
                  },
                  icon(item.icon)
                )
                : null,
              item.label
            )
          )
        );

      }

      root.appendChild(
        list
      );

    }

    appendChildren(
      root,
      options.children || []
    );

    return root;

  }

  function sidebar(side, sections = []) {

    return element(
      'aside',
      {
        className: [
          side === 'right'
            ? 'us-app-right'
            : 'us-app-left',
          'us-sidebar',
          side === 'right'
            ? 'us-sidebar-right'
            : 'us-sidebar-left'
        ].join(' ')
      },
      element(
        'div',
        {
          className: 'us-sidebar-inner'
        },
        sections.map(
          sidebarSection
        )
      )
    );

  }

  function footer(options = {}) {

    return element(
      'footer',
      {
        className:
          'us-app-footer us-footer'
      },
      ...(options.left || []),
      element(
        'div',
        {
          className: 'us-spacer'
        }
      ),
      ...(options.right || [])
    );

  }

  function appShell(options = {}) {

    return element(
      'div',
      {
        className: 'us-app',
        attrs: {
          'data-userscript-root': ''
        }
      },
      options.header ||
        header(
          options.headerOptions || {}
        ),
      options.left ||
        sidebar(
          'left',
          options.leftSections || []
        ),
      element(
        'main',
        {
          className:
            'us-app-main'
        },
        options.main || []
      ),
      options.right ||
        sidebar(
          'right',
          options.rightSections || []
        ),
      options.footer ||
        footer(
          options.footerOptions || {}
        )
    );

  }
