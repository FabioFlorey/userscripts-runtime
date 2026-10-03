  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ PANEL COMPONENTS                                                            │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function panel(options = {}) {

    const root =
      element(
        options.tagName || 'section',
        {
          id: options.id,
          className: [
            'us-panel',
            options.selected
              ? 'us-panel-selected'
              : '',
            options.className || ''
          ].filter(Boolean).join(' ')
        }
      );

    if (
      options.title ||
      options.subtitle ||
      options.actions?.length
    ) {

      const heading =
        element(
          'div',
          {
            className: 'us-panel-heading'
          }
        );

      if (options.title) {

        heading.appendChild(
          element(
            'div',
            {
              className: 'us-panel-title',
              text: options.title
            }
          )
        );

      }

      if (options.subtitle) {

        heading.appendChild(
          element(
            'div',
            {
              className: 'us-panel-subtitle',
              text: options.subtitle
            }
          )
        );

      }

      root.appendChild(
        element(
          'header',
          {
            className: 'us-panel-header'
          },
          heading,
          options.actions?.length
            ? element(
              'div',
              {
                className: 'us-panel-actions'
              },
              options.actions
            )
            : null
        )
      );

    }

    root.appendChild(
      element(
        'div',
        {
          className: [
            'us-panel-body',
            options.compact
              ? 'us-panel-body-compact'
              : ''
          ].filter(Boolean).join(' ')
        },
        options.children || []
      )
    );

    return root;

  }

  function pageHeader(options = {}) {

    return element(
      'div',
      {
        className: 'us-page-header'
      },
      element(
        'div',
        {
          className: 'us-page-header-main'
        },
        options.kicker
          ? element(
            'div',
            {
              className: 'us-page-kicker',
              text: options.kicker
            }
          )
          : null,
        element(
          'div',
          {
            className: 'us-page-title',
            text: options.title || ''
          }
        ),
        options.description
          ? element(
            'div',
            {
              className: 'us-page-description',
              text: options.description
            }
          )
          : null
      ),
      options.actions?.length
        ? element(
          'div',
          {
            className: 'us-row us-row-wrap'
          },
          options.actions
        )
        : null
    );

  }
