  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ ACTION BUTTON GALLERY                                                        │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  const actionGalleryHost =
    document.getElementById(
      'action-gallery'
    );

  const actionGalleryRoot =
    UI.createRoot({
      theme:
        THEME,
      children: []
    });

  actionGalleryRoot.classList.add(
    'action-catalog-runtime'
  );

  const groupedActions =
    new Map();

  for (
    const [name, action] of
    Object.entries(UI.ACTIONS)
  ) {

    const group =
      action.group ||
      'Other';

    if (!groupedActions.has(group)) {
      groupedActions.set(group, []);
    }

    groupedActions.get(group).push([
      name,
      action
    ]);

  }

  for (
    const [group, actions] of
    groupedActions
  ) {

    const grid =
      UI.element(
        'div',
        {
          className:
            'action-catalog-grid'
        }
      );

    for (
      const [name, action] of
      actions
    ) {

      grid.appendChild(
        UI.element(
          'div',
          {
            className:
              'action-catalog-item',
            title:
              `${name} → ${action.icon}`
          },
          UI.actionButton(
            name,
            {
              onClick: () => {

                UI.showActionToast(
                  name,
                  {
                    root:
                      overlayRoot,
                    theme:
                      THEME,
                    tone:
                      'INFO',
                    message:
                      `Action: ${name}`
                  }
                );

              }
            }
          ),
          UI.element(
            'span',
            {
              className:
                'action-catalog-label',
              text:
                action.label
            }
          )
        )
      );

    }

    actionGalleryRoot.appendChild(
      UI.element(
        'section',
        {
          className:
            'action-catalog-group'
        },
        UI.element(
          'div',
          {
            className:
              'action-catalog-title',
            text:
              group
          }
        ),
        grid
      )
    );

  }

  const iconDetails =
    UI.element(
      'details',
      {
        className:
          'icon-catalog',
        attrs: {
          open:
            true
        }
      },
      UI.element(
        'summary',
        {
          text:
            'Raw shared icon vocabulary'
        }
      )
    );

  const iconGrid =
    UI.element(
      'div',
      {
        className:
          'icon-catalog-grid'
      }
    );

  for (
    const iconName of
    Object.keys(UI.ICONS)
  ) {

    iconGrid.appendChild(
      UI.element(
        'div',
        {
          className:
            'action-catalog-item'
        },
        UI.iconButton(
          iconName,
          {
            title:
              iconName
          }
        ),
        UI.element(
          'span',
          {
            className:
              'action-catalog-label',
            text:
              iconName
          }
        )
      )
    );

  }

  iconDetails.appendChild(
    iconGrid
  );

  actionGalleryRoot.appendChild(
    iconDetails
  );

  actionGalleryHost.appendChild(
    actionGalleryRoot
  );
