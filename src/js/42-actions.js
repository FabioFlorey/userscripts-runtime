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

      try {
        await navigator.clipboard.writeText(value);
        return;
      } catch {
        // Clipboard permission can be denied even on secure pages.
        // Fall back to the DOM copy path instead of failing the action.
      }

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

  async function imageBlobAsPng(source, options = {}) {

    let blob =
      await source;

    if (typeof blob === 'string') {

      const response =
        await fetch(
          blob,
          options.fetchOptions
        );

      if (!response.ok) {
        throw new Error(
          `Image fetch failed with HTTP ${response.status}.`
        );
      }

      blob =
        await response.blob();

    }
    else if (blob instanceof Response) {

      if (!blob.ok) {
        throw new Error(
          `Image response failed with HTTP ${blob.status}.`
        );
      }

      blob =
        await blob.blob();

    }

    if (!(blob instanceof Blob)) {
      throw new TypeError(
        'copyImage() requires an image URL, Response, Blob, or Promise resolving to one.'
      );
    }

    if (blob.type === 'image/png') {
      return blob;
    }

    const canvas =
      document.createElement(
        'canvas'
      );

    if (
      typeof createImageBitmap ===
      'function'
    ) {

      const bitmap =
        await createImageBitmap(blob);

      try {

        canvas.width =
          bitmap.width;

        canvas.height =
          bitmap.height;

        const context =
          canvas.getContext('2d');

        if (!context) {
          throw new Error(
            'Canvas 2D context is unavailable.'
          );
        }

        context.drawImage(
          bitmap,
          0,
          0
        );

      }
      finally {
        bitmap.close?.();
      }

    }
    else {

      const objectUrl =
        URL.createObjectURL(blob);

      try {

        const image =
          await new Promise(
            (resolve, reject) => {

              const node =
                new Image();

              node.onload =
                () => resolve(node);

              node.onerror =
                reject;

              node.src =
                objectUrl;

            }
          );

        canvas.width =
          image.naturalWidth;

        canvas.height =
          image.naturalHeight;

        const context =
          canvas.getContext('2d');

        if (!context) {
          throw new Error(
            'Canvas 2D context is unavailable.'
          );
        }

        context.drawImage(
          image,
          0,
          0
        );

      }
      finally {
        URL.revokeObjectURL(
          objectUrl
        );
      }

    }

    return new Promise(
      (resolve, reject) => {

        canvas.toBlob(
          (result) => {

            if (result) {
              resolve(result);
              return;
            }

            reject(
              new Error(
                'PNG conversion failed.'
              )
            );

          },
          'image/png'
        );

      }
    );

  }

  async function copyImage(source, options = {}) {

    if (
      !navigator.clipboard?.write ||
      typeof ClipboardItem ===
        'undefined'
    ) {
      throw new Error(
        'Image clipboard API is unavailable.'
      );
    }

    /*
     * ClipboardItem deliberately receives the unresolved Promise.
     * navigator.clipboard.write() is therefore invoked synchronously
     * during the originating click/keyboard gesture, while image fetch
     * and PNG conversion continue asynchronously. This preserves the
     * browser's transient user activation for remote images.
     */
    const pngPromise =
      imageBlobAsPng(
        source,
        options
      );

    const item =
      new ClipboardItem({
        'image/png':
          pngPromise
      });

    await navigator.clipboard.write([
      item
    ]);

    return true;

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
