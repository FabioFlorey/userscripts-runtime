  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ DATA COMPONENTS                                                             │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function metricStrip(metrics = []) {

    return element(
      'div',
      {
        className: 'us-metric-strip'
      },
      metrics.map((metric) => {

        const valueClasses = [
          'us-metric-value'
        ];

        if (metric.mono) {
          valueClasses.push(
            'us-metric-value-mono'
          );
        }

        return element(
          'div',
          {
            className: 'us-metric'
          },
          element(
            'div',
            {
              className: 'us-metric-label',
              text: metric.label
            }
          ),
          element(
            'div',
            {
              className: valueClasses.join(' ')
            },
            metric.value instanceof Node
              ? metric.value
              : String(metric.value ?? '')
          )
        );

      })
    );

  }

  function keyValueList(items = []) {

    const children = [];

    for (const item of items) {

      children.push(
        element(
          'div',
          {
            className: 'us-kv-key',
            text: item.label
          }
        )
      );

      children.push(
        element(
          'div',
          {
            className: [
              'us-kv-value',
              item.mono
                ? 'us-kv-value-mono'
                : ''
            ].filter(Boolean).join(' ')
          },
          item.value instanceof Node
            ? item.value
            : String(item.value ?? '')
        )
      );

    }

    return element(
      'div',
      {
        className: 'us-kv-list'
      },
      children
    );

  }

  function dataTable(options = {}) {

    const table =
      element(
        'table',
        {
          className: [
            'us-table',
            options.mono
              ? 'us-table-mono'
              : ''
          ].filter(Boolean).join(' ')
        }
      );

    const head =
      element(
        'thead',
        {}
      );

    const headerRow =
      element(
        'tr',
        {}
      );

    for (const column of options.columns || []) {

      headerRow.appendChild(
        element(
          'th',
          {
            text: column.label,
            attrs: column.width
              ? {
                style:
                  `width: ${column.width};`
              }
              : null
          }
        )
      );

    }

    head.appendChild(
      headerRow
    );

    table.appendChild(
      head
    );

    const body =
      element(
        'tbody',
        {}
      );

    for (const row of options.rows || []) {

      const tr =
        element(
          'tr',
          {}
        );

      for (const column of options.columns || []) {

        const value =
          row[column.key];

        tr.appendChild(
          element(
            'td',
            {},
            value instanceof Node
              ? value
              : String(value ?? '')
          )
        );

      }

      body.appendChild(
        tr
      );

    }

    table.appendChild(
      body
    );

    return element(
      'div',
      {
        className: 'us-table-wrap'
      },
      table
    );

  }

  function tabs(items = [], active = null, onChange = null) {

    return element(
      'div',
      {
        className: 'us-tabs',
        attrs: {
          role: 'tablist'
        }
      },
      items.map((item) => {

        const key =
          item.key ?? item.label;

        return element(
          'button',
          {
            className: [
              'us-tab',
              key === active
                ? 'us-tab-active'
                : ''
            ].filter(Boolean).join(' '),
            text: item.label,
            attrs: {
              type: 'button',
              role: 'tab',
              'aria-selected':
                key === active
                  ? 'true'
                  : 'false'
            },
            on: onChange
              ? {
                click: () => {
                  onChange(key);
                }
              }
              : null
          }
        );

      })
    );

  }

  function logList(entries = []) {

    return element(
      'div',
      {
        className: 'us-log-list'
      },
      entries.map((entry) => {

        return element(
          'div',
          {
            className: 'us-log-row'
          },
          element(
            'span',
            {
              className: 'us-log-time',
              text: entry.time || ''
            }
          ),
          element(
            'span',
            {
              className: 'us-log-kind',
              text: entry.kind || ''
            }
          ),
          element(
            'span',
            {
              className: 'us-log-message',
              text: entry.message || ''
            }
          )
        );

      })
    );

  }
