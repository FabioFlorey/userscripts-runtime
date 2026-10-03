  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ TERMINAL / FLAT UTILITY COMPONENTS                                           │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function terminalLabel(text, options = {}) {

    return element(
      options.tagName || 'span',
      {
        className: [
          'us-terminal-label',
          options.cursor
            ? 'us-terminal-label-cursor'
            : '',
          options.className || ''
        ].filter(Boolean).join(' '),
        text,
        title:
          options.title
      }
    );

  }

  function metaLine(items = [], options = {}) {

    return element(
      'div',
      {
        className: [
          'us-meta-line',
          options.className || ''
        ].filter(Boolean).join(' ')
      },
      items.map(
        (item) => {

          if (item instanceof Node) {
            return item;
          }

          return element(
            'span',
            {
              text:
                String(item)
            }
          );

        }
      )
    );

  }

  function chromeStrip(children = [], options = {}) {

    return element(
      options.tagName || 'div',
      {
        className: [
          'us-chrome-strip',
          options.className || ''
        ].filter(Boolean).join(' '),
        attrs: {
          role:
            options.role,
          'aria-label':
            options.ariaLabel
        }
      },
      children
    );

  }

  function offsetCard(options = {}) {

    const tagName =
      options.href
        ? 'a'
        : typeof options.onClick === 'function'
          ? 'button'
          : 'div';

    const node =
      element(
        tagName,
        {
          className: [
            'us-offset-card',
            (
              options.href ||
              typeof options.onClick === 'function'
            )
              ? 'us-offset-card-interactive'
              : '',
            options.external
              ? 'us-external-cue'
              : '',
            options.className || ''
          ].filter(Boolean).join(' '),
          attrs: {
            href:
              options.href,
            target:
              options.external
                ? '_blank'
                : null,
            rel:
              options.external
                ? 'noopener noreferrer'
                : null,
            type:
              tagName === 'button'
                ? 'button'
                : null
          },
          on:
            typeof options.onClick === 'function'
              ? {
                click:
                  options.onClick
              }
              : null
        }
      );

    const body =
      element(
        'div',
        {
          className:
            'us-column us-column-tight'
        }
      );

    if (options.title) {

      body.appendChild(
        element(
          'strong',
          {
            text:
              options.title
          }
        )
      );

    }

    if (options.description) {

      body.appendChild(
        element(
          'span',
          {
            className:
              'us-secondary',
            text:
              options.description
          }
        )
      );

    }

    if (options.meta?.length) {

      body.appendChild(
        metaLine(
          options.meta
        )
      );

    }

    if (options.icon) {

      node.appendChild(
        element(
          'span',
          {
            className:
              'us-offset-card-icon'
          },
          icon(
            options.icon
          )
        )
      );

    }

    node.appendChild(
      body
    );

    return node;

  }
