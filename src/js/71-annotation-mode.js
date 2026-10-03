  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ PAGE ANNOTATION MODE                                                        │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function annotationModeControl(options = {}) {

    const placement =
      options.placement ||
      'floating';

    const label =
      options.label ||
      'Annotate page';

    let enabled =
      Boolean(
        options.enabled
      );

    const notify =
      (next) => {

        if (
          typeof options.onToggle === 'function'
        ) {

          options.onToggle(
            next
          );

        }

      };

    if (placement === 'floating') {

      const control =
        floatingAction({
          icon:
            'HIGHLIGHT',
          title:
            enabled
              ? 'Disable page annotation'
              : 'Enable page annotation',
          ariaLabel:
            enabled
              ? 'Disable page annotation'
              : 'Enable page annotation',
          position:
            options.position ||
            'top-right',
          className: [
            'us-annotation-mode-floating',
            options.className ||
              ''
          ].filter(Boolean).join(' '),
          onClick: () => {

            control.setEnabled(
              !enabled
            );

            notify(
              enabled
            );

          }
        });

      control.setAttribute(
        'aria-pressed',
        String(enabled)
      );

      control.setEnabled =
        (next) => {

          enabled =
            Boolean(next);

          control.classList.toggle(
            'us-annotation-mode-active',
            enabled
          );

          control.setAttribute(
            'aria-pressed',
            String(enabled)
          );

          control.title =
            enabled
              ? 'Disable page annotation'
              : 'Enable page annotation';

          control.setAttribute(
            'aria-label',
            control.title
          );

          return enabled;

        };

      control.setEnabled(
        enabled
      );

      return control;

    }

    const statusNode =
      pill(
        enabled
          ? 'ON'
          : 'OFF',
        enabled
          ? 'SUCCESS'
          : 'NEUTRAL',
        {
          dot:
            false,
          className:
            'us-annotation-mode-status'
        }
      );

    const toggleButton =
      button({
        icon:
          'HIGHLIGHT',
        label:
          enabled
            ? 'Disable'
            : 'Enable',
        size:
          'xs',
        variant:
          enabled
            ? 'primary'
            : null,
        className:
          'us-annotation-mode-toggle'
      });

    const control =
      element(
        'div',
        {
          className: [
            'us-annotation-mode-bar',
            placement === 'header'
              ? 'us-annotation-mode-bar-top'
              : 'us-annotation-mode-bar-bottom',
            options.className ||
              ''
          ].filter(Boolean).join(' '),
          attrs: {
            role:
              'toolbar',
            'aria-label':
              options.ariaLabel ||
              'Page annotation mode'
          }
        },
        element(
          'div',
          {
            className:
              'us-annotation-mode-identity'
          },
          icon(
            'HIGHLIGHT'
          ),
          element(
            'span',
            {
              className:
                'us-annotation-mode-title',
              text:
                label
            }
          ),
          statusNode
        ),
        element(
          'span',
          {
            className:
              'us-annotation-mode-help',
            text:
              options.helpText ||
              'Select text anywhere on the page'
          }
        ),
        toggleButton
      );

    control.setEnabled =
      (next) => {

        enabled =
          Boolean(next);

        control.classList.toggle(
          'us-annotation-mode-active',
          enabled
        );

        statusNode.textContent =
          enabled
            ? 'ON'
            : 'OFF';

        statusNode.className = [
          'us-pill',
          toneClass(
            enabled
              ? 'SUCCESS'
              : 'NEUTRAL'
          ),
          'us-annotation-mode-status'
        ].join(' ');

        toggleButton.classList.toggle(
          'us-button-primary',
          enabled
        );

        toggleButton.lastChild.textContent =
          enabled
            ? 'Disable'
            : 'Enable';

        toggleButton.setAttribute(
          'aria-pressed',
          String(enabled)
        );

        return enabled;

      };

    toggleButton.addEventListener(
      'click',
      () => {

        control.setEnabled(
          !enabled
        );

        notify(
          enabled
        );

      }
    );

    control.setEnabled(
      enabled
    );

    return control;

  }

  function attachPageAnnotationMode(options = {}) {

    const target =
      options.target ||
      document.body;

    if (!(target instanceof Element)) {
      return null;
    }

    const root =
      options.root ||
      ensureOverlayRoot({
        theme:
          options.theme ||
          'dark'
      });

    let enabled =
      Boolean(
        options.enabled
      );

    const selectionController =
      attachTextSelectionToolbar({
        ...options,
        target,
        root,
        enabled
      });

    const control =
      annotationModeControl({
        placement:
          options.placement ||
          'floating',
        position:
          options.position,
        label:
          options.label,
        helpText:
          options.helpText,
        ariaLabel:
          options.ariaLabel,
        className:
          options.controlClassName,
        enabled,
        onToggle:
          (next) => {

            setEnabled(
              next
            );

          }
      });

    root.appendChild(
      control
    );

    const setEnabled =
      (next) => {

        enabled =
          Boolean(next);

        selectionController.setEnabled(
          enabled
        );

        control.setEnabled?.(
          enabled
        );

        if (
          typeof options.onModeChange === 'function'
        ) {

          options.onModeChange(
            enabled
          );

        }

        return enabled;

      };

    setEnabled(
      enabled
    );

    return Object.freeze({

      control,

      selection:
        selectionController,

      get enabled() {
        return enabled;
      },

      setEnabled,

      toggle() {

        return setEnabled(
          !enabled
        );

      },

      destroy() {

        selectionController.destroy();

        control.remove();

      }

    });

  }
