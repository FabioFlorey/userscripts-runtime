  const ASSET_SELECTION_STATE = new WeakMap();

  function assetItem(item = {}, index = 0, options = {}) {

    const type =
      String(
        item.type ||
        'file'
      ).toLowerCase();

    const selected =
      Boolean(
        item &&
        typeof item === 'object' &&
        ASSET_SELECTION_STATE.has(item)
          ? ASSET_SELECTION_STATE.get(item)
          : item.selected
      );

    const checkbox =
      inputControl({
        type:
          'checkbox',
        checked:
          selected,
        ariaLabel:
          `Select ${item.name || `asset ${index + 1}`}`
      });

    checkbox.className =
      'us-asset-select';

    const preview =
      element(
        typeof options.onActivate === 'function'
          ? 'button'
          : 'div',
        {
          className: [
            'us-asset-preview',
            typeof options.onActivate === 'function'
              ? 'us-asset-preview-button'
              : ''
          ].filter(Boolean).join(' '),
          attrs:
            typeof options.onActivate === 'function'
              ? {
                type:
                  'button',
                'aria-label':
                  `Open ${item.name || `asset ${index + 1}`}`
              }
              : null
        }
      );

    if (
      type === 'video' &&
      item.previewUrl
    ) {

      preview.appendChild(
        element(
          'video',
          {
            className:
              'us-asset-preview-video',
            attrs: {
              src:
                item.previewUrl,
              poster:
                item.thumbnail,
              muted:
                true,
              playsinline:
                true,
              preload:
                item.preload ||
                'metadata'
            }
          }
        )
      );

    } else if (
      item.thumbnail ||
      (
        type === 'image' &&
        item.url
      )
    ) {

      preview.appendChild(
        element(
          'img',
          {
            className:
              'us-asset-preview-image',
            attrs: {
              src:
                item.thumbnail ||
                item.url,
              alt:
                item.alt ||
                ''
            }
          }
        )
      );

    } else {

      preview.appendChild(
        element(
          'span',
          {
            className:
              'us-asset-preview-placeholder'
          },
          icon(
            type === 'video'
              ? 'MEDIA'
              : type === 'image'
                ? 'IMAGE'
                : 'FILE'
          )
        )
      );

    }

    if (type === 'video') {

      preview.appendChild(
        element(
          'span',
          {
            className:
              'us-asset-type-icon',
            title:
              'Video'
          },
          icon(
            'PLAY'
          )
        )
      );

    }

    const actions = [];

    if (
      item.url &&
      options.open !== false
    ) {

      actions.push(
        actionButton(
          'OPEN',
          {
            title:
              'Open asset',
            onClick: (event) => {

              event.stopPropagation();

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

            }
          }
        )
      );

    }

    if (
      item.url &&
      options.download !== false
    ) {

      actions.push(
        actionButton(
          'DOWNLOAD',
          {
            title:
              'Download asset',
            onClick: (event) => {

              event.stopPropagation();

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

            }
          }
        )
      );

    }

    for (
      const actionItem of
      item.actions || []
    ) {

      actions.push(
        actionItem instanceof Node
          ? actionItem
          : actionButton(
            actionItem
          )
      );

    }

    const root =
      element(
        'article',
        {
          className:
            'us-asset-item',
          dataset: {
            index
          },
          attrs: {
            'aria-label':
              item.name ||
              `asset ${index + 1}`
          }
        },
        options.selectable === false
          ? null
          : element(
            'label',
            {
              className:
                'us-asset-select-wrap',
              title:
                'Select asset'
            },
            checkbox
          ),
        preview,
        element(
          'div',
          {
            className:
              'us-asset-item-body'
          },
          element(
            'span',
            {
              className:
                'us-asset-item-name',
              text:
                item.name ||
                `${type} ${index + 1}`
            }
          ),
          metaLine(
            [
              type,
              ...(
                Array.isArray(item.meta)
                  ? item.meta
                  : item.meta
                    ? [item.meta]
                    : []
              )
            ].filter(Boolean)
          )
        ),
        actions.length
          ? element(
            'div',
            {
              className:
                'us-asset-item-actions'
            },
            actions
          )
          : null
      );

    root.getSelected =
      () => checkbox.checked;

    root.setSelected =
      (next) => {

        const value =
          Boolean(next);

        checkbox.checked =
          value;

        if (
          item &&
          typeof item === 'object'
        ) {
          item.selected =
            value;

          ASSET_SELECTION_STATE.set(
            item,
            value
          );
        }

      };

    checkbox.addEventListener(
      'change',
      () => {

        if (
          item &&
          typeof item === 'object'
        ) {
          item.selected =
            checkbox.checked;

          ASSET_SELECTION_STATE.set(
            item,
            checkbox.checked
          );
        }

        if (
          typeof options.onSelectionChange === 'function'
        ) {

          options.onSelectionChange(
            checkbox.checked,
            item,
            index,
            root
          );

        }

      }
    );

    if (
      typeof options.onActivate === 'function'
    ) {

      preview.addEventListener(
        'click',
        () => {

          options.onActivate(
            item,
            index,
            root
          );

        }
      );

    }

    return root;

  }

  function assetTray(items = [], options = {}) {

    const normalizedItems =
      Array.from(
        items || []
      );

    const grid =
      element(
        'div',
        {
          className:
            'us-asset-grid'
        }
      );

    const root =
      element(
        'section',
        {
          className: [
            'us-asset-tray',
            options.className || ''
          ].filter(Boolean).join(' '),
          attrs: {
            'aria-label':
              options.ariaLabel ||
              options.title ||
              'Assets',
            'data-pinned':
              options.pinned
                ? 'true'
                : 'false'
          }
        }
      );

    const itemNodes = [];

    const syncSelection = () => {

      const selected =
        root.getSelected();

      if (countNode) {

        countNode.textContent =
          selected.length
            ? `${selected.length}/${normalizedItems.length}`
            : String(
              normalizedItems.length
            );

      }

      if (selectAllButton) {

        const allSelected =
          normalizedItems.length > 0 &&
          selected.length ===
            normalizedItems.length;

        selectAllButton.textContent =
          allSelected
            ? 'Clear all'
            : 'Select all';

      }

      if (
        typeof options.onSelectionChange === 'function'
      ) {

        options.onSelectionChange(
          selected,
          root
        );

      }

    };

    const countNode =
      pill(
        String(
          normalizedItems.length
        ),
        'PAGE',
        {
          dot:
            false
        }
      );

    const headerActions = [];

    if (
      typeof options.onTogglePin === 'function'
    ) {

      headerActions.push(
        button({
          icon:
            options.pinned
              ? 'UNPIN'
              : 'PIN',
          label:
            options.pinned
              ? 'Unpin'
              : 'Pin',
          size:
            'xs',
          variant:
            options.pinned
              ? 'primary'
              : null,
          className:
            'us-asset-pin-button',
          ariaLabel:
            options.pinned
              ? 'Unpin asset tray'
              : 'Pin asset tray',
          onClick: () => {

            options.onTogglePin(
              !options.pinned,
              root
            );

          }
        })
      );

    }

    let selectAllButton = null;

    if (
      typeof options.onDownloadSelected === 'function'
    ) {

      headerActions.push(
        actionButton(
          'DOWNLOAD',
          {
            title:
              'Download selected',
            onClick: () => {

              options.onDownloadSelected(
                root.getSelected(),
                root
              );

            }
          }
        )
      );

    }

    if (
      options.selectable !== false &&
      normalizedItems.length > 1
    ) {

      selectAllButton =
        button({
          label:
            'Select all',
          size:
            'xs',
          onClick: () => {

            const shouldSelect =
              root.getSelected().length !==
              normalizedItems.length;

            for (
              const node of
              itemNodes
            ) {

              node.setSelected(
                shouldSelect
              );

            }

            syncSelection();

          }
        });

      selectAllButton.classList.add(
        'us-asset-select-all'
      );

      headerActions.push(
        selectAllButton
      );

    }

    root.appendChild(
      element(
        'header',
        {
          className:
            'us-asset-tray-header'
        },
        element(
          'div',
          {
            className:
              'us-asset-tray-title'
          },
          options.icon
            ? icon(
              options.icon
            )
            : icon(
              'IMAGE'
            ),
          element(
            'span',
            {
              text:
                options.title ||
                'Assets'
            }
          ),
          countNode,
          options.pinned
            ? pill(
              'PINNED',
              'ACCENT',
              {
                dot:
                  false
              }
            )
            : null
        ),
        headerActions.length
          ? element(
            'div',
            {
              className:
                'us-asset-tray-actions'
            },
            headerActions
          )
          : null
      )
    );

    for (
      const [index, item] of
      normalizedItems.entries()
    ) {

      const node =
        assetItem(
          item,
          index,
          {
            ...options,
            onSelectionChange: () => {
              syncSelection();
            }
          }
        );

      itemNodes.push(
        node
      );

      grid.appendChild(
        node
      );

    }

    root.appendChild(
      grid
    );

    if (!normalizedItems.length) {

      root.appendChild(
        element(
          'div',
          {
            className:
              'us-asset-empty'
          },
          icon(
            'IMAGE'
          ),
          element(
            'span',
            {
              text:
                options.emptyText ||
                'No assets'
            }
          )
        )
      );

    }

    root.getSelected =
      () => itemNodes
        .map(
          (node, index) => ({
            node,
            item:
              normalizedItems[index]
          })
        )
        .filter(
          ({ node }) => node.getSelected()
        )
        .map(
          ({ item }) => item
        );

    return root;

  }
