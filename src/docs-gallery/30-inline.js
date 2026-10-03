  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ INLINE AUGMENTATION                                                          │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  const resultSlot =
    document.getElementById(
      'result-inline'
    );

  resultSlot.appendChild(
    UI.inlineRoot({
      theme:
        THEME,
      children: [

        UI.badge(
          'FILE',
          'ACCENT'
        ),

        UI.iconButton(
          'COPY',
          {
            title:
              'Copy asset URL',
            onClick: () => {

              copy(
                MEDIA_URL,
                'Asset URL copied'
              );

            }
          }
        ),

        UI.copyCommandButton({
          command:
            DEMO_COMMAND,
          title:
            'Copy command'
        })

      ]
    })
  );

  const articleSlot =
    document.getElementById(
      'article-inline'
    );

  const articleInfoButton =
    UI.iconButton(
      'EYE',
      {
        title:
          'Open details'
      }
    );

  articleSlot.appendChild(
    UI.inlineRoot({
      theme:
        THEME,
      children: [
        UI.inlineInspector(
          [
            {
              icon:
                'COPY',
              title:
                'Copy text',
              onClick: () => {
                copy(
                  'component state boundary',
                  'Selection copied'
                );
              }
            },
            {
              icon:
                'SEARCH',
              title:
                'Inspect'
            }
          ],
          {
            ariaLabel:
              'Article context tools'
          }
        ),
        articleInfoButton
      ]
    })
  );
