  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ HOVER TOOLBARS                                                               │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  UI.attachHoverToolbar(
    document.getElementById(
      'result-1'
    ),
    [
      {
        icon:
          'SEARCH',
        title:
          'Open result tools'
      },
      {
        icon:
          'COPY',
        title:
          'Copy URL',
        onClick: () => {

          copy(
            MEDIA_URL,
            'URL copied'
          );

        }
      },
      {
        icon:
          'EXTERNAL',
        title:
          'Open'
      }
    ],
    {
      root:
        overlayRoot,
      theme:
        THEME,
      label:
        'result',
      placement:
        'right'
    }
  );

  UI.attachHoverToolbar(
    document.getElementById(
      'social-media'
    ),
    [
      {
        icon:
          'DOWNLOAD',
        title:
          'Download asset'
      },
      {
        icon:
          'EXTERNAL',
        title:
          'Open asset'
      },
      {
        icon:
          'COPY',
        title:
          'Copy URL',
        onClick: () => {

          copy(
            MEDIA_URL,
            'Asset URL copied'
          );

        }
      },
      {
        icon:
          'TERMINAL',
        title:
          'Copy command',
        onClick: () => {

          copy(
            DEMO_COMMAND,
            'Command copied'
          );

        }
      }
    ],
    {
      root:
        overlayRoot,
      theme:
        THEME,
      label:
        'asset',
      placement:
        'top'
    }
  );

  UI.attachHoverToolbar(
    document.getElementById(
      'video-target'
    ),
    [
      {
        icon:
          'PLAY',
        title:
          'Play / pause'
      },
      {
        icon:
          'LAYERS',
        title:
          'Options'
      },
      {
        icon:
          'TERMINAL',
        title:
          'Copy command',
        onClick: () => {

          copy(
            DEMO_COMMAND,
            'Command copied'
          );

        }
      },
      {
        icon:
          'FULLSCREEN',
        title:
          'Fullscreen'
      }
    ],
    {
      root:
        overlayRoot,
      theme:
        THEME,
      label:
        'player',
      placement:
        'top'
    }
  );
