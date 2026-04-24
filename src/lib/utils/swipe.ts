export function swipe(
  node: HTMLElement,
  options: { onSwipe: (dir: 'left' | 'right') => void; threshold?: number }
) {
  const threshold = options.threshold ?? 60;
  let startX = 0;
  let startY = 0;
  let isTouching = false;

  function onStart(e: TouchEvent) {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    isTouching = true;
  }

  function onEnd(e: TouchEvent) {
    if (!isTouching) return;
    isTouching = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    if (Math.abs(dx) < threshold) return;
    if (Math.abs(dy) > Math.abs(dx) * 0.7) return;
    options.onSwipe(dx < 0 ? 'left' : 'right');
  }

  node.addEventListener('touchstart', onStart, { passive: true });
  node.addEventListener('touchend', onEnd, { passive: true });

  return {
    destroy() {
      node.removeEventListener('touchstart', onStart);
      node.removeEventListener('touchend', onEnd);
    }
  };
}
