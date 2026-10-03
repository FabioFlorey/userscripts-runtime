  function textSelectionToolbar(options = {}) {

    const colors =
      options.colors?.length
        ? options.colors
        : DEFAULT_HIGHLIGHT_COLORS;

    let activeColor =
      options.color ||
      (
        typeof colors[0] === 'string'
          ? colors[0]
          : colors[0]?.value
      ) ||
      '#ffe66d';

    const root =
      element(
        'div',
        {
          className: [
            'us-selection-toolbar',
            options.className || ''
          ].filter(Boolean).join(' '),
          attrs: {
            role:
              'toolbar',
            'aria-label':
              options.ariaLabel ||
              'Text selection tools'
          }
        }
      );

    const tools =
      element(
        'div',
        {
          className:
            'us-selection-tools'
        }
      );

    const tool =
      (
        iconName,
        label,
        onClick,
        extraClass = ''
      ) =>
        button({
          icon:
            iconName,
          label,
          size:
            'xs',
          className: [
            'us-selection-tool',
            extraClass
          ].filter(Boolean).join(' '),
          onClick
        });

    if (
      options.copy !== false
    ) {

      tools.appendChild(
        tool(
          'COPY',
          'Copy',
          options.onCopy
        )
      );

    }

    tools.appendChild(
      tool(
        'UNDERLINE',
        'Underline',
        options.onUnderline
      )
    );

    const highlightButton =
      tool(
        'HIGHLIGHT',
        'Highlight',
        () => {

          options.onHighlight?.(
            activeColor
          );

        },
        'us-selection-tool-highlight'
      );

    tools.appendChild(
      highlightButton
    );

    const colorButtons = [];

    const syncColors = () => {

      for (
        const entry of
        colorButtons
      ) {

        const active =
          entry.color ===
          activeColor;

        entry.node.classList.toggle(
          'us-selection-color-active',
          active
        );

        entry.node.setAttribute(
          'aria-pressed',
          String(active)
        );

      }

      highlightButton.style.setProperty(
        '--us-selection-active-color',
        activeColor
      );

    };

    for (
      const entry of
      colors
    ) {

      const color =
        typeof entry === 'string'
          ? entry
          : entry.value;

      const label =
        typeof entry === 'string'
          ? entry
          : (
            entry.name ||
            entry.label ||
            entry.value
          );

      const colorButton =
        element(
          'button',
          {
            className:
              'us-selection-tool us-selection-color',
            title:
              `Highlight ${label}`,
            attrs: {
              type:
                'button',
              'aria-label':
                `Highlight ${label}`,
              'aria-pressed':
                'false'
            },
            on: {
              click: () => {

                activeColor =
                  color;

                syncColors();

                if (
                  options.applyColorImmediately !==
                    false
                ) {

                  options.onHighlight?.(
                    color
                  );

                }

              }
            }
          },
          element(
            'span',
            {
              className:
                'us-selection-color-swatch',
              attrs: {
                'aria-hidden':
                  'true'
              },
              style: {
                backgroundColor:
                  color
              }
            }
          ),
          element(
            'span',
            {
              className:
                'us-selection-tool-label',
              text:
                label
            }
          )
        );

      colorButtons.push({
        color,
        node:
          colorButton
      });

      tools.appendChild(
        colorButton
      );

    }

    let noteComposer = null;
    let noteInput = null;

    if (
      options.note !== false
    ) {

      const noteButton =
        tool(
          'DOCUMENT',
          'Add note',
          () => {

            const open =
              noteComposer.hidden;

            noteComposer.hidden =
              !open;

            noteButton.setAttribute(
              'aria-expanded',
              String(open)
            );

            if (open) {

              requestAnimationFrame(
                () =>
                  noteInput.focus()
              );

            }

          },
          'us-selection-tool-note'
        );

      noteButton.setAttribute(
        'aria-expanded',
        'false'
      );

      tools.appendChild(
        noteButton
      );

      noteInput =
        textareaControl({
          className:
            'us-selection-note-input',
          rows:
            3,
          placeholder:
            options.notePlaceholder ||
            'Annotation note…',
          ariaLabel:
            'Annotation note'
        });

      const closeComposer =
        () => {

          noteComposer.hidden =
            true;

          noteButton.setAttribute(
            'aria-expanded',
            'false'
          );

        };

      const saveNote =
        () => {

          const note =
            noteInput.value.trim();

          if (!note) {
            return;
          }

          options.onNote?.(
            note
          );

          noteInput.value =
            '';

          closeComposer();

        };

      noteComposer =
        element(
          'div',
          {
            className:
              'us-selection-note-composer'
          },
          noteInput,
          element(
            'div',
            {
              className:
                'us-selection-note-actions'
            },
            button({
              label:
                'Cancel',
              size:
                'xs',
              onClick:
                closeComposer
            }),
            button({
              label:
                'Save note',
              size:
                'xs',
              variant:
                'primary',
              onClick:
                saveNote
            })
          )
        );

      noteComposer.hidden =
        true;

      noteInput.addEventListener(
        'keydown',
        (event) => {

          if (
            (
              event.ctrlKey ||
              event.metaKey
            ) &&
            event.key === 'Enter'
          ) {

            event.preventDefault();
            saveNote();

          } else if (
            event.key === 'Escape'
          ) {

            event.preventDefault();
            closeComposer();

          }

        }
      );

    }

    if (
      options.clear !== false
    ) {

      tools.appendChild(
        tool(
          'RESTORE',
          'Clear',
          options.onClear
        )
      );

    }

    root.appendChild(
      tools
    );

    if (noteComposer) {

      root.appendChild(
        noteComposer
      );

    }

    syncColors();

    return root;

  }

  function attachTextSelectionToolbar(options = {}) {

    const target =
      options.target ||
      document.body;

    if (!(target instanceof Element)) {
      return null;
    }

    const overlayRoot =
      options.root ||
      ensureOverlayRoot({
        theme:
          options.theme ||
          'dark'
      });

    let activeRange = null;
    let activeText = '';

    let enabled =
      options.enabled !== false;

    const finishAction = () => {

      if (
        options.clearSelectionAfterAction !== false
      ) {

        global.getSelection?.()
          ?.removeAllRanges();

      }

      hide();

    };

    const getUsableSelection =
      () => {

        const selection =
          global.getSelection?.();

        if (
          !selection ||
          selection.rangeCount === 0 ||
          selection.isCollapsed
        ) {
          return null;
        }

        const range =
          selection.getRangeAt(0);

        const container =
          range.commonAncestorContainer.nodeType ===
            Node.ELEMENT_NODE
            ? range.commonAncestorContainer
            : range.commonAncestorContainer.parentElement;

        if (
          !container ||
          !target.contains(container) ||
          container.closest(
            '[data-userscript-root]'
          ) ||
          (
            typeof options.exclude === 'string' &&
            container.closest(
              options.exclude
            )
          ) ||
          (
            typeof options.shouldIgnoreSelection === 'function' &&
            options.shouldIgnoreSelection(
              range,
              container
            )
          )
        ) {
          return null;
        }

        const text =
          selection.toString();

        if (!text.trim()) {
          return null;
        }

        return {
          range:
            range.cloneRange(),
          text
        };

      };

    const toolbar =
      textSelectionToolbar({
        ...options,
        onCopy: async () => {

          if (!activeText) {
            return;
          }

          await copyText(
            activeText
          );

          if (
            typeof options.onCopy === 'function'
          ) {

            options.onCopy(
              activeText,
              activeRange
            );

          }

          finishAction();

        },
        onUnderline: () => {

          if (!activeRange) {
            return;
          }

          const wrappers =
            annotateTextRange(
              activeRange,
              {
                type:
                  'underline'
              }
            );

          if (
            typeof options.onAnnotate === 'function'
          ) {

            options.onAnnotate(
              {
                type:
                  'underline',
                text:
                  activeText,
                wrappers,
                range:
                  activeRange
              }
            );

          }

          finishAction();

        },
        onHighlight: (color) => {

          if (!activeRange) {
            return;
          }

          const wrappers =
            annotateTextRange(
              activeRange,
              {
                type:
                  'highlight',
                color
              }
            );

          if (
            typeof options.onAnnotate === 'function'
          ) {

            options.onAnnotate(
              {
                type:
                  'highlight',
                color,
                text:
                  activeText,
                wrappers,
                range:
                  activeRange
              }
            );

          }

          finishAction();

        },
        onNote: (note) => {

          if (
            !activeRange ||
            !note
          ) {
            return;
          }

          const noteColor =
            getComputedStyle(
              overlayRoot
            )
              .getPropertyValue(
                '--us-accent'
              )
              .trim() ||
            '#ff5ca8';

          const wrappers =
            annotateTextRange(
              activeRange,
              {
                type:
                  'note',
                note,
                noteColor
              }
            );

          for (
            const wrapper of
            wrappers
          ) {

            wrapper._usAnnotationTooltip =
              attachTooltip(
                wrapper,
                note,
                {
                  root:
                    overlayRoot,
                  theme:
                    options.theme ||
                    'dark',
                  placement:
                    options.noteTooltipPlacement ||
                    'top'
                }
              );

          }

          if (
            typeof options.onAnnotate === 'function'
          ) {

            options.onAnnotate(
              {
                type:
                  'note',
                note,
                text:
                  activeText,
                wrappers,
                range:
                  activeRange
              }
            );

          }

          finishAction();

        },
        onClear: () => {

          if (!activeRange) {
            return;
          }

          const removed =
            clearTextAnnotations(
              activeRange
            );

          if (
            typeof options.onClear === 'function'
          ) {

            options.onClear(
              {
                text:
                  activeText,
                removed,
                range:
                  activeRange
              }
            );

          }

          finishAction();

        }
      });

    const shell =
      element(
        'div',
        {
          className:
            'us-selection-toolbar-shell'
        },
        toolbar
      );

    shell.hidden =
      true;

    overlayRoot.appendChild(
      shell
    );

    const position = () => {

      if (
        shell.hidden ||
        !activeRange
      ) {
        return;
      }

      let rect =
        activeRange.getBoundingClientRect();

      if (
        !rect.width &&
        !rect.height
      ) {

        const rects =
          activeRange.getClientRects();

        rect =
          rects[
            rects.length - 1
          ];

      }

      if (!rect) {
        return;
      }

      if (
        rect.bottom < 0 ||
        rect.top > global.innerHeight ||
        rect.right < 0 ||
        rect.left > global.innerWidth
      ) {

        shell.hidden =
          true;

        return;

      }

      const shellRect =
        shell.getBoundingClientRect();

      const padding =
        8;

      const gap =
        options.offset ??
        8;

      let left =
        rect.left +
        (
          rect.width -
          shellRect.width
        ) / 2;

      left =
        Math.max(
          padding,
          Math.min(
            global.innerWidth -
              shellRect.width -
              padding,
            left
          )
        );

      const maxTop =
        Math.max(
          padding,
          global.innerHeight -
            shellRect.height -
            padding
        );

      const clampTop =
        (value) =>
          Math.max(
            padding,
            Math.min(
              maxTop,
              value
            )
          );

      const aboveTop =
        clampTop(
          rect.top -
            shellRect.height -
            gap
        );

      const belowTop =
        clampTop(
          rect.bottom +
            gap
        );

      const obstacles =
        Array.from(
          overlayRoot.querySelectorAll(
            '.us-floating-window, .us-annotation-mode-bar'
          )
        ).filter(
          (node) =>
            !node.hidden &&
            node !== shell
        );

      const collides =
        (candidateTop) =>
          obstacles.some(
            (node) => {

              const obstacle =
                node.getBoundingClientRect();

              return !(
                left +
                  shellRect.width <=
                    obstacle.left ||
                left >=
                  obstacle.right ||
                candidateTop +
                  shellRect.height <=
                    obstacle.top ||
                candidateTop >=
                  obstacle.bottom
              );

            }
          );

      const aboveFits =
        rect.top -
          shellRect.height -
          gap >=
            padding;

      const belowFits =
        rect.bottom +
          gap +
          shellRect.height <=
            global.innerHeight -
              padding;

      let top =
        aboveTop;

      if (
        !aboveFits ||
        collides(
          aboveTop
        )
      ) {

        if (
          belowFits ||
          !collides(
            belowTop
          )
        ) {

          top =
            belowTop;

        }

      }

      shell.style.left =
        `${left}px`;

      shell.style.top =
        `${top}px`;

    };

    const showForSelection = () => {

      if (!enabled) {
        hide();
        return;
      }

      const usable =
        getUsableSelection();

      if (!usable) {

        if (
          !shell.matches(
            ':hover'
          ) &&
          !shell.matches(
            ':focus-within'
          )
        ) {
          hide();
        }

        return;

      }

      activeRange =
        usable.range;

      activeText =
        usable.text;

      shell.hidden =
        false;

      requestAnimationFrame(
        position
      );

    };

    const hide = () => {

      shell.hidden =
        true;

      activeRange =
        null;

      activeText =
        '';

    };

    /*
     * Prevent toolbar controls from collapsing the document selection before
     * their click handlers can act on the cloned range.
     */
    shell.addEventListener(
      'pointerdown',
      (event) => {

        if (
          event.target.closest(
            'button'
          )
        ) {
          event.preventDefault();
        }

      }
    );

    const onPointerUp =
      () => {

        if (!enabled) {
          return;
        }

        global.setTimeout(
          showForSelection,
          0
        );

      };

    const onKeyUp =
      (event) => {

        if (
          event.key === 'Escape'
        ) {

          hide();
          return;

        }

        if (!enabled) {
          return;
        }

        global.setTimeout(
          showForSelection,
          0
        );

      };

    const onKeyDown =
      (event) => {

        if (
          event.key === 'Escape' &&
          !shell.hidden
        ) {

          event.preventDefault();
          hide();

        }

      };

    target.addEventListener(
      'pointerup',
      onPointerUp
    );

    target.addEventListener(
      'keyup',
      onKeyUp
    );

    global.addEventListener(
      'keydown',
      onKeyDown,
      true
    );

    global.addEventListener(
      'scroll',
      position,
      true
    );

    global.addEventListener(
      'resize',
      position
    );

    return Object.freeze({

      element:
        shell,

      get range() {
        return activeRange;
      },

      get text() {
        return activeText;
      },

      get enabled() {
        return enabled;
      },

      setEnabled(next) {

        enabled =
          Boolean(next);

        if (!enabled) {
          hide();
        }

        if (
          typeof options.onEnabledChange === 'function'
        ) {

          options.onEnabledChange(
            enabled
          );

        }

        return enabled;

      },

      toggleEnabled() {

        return this.setEnabled(
          !enabled
        );

      },

      show:
        showForSelection,

      hide,

      destroy() {

        target.removeEventListener(
          'pointerup',
          onPointerUp
        );

        target.removeEventListener(
          'keyup',
          onKeyUp
        );

        global.removeEventListener(
          'keydown',
          onKeyDown,
          true
        );

        global.removeEventListener(
          'scroll',
          position,
          true
        );

        global.removeEventListener(
          'resize',
          position
        );

        shell.remove();

      }

    });

  }
