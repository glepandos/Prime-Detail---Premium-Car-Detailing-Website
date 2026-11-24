'use client';

import { useEffect, useRef } from 'react';

const interactive = 'a[href], button, summary, label[for], select, [role="button"], [role="link"], input[type="checkbox"], input[type="radio"], .cursor-pointer';

export default function AnimatedCursor() {
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const root = document.documentElement;
    let visible = false;
    let frame = 0;
    let hovered = false;
    let pixelRatio = window.devicePixelRatio || 1;
    let position = { x: 0, y: 0 };
    const place = () => {
      if (!cursor.current) return;
      // Cancel browser zoom: the artwork remains 32 device pixels, like a native cursor.
      cursor.current.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) scale(${1 / pixelRatio}) translate(-8px, -5px)`;
    };
    const resize = () => {
      const nextRatio = window.devicePixelRatio || 1;
      position = { x: position.x * pixelRatio / nextRatio, y: position.y * pixelRatio / nextRatio };
      pixelRatio = nextRatio;
      place();
    };
    let timer: ReturnType<typeof setTimeout> | undefined;
    const draw = () => {
      if (!cursor.current) return;
      cursor.current.dataset.frame = String(frame);
      const sprite = cursor.current.querySelector<HTMLElement>('.studio-cursor-frames');
      if (sprite) sprite.style.backgroundPositionY = `${-frame * 32}px`;
    };
    const step = () => {
      timer = undefined;
      const destination = hovered ? 10 : 0;
      if (frame === destination) return;
      frame += Math.sign(destination - frame);
      draw();
      if (frame !== destination) timer = setTimeout(step, 100);
    };
    const transition = (next: boolean) => {
      if (next === hovered) return;
      hovered = next;
      if (timer !== undefined) clearTimeout(timer);
      timer = setTimeout(step, 100);
    };
    const hide = () => {
      if (timer !== undefined) clearTimeout(timer);
      timer = undefined;
      hovered = false;
      frame = 0;
      draw();
      root.removeAttribute('data-studio-cursor');
      if (cursor.current) cursor.current.style.visibility = 'hidden';
      visible = false;
    };
    const move = (event: PointerEvent) => {
      const node = cursor.current;
      if (!node || !finePointer.matches || event.pointerType === 'touch') { hide(); return; }
      const target = event.target instanceof Element ? event.target : null;
      if (!target) { hide(); return; }
      const native = getComputedStyle(target).cursor;
      // Keep native text insertion, resizing, disabled and dragging feedback.
      if (['text', 'vertical-text', 'ew-resize', 'ns-resize', 'col-resize', 'row-resize', 'not-allowed', 'wait', 'grab', 'grabbing'].includes(native)
        || target.closest('textarea, [contenteditable="true"], [role="slider"], input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]), :disabled, [aria-disabled="true"]')) {
        hide(); return;
      }
      const hover = !!target.closest(interactive);
      transition(hover);
      position = { x: event.clientX, y: event.clientY };
      pixelRatio = window.devicePixelRatio || 1;
      place();
      if (!visible) {
        root.setAttribute('data-studio-cursor', '');
        node.style.visibility = 'visible';
        visible = true;
      }
    };
    // Original 100 ms frames play once, hold at either end, and reverse in place.
    const sync = (event: PointerEvent) => move(event);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', sync, { passive: true });
    document.documentElement.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);
    window.addEventListener('resize', resize, { passive: true });
    const visibility = () => { if (document.hidden) hide(); };
    document.addEventListener('visibilitychange', visibility);
    finePointer.addEventListener('change', hide);
    return () => {
      hide();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', sync);
      document.documentElement.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', visibility);
      finePointer.removeEventListener('change', hide);
    };
  }, []);

  return (
    <div ref={cursor} className="studio-cursor" aria-hidden="true" data-frame="0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="studio-cursor-normal" src="/cursors/normal.webp" width="32" height="32" alt="" draggable="false" />
      <span className="studio-cursor-frames" />
    </div>
  );
}
