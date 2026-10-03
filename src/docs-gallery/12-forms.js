  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ COMPLETE INPUT GALLERY                                                       │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  const inputRoot =
    UI.createRoot({
      theme:
        THEME
    });

  inputRoot.classList.add(
    'input-gallery-root'
  );

  const inputGrid =
    UI.element(
      'div',
      {
        className:
          'input-catalog-grid'
      }
    );

  function addInputField(
    label,
    control,
    hint = null,
    className = ''
  ) {

    const wrapped =
      UI.field(
        label,
        control,
        {
          hint,
          className
        }
      );

    inputGrid.appendChild(
      wrapped
    );

    return wrapped;

  }

  addInputField(
    'Text',
    UI.inputControl({
      type:
        'text',
      placeholder:
        'plain text'
    })
  );

  addInputField(
    'Search',
    UI.inputControl({
      type:
        'search',
      placeholder:
        'search terms'
    })
  );

  addInputField(
    'Password',
    UI.inputControl({
      type:
        'password',
      value:
        'example-only'
    })
  );

  addInputField(
    'Email',
    UI.inputControl({
      type:
        'email',
      placeholder:
        'name@example.com'
    })
  );

  addInputField(
    'URL',
    UI.inputControl({
      type:
        'url',
      placeholder:
        'https://example.com',
      mono:
        true
    })
  );

  addInputField(
    'Telephone',
    UI.inputControl({
      type:
        'tel',
      placeholder:
        '+39 …'
    })
  );

  addInputField(
    'Number',
    UI.inputControl({
      type:
        'number',
      min:
        0,
      max:
        100,
      step:
        1,
      value:
        42
    })
  );

  addInputField(
    'Date',
    UI.inputControl({
      type:
        'date',
      value:
        '2026-10-03'
    })
  );

  addInputField(
    'Date & time',
    UI.inputControl({
      type:
        'datetime-local',
      value:
        '2026-10-03T14:30'
    })
  );

  addInputField(
    'Month',
    UI.inputControl({
      type:
        'month',
      value:
        '2026-10'
    })
  );

  addInputField(
    'Week',
    UI.inputControl({
      type:
        'week',
      value:
        '2026-W40'
    })
  );

  addInputField(
    'Time',
    UI.inputControl({
      type:
        'time',
      value:
        '14:30'
    })
  );

  addInputField(
    'Color',
    UI.inputControl({
      type:
        'color',
      value:
        '#62c49a',
      ariaLabel:
        'Accent color'
    }),
    'Native color picker.'
  );

  addInputField(
    'Range / slider',
    UI.rangeControl({
      min:
        0,
      max:
        100,
      step:
        1,
      value:
        64,
      suffix:
        '%',
      ariaLabel:
        'Example range'
    })
  );

  addInputField(
    'File',
    UI.inputControl({
      type:
        'file',
      accept:
        'image/*,.json',
      multiple:
        true,
      ariaLabel:
        'Choose files'
    }),
    'Supports accept and multiple.'
  );

  addInputField(
    'Single select',
    UI.selectControl({
      value:
        'auto',
      options: [
        ['auto', 'Auto'],
        ['strict', 'Strict'],
        ['relaxed', 'Relaxed']
      ]
    })
  );

  addInputField(
    'Multiple select',
    UI.selectControl({
      multiple:
        true,
      visibleRows:
        4,
      value: [
        'html',
        'json'
      ],
      options: [
        ['html', 'HTML'],
        ['json', 'JSON'],
        ['xml', 'XML'],
        ['text', 'Text']
      ]
    })
  );

  addInputField(
    'Checkboxes',
    UI.element(
      'div',
      {
        className:
          'us-choice-group'
      },
      UI.checkboxControl({
        label:
          'Observe',
        checked:
          true
      }),
      UI.checkboxControl({
        label:
          'Persist'
      })
    )
  );

  addInputField(
    'Radio group',
    UI.radioGroup({
      name:
        'gallery-mode',
      value:
        'auto',
      items: [
        {
          label:
            'Auto',
          value:
            'auto'
        },
        {
          label:
            'Manual',
          value:
            'manual'
        },
        {
          label:
            'Off',
          value:
            'off'
        }
      ]
    })
  );

  addInputField(
    'Switch',
    UI.switchControl({
      checked:
        true,
      ariaLabel:
        'Example switch'
    }),
    'Composed checkbox presentation.'
  );

  addInputField(
    'Segmented choice',
    UI.segmentedControl({
      value:
        'auto',
      items: [
        {
          label:
            'Auto',
          value:
            'auto'
        },
        {
          label:
            'On',
          value:
            'on'
        },
        {
          label:
            'Off',
          value:
            'off'
        }
      ]
    }),
    'Composed single-choice control.'
  );

  addInputField(
    'Textarea',
    UI.textareaControl({
      value:
        'Investigation notes…',
      rows:
        4
    }),
    null,
    'input-catalog-span-2'
  );

  const datalistId =
    'runtime-gallery-suggestions';

  const datalist =
    UI.element(
      'datalist',
      {
        id:
          datalistId
      },
      UI.element(
        'option',
        {
          attrs: {
            value:
              'github.com'
          }
        }
      ),
      UI.element(
        'option',
        {
          attrs: {
            value:
              'arxiv.org'
          }
        }
      ),
      UI.element(
        'option',
        {
          attrs: {
            value:
              'example.com'
          }
        }
      )
    );

  const datalistControl =
    UI.element(
      'div',
      {},
      UI.inputControl({
        type:
          'text',
        list:
          datalistId,
        placeholder:
          'type for suggestions'
      }),
      datalist
    );

  addInputField(
    'Datalist / autocomplete',
    datalistControl
  );

  addInputField(
    'Readonly',
    UI.inputControl({
      type:
        'text',
      value:
        'read-only value',
      readOnly:
        true
    })
  );

  addInputField(
    'Disabled',
    UI.inputControl({
      type:
        'text',
      value:
        'disabled value',
      disabled:
        true
    })
  );

  addInputField(
    'Prefixed operator',
    UI.inputGroup({
      prefix:
        'site:',
      control:
        UI.inputControl({
          type:
            'text',
          placeholder:
            'example.com',
          mono:
            true
        })
    }),
    'Useful for compact query/operator bars.'
  );

  addInputField(
    'Suffix / units',
    UI.inputGroup({
      suffix:
        'ms',
      control:
        UI.inputControl({
          type:
            'number',
          value:
            250,
          min:
            0
        })
    })
  );

  addInputField(
    'Prefix + suffix',
    UI.inputGroup({
      prefix:
        '±',
      suffix:
        '%',
      control:
        UI.inputControl({
          type:
            'number',
          value:
            10
        })
    })
  );

  const validationGrid =
    UI.element(
      'div',
      {
        className:
          'input-catalog-grid input-catalog-span-3'
      },

      UI.field(
        'Info state',
        UI.inputControl({
          value:
            'informational',
          tone:
            'INFO'
        })
      ),

      UI.field(
        'Success state',
        UI.inputControl({
          value:
            'valid',
          tone:
            'SUCCESS'
        })
      ),

      UI.field(
        'Warning state',
        UI.inputControl({
          value:
            'check this',
          tone:
            'WARNING'
        })
      ),

      UI.field(
        'Error state',
        UI.inputControl({
          value:
            'invalid',
          tone:
            'ERROR'
        })
      ),

      UI.field(
        'Critical state',
        UI.inputControl({
          value:
            'blocked',
          tone:
            'CRITICAL'
        })
      ),

      UI.field(
        'Input surface',
        UI.inputControl({
          value:
            'input tone',
          tone:
            'INPUT'
        })
      )

    );

  inputGrid.appendChild(
    validationGrid
  );

  inputRoot.appendChild(
    inputGrid
  );

  inputRoot.appendChild(
    UI.alertBox({
      tone:
        'TRACE',
      title:
        'Native input coverage',
      message:
        'Hidden inputs are intentionally not rendered; submit/reset/button-style inputs use the runtime button system instead.'
    })
  );

  document
    .getElementById(
      'input-gallery'
    )
    .appendChild(
      inputRoot
    );
