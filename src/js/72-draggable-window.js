    function draggableWindow(options = {}) {

    const body =
      element(
        'div',
        {
          className:
            'us-floating-window-body'
        },
        options.children || []
      );

    const footer =
      options.footer?.length
        ? element(
          'footer',
          {
            className:
              'us-floating-window-footer'
          },
          options.footer
        )
        : null;

    let minimized = false;
    let maximized = false;
    let restoreRect = null;
    let drag = null;
    let resize = null;

    const closeButton =
      actionButton(
        'CLOSE',
        {
          title:
            'Close',
          onClick:
            options.onClose
        }
      );

    const minimizeButton =
      options.minimizable === false
        ? null
        : iconButton(
          'MINUS',
          {
            title:
              'Minimize'
          }
        );

    const maximizeButton =
      options.maximizable === false
        ? null
        : iconButton(
          'FULLSCREEN',
          {
            title:
              'Maximize'
          }
        );

    const headerActions =
      [
        ...(options.actions || []),
        minimizeButton,
        maximizeButton,
        closeButton
      ].filter(Boolean);

    const header =
      element(
        'header',
        {
          className:
            'us-floating-window-header'
        },
        element(
          'span',
          {
            className:
              'us-floating-window-grip',
            attrs: {
              'aria-hidden':
                'true'
            }
          },
          icon(
            'GRIP'
          )
        ),
        element(
          'div',
          {
            className:
              'us-floating-window-title',
            text:
              options.title ||
              ''
          }
        ),
        element(
          'div',
          {
            className:
              'us-floating-window-actions'
          },
          headerActions
        )
      );

    const resizeHandle =
      options.resizable === false
        ? null
        : element(
          'button',
          {
            className:
              'us-floating-window-resize',
            title:
              'Resize window',
            attrs: {
              type:
                'button',
              'aria-label':
                'Resize window'
            }
          }
        );

    const root =
      element(
        'section',
        {
          className: [
            'us-floating-window',
            options.className || ''
          ].filter(Boolean).join(' '),
          attrs: {
            role:
              'dialog',
            'aria-label':
              options.ariaLabel ||
              options.title ||
              'Floating window',
            tabindex:
              -1
          }
        },
        header,
        body,
        footer,
        resizeHandle
      );

    const px =
      (value) =>
        typeof value === 'number'
          ? String(value) + 'px'
          : String(value);

    if (options.width) {
      root.style.width =
        px(
          options.width
        );
    }

    if (options.height) {
      root.style.height =
        px(
          options.height
        );
    }

    const getRect =
      () => {

        const rect =
          root.getBoundingClientRect();

        return {
          left:
            rect.left,
          top:
            rect.top,
          width:
            rect.width,
          height:
            rect.height
        };

      };

    const clampSize =
      (
        width,
        height
      ) => {

        const minWidth =
          Math.min(
            Number(
              options.minWidth ??
              280
            ) || 280,
            global.innerWidth - 16
          );

        const minHeight =
          Math.min(
            Number(
              options.minHeight ??
              120
            ) || 120,
            global.innerHeight - 16
          );

        return {
          width:
            Math.max(
              minWidth,
              Math.min(
                global.innerWidth - 16,
                Number(width) ||
                  minWidth
              )
            ),
          height:
            Math.max(
              minHeight,
              Math.min(
                global.innerHeight - 16,
                Number(height) ||
                  minHeight
              )
            )
        };

      };

    const setSize =
      (
        width,
        height
      ) => {

        if (maximized) {
          return getRect();
        }

        const next =
          clampSize(
            width,
            height
          );

        root.style.width =
          String(
            next.width
          ) +
          'px';

        root.style.height =
          String(
            next.height
          ) +
          'px';

        return next;

      };

    const clampPosition =
      (
        left,
        top
      ) => {

        const rect =
          root.getBoundingClientRect();

        const padding =
          8;

        return {
          left:
            Math.max(
              padding,
              Math.min(
                global.innerWidth -
                  rect.width -
                  padding,
                Number(left) ||
                  0
              )
            ),
          top:
            Math.max(
              padding,
              Math.min(
                global.innerHeight -
                  Math.min(
                    rect.height,
                    global.innerHeight -
                      padding * 2
                  ) -
                  padding,
                Number(top) ||
                  0
              )
            )
        };

      };

    const setPosition =
      (
        left,
        top
      ) => {

        if (maximized) {
          return getRect();
        }

        const next =
          clampPosition(
            left,
            top
          );

        root.style.left =
          String(
            next.left
          ) +
          'px';

        root.style.top =
          String(
            next.top
          ) +
          'px';

        root.style.right =
          'auto';

        root.style.bottom =
          'auto';

        return next;

      };

    const notifyState =
      () => {

        if (
          typeof options.onStateChange ===
            'function'
        ) {

          options.onStateChange(
            {
              minimized,
              maximized,
              rect:
                getRect()
            },
            root
          );

        }

      };

    const rememberRect =
      () => {

        if (
          !minimized &&
          !maximized
        ) {

          restoreRect =
            getRect();

        }

      };

    const restore =
      () => {

        const previous =
          restoreRect;

        minimized = false;
        maximized = false;

        root.classList.remove(
          'us-floating-window-minimized',
          'us-floating-window-maximized'
        );

        if (previous) {

          const nextSize =
            clampSize(
              previous.width,
              previous.height
            );

          root.style.width =
            String(
              nextSize.width
            ) +
            'px';

          root.style.height =
            String(
              nextSize.height
            ) +
            'px';

          setPosition(
            previous.left,
            previous.top
          );

        }

        if (maximizeButton) {

          maximizeButton.title =
            'Maximize';

          maximizeButton.setAttribute(
            'aria-label',
            'Maximize'
          );

          maximizeButton.querySelector(
            'svg'
          )?.replaceWith(
            icon(
              'FULLSCREEN'
            )
          );

        }

        notifyState();

        return root;

      };

    const minimize =
      () => {

        if (minimized) {
          return restore();
        }

        rememberRect();

        if (maximized) {

          maximized = false;

          root.classList.remove(
            'us-floating-window-maximized'
          );

        }

        minimized = true;

        root.classList.add(
          'us-floating-window-minimized'
        );

        notifyState();

        return root;

      };

    const maximize =
      () => {

        if (maximized) {
          return restore();
        }

        rememberRect();

        minimized = false;
        maximized = true;

        root.classList.remove(
          'us-floating-window-minimized'
        );

        root.classList.add(
          'us-floating-window-maximized'
        );

        root.style.left =
          '8px';

        root.style.top =
          '8px';

        root.style.right =
          'auto';

        root.style.bottom =
          'auto';

        root.style.width =
          String(
            Math.max(
              1,
              global.innerWidth -
                16
            )
          ) +
          'px';

        root.style.height =
          String(
            Math.max(
              1,
              global.innerHeight -
                16
            )
          ) +
          'px';

        if (maximizeButton) {

          maximizeButton.title =
            'Restore';

          maximizeButton.setAttribute(
            'aria-label',
            'Restore'
          );

          maximizeButton.querySelector(
            'svg'
          )?.replaceWith(
            icon(
              'RESTORE'
            )
          );

        }

        notifyState();

        return root;

      };

    const onPointerMove =
      (event) => {

        if (!drag) {
          return;
        }

        setPosition(
          drag.left +
            event.clientX -
            drag.x,
          drag.top +
            event.clientY -
            drag.y
        );

      };

    const endDrag =
      () => {

        if (!drag) {
          return;
        }

        drag = null;

        root.classList.remove(
          'us-floating-window-dragging'
        );

        global.removeEventListener(
          'pointermove',
          onPointerMove
        );

        global.removeEventListener(
          'pointerup',
          endDrag
        );

        global.removeEventListener(
          'pointercancel',
          endDrag
        );

        if (
          typeof options.onMove ===
            'function'
        ) {

          const rect =
            getRect();

          options.onMove(
            {
              left:
                rect.left,
              top:
                rect.top
            },
            root
          );

        }

      };

    const onResizeMove =
      (event) => {

        if (!resize) {
          return;
        }

        setSize(
          resize.width +
            event.clientX -
            resize.x,
          resize.height +
            event.clientY -
            resize.y
        );

      };

    const endResize =
      () => {

        if (!resize) {
          return;
        }

        resize = null;

        root.classList.remove(
          'us-floating-window-resizing'
        );

        global.removeEventListener(
          'pointermove',
          onResizeMove
        );

        global.removeEventListener(
          'pointerup',
          endResize
        );

        global.removeEventListener(
          'pointercancel',
          endResize
        );

        options.onResize?.(
          root.getSize(),
          root
        );

      };

    header.addEventListener(
      'pointerdown',
      (event) => {

        if (
          maximized ||
          minimized ||
          event.button !== 0 ||
          event.target.closest(
            'button, a, input, select, textarea'
          )
        ) {
          return;
        }

        const rect =
          getRect();

        drag = {
          x:
            event.clientX,
          y:
            event.clientY,
          left:
            rect.left,
          top:
            rect.top
        };

        root.classList.add(
          'us-floating-window-dragging'
        );

        global.addEventListener(
          'pointermove',
          onPointerMove
        );

        global.addEventListener(
          'pointerup',
          endDrag
        );

        global.addEventListener(
          'pointercancel',
          endDrag
        );

        event.preventDefault();

      }
    );

    header.addEventListener(
      'dblclick',
      (event) => {

        if (
          options.maximizable === false ||
          event.target.closest(
            'button, a, input, select, textarea'
          )
        ) {
          return;
        }

        maximize();

      }
    );

    resizeHandle?.addEventListener(
      'pointerdown',
      (event) => {

        if (
          event.button !== 0 ||
          maximized ||
          minimized
        ) {
          return;
        }

        const rect =
          getRect();

        restoreRect =
          rect;

        resize = {
          x:
            event.clientX,
          y:
            event.clientY,
          width:
            rect.width,
          height:
            rect.height
        };

        root.classList.add(
          'us-floating-window-resizing'
        );

        global.addEventListener(
          'pointermove',
          onResizeMove
        );

        global.addEventListener(
          'pointerup',
          endResize
        );

        global.addEventListener(
          'pointercancel',
          endResize
        );

        event.preventDefault();

      }
    );

    minimizeButton?.addEventListener(
      'click',
      minimize
    );

    maximizeButton?.addEventListener(
      'click',
      maximize
    );

    root.setPosition =
      setPosition;

    root.getPosition =
      () => {

        const rect =
          getRect();

        return {
          left:
            rect.left,
          top:
            rect.top
        };

      };

    root.setSize =
      setSize;

    root.getSize =
      () => {

        const rect =
          getRect();

        return {
          width:
            rect.width,
          height:
            rect.height
        };

      };

    root.minimize =
      minimize;

    root.maximize =
      maximize;

    root.restore =
      restore;

    root.toggleMaximize =
      maximize;

    root.fitToViewport =
      () => {

        if (maximized) {

          root.style.left =
            '8px';

          root.style.top =
            '8px';

          root.style.width =
            String(
              Math.max(
                1,
                global.innerWidth -
                  16
              )
            ) +
            'px';

          root.style.height =
            String(
              Math.max(
                1,
                global.innerHeight -
                  16
              )
            ) +
            'px';

          return;

        }

        const rect =
          getRect();

        if (!minimized) {

          setSize(
            rect.width,
            rect.height
          );

        }

        setPosition(
          rect.left,
          rect.top
        );

      };

    root.destroyInteractions =
      () => {

        endDrag();
        endResize();

      };

    Object.defineProperties(
      root,
      {
        minimized: {
          get:
            () => minimized
        },
        maximized: {
          get:
            () => maximized
        }
      }
    );

    return root;

  }


  function openDraggableWindow(options = {}) {

    const overlayRoot =
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

      surface.destroyInteractions?.();

      global.removeEventListener(
        'resize',
        onResize
      );

      if (
        options.closeOnEscape !== false
      ) {

        global.removeEventListener(
          'keydown',
          onKeyDown,
          true
        );

      }

      surface.remove();
      surface = null;

      if (
        typeof options.onClose === 'function'
      ) {
        options.onClose();
      }

    };

    surface =
      draggableWindow({
        ...options,
        onClose:
          close
      });

    const onResize =
      () => {

        if (!surface) {
          return;
        }

        surface.fitToViewport?.();

      };

    const onKeyDown =
      (event) => {

        if (
          event.key === 'Escape'
        ) {

          event.preventDefault();
          close();

        }

      };

    overlayRoot.appendChild(
      surface
    );

    const initialLeft =
      options.left ??
      Math.max(
        12,
        global.innerWidth -
          surface.getBoundingClientRect().width -
          24
      );

    const initialTop =
      options.top ??
      56;

    surface.setPosition(
      initialLeft,
      initialTop
    );

    global.addEventListener(
      'resize',
      onResize
    );

    if (
      options.closeOnEscape !== false
    ) {

      global.addEventListener(
        'keydown',
        onKeyDown,
        true
      );

    }

    requestAnimationFrame(
      () => surface?.focus()
    );

    return Object.freeze({

      get element() {
        return surface;
      },

      close,

      setPosition(
        left,
        top
      ) {

        surface?.setPosition(
          left,
          top
        );

      },

      getPosition() {

        return surface?.getPosition() ||
          null;

      },

      setSize(
        width,
        height
      ) {

        return surface?.setSize(
          width,
          height
        ) || null;

      },

      getSize() {

        return surface?.getSize() ||
          null;

      },

      minimize() {

        return surface?.minimize() ||
          null;

      },

      maximize() {

        return surface?.maximize() ||
          null;

      },

      restore() {

        return surface?.restore() ||
          null;

      },

      toggleMaximize() {

        return surface?.toggleMaximize() ||
          null;

      },

      get minimized() {
        return Boolean(
          surface?.minimized
        );
      },

      get maximized() {
        return Boolean(
          surface?.maximized
        );
      }

    });

  }
