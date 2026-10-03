  function assetCarousel(items = [], options = {}) {

    const normalizedItems =
      Array.from(
        items || []
      );

    let index =
      Math.max(
        0,
        Math.min(
          normalizedItems.length - 1,
          Number(
            options.index ??
            0
          ) || 0
        )
      );

    const stage =
      element(
        'div',
        {
          className:
            'us-asset-carousel-stage'
        }
      );

    const titleNode =
      element(
        'span',
        {
          className:
            'us-asset-carousel-title'
        }
      );

    const indexNode =
      pill(
        '',
        'PAGE',
        {
          dot:
            false
        }
      );

    const previous =
      actionButton(
        'BACK',
        {
          title:
            'Previous asset'
        }
      );

    const next =
      actionButton(
        'FORWARD',
        {
          title:
            'Next asset'
        }
      );

    const openButton =
      actionButton(
        'OPEN',
        {
          title:
            'Open asset'
        }
      );

    const downloadButton =
      actionButton(
        'DOWNLOAD',
        {
          title:
            'Download asset'
        }
      );

    const root =
      element(
        'section',
        {
          className:
            'us-asset-carousel',
          attrs: {
            role:
              'dialog',
            'aria-label':
              options.ariaLabel ||
              'Asset carousel',
            tabindex:
              -1
          }
        },
        element(
          'header',
          {
            className:
              'us-asset-carousel-header'
          },
          titleNode,
          indexNode,
          element(
            'div',
            {
              className:
                'us-spacer'
            }
          ),
          openButton,
          downloadButton,
          actionButton(
            'CLOSE',
            {
              title:
                'Close carousel',
              onClick: () => {

                if (
                  typeof options.onClose === 'function'
                ) {
                  options.onClose();
                }

              }
            }
          )
        ),
        stage,
        element(
          'footer',
          {
            className:
              'us-asset-carousel-footer'
          },
          previous,
          element(
            'div',
            {
              className:
                'us-asset-carousel-dots',
              attrs: {
                role:
                  'tablist',
                'aria-label':
                  'Asset positions'
              }
            }
          ),
          next
        )
      );

    const dots =
      root.querySelector(
        '.us-asset-carousel-dots'
      );

    const activateExternal =
      (item) => {

        if (!item?.url) {
          return;
        }

        if (
          typeof options.onOpen === 'function'
        ) {

          options.onOpen(
            item,
            index
          );

          return;

        }

        global.open(
          item.url,
          '_blank',
          'noopener'
        );

      };

    const downloadCurrent =
      (item) => {

        if (!item?.url) {
          return;
        }

        if (
          typeof options.onDownload === 'function'
        ) {

          options.onDownload(
            item,
            index
          );

          return;

        }

        const link =
          document.createElement(
            'a'
          );

        link.href =
          item.url;

        link.download =
          item.downloadName ||
          item.name ||
          '';

        link.rel =
          'noopener';

        link.click();

      };

    const render = () => {

      const item =
        normalizedItems[index];

      stage.replaceChildren();
      dots.replaceChildren();

      if (!item) {

        titleNode.textContent =
          'No assets';

        indexNode.textContent =
          '0/0';

        previous.disabled = true;
        next.disabled = true;
        openButton.disabled = true;
        downloadButton.disabled = true;

        stage.appendChild(
          element(
            'div',
            {
              className:
                'us-asset-carousel-empty',
              text:
                options.emptyText ||
                'No assets'
            }
          )
        );

        return;

      }

      titleNode.textContent =
        item.name ||
        `Asset ${index + 1}`;

      indexNode.textContent =
        `${index + 1}/${normalizedItems.length}`;

      const type =
        String(
          item.type ||
          'file'
        ).toLowerCase();

      if (
        type === 'video' &&
        (
          item.previewUrl ||
          (
            item.url &&
            !item.thumbnail
          )
        )
      ) {

        stage.appendChild(
          element(
            'video',
            {
              className:
                'us-asset-carousel-media',
              attrs: {
                src:
                  item.previewUrl ||
                  item.url,
                poster:
                  item.thumbnail,
                controls:
                  true,
                playsinline:
                  true,
                preload:
                  'metadata'
              }
            }
          )
        );

      } else if (
        (
          type === 'image' ||
          type === 'video'
        ) &&
        (
          item.url ||
          item.thumbnail
        )
      ) {

        stage.appendChild(
          element(
            'img',
            {
              className:
                'us-asset-carousel-media',
              attrs: {
                src:
                  item.url ||
                  item.thumbnail,
                alt:
                  item.alt ||
                  item.name ||
                  ''
              }
            }
          )
        );

      } else {

        stage.appendChild(
          element(
            'div',
            {
              className:
                'us-asset-carousel-placeholder'
            },
            icon(
              type === 'video'
                ? 'MEDIA'
                : type === 'image'
                  ? 'IMAGE'
                  : 'FILE'
            ),
            element(
              'span',
              {
                text:
                  item.name ||
                  'Asset'
              }
            )
          )
        );

      }

      previous.disabled =
        normalizedItems.length <= 1;

      next.disabled =
        normalizedItems.length <= 1;

      openButton.disabled =
        !item.url;

      downloadButton.disabled =
        !item.url;

      openButton.onclick =
        () => activateExternal(item);

      downloadButton.onclick =
        () => downloadCurrent(item);

      normalizedItems.forEach(
        (asset, dotIndex) => {

          const dot =
            element(
              'button',
              {
                className: [
                  'us-asset-carousel-dot',
                  dotIndex === index
                    ? 'us-asset-carousel-dot-active'
                    : ''
                ].filter(Boolean).join(' '),
                title:
                  asset.name ||
                  `Asset ${dotIndex + 1}`,
                attrs: {
                  type:
                    'button',
                  role:
                    'tab',
                  'aria-selected':
                    dotIndex === index
                      ? 'true'
                      : 'false',
                  'aria-label':
                    `Show asset ${dotIndex + 1}`
                },
                on: {
                  click: () => {

                    index =
                      dotIndex;

                    render();

                  }
                }
              }
            );

          dots.appendChild(
            dot
          );

        }
      );

      if (
        typeof options.onChange === 'function'
      ) {

        options.onChange(
          item,
          index,
          root
        );

      }

    };

    const move =
      (delta) => {

        if (
          normalizedItems.length <= 1
        ) {
          return;
        }

        index =
          (
            index +
            delta +
            normalizedItems.length
          ) %
          normalizedItems.length;

        render();

      };

    previous.addEventListener(
      'click',
      () => move(-1)
    );

    next.addEventListener(
      'click',
      () => move(1)
    );

    root.addEventListener(
      'keydown',
      (event) => {

        if (
          event.key === 'ArrowLeft'
        ) {

          event.preventDefault();
          move(-1);

        } else if (
          event.key === 'ArrowRight'
        ) {

          event.preventDefault();
          move(1);

        } else if (
          event.key === 'Escape' &&
          typeof options.onClose === 'function'
        ) {

          event.preventDefault();
          options.onClose();

        }

      }
    );

    root.getIndex =
      () => index;

    root.setIndex =
      (nextIndex) => {

        index =
          Math.max(
            0,
            Math.min(
              normalizedItems.length - 1,
              Number(nextIndex) || 0
            )
          );

        render();

      };

    render();

    return root;

  }

  function openAssetCarousel(items = [], options = {}) {

    const overlayRoot =
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

      if (
        options.restoreFocus !== false &&
        previousFocus?.isConnected
      ) {
        previousFocus.focus({
          preventScroll: true
        });
      }

      if (
        typeof options.onClose === 'function'
      ) {
        options.onClose();
      }

    };

    const carousel =
      assetCarousel(
        items,
        {
          ...options,
          onClose:
            close
        }
      );

    surface =
      element(
        'div',
        {
          className:
            'us-asset-carousel-backdrop'
        },
        carousel
      );

    const onKeyDown =
      (event) => {

        if (
          event.key === 'Escape'
        ) {

          event.preventDefault();
          close();
          return;

        }

        trapFocus(
          event,
          carousel
        );

      };

    surface.addEventListener(
      'pointerdown',
      (event) => {

        if (
          event.target === surface
        ) {
          close();
        }

      }
    );

    global.addEventListener(
      'keydown',
      onKeyDown,
      true
    );

    overlayRoot.appendChild(
      surface
    );

    focusInitial(
      carousel,
      options.initialFocus
    );

    return Object.freeze({

      element:
        surface,

      carousel,

      close

    });

  }
