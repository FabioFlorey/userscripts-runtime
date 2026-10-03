  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ FEEDBACK / ALERT GALLERY                                                     │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  const TONES = [
    'NEUTRAL',
    'PAGE',
    'INPUT',
    'ACCENT',
    'TRACE',
    'DEBUG',
    'INFO',
    'SUCCESS',
    'WARNING',
    'ERROR',
    'CRITICAL'
  ];

  const feedbackRoot =
    UI.createRoot({
      theme:
        THEME
    });

  feedbackRoot.classList.add(
    'feedback-gallery-root'
  );

  feedbackRoot.appendChild(
    UI.element(
      'div',
      {
        className:
          'catalog-subtitle',
        text:
          'Pills / log levels / surface tones'
      }
    )
  );

  feedbackRoot.appendChild(
    UI.element(
      'div',
      {
        className:
          'feedback-tone-grid'
      },
      TONES.map(
        (tone) => UI.pill(
          tone.toLowerCase(),
          tone
        )
      )
    )
  );

  feedbackRoot.appendChild(
    UI.element(
      'div',
      {
        className:
          'catalog-subtitle',
        text:
          'Inline alerts'
      }
    )
  );

  feedbackRoot.appendChild(
    UI.element(
      'div',
      {
        className:
          'feedback-alert-grid'
      },
      TONES.map(
        (tone) => UI.alertBox({
          tone,
          title:
            tone.toLowerCase(),
          message:
            'Shared semantic tone for alerts, pills, toasts and control state.'
        })
      )
    )
  );

  const feedbackActions =
    UI.element(
      'div',
      {
        className:
          'us-row us-row-wrap'
      },

      UI.button({
        label:
          'Screen info',
        onClick: () => {

          UI.showAlert({
            root:
              overlayRoot,
            theme:
              THEME,
            tone:
              'INFO',
            title:
              'Screen alert',
            message:
              'This alert is injected at the top of the viewport.'
          });

        }
      }),

      UI.button({
        label:
          'Toast success',
        onClick: () => {

          UI.showToast({
            root:
              overlayRoot,
            theme:
              THEME,
            tone:
              'SUCCESS',
            title:
              'Saved',
            message:
              'Short feedback belongs in a toast.'
          });

        }
      }),

      UI.button({
        label:
          'Warning dialog',
        onClick: () => {

          UI.openAlertDialog({
            root:
              overlayRoot,
            theme:
              THEME,
            tone:
              'WARNING',
            title:
              'Confirm attention',
            message:
              'A click-triggered alert can use the same semantic tone inside a modal.'
          });

        }
      }),

      UI.pill(
        'clickable critical pill',
        'CRITICAL',
        {
          onClick: () => {

            UI.showAlert({
              root:
                overlayRoot,
              theme:
                THEME,
              tone:
                'CRITICAL',
              title:
                'Critical',
              message:
                'Pills can be interactive without becoming generic buttons.'
            });

          }
        }
      )

    );

  feedbackRoot.appendChild(
    UI.element(
      'div',
      {
        className:
          'catalog-subtitle',
        text:
          'Click-triggered feedback'
      }
    )
  );

  feedbackRoot.appendChild(
    feedbackActions
  );

  feedbackRoot.appendChild(
    UI.element(
      'div',
      {
        className:
          'catalog-subtitle',
        text:
          'Action menu with shared icons'
      }
    )
  );

  feedbackRoot.appendChild(
    UI.actionMenu(
      [
        'COPY',
        'OPEN',
        'DOWNLOAD',
        'COPY_XPATH',
        'SETTINGS'
      ],
      {
        ariaLabel:
          'Example action menu',
        onSelect:
          (descriptor) => {

            UI.showActionToast(
              descriptor,
              {
                root:
                  overlayRoot,
                theme:
                  THEME,
                tone:
                  'INFO',
                message:
                  'Menu and toast reuse the same action icon.'
              }
            );

          }
      }
    )
  );

  document
    .getElementById(
      'feedback-gallery'
    )
    .appendChild(
      feedbackRoot
    );
