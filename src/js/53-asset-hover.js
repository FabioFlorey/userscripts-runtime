  function attachAssetHoverTray(
    target,
    itemsOrGetter,
    options = {}
  ) {

    if (!(target instanceof Element)) {
      return null;
    }

    const overlayRoot =
      options.root ||
      ensureOverlayRoot({
        theme:
          options.theme ||
          'dark'
      });

    const shell =
      element(
        'div',
        {
          className:
            'us-asset-hover'
        }
      );

    shell.hidden =
      true;

    overlayRoot.appendChild(
      shell
    );

    const pinTrigger =
      actionButton(
        'PIN_ELEMENT',
        {
          title:
            'Pin asset tray'
        }
      );

    pinTrigger.classList.add(
      'us-asset-pin-trigger'
    );

    pinTrigger.hidden =
      true;

    overlayRoot.appendChild(
      pinTrigger
    );

    let hideTimer = null;
    let currentTray = null;
    let carouselController = null;

    let pinned =
      Boolean(
        options.pinned
      );

    let targetActive = false;
    let shellActive = false;

    let pin = null;
    let unpin = null;

    const getItems =
      typeof itemsOrGetter === 'function'
        ? itemsOrGetter
        : () => itemsOrGetter;

    const update = () => {

      if (shell.hidden) {
        return;
      }

      const placement =
        options.placement ||
        'bottom';

      shell.dataset.placement =
        placement;

      shell.style.setProperty(
        '--us-hover-bridge',
        `${(
          Number(
            options.offset ??
            8
          ) || 0
        ) + 5}px`
      );

      positionFloating(
        target,
        shell,
        {
          placement,
          offset:
            options.offset ??
            8,
          viewportPadding:
            options.viewportPadding ??
            8
        }
      );

      const targetRect =
        target.getBoundingClientRect();

      pinTrigger.style.left =
        `${Math.max(
          8,
          Math.min(
            global.innerWidth - 43,
            targetRect.right - 39
          )
        )}px`;

      pinTrigger.style.top =
        `${Math.max(
          8,
          targetRect.top + 4
        )}px`;

    };

    const render = () => {

      const nextItems =
        getItems() ||
        [];

      const openCarousel =
        (
          item,
          index
        ) => {

          if (
            typeof options.onActivate === 'function'
          ) {

            options.onActivate(
              item,
              index,
              currentTray
            );

            return;

          }

          carouselController?.close();

          carouselController =
            openAssetCarousel(
              nextItems,
              {
                root:
                  overlayRoot,
                theme:
                  options.theme,
                index,
                onOpen:
                  options.onOpen,
                onDownload:
                  options.onDownload,
                onClose: () => {
                  carouselController = null;
                }
              }
            );

        };

      currentTray =
        assetTray(
          nextItems,
          {
            ...options,
            pinned,
            onActivate:
              openCarousel,
            onTogglePin:
              (nextPinned) => {

                if (nextPinned) {
                  pin();
                } else {
                  unpin();
                }

              }
          }
        );

      shell.replaceChildren(
        currentTray
      );

    };

    const cancelHide = () => {

      if (hideTimer) {

        global.clearTimeout(
          hideTimer
        );

        hideTimer = null;

      }

    };

    const syncPinTrigger = () => {

      pinTrigger.replaceChildren(
        icon(
          pinned
            ? 'UNPIN'
            : 'PIN'
        )
      );

      pinTrigger.title =
        pinned
          ? 'Unpin asset tray'
          : 'Pin asset tray';

      pinTrigger.setAttribute(
        'aria-label',
        pinTrigger.title
      );

      pinTrigger.classList.toggle(
        'us-asset-pin-trigger-active',
        pinned
      );

    };

    pin =
      () => {

        pinned = true;

        cancelHide();
        syncPinTrigger();

        show(false);
        render();

        if (
          typeof options.onPinChange === 'function'
        ) {

          options.onPinChange(
            true,
            shell
          );

        }

      };

    unpin =
      (
        hideImmediately = false
      ) => {

        pinned = false;

        cancelHide();
        syncPinTrigger();
        render();

        if (
          typeof options.onPinChange === 'function'
        ) {

          options.onPinChange(
            false,
            shell
          );

        }

        if (
          hideImmediately ||
          (
            !targetActive &&
            !shellActive &&
            !target.matches(':focus-within') &&
            !shell.matches(':focus-within')
          )
        ) {

          shell.hidden =
            true;

          pinTrigger.hidden =
            true;

          return;

        }

        hide();

      };

    const show = (
      refresh = true
    ) => {

      cancelHide();

      if (
        refresh ||
        shell.hidden ||
        !currentTray
      ) {
        render();
      }

      shell.hidden =
        false;

      pinTrigger.hidden =
        false;

      requestAnimationFrame(
        update
      );

    };

    const hide = () => {

      cancelHide();

      hideTimer =
        global.setTimeout(
          () => {

            const targetFocused =
              target.matches(
                ':focus-within'
              );

            const shellFocused =
              shell.matches(
                ':focus-within'
              );

            if (
              pinned ||
              targetActive ||
              shellActive ||
              targetFocused ||
              shellFocused
            ) {
              return;
            }

            shell.hidden =
              true;

            pinTrigger.hidden =
              true;

          },
          options.hideDelay ??
          360
        );

    };

    const targetEnter = () => {

      targetActive = true;
      show(true);

    };

    const targetLeave = () => {

      targetActive = false;
      hide();

    };

    const shellEnter = () => {

      shellActive = true;
      cancelHide();

    };

    const shellLeave = () => {

      shellActive = false;
      hide();

    };

    const targetFocusIn = () => {

      targetActive = true;
      show(true);

    };

    const targetFocusOut = () => {

      targetActive = false;
      hide();

    };

    const shellFocusIn = () => {

      shellActive = true;
      cancelHide();

    };

    const shellFocusOut = () => {

      shellActive = false;
      hide();

    };

    syncPinTrigger();

    target.addEventListener(
      'pointerenter',
      targetEnter
    );

    target.addEventListener(
      'pointerleave',
      targetLeave
    );

    target.addEventListener(
      'focusin',
      targetFocusIn
    );

    target.addEventListener(
      'focusout',
      targetFocusOut
    );

    shell.addEventListener(
      'pointerenter',
      shellEnter
    );

    shell.addEventListener(
      'pointerleave',
      shellLeave
    );

    shell.addEventListener(
      'focusin',
      shellFocusIn
    );

    shell.addEventListener(
      'focusout',
      shellFocusOut
    );

    pinTrigger.addEventListener(
      'pointerenter',
      cancelHide
    );

    pinTrigger.addEventListener(
      'pointerleave',
      hide
    );

    pinTrigger.addEventListener(
      'click',
      (event) => {

        event.preventDefault();
        event.stopPropagation();

        if (pinned) {
          unpin(false);
        } else {
          pin();
        }

      }
    );

    const onKeyDown =
      (event) => {

        if (
          event.key !== 'Escape'
        ) {
          return;
        }

        if (carouselController) {

          carouselController.close();
          carouselController = null;

          return;

        }

        if (
          !shell.hidden ||
          pinned
        ) {

          event.preventDefault();

          pinned = false;
          cancelHide();
          syncPinTrigger();

          shell.hidden =
            true;

          pinTrigger.hidden =
            true;

          if (
            typeof options.onPinChange === 'function'
          ) {

            options.onPinChange(
              false,
              shell
            );

          }

        }

      };

    global.addEventListener(
      'keydown',
      onKeyDown,
      true
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
        shell,

      get tray() {
        return currentTray;
      },

      get pinned() {
        return pinned;
      },

      show,

      hide,

      pin,

      unpin,

      togglePin() {

        if (pinned) {
          unpin(false);
        } else {
          pin();
        }

      },

      update,

      refresh() {

        render();

        if (!shell.hidden) {
          requestAnimationFrame(
            update
          );
        }

      },

      destroy() {

        if (hideTimer) {
          global.clearTimeout(
            hideTimer
          );
        }

        target.removeEventListener(
          'pointerenter',
          targetEnter
        );

        target.removeEventListener(
          'pointerleave',
          targetLeave
        );

        target.removeEventListener(
          'focusin',
          targetFocusIn
        );

        target.removeEventListener(
          'focusout',
          targetFocusOut
        );

        shell.removeEventListener(
          'pointerenter',
          shellEnter
        );

        shell.removeEventListener(
          'pointerleave',
          shellLeave
        );

        shell.removeEventListener(
          'focusin',
          shellFocusIn
        );

        shell.removeEventListener(
          'focusout',
          shellFocusOut
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

        global.removeEventListener(
          'keydown',
          onKeyDown,
          true
        );

        carouselController?.close();

        pinTrigger.removeEventListener(
          'pointerenter',
          cancelHide
        );

        pinTrigger.removeEventListener(
          'pointerleave',
          hide
        );

        pinTrigger.remove();
        shell.remove();

      }

    });

  }
