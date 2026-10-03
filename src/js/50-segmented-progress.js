  function segmentedProgress(segments = [], options = {}) {

    let currentSegments =
      Array.isArray(segments)
        ? [...segments]
        : [];

    const labelNode =
      element(
        'span',
        {
          className:
            'us-progress-label',
          text:
            options.label ||
            ''
        }
      );

    const valueNode =
      element(
        'span',
        {
          className:
            'us-progress-text'
        }
      );

    const track =
      element(
        'div',
        {
          className:
            'us-segmented-progress-track',
          attrs: {
            role:
              'progressbar',
            'aria-label':
              options.ariaLabel ||
              options.label ||
              'Segmented progress',
            'aria-valuemin':
              0
          }
        }
      );

    const legend =
      element(
        'div',
        {
          className:
            'us-segmented-progress-legend'
        }
      );

    const root =
      element(
        'div',
        {
          className: [
            'us-segmented-progress',
            options.compact
              ? 'us-segmented-progress-compact'
              : '',
            options.className ||
              ''
          ].filter(Boolean).join(' ')
        },
        (
          options.label ||
          options.showValue !== false
        )
          ? element(
            'div',
            {
              className:
                'us-progress-header'
            },
            labelNode,
            valueNode
          )
          : null,
        track,
        options.legend === false
          ? null
          : legend
      );

    const normalize =
      (segment, index) => {

        if (
          typeof segment === 'number'
        ) {

          return {
            value:
              Math.max(
                0,
                segment
              ),
            label:
              `Segment ${index + 1}`,
            tone:
              'ACCENT'
          };

        }

        return {
          ...segment,
          value:
            Math.max(
              0,
              Number(
                segment?.value
              ) || 0
            ),
          label:
            segment?.label ||
            `Segment ${index + 1}`,
          tone:
            segment?.tone ||
            'ACCENT'
        };

      };

    const render =
      () => {

        track.replaceChildren();
        legend.replaceChildren();

        const normalized =
          currentSegments.map(
            normalize
          );

        const total =
          normalized.reduce(
            (
              sum,
              segment
            ) =>
              sum +
              segment.value,
            0
          );

        const maximum =
          Math.max(
            Number(
              options.max ??
              total ??
              100
            ) || 0,
            Number.EPSILON
          );

        track.setAttribute(
          'aria-valuemax',
          String(maximum)
        );

        track.setAttribute(
          'aria-valuenow',
          String(
            Math.min(
              total,
              maximum
            )
          )
        );

        valueNode.textContent =
          typeof options.formatValue ===
            'function'
            ? options.formatValue(
              total,
              {
                max:
                  maximum,
                percentage:
                  (
                    Math.min(
                      total,
                      maximum
                    ) /
                    maximum
                  ) * 100
              }
            )
            : `${Math.round(
              (
                Math.min(
                  total,
                  maximum
                ) /
                maximum
              ) * 100
            )}%`;

        for (
          const [
            index,
            segment
          ] of normalized.entries()
        ) {

          const width =
            (
              Math.min(
                segment.value,
                maximum
              ) /
              maximum
            ) * 100;

          const segmentNode =
            element(
              'span',
              {
                className: [
                  'us-segmented-progress-segment',
                  toneClass(
                    segment.tone
                  )
                ].join(' '),
                title:
                  segment.title ||
                  `${segment.label}: ${segment.value}`,
                attrs: {
                  'aria-hidden':
                    'true'
                }
              }
            );

          segmentNode.style.width =
            `${width}%`;

          if (segment.color) {

            segmentNode.style.setProperty(
              '--us-segment-color',
              segment.color
            );

          }

          track.appendChild(
            segmentNode
          );

          if (
            options.legend !== false
          ) {

            legend.appendChild(
              element(
                'span',
                {
                  className:
                    'us-segmented-progress-legend-item'
                },
                element(
                  'span',
                  {
                    className: [
                      'us-segmented-progress-swatch',
                      toneClass(
                        segment.tone
                      )
                    ].join(' ')
                  }
                ),
                element(
                  'span',
                  {
                    text:
                      segment.label
                  }
                ),
                options.showLegendValues === false
                  ? null
                  : element(
                    'span',
                    {
                      className:
                        'us-segmented-progress-legend-value',
                      text:
                        typeof options.formatSegmentValue ===
                          'function'
                          ? options.formatSegmentValue(
                            segment.value,
                            segment,
                            index
                          )
                          : String(
                            segment.value
                          )
                    }
                  )
              )
            );

          }

        }

      };

    root.setSegments =
      (nextSegments = []) => {

        currentSegments =
          Array.isArray(nextSegments)
            ? [...nextSegments]
            : [];

        render();

        return root;

      };

    root.getSegments =
      () => [...currentSegments];

    root.setLabel =
      (nextLabel) => {

        labelNode.textContent =
          nextLabel ||
          '';

        return root;

      };

    render();

    return root;

  }
