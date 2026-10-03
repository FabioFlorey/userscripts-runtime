  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ TEXT SELECTION / ANNOTATION                                                  │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  const DEFAULT_HIGHLIGHT_COLORS =
    Object.freeze([
      Object.freeze({
        name:
          'Yellow',
        value:
          '#ffe66d'
      }),
      Object.freeze({
        name:
          'Pink',
        value:
          '#ff8ac4'
      }),
      Object.freeze({
        name:
          'Green',
        value:
          '#8ee6a8'
      }),
      Object.freeze({
        name:
          'Blue',
        value:
          '#8bc7ff'
      }),
      Object.freeze({
        name:
          'Orange',
        value:
          '#ffb86c'
      })
    ]);

  function textNodesInRange(range) {

    if (!(range instanceof Range)) {
      return [];
    }

    const common =
      range.commonAncestorContainer;

    if (
      common.nodeType ===
      Node.TEXT_NODE
    ) {

      return range.toString()
        ? [common]
        : [];

    }

    const walker =
      document.createTreeWalker(
        common,
        NodeFilter.SHOW_TEXT
      );

    const nodes = [];

    let node =
      walker.nextNode();

    while (node) {

      try {

        if (
          node.nodeValue &&
          range.intersectsNode(node)
        ) {
          nodes.push(node);
        }

      } catch (error) {

        // Ignore detached/transient nodes.

      }

      node =
        walker.nextNode();

    }

    return nodes;

  }

  function annotateTextRange(
    range,
    options = {}
  ) {

    if (
      !(range instanceof Range) ||
      range.collapsed
    ) {
      return [];
    }

    const type =
      options.type === 'underline'
        ? 'underline'
        : options.type === 'note'
          ? 'note'
          : 'highlight';

    const color =
      options.color ||
      DEFAULT_HIGHLIGHT_COLORS[0].value;

    const nodes =
      textNodesInRange(range);

    const wrappers = [];

    for (const originalNode of nodes) {

      if (!originalNode.isConnected) {
        continue;
      }

      let start =
        originalNode === range.startContainer
          ? range.startOffset
          : 0;

      let end =
        originalNode === range.endContainer
          ? range.endOffset
          : originalNode.nodeValue.length;

      start =
        Math.max(
          0,
          Math.min(
            originalNode.nodeValue.length,
            start
          )
        );

      end =
        Math.max(
          start,
          Math.min(
            originalNode.nodeValue.length,
            end
          )
        );

      if (start === end) {
        continue;
      }

      let selectedNode =
        originalNode;

      if (
        end <
        selectedNode.nodeValue.length
      ) {

        selectedNode.splitText(
          end
        );

      }

      if (start > 0) {

        selectedNode =
          selectedNode.splitText(
            start
          );

      }

      const wrapper =
        document.createElement(
          'span'
        );

      wrapper.className = [
        'us-text-annotation',
        type === 'underline'
          ? 'us-text-annotation-underline'
          : type === 'note'
            ? 'us-text-annotation-note'
            : 'us-text-annotation-highlight'
      ].join(' ');

      wrapper.dataset.usAnnotation =
        type;

      if (
        options.id != null
      ) {

        wrapper.dataset.usAnnotationId =
          String(options.id);

      }

      if (type === 'underline') {

        wrapper.style.textDecorationLine =
          'underline';

        wrapper.style.textDecorationThickness =
          options.thickness ||
          '2px';

        wrapper.style.textUnderlineOffset =
          options.offset ||
          '0.16em';

        wrapper.style.textDecorationColor =
          options.underlineColor ||
          'currentColor';

      } else if (type === 'note') {

        const note =
          String(
            options.note ||
            ''
          );

        wrapper.dataset.usAnnotationNote =
          note;

        wrapper.tabIndex =
          0;

        wrapper.style.textDecorationLine =
          'underline';

        wrapper.style.textDecorationStyle =
          'dotted';

        wrapper.style.textDecorationThickness =
          options.thickness ||
          '2px';

        wrapper.style.textUnderlineOffset =
          options.offset ||
          '0.18em';

        wrapper.style.textDecorationColor =
          options.noteColor ||
          options.underlineColor ||
          '#ff5ca8';

        wrapper.style.cursor =
          'help';

      } else {

        wrapper.dataset.usHighlightColor =
          color;

        wrapper.style.backgroundColor =
          color;

        wrapper.style.color =
          options.highlightTextColor ||
          '#111111';

        wrapper.style.boxDecorationBreak =
          'clone';

        wrapper.style.webkitBoxDecorationBreak =
          'clone';

      }

      selectedNode.parentNode.insertBefore(
        wrapper,
        selectedNode
      );

      wrapper.appendChild(
        selectedNode
      );

      wrappers.push(
        wrapper
      );

    }

    return wrappers;

  }

  function clearTextAnnotations(range) {

    if (!(range instanceof Range)) {
      return [];
    }

    const candidates =
      new Set();

    const commonElement =
      range.commonAncestorContainer.nodeType ===
        Node.ELEMENT_NODE
        ? range.commonAncestorContainer
        : range.commonAncestorContainer.parentElement;

    if (commonElement) {

      const enclosing =
        commonElement.closest?.(
          '[data-us-annotation]'
        );

      if (enclosing) {
        candidates.add(enclosing);
      }

      for (
        const node of
        commonElement.querySelectorAll?.(
          '[data-us-annotation]'
        ) ||
        []
      ) {

        try {

          if (
            range.intersectsNode(node)
          ) {
            candidates.add(node);
          }

        } catch (error) {

          // Ignore detached/transient nodes.

        }

      }

    }

    const removed = [];

    for (const wrapper of candidates) {

      if (!wrapper.isConnected) {
        continue;
      }

      const parent =
        wrapper.parentNode;

      if (!parent) {
        continue;
      }

      wrapper._usAnnotationTooltip
        ?.destroy?.();

      while (
        wrapper.firstChild
      ) {

        parent.insertBefore(
          wrapper.firstChild,
          wrapper
        );

      }

      wrapper.remove();

      parent.normalize?.();

      removed.push(
        wrapper
      );

    }

    return removed;

  }

  function textOffsetRange(
    root,
    start,
    end
  ) {

    if (
      !(root instanceof Node) ||
      start < 0 ||
      end < start
    ) {
      return null;
    }

    const walker =
      document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT
      );

    let position = 0;
    let startNode = null;
    let startOffset = 0;
    let endNode = null;
    let endOffset = 0;
    let node =
      root.nodeType === Node.TEXT_NODE
        ? root
        : walker.nextNode();

    while (node) {

      const length =
        node.nodeValue?.length ||
        0;

      const next =
        position +
        length;

      if (
        !startNode &&
        start >= position &&
        start <= next
      ) {

        startNode =
          node;

        startOffset =
          Math.min(
            length,
            start - position
          );

      }

      if (
        startNode &&
        end >= position &&
        end <= next
      ) {

        endNode =
          node;

        endOffset =
          Math.min(
            length,
            end - position
          );

        break;

      }

      position =
        next;

      node =
        root.nodeType === Node.TEXT_NODE
          ? null
          : walker.nextNode();

    }

    if (
      !startNode ||
      !endNode
    ) {
      return null;
    }

    const range =
      document.createRange();

    range.setStart(
      startNode,
      startOffset
    );

    range.setEnd(
      endNode,
      endOffset
    );

    return range;

  }

  function createTextQuoteAnchor(
    range,
    root = document.body,
    options = {}
  ) {

    if (
      !(range instanceof Range) ||
      range.collapsed ||
      !(root instanceof Node)
    ) {
      return null;
    }

    const exact =
      range.toString();

    if (!exact) {
      return null;
    }

    const before =
      document.createRange();

    before.selectNodeContents(
      root
    );

    try {

      before.setEnd(
        range.startContainer,
        range.startOffset
      );

    } catch (error) {

      return null;

    }

    const start =
      before.toString().length;

    const fullText =
      root.textContent ||
      '';

    const end =
      start +
      exact.length;

    const context =
      Math.max(
        0,
        Number(
          options.context ??
          40
        ) || 0
      );

    return Object.freeze({

      exact,

      prefix:
        fullText.slice(
          Math.max(
            0,
            start - context
          ),
          start
        ),

      suffix:
        fullText.slice(
          end,
          end + context
        ),

      start

    });

  }

  function resolveTextQuoteAnchor(
    anchor,
    root = document.body
  ) {

    if (
      !anchor ||
      typeof anchor.exact !== 'string' ||
      !anchor.exact ||
      !(root instanceof Node)
    ) {
      return null;
    }

    const text =
      root.textContent ||
      '';

    const candidates = [];

    let index =
      text.indexOf(
        anchor.exact
      );

    while (index !== -1) {

      const prefix =
        String(
          anchor.prefix ||
          ''
        );

      const suffix =
        String(
          anchor.suffix ||
          ''
        );

      let prefixScore = 0;
      let suffixScore = 0;

      const before =
        text.slice(
          Math.max(
            0,
            index - prefix.length
          ),
          index
        );

      const after =
        text.slice(
          index +
          anchor.exact.length,
          index +
          anchor.exact.length +
          suffix.length
        );

      const prefixLimit =
        Math.min(
          prefix.length,
          before.length
        );

      for (
        let offset = 1;
        offset <= prefixLimit;
        offset += 1
      ) {

        if (
          prefix[
            prefix.length - offset
          ] !==
          before[
            before.length - offset
          ]
        ) {
          break;
        }

        prefixScore += 1;

      }

      const suffixLimit =
        Math.min(
          suffix.length,
          after.length
        );

      for (
        let offset = 0;
        offset < suffixLimit;
        offset += 1
      ) {

        if (
          suffix[offset] !==
          after[offset]
        ) {
          break;
        }

        suffixScore += 1;

      }

      const positionDistance =
        Number.isFinite(
          Number(anchor.start)
        )
          ? Math.abs(
            index -
            Number(anchor.start)
          )
          : 0;

      candidates.push({

        index,

        score:
          prefixScore +
          suffixScore,

        positionDistance

      });

      index =
        text.indexOf(
          anchor.exact,
          index + 1
        );

    }

    if (!candidates.length) {
      return null;
    }

    candidates.sort(
      (
        left,
        right
      ) => {

        if (
          right.score !==
          left.score
        ) {

          return (
            right.score -
            left.score
          );

        }

        return (
          left.positionDistance -
          right.positionDistance
        );

      }
    );

    const selected =
      candidates[0];

    const range =
      textOffsetRange(
        root,
        selected.index,
        selected.index +
          anchor.exact.length
      );

    if (
      !range ||
      range.toString() !==
        anchor.exact
    ) {
      return null;
    }

    return range;

  }
