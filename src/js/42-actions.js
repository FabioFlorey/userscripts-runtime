  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ ACTION COMPONENTS                                                           │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function actionStrip(actions = [], options = {}) {

    return element(
      'div',
      {
        className: 'us-action-strip',
        attrs: {
          role: 'group',
          'aria-label':
            options.ariaLabel ||
            'Actions'
        }
      },
      actions.map((item) => {

        if (item instanceof Node) {
          return item;
        }

        if (typeof item === 'string') {
          return actionButton(item);
        }

        if (item.custom instanceof Node) {
          return item.custom;
        }

        if (item.action) {
          return actionButton(item);
        }

        return iconButton(
          item.icon,
          item
        );

      })
    );

  }

  async function copyText(value) {

    if (navigator.clipboard?.writeText) {

      await navigator.clipboard.writeText(value);
      return;

    }

    const textarea =
      document.createElement('textarea');

    textarea.value = value;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';

    document.body.appendChild(
      textarea
    );

    textarea.select();

    document.execCommand(
      'copy'
    );

    textarea.remove();

  }

  function shellQuote(value) {

    return `'${String(value).replaceAll("'", "'\\\"'\\\"'")}'`;

  }

  function copyCommandButton(options = {}) {

    const getCommand =
      typeof options.command === 'function'
        ? options.command
        : () => String(options.command || '');

    const action =
      iconButton(
        options.icon || 'TERMINAL',
        {
          title: options.title || 'Copy command',
          command: true,
          onClick: async () => {

            const command =
              getCommand();

            if (!command) {
              return;
            }

            await copyText(
              command
            );

            action.dataset.copied = 'true';
            action.title = command;

            setTimeout(() => {

              delete action.dataset.copied;

              action.title =
                options.title ||
                'Copy command';

            }, options.feedbackMs || 1400);

          }
        }
      );

    return action;

  }

  function commandBlock(command, options = {}) {

    const getCommand =
      typeof command === 'function'
        ? command
        : () => String(command || '');

    return element(
      'div',
      {
        className: 'us-command'
      },
      element(
        'code',
        {
          className: 'us-command-code',
          text: getCommand()
        }
      ),
      copyCommandButton({
        command: getCommand,
        title:
          options.title ||
          'Copy command'
      })
    );

  }
