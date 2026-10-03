  function uploadQueue(files = [], options = {}) {

    const items = [];
    const upload = options.upload;
    const concurrency = Math.max(1, Math.floor(Number(options.concurrency ?? 2) || 1));
    let running = null;

    const list = element('div', {
      className: 'us-upload-queue-list',
      attrs: { 'aria-live': 'polite' }
    });

    const summary = element('span', {
      className: 'us-upload-queue-summary'
    });

    const aggregate = progressBar(0, {
      label: options.aggregateLabel || 'Overall',
      max: 100
    });

    const startButton = button({
      icon: 'UPLOAD',
      label: options.startLabel || 'Start',
      size: 'xs',
      variant: 'primary'
    });

    const retryButton = button({
      icon: 'REFRESH',
      label: 'Retry failed',
      size: 'xs'
    });

    const cancelButton = button({
      icon: 'CLOSE',
      label: 'Cancel all',
      size: 'xs'
    });

    const root = element(
      'section',
      {
        className: [
          'us-upload-queue',
          options.className || ''
        ].filter(Boolean).join(' ')
      },
      options.title
        ? element('div', {
          className: 'us-upload-queue-title',
          text: options.title
        })
        : null,
      aggregate,
      list,
      element(
        'div',
        { className: 'us-upload-queue-footer' },
        summary,
        element(
          'div',
          { className: 'us-upload-queue-actions' },
          startButton,
          retryButton,
          cancelButton
        )
      )
    );

    const toneFor = (status) => ({
      success: 'SUCCESS',
      error: 'ERROR',
      uploading: 'INFO',
      cancelled: 'WARNING'
    }[status] || 'NEUTRAL');

    const labelFor = (status) => ({
      success: 'Complete',
      error: 'Failed',
      uploading: 'Uploading',
      cancelled: 'Cancelled'
    }[status] || 'Queued');

    const sync = () => {

      const total = items.reduce(
        (sum, item) => sum + Math.max(1, item.total),
        0
      );

      const loaded = items.reduce(
        (sum, item) => sum + Math.min(item.loaded, Math.max(1, item.total)),
        0
      );

      const percentage = total
        ? (loaded / total) * 100
        : 0;

      aggregate.setValue(percentage);

      const counts = items.reduce((result, item) => {
        result[item.status] = (result[item.status] || 0) + 1;
        return result;
      }, {});

      summary.textContent =
        String(items.length) +
        ' file' +
        (items.length === 1 ? '' : 's') +
        ' · ' +
        String(counts.success || 0) +
        ' complete · ' +
        String(counts.error || 0) +
        ' failed';

      startButton.disabled =
        Boolean(running) ||
        !items.some((item) => item.status === 'queued');

      retryButton.disabled =
        !items.some((item) => item.status === 'error');

      cancelButton.disabled =
        !items.some(
          (item) =>
            item.status === 'queued' ||
            item.status === 'uploading'
        );

      if (typeof options.onChange === 'function') {
        options.onChange(root.getState(), root);
      }

    };

    const updateItem = (item) => {

      item.statusNode.textContent = labelFor(item.status);
      item.statusNode.className = [
        'us-pill',
        toneClass(toneFor(item.status)),
        'us-upload-queue-status'
      ].join(' ');

      item.progress.setIndeterminate(
        item.status === 'uploading' &&
        !item.hasProgress
      );

      if (item.status !== 'uploading' || item.hasProgress) {
        item.progress.setValue(item.loaded);
      }

      item.cancelButton.hidden = item.status !== 'uploading';
      item.retryButton.hidden =
        item.status !== 'error' &&
        item.status !== 'cancelled';

      item.errorNode.hidden = !item.error;
      item.errorNode.textContent = item.error
        ? (item.error.message || String(item.error))
        : '';

      item.row.classList.toggle(
        'us-upload-queue-item-active',
        item.status === 'uploading'
      );

      item.row.classList.toggle(
        'us-upload-queue-item-error',
        item.status === 'error'
      );

      sync();

    };

    const createItem = (file) => {

      const total = Math.max(1, Number(file?.size) || 1);
      const progress = progressBar(0, {
        max: total,
        compact: true
      });

      const statusNode = pill('Queued', 'NEUTRAL', {
        dot: false,
        className: 'us-upload-queue-status'
      });

      const errorNode = element('span', {
        className: 'us-upload-queue-error'
      });

      errorNode.hidden = true;

      const item = {
        file,
        status: 'queued',
        loaded: 0,
        total,
        hasProgress: false,
        error: null,
        result: null,
        abortController: null,
        progress,
        statusNode,
        errorNode,
        cancelButton: null,
        retryButton: null,
        row: null
      };

      const cancelItem = actionButton('CLOSE', {
        title: 'Cancel ' + (file?.name || 'upload')
      });

      const retryItem = actionButton('REFRESH', {
        title: 'Retry ' + (file?.name || 'upload')
      });

      cancelItem.addEventListener('click', () => {
        const index = items.indexOf(item);
        if (index >= 0) root.cancel(index);
      });

      retryItem.addEventListener('click', () => {
        const index = items.indexOf(item);
        if (index >= 0) root.retry(index, true);
      });

      item.cancelButton = cancelItem;
      item.retryButton = retryItem;

      item.row = element(
        'article',
        { className: 'us-upload-queue-item' },
        element(
          'div',
          { className: 'us-upload-queue-item-header' },
          element(
            'div',
            { className: 'us-upload-queue-item-copy' },
            element('strong', {
              className: 'us-upload-queue-item-name',
              text: file?.name || 'File'
            }),
            metaLine([
              file?.type || 'file',
              formatBytes(file?.size)
            ])
          ),
          statusNode,
          element(
            'div',
            { className: 'us-upload-queue-item-actions' },
            cancelItem,
            retryItem
          )
        ),
        progress,
        errorNode
      );

      return item;

    };

    const runItem = async (item) => {

      if (item.status !== 'queued') return;

      if (typeof upload !== 'function') {
        item.status = 'error';
        item.error = new Error(
          'uploadQueue requires options.upload(file, context)'
        );
        updateItem(item);
        return;
      }

      item.status = 'uploading';
      item.error = null;
      item.hasProgress = false;
      item.abortController = new AbortController();
      updateItem(item);

      const reportProgress = (
        loaded,
        total = item.total
      ) => {

        item.total = Math.max(1, Number(total) || item.total);
        item.loaded = Math.max(
          0,
          Math.min(item.total, Number(loaded) || 0)
        );
        item.hasProgress = true;
        updateItem(item);

        options.onItemProgress?.(
          item.file,
          {
            loaded: item.loaded,
            total: item.total,
            percentage: (item.loaded / item.total) * 100
          },
          items.indexOf(item)
        );

      };

      try {

        options.onItemStart?.(
          item.file,
          items.indexOf(item)
        );

        item.result = await upload(item.file, {
          signal: item.abortController.signal,
          reportProgress,
          index: items.indexOf(item),
          item
        });

        if (item.abortController.signal.aborted) {
          throw new DOMException('Upload cancelled', 'AbortError');
        }

        item.loaded = item.total;
        item.hasProgress = true;
        item.status = 'success';
        updateItem(item);

        options.onItemComplete?.(
          item.file,
          item.result,
          items.indexOf(item)
        );

      } catch (error) {

        if (
          error?.name === 'AbortError' ||
          item.abortController?.signal.aborted
        ) {
          item.status = 'cancelled';
        } else {
          item.status = 'error';
          item.error = error;
        }

        updateItem(item);

        if (item.status === 'error') {
          options.onItemError?.(
            item.file,
            error,
            items.indexOf(item)
          );
        }

      } finally {

        item.abortController = null;

      }

    };

    root.addFiles = (incoming = []) => {

      for (const file of Array.from(incoming || [])) {
        const item = createItem(file);
        items.push(item);
        list.appendChild(item.row);
        updateItem(item);
      }

      if (options.autoStart && !running) {
        root.start();
      }

      return root;

    };

    root.start = async () => {

      if (running) return running;

      const pending = items.filter(
        (item) => item.status === 'queued'
      );

      if (!pending.length) return root.getState();

      running = (async () => {

        let cursor = 0;

        const worker = async () => {
          while (cursor < pending.length) {
            const item = pending[cursor];
            cursor += 1;
            await runItem(item);
          }
        };

        await Promise.all(
          Array.from(
            {
              length: Math.min(
                concurrency,
                pending.length
              )
            },
            () => worker()
          )
        );

        const state = root.getState();
        options.onComplete?.(state, root);
        return state;

      })();

      sync();

      try {
        return await running;
      } finally {
        running = null;
        sync();
      }

    };

    root.cancel = (index) => {

      const item = items[index];
      if (!item) return false;

      if (item.status === 'uploading') {
        item.abortController?.abort();
        return true;
      }

      if (item.status === 'queued') {
        item.status = 'cancelled';
        updateItem(item);
        return true;
      }

      return false;

    };

    root.cancelAll = () => {
      items.forEach((item, index) => {
        if (
          item.status === 'queued' ||
          item.status === 'uploading'
        ) {
          root.cancel(index);
        }
      });
      return root;
    };

    root.retry = (
      index,
      startNow = false
    ) => {

      const item = items[index];

      if (
        !item ||
        (
          item.status !== 'error' &&
          item.status !== 'cancelled'
        )
      ) {
        return false;
      }

      item.status = 'queued';
      item.error = null;
      item.loaded = 0;
      item.hasProgress = false;
      updateItem(item);

      if (startNow) root.start();
      return true;

    };

    root.retryFailed = (
      startNow = false
    ) => {

      items.forEach((item, index) => {
        if (item.status === 'error') {
          root.retry(index, false);
        }
      });

      if (startNow) root.start();
      return root;

    };

    root.getState = () =>
      items.map((item, index) => ({
        index,
        file: item.file,
        status: item.status,
        loaded: item.loaded,
        total: item.total,
        error: item.error,
        result: item.result
      }));

    startButton.addEventListener(
      'click',
      () => root.start()
    );

    retryButton.addEventListener(
      'click',
      () => root.retryFailed(true)
    );

    cancelButton.addEventListener(
      'click',
      () => root.cancelAll()
    );

    root.addFiles(files);
    sync();

    return root;

  }
