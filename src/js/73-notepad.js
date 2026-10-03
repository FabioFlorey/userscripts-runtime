  function openNotepad(options = {}) {

    const storage =
      options.storage ||
      storageAdapter();

    const key =
      options.key ||
      'userscript:notepad';

    const textarea =
      textareaControl({
        className:
          'us-notepad-textarea',
        rows:
          options.rows ||
          12,
        placeholder:
          options.placeholder ||
          'Write notes here…',
        ariaLabel:
          options.ariaLabel ||
          'Notepad'
      });

    const statusNode =
      element(
        'span',
        {
          className:
            'us-notepad-status',
          text:
            'Loading…',
          attrs: {
            'aria-live':
              'polite'
          }
        }
      );

    const clearButton =
      button({
        label:
          'Clear',
        size:
          'xs'
      });

    let saveTimer = null;
    let closed = false;

    const save =
      async () => {

        if (closed) {
          return;
        }

        if (saveTimer) {

          global.clearTimeout(
            saveTimer
          );

          saveTimer = null;

        }

        statusNode.textContent =
          'Saving…';

        try {

          await storage.set(
            key,
            textarea.value
          );

          statusNode.textContent =
            'Saved';

          if (
            typeof options.onSave === 'function'
          ) {

            options.onSave(
              textarea.value
            );

          }

        } catch (error) {

          statusNode.textContent =
            'Save failed';

          if (
            typeof options.onError === 'function'
          ) {

            options.onError(
              error
            );

          }

        }

      };

    const scheduleSave =
      () => {

        if (saveTimer) {

          global.clearTimeout(
            saveTimer
          );

        }

        statusNode.textContent =
          'Unsaved';

        saveTimer =
          global.setTimeout(
            save,
            options.saveDelay ??
            350
          );

      };

    textarea.addEventListener(
      'input',
      scheduleSave
    );

    textarea.addEventListener(
      'keydown',
      (event) => {

        if (
          (
            event.ctrlKey ||
            event.metaKey
          ) &&
          event.key.toLowerCase() === 's'
        ) {

          event.preventDefault();
          save();

        }

      }
    );

    clearButton.addEventListener(
      'click',
      async () => {

        textarea.value =
          '';

        await save();

        textarea.focus();

      }
    );

    const controller =
      openDraggableWindow({
        root:
          options.root,
        theme:
          options.theme,
        title:
          options.title ||
          'Notepad',
        width:
          options.width ||
          460,
        height:
          options.height,
        left:
          options.left,
        top:
          options.top,
        closeOnEscape:
          options.closeOnEscape,
        className:
          'us-notepad-window',
        children: [
          textarea
        ],
        footer: [
          statusNode,
          element(
            'div',
            {
              className:
                'us-spacer'
            }
          ),
          clearButton,
          button({
            label:
              'Save',
            size:
              'xs',
            variant:
              'primary',
            onClick:
              save
          })
        ],
        onMove:
          (
            position,
            root
          ) => {

            if (
              options.persistPosition !== false
            ) {

              Promise.resolve(
                storage.set(
                  `${key}:position`,
                  position
                )
              ).catch(
                () => {}
              );

            }

            if (
              typeof options.onMove === 'function'
            ) {

              options.onMove(
                position,
                root
              );

            }

          },
        onClose: () => {

          if (saveTimer) {

            global.clearTimeout(
              saveTimer
            );

            saveTimer = null;

            Promise.resolve(
              storage.set(
                key,
                textarea.value
              )
            ).catch(
              () => {}
            );

          }

          closed = true;

          if (
            typeof options.onClose === 'function'
          ) {
            options.onClose();
          }

        }
      });

    const ready =
      Promise.all([
        Promise.resolve(
          storage.get(
            key,
            options.defaultValue ||
            ''
          )
        ),
        options.persistPosition === false
          ? Promise.resolve(null)
          : Promise.resolve(
            storage.get(
              `${key}:position`,
              null
            )
          )
      ])
        .then(
          (
            [
              value,
              position
            ]
          ) => {

            if (closed) {
              return;
            }

            textarea.value =
              String(
                value ??
                ''
              );

            if (
              position &&
              Number.isFinite(
                Number(position.left)
              ) &&
              Number.isFinite(
                Number(position.top)
              )
            ) {

              controller.setPosition(
                Number(position.left),
                Number(position.top)
              );

            }

            statusNode.textContent =
              'Saved';

          }
        )
        .catch(
          (error) => {

            if (closed) {
              return;
            }

            statusNode.textContent =
              'Load failed';

            if (
              typeof options.onError === 'function'
            ) {

              options.onError(
                error
              );

            }

          }
        );

    return Object.freeze({

      ...controller,

      textarea,

      storage,

      key,

      ready,

      save,

      getValue() {
        return textarea.value;
      },

      setValue(
        value,
        saveNow = true
      ) {

        textarea.value =
          String(
            value ??
            ''
          );

        if (saveNow) {
          return save();
        }

        statusNode.textContent =
          'Unsaved';

        return Promise.resolve();

      }

    });

  }
