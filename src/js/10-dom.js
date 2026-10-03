  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ DOM PRIMITIVES                                                               │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function appendChildren(parent, children) {

    for (const child of children.flat(Infinity)) {

      if (child == null || child === false) {
        continue;
      }

      if (child instanceof Node) {

        parent.appendChild(child);
        continue;

      }

      parent.appendChild(
        document.createTextNode(
          String(child)
        )
      );

    }

    return parent;

  }

  function element(tagName, options = {}, ...children) {

    const node =
      document.createElement(tagName);

    if (options.className) {
      node.className = options.className;
    }

    if (options.text != null) {
      node.textContent = String(options.text);
    }

    if (options.title) {
      node.title = options.title;
    }

    if (options.id) {
      node.id = options.id;
    }

    if (options.attrs) {

      for (const [name, value] of Object.entries(options.attrs)) {

        if (value == null || value === false) {
          continue;
        }

        node.setAttribute(
          name,
          value === true
            ? ''
            : String(value)
        );

      }

    }

    if (options.dataset) {

      for (const [name, value] of Object.entries(options.dataset)) {

        if (value != null) {
          node.dataset[name] = String(value);
        }

      }

    }

    if (options.style) {

      if (typeof options.style === 'string') {

        node.setAttribute(
          'style',
          options.style
        );

      } else {

        Object.assign(
          node.style,
          options.style
        );

      }

    }

    if (options.on) {

      for (const [eventName, listener] of Object.entries(options.on)) {

        if (typeof listener === 'function') {
          node.addEventListener(eventName, listener);
        }

      }

    }

    appendChildren(
      node,
      children
    );

    return node;

  }

  function icon(name, options = {}) {

    const svg =
      document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg'
      );

    svg.setAttribute(
      'class',
      [
        'us-icon',
        options.className || ''
      ].filter(Boolean).join(' ')
    );

    svg.setAttribute(
      'viewBox',
      options.viewBox || '0 0 24 24'
    );

    svg.setAttribute(
      'width',
      String(
        options.width ||
        24
      )
    );

    svg.setAttribute(
      'height',
      String(
        options.height ||
        24
      )
    );

    svg.setAttribute(
      'fill',
      'none'
    );

    svg.setAttribute(
      'stroke',
      options.stroke || 'currentColor'
    );

    svg.setAttribute(
      'stroke-width',
      String(
        options.strokeWidth ||
        2
      )
    );

    svg.setAttribute(
      'stroke-linecap',
      'round'
    );

    svg.setAttribute(
      'stroke-linejoin',
      'round'
    );

    svg.setAttribute(
      'aria-hidden',
      'true'
    );

    svg.innerHTML =
      ICONS[name] || '';

    return svg;

  }


  const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  function focusableElements(root) {

    if (!(root instanceof Element)) {
      return [];
    }

    return Array.from(
      root.querySelectorAll(
        FOCUSABLE_SELECTOR
      )
    ).filter(
      (node) =>
        !node.hidden &&
        node.getAttribute('aria-hidden') !== 'true' &&
        node.getClientRects().length > 0
    );

  }

  function focusInitial(root, preferred = null) {

    const target =
      preferred instanceof Element &&
      root.contains(preferred)
        ? preferred
        : focusableElements(root)[0] ||
          root;

    if (
      target instanceof HTMLElement &&
      typeof target.focus === 'function'
    ) {
      target.focus({
        preventScroll: true
      });
    }

    return target;

  }

  function trapFocus(event, root) {

    if (
      event.key !== 'Tab' ||
      !(root instanceof Element)
    ) {
      return false;
    }

    const focusable =
      focusableElements(root);

    if (!focusable.length) {
      event.preventDefault();
      focusInitial(root);
      return true;
    }

    const first =
      focusable[0];

    const last =
      focusable[
        focusable.length - 1
      ];

    const active =
      document.activeElement;

    if (
      event.shiftKey &&
      (
        active === first ||
        !root.contains(active)
      )
    ) {
      event.preventDefault();
      last.focus({
        preventScroll: true
      });
      return true;
    }

    if (
      !event.shiftKey &&
      (
        active === last ||
        !root.contains(active)
      )
    ) {
      event.preventDefault();
      first.focus({
        preventScroll: true
      });
      return true;
    }

    return false;

  }
