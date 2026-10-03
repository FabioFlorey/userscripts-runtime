  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ SMALL VIDEO POPOVER                                                          │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  const videoSlot =
    document.getElementById(
      'video-inline'
    );

  const videoInfoButton =
    UI.iconButton(
      'LAYERS',
      {
        title:
          'Show player options'
      }
    );

  videoSlot.appendChild(
    UI.inlineRoot({
      theme:
        THEME,
      children: [
        UI.badge(
          'Large',
          'ACCENT'
        ),
        UI.badge('FILE'),
        videoInfoButton
      ]
    })
  );

  const docsParams =
    new URLSearchParams(
      location.search
    );

  if (docsParams.has('settings')) {
    settingsLauncher.click();
  }

  if (docsParams.has('tools')) {
    launcher.click();
  }


  if (location.hash) {

    const target =
      document.querySelector(
        location.hash
      );

    if (target) {

      const scrollToTarget =
        () => {

          target.scrollIntoView({
            block:
              'start'
          });

        };

      requestAnimationFrame(
        () =>
          requestAnimationFrame(
            scrollToTarget
          )
      );

      globalThis.setTimeout(
        scrollToTarget,
        120
      );

    }

  }


  UI.attachPopover(
    videoInfoButton,
    UI.popover({
      title:
        'Available versions',
      children: [

        UI.dataTable({
          mono:
            true,
          columns: [
            {
              key:
                'quality',
              label:
                'Quality',
              width:
                '88px'
            },
            {
              key:
                'size',
              label:
                'Size',
              width:
                '92px'
            },
            {
              key:
                'path',
              label:
                'Path'
            }
          ],
          rows: [
            {
              quality:
                'Large',
              bitrate:
                '2.4 MB',
              path:
                '/assets/demo-large.jpg'
            },
            {
              quality:
                'Medium',
              bitrate:
                '1.3 MB',
              path:
                '/assets/demo-medium.jpg'
            },
            {
              quality:
                'Small',
              bitrate:
                '620 KB',
              path:
                '/assets/demo-small.jpg'
            }
          ]
        })

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

})();
