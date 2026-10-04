/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ VIEWPORT NAVIGATOR                                                           │
└──────────────────────────────────────────────────────────────────────────────┘
*/

  function viewportNavigator(options = {}) {

    const preview = element('img', {
      className: 'us-viewport-navigator-preview',
      attrs: {
        alt: options.alt || '',
        draggable: 'false'
      }
    });

    const viewport = element('div', {
      className: 'us-viewport-navigator-window',
      attrs: { 'aria-hidden': 'true' }
    });

    const root = element('div', {
      className: [
        'us-viewport-navigator',
        options.className || ''
      ].filter(Boolean).join(' '),
      attrs: {
        role: 'application',
        tabindex: '0',
        'aria-label': options.ariaLabel || 'Viewport navigator'
      }
    }, preview, viewport);

    let state = {
      source: options.source || '',
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      rotation: 0,
      visible: false
    };

    let dragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    function clamp01(value) {
      return Math.min(1, Math.max(0, Number(value) || 0));
    }

    function normalize(next = {}) {
      const width = Math.min(1, Math.max(0.02, Number(next.width ?? state.width) || 1));
      const height = Math.min(1, Math.max(0.02, Number(next.height ?? state.height) || 1));

      return {
        source: next.source ?? state.source,
        width,
        height,
        x: Math.min(1 - width, clamp01(next.x ?? state.x)),
        y: Math.min(1 - height, clamp01(next.y ?? state.y)),
        rotation: Number(next.rotation ?? state.rotation) || 0,
        visible: next.visible ?? state.visible
      };
    }

    function getContentRect() {
      const rootRect = root.getBoundingClientRect();
      const boxWidth = Math.max(1, rootRect.width);
      const boxHeight = Math.max(1, rootRect.height);
      const naturalWidth = preview.naturalWidth || 1;
      const naturalHeight = preview.naturalHeight || 1;
      const imageRatio = naturalWidth / naturalHeight;
      const boxRatio = boxWidth / boxHeight;

      let width;
      let height;

      if (imageRatio >= boxRatio) {
        width = boxWidth;
        height = boxWidth / imageRatio;
      }
      else {
        height = boxHeight;
        width = boxHeight * imageRatio;
      }

      const normalizedRotation = ((state.rotation % 360) + 360) % 360;
      if (normalizedRotation === 90 || normalizedRotation === 270) {
        [width, height] = [height, width];
      }

      return {
        left: (boxWidth - width) / 2,
        top: (boxHeight - height) / 2,
        width,
        height,
        rootRect
      };
    }

    function render() {
      if (preview.getAttribute('src') !== state.source) {
        preview.setAttribute('src', state.source || '');
      }

      root.hidden = !state.visible;
      preview.style.transform = `rotate(${state.rotation}deg)`;

      const contentRect = getContentRect();
      viewport.style.left = `${contentRect.left + state.x * contentRect.width}px`;
      viewport.style.top = `${contentRect.top + state.y * contentRect.height}px`;
      viewport.style.width = `${state.width * contentRect.width}px`;
      viewport.style.height = `${state.height * contentRect.height}px`;
    }

    function update(next = {}) {
      state = normalize(next);
      render();
      return root;
    }

    function pointerPosition(event) {
      const contentRect = getContentRect();

      return {
        x: clamp01(
          (event.clientX - contentRect.rootRect.left - contentRect.left) /
          Math.max(1, contentRect.width)
        ),
        y: clamp01(
          (event.clientY - contentRect.rootRect.top - contentRect.top) /
          Math.max(1, contentRect.height)
        )
      };
    }

    function emit(nextX, nextY) {
      const x = Math.min(1 - state.width, Math.max(0, nextX));
      const y = Math.min(1 - state.height, Math.max(0, nextY));

      if (typeof options.onPan === 'function') {
        options.onPan({
          x,
          y,
          width: state.width,
          height: state.height
        });
      }
    }

    function onPointerDown(event) {
      if (!state.visible || event.button > 0) return;

      const point = pointerPosition(event);
      const viewportRect = viewport.getBoundingClientRect();
      const contentRect = getContentRect();

      if (event.target === viewport) {
        dragOffsetX = (event.clientX - viewportRect.left) / Math.max(1, contentRect.width);
        dragOffsetY = (event.clientY - viewportRect.top) / Math.max(1, contentRect.height);
      }
      else {
        dragOffsetX = state.width / 2;
        dragOffsetY = state.height / 2;
        emit(point.x - dragOffsetX, point.y - dragOffsetY);
      }

      dragging = true;
      root.setPointerCapture?.(event.pointerId);
      event.preventDefault();
      event.stopPropagation();
    }

    function onPointerMove(event) {
      if (!dragging) return;

      const point = pointerPosition(event);
      emit(point.x - dragOffsetX, point.y - dragOffsetY);
      event.preventDefault();
      event.stopPropagation();
    }

    function stopDragging(event) {
      if (!dragging) return;

      dragging = false;
      root.releasePointerCapture?.(event.pointerId);
      event.preventDefault();
      event.stopPropagation();
    }

    root.addEventListener('pointerdown', onPointerDown);
    root.addEventListener('pointermove', onPointerMove);
    root.addEventListener('pointerup', stopDragging);
    root.addEventListener('pointercancel', stopDragging);
    root.addEventListener('wheel', (event) => event.stopPropagation());
    preview.addEventListener('load', render);

    const resizeObserver = typeof ResizeObserver === 'function'
      ? new ResizeObserver(render)
      : null;
    resizeObserver?.observe(root);

    root.update = update;
    root.getState = () => ({ ...state });
    root.destroy = () => resizeObserver?.disconnect();

    update({
      source: options.source || '',
      x: options.x ?? 0,
      y: options.y ?? 0,
      width: options.width ?? 1,
      height: options.height ?? 1,
      rotation: options.rotation ?? 0,
      visible: options.visible ?? false
    });

    return root;
  }
