  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ BASIC COMPONENTS                                                            │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function button(options = {}) {

    const classes = [
      'us-button'
    ];

    if (options.variant === 'primary') {
      classes.push('us-button-primary');
    }

    if (options.variant === 'danger') {
      classes.push('us-button-danger');
    }

    if (options.size === 'xs') {
      classes.push('us-button-xs');
    }

    if (options.className) {
      classes.push(options.className);
    }

    return element(
      'button',
      {
        className: classes.join(' '),
        title: options.title,
        attrs: {
          type: options.type || 'button',
          disabled: options.disabled || null,
          'aria-label': options.ariaLabel || null
        },
        dataset: options.dataset,
        on: options.onClick
          ? {
            click: options.onClick
          }
          : null
      },
      options.icon
        ? iconSlot(
          options.icon,
          {
            className:
              options.iconClassName,
            iconOptions:
              options.iconOptions
          }
        )
        : null,
      options.label || null
    );

  }

  function iconButton(iconName, options = {}) {

    const classes = [
      'us-icon-button-xs',
      'us-action-button'
    ];

    if (options.danger) {
      classes.push('us-action-button-danger');
    }

    if (options.command) {
      classes.push('us-command-action');
    }

    if (options.className) {
      classes.push(options.className);
    }

    return button({
      icon: iconName,
      title: options.title,
      ariaLabel:
        options.ariaLabel ||
        options.title,
      className: classes.join(' '),
      dataset: options.dataset,
      onClick: options.onClick
    });

  }

  function action(actionName, options = {}) {

    const preset =
      ACTIONS[actionName];

    if (!preset) {
      throw new Error(
        `Unknown action: ${actionName}`
      );
    }

    return Object.freeze({
      action:
        actionName,
      icon:
        options.icon ||
        preset.icon,
      label:
        options.label ||
        preset.label,
      title:
        options.title ||
        options.label ||
        preset.label,
      group:
        preset.group,
      danger:
        Boolean(options.danger),
      disabled:
        Boolean(options.disabled),
      onClick:
        options.onClick ||
        options.run ||
        null
    });

  }

  function resolveAction(
    actionNameOrDescriptor,
    options = {}
  ) {

    if (
      actionNameOrDescriptor &&
      actionNameOrDescriptor.nodeType
    ) {
      return actionNameOrDescriptor;
    }

    if (
      typeof actionNameOrDescriptor === 'string'
    ) {

      return action(
        actionNameOrDescriptor,
        options
      );

    }

    if (
      actionNameOrDescriptor &&
      actionNameOrDescriptor.action
    ) {

      return {
        ...action(
          actionNameOrDescriptor.action,
          actionNameOrDescriptor
        ),
        ...actionNameOrDescriptor,
        ...options
      };

    }

    return {
      ...actionNameOrDescriptor,
      ...options
    };

  }

  function actionButton(actionNameOrDescriptor, options = {}) {

    const descriptor =
      resolveAction(
        actionNameOrDescriptor,
        options
      );

    return iconButton(
      descriptor.icon,
      {
        ...descriptor,
        title:
          descriptor.title ||
          descriptor.label,
        ariaLabel:
          descriptor.ariaLabel ||
          descriptor.label,
        danger:
          descriptor.danger,
        onClick:
          descriptor.onClick
      }
    );

  }

  function toneClass(tone = 'NEUTRAL') {

    const key =
      String(
        tone ||
        'NEUTRAL'
      ).toUpperCase();

    return (
      TONE_CLASSES[key] ||
      TONE_CLASSES.NEUTRAL
    );

  }

  function pill(text, tone = 'NEUTRAL', options = {}) {

    const tagName =
      typeof options.onClick === 'function'
        ? 'button'
        : 'span';

    return element(
      tagName,
      {
        className: [
          'us-pill',
          toneClass(tone),
          options.className || ''
        ].filter(Boolean).join(' '),
        title:
          options.title,
        attrs:
          tagName === 'button'
            ? {
              type:
                'button',
              'aria-label':
                options.ariaLabel ||
                options.title ||
                String(text)
            }
            : null,
        on:
          typeof options.onClick === 'function'
            ? {
              click:
                options.onClick
            }
            : null
      },
      options.dot === false
        ? null
        : element(
          'span',
          {
            className:
              'us-pill-dot'
          }
        ),
      text
    );

  }

  function alertBox(options = {}) {

    const tone =
      options.tone ||
      options.level ||
      'INFO';

    const root =
      element(
        'div',
        {
          className: [
            'us-alert',
            toneClass(tone),
            options.className || ''
          ].filter(Boolean).join(' '),
          attrs: {
            role:
              options.role ||
              (
                ['ERROR', 'DANGER', 'CRITICAL']
                  .includes(
                    String(tone).toUpperCase()
                  )
                  ? 'alert'
                  : 'status'
              )
          }
        }
      );

    const iconName =
      options.icon ||
      (
        ['ERROR', 'DANGER', 'CRITICAL', 'WARNING', 'WARN']
          .includes(
            String(tone).toUpperCase()
          )
          ? 'ALERT'
          : 'INFO'
      );

    root.appendChild(
      element(
        'span',
        {
          className:
            'us-alert-icon'
        },
        icon(iconName)
      )
    );

    root.appendChild(
      element(
        'div',
        {
          className:
            'us-alert-content'
        },
        options.title
          ? element(
            'div',
            {
              className:
                'us-alert-title',
              text:
                options.title
            }
          )
          : null,
        options.message instanceof Node
          ? options.message
          : options.message != null
            ? element(
              'div',
              {
                className:
                  'us-alert-message',
                text:
                  options.message
              }
            )
            : null
      )
    );

    const actions = [];

    if (Array.isArray(options.actions)) {
      actions.push(...options.actions);
    }

    if (
      options.closable ||
      typeof options.onClose === 'function'
    ) {

      actions.push(
        iconButton(
          'CLOSE',
          {
            title:
              'Dismiss',
            onClick: () => {

              root.remove();

              if (typeof options.onClose === 'function') {
                options.onClose();
              }

            }
          }
        )
      );

    }

    if (actions.length) {

      root.appendChild(
        element(
          'div',
          {
            className:
              'us-alert-actions'
          },
          actions
        )
      );

    } else {

      root.appendChild(
        element(
          'span'
        )
      );

    }

    return root;

  }

  function showAlert(options = {}) {

    const root =
      options.root ||
      ensureOverlayRoot({
        theme:
          options.theme ||
          'dark'
      });

    let stack =
      root.querySelector(
        '.us-alert-stack'
      );

    if (!stack) {

      stack =
        element(
          'div',
          {
            className:
              'us-alert-stack',
            attrs: {
              'aria-live':
                'polite'
            }
          }
        );

      root.appendChild(
        stack
      );

    }

    const item =
      alertBox({
        ...options,
        closable:
          options.closable !== false
      });

    stack.appendChild(
      item
    );

    const remove = () => {
      item.remove();
    };

    if (options.duration !== 0) {

      global.setTimeout(
        remove,
        options.duration ?? 4200
      );

    }

    return Object.freeze({

      element:
        item,

      remove

    });

  }

  function openAlertDialog(options = {}) {

    let controller = null;

    const dismiss =
      button({
        label:
          options.dismissLabel ||
          'Dismiss',
        variant:
          ['CRITICAL', 'ERROR', 'DANGER']
            .includes(
              String(
                options.tone ||
                options.level ||
                ''
              ).toUpperCase()
            )
            ? 'danger'
            : 'primary',
        onClick: () => {

          if (controller) {
            controller.close();
          }

        }
      });

    controller =
      openModal({
        root:
          options.root,
        theme:
          options.theme,
        title:
          options.dialogTitle ||
          options.title ||
          'Alert',
        closeOnBackdrop:
          options.closeOnBackdrop,
        children: [

          alertBox({
            tone:
              options.tone ||
              options.level ||
              'INFO',
            title:
              options.title,
            message:
              options.message,
            actions:
              options.actions,
            closable:
              false
          })

        ],
        footer: [
          ...(options.footer || []),
          dismiss
        ],
        onClose:
          options.onClose
      });

    return controller;

  }

  function actionMenuItem(
    actionNameOrDescriptor,
    options = {}
  ) {

    const descriptor =
      resolveAction(
        actionNameOrDescriptor,
        options
      );

    const buttonNode =
      element(
        'button',
        {
          className: [
            'us-action-menu-item',
            descriptor.danger
              ? 'us-action-menu-item-danger'
              : ''
          ].filter(Boolean).join(' '),
          attrs: {
            type:
              'button',
            role:
              'menuitem',
            disabled:
              descriptor.disabled,
            'aria-label':
              descriptor.ariaLabel ||
              descriptor.label
          },
          on: {
            click: (event) => {

              if (descriptor.disabled) {
                return;
              }

              if (
                typeof descriptor.onClick === 'function'
              ) {

                descriptor.onClick(
                  event,
                  descriptor
                );

              }

              if (
                typeof options.onSelect === 'function'
              ) {

                options.onSelect(
                  descriptor,
                  event
                );

              }

            }
          }
        },
        descriptor.icon
          ? element(
            'span',
            {
              className:
                'us-action-menu-icon'
            },
            icon(
              descriptor.icon
            )
          )
          : null,
        element(
          'span',
          {
            className:
              'us-action-menu-label',
            text:
              descriptor.label ||
              descriptor.title ||
              ''
          }
        ),
        (
          descriptor.shortcut ||
          descriptor.hint
        )
          ? element(
            'span',
            {
              className:
                'us-action-menu-hint',
              text:
                descriptor.shortcut ||
                descriptor.hint
            }
          )
          : null
      );

    return buttonNode;

  }

  function actionMenu(actions = [], options = {}) {

    return element(
      'div',
      {
        className: [
          'us-action-menu',
          options.className || ''
        ].filter(Boolean).join(' '),
        attrs: {
          role:
            'menu',
          'aria-label':
            options.ariaLabel ||
            'Actions'
        }
      },
      actions.map(
        (item) => {

          if (
            item &&
            item.nodeType
          ) {
            return item;
          }

          return actionMenuItem(
            item,
            {
              onSelect:
                options.onSelect
            }
          );

        }
      )
    );

  }

  function badge(text, type = null) {

    return element(
      'span',
      {
        className: [
          'us-badge',
          type
            ? BADGE_CLASSES[type]
            : ''
        ].filter(Boolean).join(' '),
        text
      }
    );

  }

  function status(text, type = 'OK') {

    return element(
      'span',
      {
        className: [
          'us-status',
          STATUS_CLASSES[type] || ''
        ].filter(Boolean).join(' '),
        text
      }
    );

  }

  function callout(content, type = null) {

    return element(
      'div',
      {
        className: [
          'us-callout',
          type
            ? CALLOUT_CLASSES[type]
            : ''
        ].filter(Boolean).join(' ')
      },
      content
    );

  }

  function divider() {

    return element(
      'div',
      {
        className: 'us-divider'
      }
    );

  }

  function toolbar(children = [], options = {}) {

    return element(
      'div',
      {
        className: [
          'us-toolbar',
          options.className || ''
        ].filter(Boolean).join(' ')
      },
      children
    );

  }

  function stack(children = [], options = {}) {

    const node =
      element(
        options.tag ||
        'div',
        {
          className: [
            'us-stack',
            options.tight
              ? 'us-stack-tight'
              : '',
            options.className || ''
          ].filter(Boolean).join(' ')
        },
        children
      );

    if (options.gap != null) {

      node.style.setProperty(
        '--us-stack-gap',
        typeof options.gap === 'number'
          ? `${options.gap}px`
          : String(options.gap)
      );

    }

    return node;

  }

  function cluster(children = [], options = {}) {

    const node =
      element(
        options.tag ||
        'div',
        {
          className: [
            'us-cluster',
            options.tight
              ? 'us-cluster-tight'
              : '',
            options.className || ''
          ].filter(Boolean).join(' ')
        },
        children
      );

    if (options.gap != null) {

      node.style.setProperty(
        '--us-cluster-gap',
        typeof options.gap === 'number'
          ? `${options.gap}px`
          : String(options.gap)
      );

    }

    return node;

  }

  function field(label, control, options = {}) {

    return element(
      'label',
      {
        className: [
          'us-field',
          options.className || ''
        ].filter(Boolean).join(' ')
      },
      element(
        'span',
        {
          className: 'us-field-label',
          text: label
        }
      ),
      control,
      options.hint
        ? element(
          'span',
          {
            className:
              'us-field-hint',
            text:
              options.hint
          }
        )
        : null
    );

  }
