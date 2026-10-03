  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ FILES / PROGRESS / ASSET TRAYS                                               │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function formatBytes(bytes = 0) {

    const value =
      Number(bytes) || 0;

    if (value < 1024) {
      return `${value} B`;
    }

    const units = [
      'KB',
      'MB',
      'GB',
      'TB'
    ];

    let size =
      value / 1024;

    let unitIndex = 0;

    while (
      size >= 1024 &&
      unitIndex < units.length - 1
    ) {

      size /= 1024;
      unitIndex += 1;

    }

    return `${size.toFixed(
      size >= 10
        ? 1
        : 2
    )} ${units[unitIndex]}`;

  }

  function fileMatchesAccept(file, accept = '') {

    if (!accept) {
      return true;
    }

    const rules =
      String(accept)
        .split(',')
        .map(
          (rule) => rule.trim().toLowerCase()
        )
        .filter(Boolean);

    if (!rules.length) {
      return true;
    }

    const name =
      String(
        file?.name ||
        ''
      ).toLowerCase();

    const type =
      String(
        file?.type ||
        ''
      ).toLowerCase();

    return rules.some(
      (rule) => {

        if (rule.startsWith('.')) {
          return name.endsWith(rule);
        }

        if (rule.endsWith('/*')) {

          return type.startsWith(
            rule.slice(0, -1)
          );

        }

        return type === rule;

      }
    );

  }

  function progressBar(value = 0, options = {}) {

    const minimum =
      Number(
        options.min ??
        0
      );

    const maximum =
      Math.max(
        minimum + Number.EPSILON,
        Number(
          options.max ??
          100
        )
      );

    const clampValue =
      (nextValue) => Math.max(
        minimum,
        Math.min(
          maximum,
          Number(nextValue) || 0
        )
      );

    let currentValue =
      value == null
        ? null
        : clampValue(value);

    let indeterminate =
      Boolean(
        options.indeterminate ||
        value == null
      );

    const labelNode =
      element(
        'span',
        {
          className:
            'us-progress-label',
          text:
            options.label ||
            ''
        }
      );

    const valueNode =
      element(
        'span',
        {
          className:
            'us-progress-text'
        }
      );

    const fill =
      element(
        'span',
        {
          className:
            'us-progress-fill'
        }
      );

    const track =
      element(
        'div',
        {
          className:
            'us-progress-track',
          attrs: {
            role:
              'progressbar',
            'aria-label':
              options.ariaLabel ||
              options.label ||
              'Progress',
            'aria-valuemin':
              minimum,
            'aria-valuemax':
              maximum
          }
        },
        fill
      );

    const root =
      element(
        'div',
        {
          className: [
            'us-progress',
            toneClass(
              options.tone ||
              'ACCENT'
            ),
            options.compact
              ? 'us-progress-compact'
              : '',
            options.className || ''
          ].filter(Boolean).join(' ')
        },
        (
          options.label ||
          options.showValue !== false
        )
          ? element(
            'div',
            {
              className:
                'us-progress-header'
            },
            labelNode,
            valueNode
          )
          : null,
        track
      );

    const sync = () => {

      root.classList.toggle(
        'us-progress-indeterminate',
        indeterminate
      );

      if (indeterminate) {

        track.removeAttribute(
          'aria-valuenow'
        );

        valueNode.textContent =
          options.indeterminateLabel ||
          '…';

        fill.style.width =
          '';

        return;

      }

      track.setAttribute(
        'aria-valuenow',
        String(currentValue)
      );

      const percentage =
        (
          (
            currentValue -
            minimum
          ) /
          (
            maximum -
            minimum
          )
        ) * 100;

      fill.style.width =
        `${percentage}%`;

      valueNode.textContent =
        typeof options.formatValue === 'function'
          ? options.formatValue(
            currentValue,
            {
              min:
                minimum,
              max:
                maximum,
              percentage
            }
          )
          : `${Math.round(percentage)}%`;

    };

    root.setValue =
      (nextValue) => {

        currentValue =
          clampValue(
            nextValue
          );

        indeterminate = false;

        sync();

      };

    root.setIndeterminate =
      (next = true) => {

        indeterminate =
          Boolean(next);

        sync();

      };

    root.setLabel =
      (nextLabel) => {

        labelNode.textContent =
          nextLabel || '';

      };

    sync();

    return root;

  }

  function progressGroup(items = [], options = {}) {

    return element(
      'div',
      {
        className: [
          'us-progress-group',
          options.className || ''
        ].filter(Boolean).join(' ')
      },
      items.map(
        (item) => {

          if (
            item &&
            item.nodeType
          ) {
            return item;
          }

          return progressBar(
            item.value,
            item
          );

        }
      )
    );

  }

  function spinner(options = {}) {

    return element(
      'span',
      {
        className: [
          'us-spinner',
          toneClass(
            options.tone ||
            'ACCENT'
          ),
          options.className || ''
        ].filter(Boolean).join(' '),
        attrs: {
          role:
            'status',
          'aria-label':
            options.ariaLabel ||
            options.label ||
            'Loading'
        }
      },
      element(
        'span',
        {
          className:
            'us-visually-hidden',
          text:
            options.label ||
            'Loading'
        }
      )
    );

  }

  function skeleton(options = {}) {

    const variant =
      options.variant ||
      (
        options.lines
          ? 'text'
          : 'block'
      );

    const root =
      element(
        'div',
        {
          className: [
            'us-skeleton',
            `us-skeleton-${variant}`,
            options.className || ''
          ].filter(Boolean).join(' '),
          attrs: {
            'aria-hidden':
              'true'
          }
        }
      );

    if (options.width) {
      root.style.width =
        typeof options.width === 'number'
          ? `${options.width}px`
          : String(options.width);
    }

    if (options.height) {
      root.style.height =
        typeof options.height === 'number'
          ? `${options.height}px`
          : String(options.height);
    }

    if (variant === 'text') {

      const lines =
        Math.max(
          1,
          Number(options.lines) || 3
        );

      for (
        let index = 0;
        index < lines;
        index += 1
      ) {

        root.appendChild(
          element(
            'span',
            {
              className:
                'us-skeleton-line'
            }
          )
        );

      }

    } else if (variant === 'card') {

      root.append(
        element(
          'span',
          {
            className:
              'us-skeleton-card-media'
          }
        ),
        element(
          'span',
          {
            className:
              'us-skeleton-card-line'
          }
        ),
        element(
          'span',
          {
            className:
              'us-skeleton-card-line us-skeleton-card-line-short'
          }
        )
      );

    } else if (variant === 'table') {

      const rows =
        Math.max(
          1,
          Number(options.rows) || 4
        );

      const columns =
        Math.max(
          1,
          Number(options.columns) || 3
        );

      root.style.setProperty(
        '--us-skeleton-columns',
        String(columns)
      );

      for (
        let rowIndex = 0;
        rowIndex < rows;
        rowIndex += 1
      ) {

        const row =
          element(
            'span',
            {
              className:
                'us-skeleton-table-row'
            }
          );

        for (
          let columnIndex = 0;
          columnIndex < columns;
          columnIndex += 1
        ) {
          row.appendChild(
            element(
              'span',
              {
                className:
                  'us-skeleton-table-cell'
              }
            )
          );
        }

        root.appendChild(row);

      }

    }

    return root;

  }
