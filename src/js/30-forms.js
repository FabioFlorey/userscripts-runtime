  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ FORM COMPONENTS                                                             │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function inputControl(options = {}) {

    const type =
      options.type ||
      'text';

    const node =
      element(
        'input',
        {
          className: [
            'us-input',
            options.size === 'xs'
              ? 'us-input-xs'
              : '',
            options.mono
              ? 'us-input-mono'
              : '',
            type === 'date'
              ? 'us-input-date'
              : '',
            options.tone
              ? toneClass(options.tone)
              : '',
            options.className || ''
          ].filter(Boolean).join(' '),
          attrs: {
            type,
            name:
              options.name,
            id:
              options.id,
            placeholder:
              options.placeholder,
            min:
              options.min,
            max:
              options.max,
            step:
              options.step,
            pattern:
              options.pattern,
            inputmode:
              options.inputMode,
            autocomplete:
              options.autocomplete,
            accept:
              options.accept,
            capture:
              options.capture,
            webkitdirectory:
              options.directory,
            multiple:
              options.multiple,
            readonly:
              options.readOnly,
            disabled:
              options.disabled,
            required:
              options.required,
            list:
              options.list,
            'aria-label':
              options.ariaLabel
          },
          on:
            options.on
        }
      );

    if (options.value != null) {
      node.value = String(options.value);
    }

    if (options.checked != null) {
      node.checked = Boolean(options.checked);
    }

    if (typeof options.onInput === 'function') {

      node.addEventListener(
        'input',
        (event) => {
          options.onInput(
            event,
            node
          );
        }
      );

    }

    if (typeof options.onChange === 'function') {

      node.addEventListener(
        'change',
        (event) => {
          options.onChange(
            event,
            node
          );
        }
      );

    }

    return node;

  }

  function textareaControl(options = {}) {

    const node =
      element(
        'textarea',
        {
          className: [
            'us-textarea',
            options.mono
              ? 'us-input-mono'
              : '',
            options.tone
              ? toneClass(options.tone)
              : '',
            options.className || ''
          ].filter(Boolean).join(' '),
          attrs: {
            name:
              options.name,
            id:
              options.id,
            placeholder:
              options.placeholder,
            rows:
              options.rows,
            cols:
              options.cols,
            maxlength:
              options.maxLength,
            readonly:
              options.readOnly,
            disabled:
              options.disabled,
            required:
              options.required,
            'aria-label':
              options.ariaLabel
          },
          on:
            options.on
        }
      );

    if (options.value != null) {
      node.value = String(options.value);
    }

    if (typeof options.onInput === 'function') {

      node.addEventListener(
        'input',
        (event) => {
          options.onInput(
            event,
            node
          );
        }
      );

    }

    if (typeof options.onChange === 'function') {

      node.addEventListener(
        'change',
        (event) => {
          options.onChange(
            event,
            node
          );
        }
      );

    }

    return node;

  }

  function selectControl(options = {}) {

    const node =
      element(
        'select',
        {
          className: [
            'us-select',
            options.size === 'xs'
              ? 'us-select-xs'
              : '',
            options.mono
              ? 'us-input-mono'
              : '',
            options.tone
              ? toneClass(options.tone)
              : '',
            options.className || ''
          ].filter(Boolean).join(' '),
          attrs: {
            name:
              options.name,
            id:
              options.id,
            multiple:
              options.multiple,
            disabled:
              options.disabled,
            required:
              options.required,
            size:
              options.visibleRows,
            'aria-label':
              options.ariaLabel
          }
        }
      );

    const selectedValues =
      new Set(
        Array.isArray(options.value)
          ? options.value.map(String)
          : options.value != null
            ? [String(options.value)]
            : []
      );

    for (const item of options.options || []) {

      const normalized =
        Array.isArray(item)
          ? {
            value:
              item[0],
            label:
              item[1]
          }
          : item;

      const option =
        element(
          'option',
          {
            text:
              normalized.label ??
              normalized.value,
            attrs: {
              value:
                normalized.value,
              disabled:
                normalized.disabled
            }
          }
        );

      if (
        selectedValues.has(
          String(normalized.value)
        )
      ) {
        option.selected = true;
      }

      node.appendChild(
        option
      );

    }

    if (typeof options.onChange === 'function') {

      node.addEventListener(
        'change',
        (event) => {
          options.onChange(
            event,
            node
          );
        }
      );

    }

    return node;

  }

  function choiceControl(options = {}) {

    const input =
      inputControl({
        type:
          options.type === 'radio'
            ? 'radio'
            : 'checkbox',
        name:
          options.name,
        value:
          options.value,
        checked:
          options.checked,
        disabled:
          options.disabled,
        ariaLabel:
          options.ariaLabel ||
          options.label,
        onChange:
          options.onChange
      });

    input.className =
      '';

    return element(
      'label',
      {
        className: [
          'us-choice',
          options.className || ''
        ].filter(Boolean).join(' ')
      },
      input,
      element(
        'span',
        {
          className:
            'us-choice-copy'
        },
        element(
          'span',
          {
            text:
              options.label ||
              ''
          }
        ),
        options.description
          ? element(
            'span',
            {
              className:
                'us-choice-description',
              text:
                options.description
            }
          )
          : null
      )
    );

  }

  function checkboxControl(options = {}) {

    return choiceControl({
      ...options,
      type:
        'checkbox'
    });

  }

  function radioControl(options = {}) {

    return choiceControl({
      ...options,
      type:
        'radio'
    });

  }

  function radioGroup(options = {}) {

    return element(
      'div',
      {
        className:
          'us-choice-group',
        attrs: {
          role:
            'radiogroup',
          'aria-label':
            options.ariaLabel ||
            options.label ||
            'Options'
        }
      },
      (options.items || []).map(
        (item) => radioControl({
          ...item,
          name:
            options.name,
          checked:
            item.value === options.value ||
            item.checked,
          onChange:
            options.onChange
        })
      )
    );

  }

  function inputGroup(options = {}) {

    return element(
      'div',
      {
        className: [
          'us-input-group',
          options.tone
            ? toneClass(options.tone)
            : '',
          options.className || ''
        ].filter(Boolean).join(' ')
      },
      options.prefix != null
        ? element(
          'span',
          {
            className:
              'us-input-affix us-input-prefix',
            text:
              options.prefix
          }
        )
        : null,
      options.control ||
        inputControl(
          options.input || {}
        ),
      options.suffix != null
        ? element(
          'span',
          {
            className:
              'us-input-affix us-input-suffix',
            text:
              options.suffix
          }
        )
        : null
    );

  }

  function utilityGroup(options = {}) {

    return element(
      'div',
      {
        className:
          'us-utility-group'
      },
      options.label
        ? element(
          'span',
          {
            className:
              'us-utility-label',
            text:
              options.label
          }
        )
        : null,
      options.children || []
    );

  }

  function utilityBar(options = {}) {

    return element(
      options.tagName || 'div',
      {
        className: [
          'us-utility-bar',
          options.fixed
            ? 'us-utility-bar-fixed'
            : '',
          options.className || ''
        ].filter(Boolean).join(' '),
        attrs: {
          role:
            options.role ||
            'toolbar',
          'aria-label':
            options.ariaLabel ||
            options.label ||
            'Userscript utility bar'
        }
      },
      options.children || []
    );

  }
