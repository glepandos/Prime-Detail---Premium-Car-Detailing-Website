'use client';

import { useEffect, useRef } from 'react';

const interactive = 'a[href], button, summary, label[for], select, [role="button"], [role="link"], input[type="checkbox"], input[type="radio"], .cursor-pointer';

export default function AnimatedCursor() {
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const root = document.documentElement;
    let visible = false;
    const hide = () => {
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
      node.dataset.hover = String(hover);
      node.style.transform = `translate3d(${event.clientX - 8}px, ${event.clientY - 5}px, 0)`;
      if (!visible) {
        root.setAttribute('data-studio-cursor', '');
        node.style.visibility = 'visible';
        visible = true;
      }
    };
    // Both images stay mounted so the browser preserves the original WebP timing.
    const sync = (event: PointerEvent) => move(event);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', sync, { passive: true });
    document.documentElement.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);
    const visibility = () => { if (document.hidden) hide(); };
    document.addEventListener('visibilitychange', visibility);
    finePointer.addEventListener('change', hide);
    return () => {
      hide();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', sync);
      document.documentElement.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
      document.removeEventListener('visibilitychange', visibility);
      finePointer.removeEventListener('change', hide);
    };
  }, []);

  return (
    <div ref={cursor} className="studio-cursor" aria-hidden="true" data-hover="false">
      {/* Native img preserves animated WebP frames without a JS animation loop. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="studio-cursor-normal" src="/cursors/normal.webp" width="32" height="32" alt="" draggable="false" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="studio-cursor-hover" src="/cursors/hover.webp" width="32" height="32" alt="" draggable="false" />
    </div>
  );
}
