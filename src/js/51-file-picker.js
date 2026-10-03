  function filePicker(options = {}) {

    let files = [];

    const input =
      inputControl({
        type:
          'file',
        accept:
          options.accept,
        capture:
          options.capture,
        directory:
          options.directory,
        multiple:
          options.directory
            ? true
            : options.multiple !== false,
        disabled:
          options.disabled,
        ariaLabel:
          options.ariaLabel ||
          options.label ||
          'Choose files'
      });

    input.classList.add(
      'us-file-picker-input'
    );

    const list =
      element(
        'div',
        {
          className:
            'us-file-picker-list',
          attrs: {
            'aria-live':
              'polite'
          }
        }
      );

    const summary =
      element(
        'span',
        {
          className:
            'us-file-picker-summary',
          text:
            options.emptyText ||
            'No files selected'
        }
      );

    const clearButton =
      actionButton(
        'CLOSE',
        {
          title:
            'Clear files'
        }
      );

    const footer =
      element(
        'div',
        {
          className:
            'us-file-picker-footer'
        },
        summary,
        clearButton
      );

    const browse =
      button({
        label:
          options.buttonLabel ||
          'Browse',
        size:
          'xs',
        variant:
          'primary'
      });

    const dropZone =
      element(
        'div',
        {
          className:
            'us-file-picker-drop',
          attrs: {
            role:
              'button',
            tabindex:
              options.disabled
                ? -1
                : 0,
            'aria-label':
              options.ariaLabel ||
              options.label ||
              'Choose or drop files'
          }
        },
        element(
          'span',
          {
            className:
              'us-file-picker-icon'
          },
          icon(
            'UPLOAD'
          )
        ),
        element(
          'div',
          {
            className:
              'us-file-picker-copy'
          },
          element(
            'strong',
            {
              text:
                options.label ||
                'Drop files here'
            }
          ),
          element(
            'span',
            {
              text:
                options.description ||
                (
                  options.accept
                    ? `Accepted: ${options.accept}`
                    : 'Choose files or drag them into this area.'
                )
            }
          )
        ),
        browse
      );

    const root =
      element(
        'section',
        {
          className: [
            'us-file-picker',
            options.disabled
              ? 'us-file-picker-disabled'
              : '',
            options.className || ''
          ].filter(Boolean).join(' ')
        },
        input,
        dropZone,
        list,
        footer
      );

    const notifyChange = () => {

      if (
        typeof options.onChange === 'function'
      ) {

        options.onChange(
          [...files],
          root
        );

      }

    };

    const render = () => {

      list.replaceChildren();

      for (
        const [index, file] of
        files.entries()
      ) {

        const type =
          String(
            file.type ||
            ''
          );

        const iconName =
          type.startsWith('image/')
            ? 'IMAGE'
            : type.startsWith('video/')
              ? 'MEDIA'
              : 'FILE';

        const removeButton =
          actionButton(
            'CLOSE',
            {
              title:
                `Remove ${file.name}`,
              onClick: () => {

                files.splice(
                  index,
                  1
                );

                render();
                notifyChange();

              }
            }
          );

        list.appendChild(
          element(
            'div',
            {
              className:
                'us-file-picker-item'
            },
            element(
              'span',
              {
                className:
                  'us-file-picker-item-icon'
              },
              icon(
                iconName
              )
            ),
            element(
              'div',
              {
                className:
                  'us-file-picker-item-main'
              },
              element(
                'span',
                {
                  className:
                    'us-file-picker-item-name',
                  text:
                    file.name ||
                    `File ${index + 1}`
                }
              ),
              metaLine([
                type ||
                'file',
                formatBytes(
                  file.size
                )
              ])
            ),
            removeButton
          )
        );

      }

      const totalBytes =
        files.reduce(
          (sum, file) => sum + (
            Number(file.size) || 0
          ),
          0
        );

      summary.textContent =
        files.length
          ? `${files.length} file${files.length === 1 ? '' : 's'} · ${formatBytes(totalBytes)}`
          : (
            options.emptyText ||
            'No files selected'
          );

      footer.hidden =
        files.length === 0;

    };

    const addFiles =
      (incoming) => {

        const next =
          Array.from(
            incoming || []
          );

        const accepted = [];
        const rejected = [];

        for (const file of next) {

          const tooLarge =
            options.maxSize != null &&
            Number(file.size) >
              Number(options.maxSize);

          const wrongType =
            !fileMatchesAccept(
              file,
              options.accept
            );

          if (
            tooLarge ||
            wrongType
          ) {

            rejected.push({
              file,
              reason:
                tooLarge
                  ? 'size'
                  : 'type'
            });

            continue;

          }

          accepted.push(file);

        }

        if (rejected.length) {

          if (
            typeof options.onReject === 'function'
          ) {

            options.onReject(
              rejected,
              root
            );

          }

        }

        if (!accepted.length) {
          return;
        }

        if (options.multiple === false) {

          files = [
            accepted[0]
          ];

        } else {

          files.push(
            ...accepted
          );

        }

        if (options.maxFiles != null) {

          files =
            files.slice(
              0,
              Math.max(
                0,
                Number(options.maxFiles) || 0
              )
            );

        }

        render();
        notifyChange();

      };

    const openPicker = () => {

      if (
        options.disabled
      ) {
        return;
      }

      input.click();

    };

    input.addEventListener(
      'change',
      () => {

        addFiles(
          input.files
        );

        input.value =
          '';

      }
    );

    browse.addEventListener(
      'click',
      (event) => {

        event.preventDefault();
        event.stopPropagation();

        openPicker();

      }
    );

    dropZone.addEventListener(
      'click',
      (event) => {

        if (
          event.target.closest(
            '.us-button'
          )
        ) {
          return;
        }

        openPicker();

      }
    );

    dropZone.addEventListener(
      'keydown',
      (event) => {

        if (
          event.key === 'Enter' ||
          event.key === ' '
        ) {

          event.preventDefault();
          openPicker();

        }

      }
    );

    dropZone.addEventListener(
      'dragenter',
      (event) => {

        event.preventDefault();

        dropZone.classList.add(
          'us-file-picker-drop-active'
        );

      }
    );

    dropZone.addEventListener(
      'dragover',
      (event) => {

        event.preventDefault();

        if (event.dataTransfer) {
          event.dataTransfer.dropEffect =
            'copy';
        }

      }
    );

    dropZone.addEventListener(
      'dragleave',
      (event) => {

        if (
          event.relatedTarget &&
          dropZone.contains(
            event.relatedTarget
          )
        ) {
          return;
        }

        dropZone.classList.remove(
          'us-file-picker-drop-active'
        );

      }
    );

    dropZone.addEventListener(
      'drop',
      (event) => {

        event.preventDefault();

        dropZone.classList.remove(
          'us-file-picker-drop-active'
        );

        addFiles(
          event.dataTransfer?.files
        );

      }
    );

    clearButton.addEventListener(
      'click',
      () => {

        files = [];

        render();
        notifyChange();

      }
    );

    root.getFiles =
      () => [...files];

    root.addFiles =
      addFiles;

    root.clear =
      () => {

        files = [];

        render();
        notifyChange();

      };

    render();

    return root;

  }
