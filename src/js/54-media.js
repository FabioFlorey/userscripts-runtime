  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ MEDIA COMPONENTS                                                            │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function mediaProgress(value = 0, options = {}) {

    const progress =
      Math.max(
        0,
        Math.min(
          100,
          Number(value) || 0
        )
      );

    const root =
      element(
        'div',
        {
          className: 'us-media-progress',
          title:
            options.title ||
            'Media progress',
          attrs: {
            role: 'progressbar',
            'aria-valuemin': 0,
            'aria-valuemax': 100,
            'aria-valuenow': progress
          }
        }
      );

    root.style.setProperty(
      '--us-media-progress',
      `${progress}%`
    );

    root.appendChild(
      element(
        'span',
        {
          className: 'us-media-progress-value'
        }
      )
    );

    return root;

  }

  function qualitySelect(qualities = [], current = 'Auto', onChange = null) {

    const select =
      element(
        'select',
        {
          className: 'us-select us-select-xs',
          attrs: {
            'aria-label': 'Quality'
          }
        }
      );

    for (const quality of qualities) {

      const option =
        element(
          'option',
          {
            text: quality,
            attrs: {
              value: quality
            }
          }
        );

      if (quality === current) {
        option.selected = true;
      }

      select.appendChild(
        option
      );

    }

    if (onChange) {
      select.addEventListener(
        'change',
        onChange
      );
    }

    return select;

  }

  function mediaSource(options = {}) {

    const urlGetter =
      typeof options.url === 'function'
        ? options.url
        : () => options.url;

    const actions = [];

    if (options.copy !== false) {

      actions.push(
        iconButton(
          'COPY',
          {
            title: 'Copy URL',
            onClick: () => {
              copyText(urlGetter());
            }
          }
        )
      );

    }

    if (options.open !== false) {

      actions.push(
        iconButton(
          'EXTERNAL',
          {
            title: 'Open in new tab',
            onClick: () => {

              const url =
                urlGetter();

              if (url) {

                global.open(
                  url,
                  '_blank',
                  'noopener,noreferrer'
                );

              }

            }
          }
        )
      );

    }

    if (options.command) {

      actions.push(
        copyCommandButton({
          command:
            options.command,
          title:
            options.commandTitle ||
            'Copy command'
        })
      );

    }

    if (options.download) {

      actions.push(
        iconButton(
          'DOWNLOAD',
          {
            title: 'Download',
            onClick:
              options.download
          }
        )
      );

    }

    return element(
      'div',
      {
        className: 'us-media-source-row'
      },
      element(
        'div',
        {
          className: 'us-media-source-main'
        },
        element(
          'span',
          {
            className: 'us-media-source-label',
            text:
              options.label ||
              'Media source'
          }
        ),
        element(
          'span',
          {
            className: 'us-media-source-url',
            text:
              urlGetter() || ''
          }
        )
      ),
      actionStrip(
        actions.map((action) => {

          return {
            icon: null,
            custom: action
          };

        })
      )
    );

  }

  function mediaControls(options = {}) {

    const urlGetter =
      typeof options.url === 'function'
        ? options.url
        : () => options.url;

    const actionGroup =
      element(
        'div',
        {
          className:
            'us-media-controls-actions'
        },
        iconButton(
          'LAYERS',
          {
            title: 'Inspect options',
            onClick: options.onVariants
          }
        ),
        iconButton(
          'REFRESH',
          {
            title: 'Reload source',
            onClick: options.onReload
          }
        ),
        options.command
          ? copyCommandButton({
            command:
              options.command,
            title:
              options.commandTitle ||
              'Copy command'
          })
          : null,
        iconButton(
          'FULLSCREEN',
          {
            title: 'Fullscreen',
            onClick: options.onFullscreen
          }
        )
      );

    return element(
      'div',
      {
        className: 'us-media-controls',
        attrs: {
          'aria-label':
            options.ariaLabel ||
            'Media controls'
        }
      },
      iconButton(
        options.playing
          ? 'PAUSE'
          : 'PLAY',
        {
          title:
            options.playing
              ? 'Pause'
              : 'Play',
          onClick: options.onPlay
        }
      ),
      iconButton(
        options.muted
          ? 'MUTE'
          : 'VOLUME',
        {
          title:
            options.muted
              ? 'Unmute'
              : 'Mute',
          onClick: options.onMute
        }
      ),
      mediaProgress(
        options.progress || 0,
        {
          title:
            options.progressTitle ||
            'Progress'
        }
      ),
      options.time
        ? element(
          'span',
          {
            className: 'us-media-time',
            text: options.time
          }
        )
        : null,
      qualitySelect(
        options.qualities || ['Auto'],
        options.quality || 'Auto',
        options.onQuality
      ),
      actionGroup
    );

  }

  function sourceInspector(options = {}) {

    const url =
      options.url || '';

    const sourceActions = [];

    sourceActions.push({
      icon: 'COPY',
      title: 'Copy URL',
      onClick: () => {
        copyText(url);
      }
    });

    sourceActions.push({
      icon: 'EXTERNAL',
      title: 'Open in new tab',
      onClick: () => {

        if (url) {

          global.open(
            url,
            '_blank',
            'noopener,noreferrer'
          );

        }

      }
    });

    if (options.command) {

      sourceActions.push(
        copyCommandButton({
          command:
            options.command,
          title:
            options.commandTitle ||
            'Copy command'
        })
      );

    }

    const children = [
      element(
        'div',
        {
          className: 'us-media-source-row'
        },
        element(
          'div',
          {
            className: 'us-media-source-main'
          },
          element(
            'span',
            {
              className: 'us-media-source-label',
              text:
                options.sourceLabel ||
                'Resolved source'
            }
          ),
          element(
            'span',
            {
              className: 'us-media-source-url',
              text: url
            }
          )
        ),
        actionStrip(
          sourceActions
        )
      ),

      element(
        'div',
        {
          className: 'us-row us-row-wrap'
        },
        options.active
          ? badge('ACTIVE', 'SUCCESS')
          : null,
        options.type
          ? badge(options.type)
          : null,
        options.size
          ? badge(options.size)
          : null,
        options.state
          ? badge(options.state, 'ACCENT')
          : null
      ),

      mediaControls({
        url,
        playing: options.playing,
        muted: options.muted,
        progress: options.progress,
        time: options.time,
        qualities: options.qualities,
        quality: options.quality,
        onPlay: options.onPlay,
        onMute: options.onMute,
        onQuality: options.onQuality,
        onVariants: options.onVariants,
        onReload: options.onReload,
        onFullscreen: options.onFullscreen
      })
    ];

    if (options.variants?.length) {

      children.push(
        dataTable({
          mono: true,
          columns: [
            {
              key: 'quality',
              label: 'Option',
              width: '110px'
            },
            {
              key: 'size',
              label: 'Size',
              width: '90px'
            },
            {
              key: 'type',
              label: 'Type',
              width: '110px'
            },
            {
              key: 'path',
              label: 'Path'
            }
          ],
          rows: options.variants
        })
      );

    }

    return panel({
      title:
        options.title ||
        'Stream inspector',
      subtitle:
        options.subtitle ||
        'Resolved media and rendition state',
      actions:
        options.actions || [],
      selected:
        options.selected !== false,
      children
    });

  }
