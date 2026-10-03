  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ SETTINGS COMPONENTS                                                         │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function rangeControl(options = {}) {

    const input =
      element(
        'input',
        {
          className: 'us-range',
          attrs: {
            type: 'range',
            min:
              options.min ?? 0,
            max:
              options.max ?? 100,
            step:
              options.step ?? 1,
            value:
              options.value ?? 50,
            'aria-label':
              options.ariaLabel ||
              options.label ||
              'Range'
          }
        }
      );

    const output =
      element(
        'output',
        {
          className:
            'us-range-value'
        }
      );

    const format =
      typeof options.format === 'function'
        ? options.format
        : (value) => {

          if (options.suffix) {
            return `${value}${options.suffix}`;
          }

          return String(value);

        };

    const update = () => {

      output.value =
        format(
          input.value
        );

      output.textContent =
        output.value;

      if (typeof options.onInput === 'function') {

        options.onInput(
          Number(input.value),
          input
        );

      }

    };

    input.addEventListener(
      'input',
      update
    );

    if (typeof options.onChange === 'function') {

      input.addEventListener(
        'change',
        () => {

          options.onChange(
            Number(input.value),
            input
          );

        }
      );

    }

    update();

    return element(
      'div',
      {
        className:
          'us-range-wrap'
      },
      input,
      output
    );

  }

  function switchControl(options = {}) {

    const input =
      element(
        'input',
        {
          className:
            'us-switch-input',
          attrs: {
            type: 'checkbox',
            'aria-label':
              options.ariaLabel ||
              options.label ||
              'Toggle'
          }
        }
      );

    input.checked =
      Boolean(
        options.checked
      );

    if (typeof options.onChange === 'function') {

      input.addEventListener(
        'change',
        () => {

          options.onChange(
            input.checked,
            input
          );

        }
      );

    }

    return element(
      'label',
      {
        className:
          'us-switch'
      },
      input,
      element(
        'span',
        {
          className:
            'us-switch-track'
        },
        element(
          'span',
          {
            className:
              'us-switch-thumb'
          }
        )
      )
    );

  }

  function segmentedControl(options = {}) {

    const root =
      element(
        'div',
        {
          className:
            'us-segmented',
          attrs: {
            role: 'group',
            'aria-label':
              options.ariaLabel ||
              options.label ||
              'Options'
          }
        }
      );

    let value =
      options.value ??
      options.items?.[0]?.value ??
      null;

    const buttons = [];

    const sync = () => {

      for (const item of buttons) {

        const active =
          item.dataset.value ===
          String(value);

        item.classList.toggle(
          'us-segmented-option-active',
          active
        );

        item.setAttribute(
          'aria-pressed',
          active
            ? 'true'
            : 'false'
        );

      }

    };

    for (const item of options.items || []) {

      const buttonNode =
        element(
          'button',
          {
            className:
              'us-segmented-option',
            text:
              item.label,
            attrs: {
              type: 'button'
            },
            dataset: {
              value:
                item.value
            },
            on: {
              click: () => {

                value =
                  item.value;

                sync();

                if (typeof options.onChange === 'function') {

                  options.onChange(
                    value,
                    root
                  );

                }

              }
            }
          }
        );

      buttons.push(
        buttonNode
      );

      root.appendChild(
        buttonNode
      );

    }

    sync();

    return root;

  }

  function settingRow(options = {}) {

    return element(
      'div',
      {
        className:
          'us-setting-row'
      },
      element(
        'div',
        {
          className:
            'us-setting-copy'
        },
        element(
          'div',
          {
            className:
              'us-setting-label',
            text:
              options.label ||
              ''
          }
        ),
        options.description
          ? element(
            'div',
            {
              className:
                'us-setting-description',
              text:
                options.description
            }
          )
          : null
      ),
      element(
        'div',
        {
          className:
            'us-setting-control'
        },
        options.control || null
      )
    );

  }

  function settingsGroup(options = {}) {

    return element(
      'section',
      {
        className:
          'us-settings-group'
      },
      options.title
        ? element(
          'div',
          {
            className:
              'us-settings-group-title',
            text:
              options.title
          }
        )
        : null,
      options.children || []
    );

  }
