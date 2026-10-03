  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ PAGE-OVERLAY COMPONENTS                                                      │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  /*
   * Most userscripts augment an existing page. These helpers create scoped roots
   * and detached overlay controls without requiring a full application shell.
   */

  function createRoot(options = {}) {

    const root =
      element(
        options.tagName || 'div',
        {
          id: options.id,
          className: [
            options.overlay
              ? 'us-overlay-root'
              : '',
            options.inline
              ? 'us-inline-root'
              : '',
            options.className || ''
          ].filter(Boolean).join(' '),
          attrs: {
            'data-userscript-root': '',
            'data-us-theme':
              options.theme ||
              'dark'
          }
        },
        options.children || []
      );

    return root;

  }

  function setTheme(root, theme) {

    if (!(root instanceof HTMLElement)) {
      return;
    }

    root.setAttribute(
      'data-us-theme',
      theme === 'light'
        ? 'light'
        : 'dark'
    );

  }

  function ensureOverlayRoot(options = {}) {

    const id =
      options.id ||
      'userscript-overlay-root';

    let root =
      document.getElementById(id);

    if (root) {

      setTheme(
        root,
        options.theme ||
        root.getAttribute('data-us-theme') ||
        'dark'
      );

      return root;

    }

    root =
      createRoot({
        id,
        theme:
          options.theme ||
          'dark',
        overlay:
          true
      });

    (
      document.body ||
      document.documentElement
    ).appendChild(root);

    return root;

  }

  function positionFloating(anchor, floating, options = {}) {

    if (
      !(anchor instanceof Element) ||
      !(floating instanceof HTMLElement)
    ) {
      return;
    }

    const placement =
      options.placement ||
      'top';

    const offset =
      Number(options.offset ?? 8);

    const padding =
      Number(options.viewportPadding ?? 8);

    const anchorRect =
      anchor.getBoundingClientRect();

    const floatingRect =
      floating.getBoundingClientRect();

    let left =
      anchorRect.left;

    let top =
      anchorRect.top -
      floatingRect.height -
      offset;

    if (placement === 'bottom') {

      top =
        anchorRect.bottom +
        offset;

    }

    if (placement === 'left') {

      left =
        anchorRect.left -
        floatingRect.width -
        offset;

      top =
        anchorRect.top +
        (
          anchorRect.height -
          floatingRect.height
        ) / 2;

    }

    if (placement === 'right') {

      left =
        anchorRect.right +
        offset;

      top =
        anchorRect.top +
        (
          anchorRect.height -
          floatingRect.height
        ) / 2;

    }

    if (
      placement === 'top' ||
      placement === 'bottom'
    ) {

      left =
        anchorRect.left +
        (
          anchorRect.width -
          floatingRect.width
        ) / 2;

    }

    left =
      Math.max(
        padding,
        Math.min(
          left,
          global.innerWidth -
          floatingRect.width -
          padding
        )
      );

    top =
      Math.max(
        padding,
        Math.min(
          top,
          global.innerHeight -
          floatingRect.height -
          padding
        )
      );

    floating.style.left =
      `${Math.round(left)}px`;

    floating.style.top =
      `${Math.round(top)}px`;

  }

  function floatingAction(options = {}) {

    return element(
      'button',
      {
        className: [
          'us-floating-action',
          options.label
            ? 'us-floating-action-labeled'
            : '',
          `us-floating-action-${options.position || 'bottom-right'}`,
          options.className || ''
        ].filter(Boolean).join(' '),
        title: options.title,
        attrs: {
          type: 'button',
          'aria-label':
            options.ariaLabel ||
            options.title ||
            options.label ||
            'Userscript action'
        },
        on: options.onClick
          ? {
            click:
              options.onClick
          }
          : null
      },
      options.icon
        ? icon(options.icon)
        : null,
      options.label || null
    );

  }

  function hoverToolbar(actions = [], options = {}) {

    return element(
      'div',
      {
        className: [
          'us-hover-toolbar',
          options.className || ''
        ].filter(Boolean).join(' '),
        attrs: {
          role: 'toolbar',
          'aria-label':
            options.ariaLabel ||
            'Userscript actions'
        }
      },
      options.label
        ? element(
          'span',
          {
            className:
              'us-hover-toolbar-label',
            text:
              options.label
          }
        )
        : null,
      actionStrip(actions)
    );

  }

  function attachHoverToolbar(target, actions = [], options = {}) {

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

    const control =
      hoverToolbar(
        actions,
        options
      );

    control.hidden = true;

    root.appendChild(
      control
    );

    let hideTimer = null;

    const update = () => {

      if (control.hidden) {
        return;
      }

      positionFloating(
        target,
        control,
        {
          placement:
            options.placement ||
            'top',
          offset:
            options.offset ?? 7
        }
      );

    };

    const show = () => {

      if (hideTimer) {
        global.clearTimeout(hideTimer);
      }

      control.hidden = false;

      requestAnimationFrame(
        update
      );

    };

    const hide = () => {

      hideTimer =
        global.setTimeout(
          () => {
            control.hidden = true;
          },
          options.hideDelay ?? 120
        );

    };

    target.addEventListener(
      'pointerenter',
      show
    );

    target.addEventListener(
      'pointerleave',
      hide
    );

    control.addEventListener(
      'pointerenter',
      show
    );

    control.addEventListener(
      'pointerleave',
      hide
    );

    global.addEventListener(
      'scroll',
      update,
      true
    );

    global.addEventListener(
      'resize',
      update
    );

    return Object.freeze({

      element:
        control,

      show,

      hide,

      update,

      destroy() {

        if (hideTimer) {
          global.clearTimeout(hideTimer);
        }

        target.removeEventListener(
          'pointerenter',
          show
        );

        target.removeEventListener(
          'pointerleave',
          hide
        );

        control.removeEventListener(
          'pointerenter',
          show
        );

        control.removeEventListener(
          'pointerleave',
          hide
        );

        global.removeEventListener(
          'scroll',
          update,
          true
        );

        global.removeEventListener(
          'resize',
          update
        );

        control.remove();

      }

    });

  }

  function popover(options = {}) {

    const root =
      element(
        'section',
        {
          className: [
            'us-popover',
            options.className || ''
          ].filter(Boolean).join(' '),
          attrs: {
            role:
              options.role ||
              'dialog',
            'aria-label':
              options.ariaLabel ||
              options.title ||
              'Userscript popover'
          }
        }
      );

    if (
      options.title ||
      options.actions?.length
    ) {

      root.appendChild(
        element(
          'header',
          {
            className:
              'us-popover-header'
          },
          element(
            'div',
            {
              className:
                'us-popover-title',
              text:
                options.title ||
                ''
            }
          ),
          ...(options.actions || [])
        )
      );

    }

    root.appendChild(
      element(
        'div',
        {
          className:
            'us-popover-body'
        },
        options.children || []
      )
    );

    if (options.footer?.length) {

      root.appendChild(
        element(
          'footer',
          {
            className:
              'us-popover-footer'
          },
          options.footer
        )
      );

    }

    return root;

  }

  function attachPopover(anchor, content, options = {}) {

    if (!(anchor instanceof Element)) {
      return null;
    }

    const root =
      options.root ||
      ensureOverlayRoot({
        theme:
          options.theme ||
          'dark'
      });

    const surface =
      content instanceof Node
        ? content
        : popover(content || {});

    surface.hidden = true;

    root.appendChild(
      surface
    );

    const update = () => {

      if (surface.hidden) {
        return;
      }

      positionFloating(
        anchor,
        surface,
        {
          placement:
            options.placement ||
            'bottom',
          offset:
            options.offset ?? 8
        }
      );

    };

    const open = () => {

      surface.hidden = false;

      requestAnimationFrame(
        update
      );

    };

    const close = () => {
      surface.hidden = true;
    };

    const toggle = () => {

      if (surface.hidden) {
        open();
      } else {
        close();
      }

    };

    if (options.trigger !== false) {

      anchor.addEventListener(
        'click',
        toggle
      );

    }

    global.addEventListener(
      'scroll',
      update,
      true
    );

    global.addEventListener(
      'resize',
      update
    );

    return Object.freeze({

      element:
        surface,

      open,

      close,

      toggle,

      update,

      destroy() {

        if (options.trigger !== false) {

          anchor.removeEventListener(
            'click',
            toggle
          );

        }

        global.removeEventListener(
          'scroll',
          update,
          true
        );

        global.removeEventListener(
          'resize',
          update
        );

        surface.remove();

      }

    });

  }
