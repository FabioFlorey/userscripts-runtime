  function modal(options = {}) {

    const closeButton =
      iconButton(
        'CLOSE',
        {
          title:
            'Close',
          onClick:
            options.onClose
        }
      );

    const card =
      element(
        'section',
        {
          className:
            'us-modal',
          attrs: {
            role: 'dialog',
            'aria-modal': 'true',
            tabindex: -1,
            'aria-label':
              options.ariaLabel ||
              options.title ||
              'Userscript dialog'
          }
        },
        element(
          'header',
          {
            className:
              'us-modal-header'
          },
          element(
            'div',
            {
              className:
                'us-modal-title',
              text:
                options.title ||
                ''
            }
          ),
          closeButton
        ),
        element(
          'div',
          {
            className:
              'us-modal-body'
          },
          options.children || []
        ),
        options.footer?.length
          ? element(
            'footer',
            {
              className:
                'us-modal-footer'
            },
            options.footer
          )
          : null
      );

    const backdrop =
      element(
        'div',
        {
          className:
            'us-modal-backdrop'
        },
        card
      );

    return backdrop;

  }

  function openModal(options = {}) {

    const root =
      options.root ||
      ensureOverlayRoot({
        theme:
          options.theme ||
          'dark'
      });

    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    let surface = null;
    let card = null;

    const onKeyDown =
      (event) => {

        if (!surface || !card) {
          return;
        }

        if (
          event.key === 'Escape' &&
          options.closeOnEscape !== false
        ) {
          event.preventDefault();
          close();
          return;
        }

        trapFocus(
          event,
          card
        );

      };

    const close = () => {

      if (!surface) {
        return;
      }

      global.removeEventListener(
        'keydown',
        onKeyDown,
        true
      );

      surface.remove();
      surface = null;
      card = null;

      if (
        options.restoreFocus !== false &&
        previousFocus?.isConnected
      ) {
        previousFocus.focus({
          preventScroll: true
        });
      }

      if (typeof options.onClose === 'function') {
        options.onClose();
      }

    };

    surface =
      modal({
        ...options,
        onClose:
          close
      });

    card =
      surface.querySelector(
        '.us-modal'
      );

    surface.addEventListener(
      'pointerdown',
      (event) => {

        if (
          event.target === surface &&
          options.closeOnBackdrop !== false
        ) {
          close();
        }

      }
    );

    root.appendChild(
      surface
    );

    global.addEventListener(
      'keydown',
      onKeyDown,
      true
    );

    focusInitial(
      card,
      options.initialFocus
    );

    return Object.freeze({

      element:
        surface,

      dialog:
        card,

      close

    });

  }

  function drawer(options = {}) {

    const closeButton =
      iconButton(
        'CLOSE',
        {
          title:
            'Close',
          onClick:
            options.onClose
        }
      );

    return element(
      'aside',
      {
        className: [
          'us-drawer',
          options.side === 'left'
            ? 'us-drawer-left'
            : 'us-drawer-right',
          options.className || ''
        ].filter(Boolean).join(' '),
        attrs: {
          role: 'dialog',
          'aria-label':
            options.ariaLabel ||
            options.title ||
            'Userscript drawer'
        }
      },
      element(
        'header',
        {
          className:
            'us-drawer-header'
        },
        element(
          'div',
          {
            className:
              'us-drawer-title',
            text:
              options.title ||
              ''
          }
        ),
        closeButton
      ),
      element(
        'div',
        {
          className:
            'us-drawer-body'
        },
        options.children || []
      )
    );

  }

  function openDrawer(options = {}) {

    const root =
      options.root ||
      ensureOverlayRoot({
        theme:
          options.theme ||
          'dark'
      });

    let surface = null;

    const close = () => {

      if (!surface) {
        return;
      }

      surface.remove();
      surface = null;

      if (typeof options.onClose === 'function') {
        options.onClose();
      }

    };

    surface =
      drawer({
        ...options,
        onClose:
          close
      });

    root.appendChild(
      surface
    );

    return Object.freeze({

      element:
        surface,

      close

    });

  }

  function toast(options = {}) {

    const actionDescriptor =
      options.action
        ? resolveAction(
          options.action,
          options.actionOptions || {}
        )
        : null;

    const toastIcon =
      options.icon ||
      actionDescriptor?.icon ||
      null;

    const toastTitle =
      options.title ||
      actionDescriptor?.label ||
      null;

    return element(
      'div',
      {
        className: [
          'us-toast',
          toneClass(
            options.tone ||
            options.level ||
            'NEUTRAL'
          )
        ].join(' '),
        attrs: {
          role:
            options.role ||
            'status'
        }
      },
      toastIcon
        ? element(
          'span',
          {
            className:
              'us-toast-icon'
          },
          icon(
            toastIcon
          )
        )
        : null,
      element(
        'div',
        {
          className:
            'us-column us-column-tight'
        },
        toastTitle
          ? element(
            'div',
            {
              className:
                'us-toast-title',
              text:
                toastTitle
            }
          )
          : null,
        options.message
          ? element(
            'div',
            {
              className:
                'us-toast-message',
              text:
                options.message
            }
          )
          : null
      )
    );

  }

  function showActionToast(
    actionNameOrDescriptor,
    options = {}
  ) {

    return showToast({
      ...options,
      action:
        actionNameOrDescriptor
    });

  }

  function showToast(options = {}) {

    const root =
      options.root ||
      ensureOverlayRoot({
        theme:
          options.theme ||
          'dark'
      });

    let stack =
      root.querySelector(
        '.us-toast-stack'
      );

    if (!stack) {

      stack =
        element(
          'div',
          {
            className:
              'us-toast-stack'
          }
        );

      root.appendChild(
        stack
      );

    }

    const item =
      toast(options);

    stack.appendChild(
      item
    );

    const remove = () => {
      item.remove();
    };

    if (options.duration !== 0) {

      global.setTimeout(
        remove,
        options.duration ?? 2600
      );

    }

    return Object.freeze({

      element:
        item,

      remove

    });

  }

  function tooltip(text, options = {}) {

    return element(
      'div',
      {
        className:
          'us-tooltip',
        attrs: {
          role: 'tooltip'
        },
        text
      }
    );

  }

  function attachTooltip(target, text, options = {}) {

    if (!(target instanceof Element)) {
      return null;
    }

    const root =
      options.root ||
      ensureOverlayRoot({
        theme:
          options.theme ||
          'dark'
      });

    const tip =
      tooltip(
        text,
        options
      );

    tip.hidden = true;

    root.appendChild(
      tip
    );

    const update = () => {

      if (tip.hidden) {
        return;
      }

      positionFloating(
        target,
        tip,
        {
          placement:
            options.placement ||
            'top',
          offset:
            options.offset ?? 6
        }
      );

    };

    const show = () => {

      tip.hidden = false;

      requestAnimationFrame(
        update
      );

    };

    const hide = () => {
      tip.hidden = true;
    };

    target.addEventListener(
      'pointerenter',
      show
    );

    target.addEventListener(
      'pointerleave',
      hide
    );

    target.addEventListener(
      'focus',
      show
    );

    target.addEventListener(
      'blur',
      hide
    );

    return Object.freeze({

      element:
        tip,

      show,

      hide,

      destroy() {

        target.removeEventListener(
          'pointerenter',
          show
        );

        target.removeEventListener(
          'pointerleave',
          hide
        );

        target.removeEventListener(
          'focus',
          show
        );

        target.removeEventListener(
          'blur',
          hide
        );

        tip.remove();

      }

    });

  }

  function inlineRoot(options = {}) {

    return createRoot({
      tagName:
        options.tagName ||
        'span',
      theme:
        options.theme ||
        'dark',
      inline:
        true,
      className:
        options.className,
      children:
        options.children
    });

  }

  function inlineInspector(actions = [], options = {}) {

    return element(
      'span',
      {
        className:
          'us-inline-inspector',
        attrs: {
          role: 'group',
          'aria-label':
            options.ariaLabel ||
            'Userscript inline controls'
        }
      },
      actionStrip(actions)
    );

  }
