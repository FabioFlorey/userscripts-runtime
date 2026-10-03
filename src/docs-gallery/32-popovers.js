  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ POPOVERS AND TOOLTIPS                                                        │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  UI.attachPopover(
    articleInfoButton,
    UI.popover({
      title:
        'Selection details',
      children: [

        UI.keyValueList([
          {
            label:
              'Type',
            value:
              'text'
          },
          {
            label:
              'Length',
            value:
              '31 chars'
          },
          {
            label:
              'Context',
            value:
              'article body'
          }
        ]),

        UI.callout(
          'Small contextual tools are usually better than opening a full dashboard.',
          'INFO'
        )

      ]
    }),
    {
      root:
        overlayRoot,
      theme:
        THEME,
      placement:
        'bottom'
    }
  );

  UI.attachTooltip(
    document.getElementById(
      'article-term'
    ),
    'A tooltip can annotate a host-page element without changing its layout.',
    {
      root:
        overlayRoot,
      theme:
        THEME,
      placement:
        'top'
    }
  );
