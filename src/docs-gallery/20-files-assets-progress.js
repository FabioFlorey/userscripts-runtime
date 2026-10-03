  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ FILES / ASSET HOVER / PROGRESS                                               │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function demoThumbnail(
    label,
    background,
    foreground = '#f5f5f5'
  ) {

    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
        <rect width="320" height="320" fill="${background}"/>
        <path d="M0 255 L88 165 L142 219 L196 147 L320 270 L320 320 L0 320 Z" fill="${foreground}" opacity=".15"/>
        <circle cx="90" cy="88" r="30" fill="${foreground}" opacity=".18"/>
        <text x="20" y="292" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="${foreground}">${label}</text>
      </svg>`;

    return (
      'data:image/svg+xml;charset=UTF-8,' +
      encodeURIComponent(svg)
    );

  }

  const demoAssets = [
    {
      type:
        'image',
      name:
        'photo-01.jpg',
      meta: [
        '1600×1600',
        '412 KB'
      ],
      thumbnail:
        demoThumbnail(
          'IMAGE 01',
          '#662847'
        ),
      url:
        demoThumbnail(
          'IMAGE 01',
          '#662847'
        )
    },
    {
      type:
        'video',
      name:
        'clip-02.mp4',
      meta: [
        '00:14',
        'Large'
      ],
      thumbnail:
        demoThumbnail(
          'VIDEO 02',
          '#243f63'
        ),
      url:
        demoThumbnail(
          'VIDEO 02',
          '#243f63'
        )
    },
    {
      type:
        'image',
      name:
        'photo-03.png',
      meta: [
        '2048×1365',
        '1.2 MB'
      ],
      thumbnail:
        demoThumbnail(
          'IMAGE 03',
          '#345a45'
        ),
      url:
        demoThumbnail(
          'IMAGE 03',
          '#345a45'
        )
    }
  ];

  const assetHoverController =
    UI.attachAssetHoverTray(
      document.getElementById(
        'asset-hover-target'
      ),
      () => demoAssets,
      {
        root:
          overlayRoot,
        theme:
          THEME,
        title:
          'Page assets',
        placement:
          'bottom',
        selectable:
          true,
        onOpen:
          (item) => {

            UI.showActionToast(
              'OPEN',
              {
                root:
                  overlayRoot,
                theme:
                  THEME,
                tone:
                  'INFO',
                message:
                  `Open: ${item.name}`
              }
            );

          },
        onDownload:
          (item) => {

            UI.showActionToast(
              'DOWNLOAD',
              {
                root:
                  overlayRoot,
                theme:
                  THEME,
                tone:
                  'SUCCESS',
                message:
                  `Download: ${item.name}`
              }
            );

          },
        onDownloadSelected:
          (items) => {

            UI.showActionToast(
              'DOWNLOAD',
              {
                root:
                  overlayRoot,
                theme:
                  THEME,
                tone:
                  'SUCCESS',
                title:
                  'Download selected',
                message:
                  `${items.length} selected asset${items.length === 1 ? '' : 's'}`
              }
            );

          }
      }
    );

  const filePickerRoot =
    UI.createRoot({
      theme:
        THEME,
      children: [
        UI.filePicker({
          label:
            'Drop files here',
          description:
            'Images, video, JSON or text. Multiple selection is enabled.',
          accept:
            'image/*,video/*,.json,.txt',
          multiple:
            true,
          maxFiles:
            8,
          maxSize:
            25 * 1024 * 1024,
          onReject:
            (rejected) => {

              UI.showAlert({
                root:
                  overlayRoot,
                theme:
                  THEME,
                tone:
                  'WARNING',
                title:
                  'File rejected',
                message:
                  `${rejected.length} file${rejected.length === 1 ? '' : 's'} did not match the picker rules.`
              });

            }
        })
      ]
    });

  document
    .getElementById(
      'file-picker-gallery'
    )
    .appendChild(
      filePickerRoot
    );

  const progressDemo =
    UI.progressBar(
      68,
      {
        label:
          'Processing files',
        tone:
          'ACCENT'
      }
    );

  const segmentedProgressDemo =
    UI.segmentedProgress(
      [
        {
          label:
            'Complete',
          value:
            34,
          tone:
            'SUCCESS'
        },
        {
          label:
            'Active',
          value:
            27,
          tone:
            'INFO'
        },
        {
          label:
            'Queued',
          value:
            19,
          tone:
            'WARNING'
        }
      ],
      {
        label:
          'Segmented progress',
        max:
          100
      }
    );

  const uploadQueueDemo =
    UI.uploadQueue(
      [
        new File(
          ['alpha'],
          'alpha.txt',
          {
            type:
              'text/plain'
          }
        ),
        new File(
          ['bravo-bravo'],
          'bravo.txt',
          {
            type:
              'text/plain'
          }
        )
      ],
      {
        title:
          'Upload queue',
        concurrency:
          1,
        upload:
          async (
            file,
            {
              signal,
              reportProgress
            }
          ) => {

            const total =
              Math.max(
                1,
                file.size
              );

            for (
              const ratio of
              [0.25, 0.5, 0.75, 1]
            ) {

              if (signal.aborted) {
                throw new DOMException(
                  'Upload cancelled',
                  'AbortError'
                );
              }

              await new Promise(
                (resolve) =>
                  setTimeout(
                    resolve,
                    120
                  )
              );

              reportProgress(
                Math.round(
                  total *
                  ratio
                ),
                total
              );

            }

            return {
              ok:
                true
            };

          }
      }
    );

  const progressRoot =
    UI.createRoot({
      theme:
        THEME,
      children: [

        UI.progressGroup([
          {
            value:
              68,
            label:
              'Processing files',
            tone:
              'ACCENT'
          },
          {
            value:
              100,
            label:
              'Completed',
            tone:
              'SUCCESS'
          },
          {
            value:
              42,
            label:
              'Waiting for input',
            tone:
              'WARNING'
          },
          {
            value:
              null,
            label:
              'Loading metadata',
            tone:
              'INFO',
            indeterminate:
              true
          }
        ]),

        UI.element(
          'div',
          {
            className:
              'us-row us-row-wrap'
          },
          UI.spinner({
            tone:
              'ACCENT',
            label:
              'Loading'
          }),
          UI.pill(
            'spinner',
            'PAGE',
            {
              dot:
                false
            }
          ),
          UI.button({
            label:
              'Advance demo',
            size:
              'xs',
            onClick: () => {

              const current =
                Number(
                  progressDemo
                    .querySelector(
                      '.us-progress-track'
                    )
                    ?.getAttribute(
                      'aria-valuenow'
                    ) ||
                  0
                );

              progressDemo.setValue(
                current >= 100
                  ? 0
                  : current + 10
              );

            }
          })
        ),

        progressDemo,

        segmentedProgressDemo,

        uploadQueueDemo,

        UI.stack(
          [
            UI.metaLine([
              'skeleton variants',
              'text'
            ]),
            UI.skeleton({
              variant:
                'text',
              lines:
                3
            })
          ],
          {
            tight:
              true
          }
        )

      ]
    });

  progressRoot.classList.add(
    'progress-gallery-root'
  );

  document
    .getElementById(
      'progress-gallery'
    )
    .appendChild(
      progressRoot
    );

  const demoNotepadStorage =
    UI.storageAdapter({
      get:
        (
          key,
          fallback
        ) => {

          const value =
            localStorage.getItem(
              key
            );

          return value == null
            ? fallback
            : value;

        },
      set:
        (
          key,
          value
        ) => {

          localStorage.setItem(
            key,
            String(value)
          );

        },
      remove:
        (key) => {

          localStorage.removeItem(
            key
          );

        }
    });

  let notepadController = null;

  function openDemoNotepad() {

    if (
      notepadController?.element?.isConnected
    ) {

      notepadController
        .element
        .focus();

      return;

    }

    notepadController =
      UI.openNotepad({
        root:
          overlayRoot,
        theme:
          THEME,
        title:
          'Notepad',
        storage:
          demoNotepadStorage,
        key:
          'userscript-runtime:demo-notepad',
        defaultValue:
          'Notes saved through a storage adapter.',
        onClose: () => {
          notepadController = null;
        }
      });

  }

  const notepadRoot =
    UI.createRoot({
      theme:
        THEME,
      children: [

        UI.element(
          'div',
          {
            className:
              'us-row us-row-wrap'
          },

          UI.actionButton(
            'NOTEPAD',
            {
              title:
                'Open notepad',
              onClick:
                openDemoNotepad
            }
          ),

          UI.button({
            label:
              'Open notepad',
            size:
              'xs',
            onClick:
              openDemoNotepad
          }),

          UI.pill(
            'drag · resize · min/max · autosave',
            'INFO'
          )

        )

      ]
    });

  document
    .getElementById(
      'notepad-gallery'
    )
    .appendChild(
      notepadRoot
    );

  const selectionDemo =
    document.getElementById(
      'selection-demo'
    );

  const showAnnotationToast =
    (annotation) => {

      const action =
        annotation.type === 'underline'
          ? 'UNDERLINE_TEXT'
          : annotation.type === 'note'
            ? 'ADD_NOTE'
            : 'HIGHLIGHT_TEXT';

      const message =
        annotation.type === 'highlight'
          ? `Highlighted with ${annotation.color}`
          : annotation.type === 'note'
            ? 'Annotation note attached as a tooltip'
            : 'Selection underlined';

      UI.showActionToast(
        action,
        {
          root:
            overlayRoot,
          theme:
            THEME,
          tone:
            'INFO',
          message
        }
      );

    };

  const showAnnotationClearToast =
    ({ removed }) => {

      UI.showActionToast(
        'CLEAR_ANNOTATION',
        {
          root:
            overlayRoot,
          theme:
            THEME,
          tone:
            'INFO',
          message:
            removed.length
              ? `Removed ${removed.length} annotation${removed.length === 1 ? '' : 's'}`
              : 'No annotation in selection'
        }
      );

    };

  const selectionToolbarController =
    UI.attachTextSelectionToolbar({
      target:
        selectionDemo,
      root:
        overlayRoot,
      theme:
        THEME,
      onAnnotate:
        showAnnotationToast,
      onClear:
        showAnnotationClearToast
    });

  let pageAnnotationController = null;

  const mountPageAnnotationMode =
    (
      placement = 'floating',
      enabled = false
    ) => {

      pageAnnotationController?.destroy();

      pageAnnotationController =
        UI.attachPageAnnotationMode({
          target:
            document.body,
          root:
            overlayRoot,
          theme:
            THEME,
          placement,
          position:
            'top-right',
          enabled,
          exclude:
            '#selection-demo',
          controlClassName:
            'gallery-annotation-launcher',
          label:
            'Annotate page',
          onAnnotate:
            showAnnotationToast,
          onClear:
            showAnnotationClearToast
        });

      return pageAnnotationController;

    };

  mountPageAnnotationMode(
    'floating',
    false
  );

  const annotationModeRoot =
    UI.createRoot({
      theme:
        THEME,
      children: [

        UI.stack(
          [

            UI.cluster(
              [

                UI.button({
                  icon:
                    'HIGHLIGHT',
                  label:
                    'Floating button',
                  size:
                    'xs',
                  onClick: () =>
                    mountPageAnnotationMode(
                      'floating',
                      true
                    )
                }),

                UI.button({
                  label:
                    'Top bar',
                  size:
                    'xs',
                  onClick: () =>
                    mountPageAnnotationMode(
                      'header',
                      true
                    )
                }),

                UI.button({
                  label:
                    'Bottom bar',
                  size:
                    'xs',
                  onClick: () =>
                    mountPageAnnotationMode(
                      'footer',
                      true
                    )
                })

              ],
              {
                tight:
                  true
              }
            ),

            UI.metaLine([
              'page-wide mode',
              'select text anywhere',
              'demo paragraph remains local'
            ])

          ],
          {
            tight:
              true
          }
        )

      ]
    });

  document
    .getElementById(
      'annotation-mode-gallery'
    )
    .appendChild(
      annotationModeRoot
    );

  const utilityDemoParams =
    new URLSearchParams(
      location.search
    );

  if (
    utilityDemoParams.has(
      'selection'
    )
  ) {

    const textNode =
      Array.from(
        selectionDemo.childNodes
      ).find(
        (node) =>
          node.nodeType ===
            Node.TEXT_NODE &&
          node.nodeValue.trim()
      );

    if (textNode) {

      const start =
        Math.max(
          0,
          textNode.nodeValue.indexOf(
            'Select any part'
          )
        );

      const end =
        Math.min(
          textNode.nodeValue.length,
          start + 45
        );

      const range =
        document.createRange();

      range.setStart(
        textNode,
        start
      );

      range.setEnd(
        textNode,
        end
      );

      const selection =
        globalThis.getSelection();

      selection.removeAllRanges();
      selection.addRange(
        range
      );

      selectionToolbarController?.show();

    }

  }

  if (
    utilityDemoParams.has(
      'notepad'
    )
  ) {

    notepadRoot
      .querySelector(
        '.us-action-button'
      )
      ?.click();

  }

  if (
    utilityDemoParams.has(
      'carousel'
    )
  ) {

    UI.openAssetCarousel(
      demoAssets,
      {
        root:
          overlayRoot,
        theme:
          THEME,
        index:
          0
      }
    );

  }

  if (
    utilityDemoParams.has(
      'assets'
    )
  ) {

    assetHoverController?.show();

    if (
      utilityDemoParams.has(
        'pin'
      )
    ) {
      assetHoverController?.pin();
    }

  }
