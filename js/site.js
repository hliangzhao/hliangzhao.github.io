(() => {
  const menus = [...document.querySelectorAll('.mobile-menu')];

  menus.forEach((menu) => {
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => menu.removeAttribute('open'));
    });
  });

  document.addEventListener('click', (event) => {
    menus.forEach((menu) => {
      if (!menu.contains(event.target)) menu.removeAttribute('open');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') menus.forEach((menu) => menu.removeAttribute('open'));
  });

  const isChinese = document.documentElement.lang.toLowerCase().startsWith('zh');
  const scrollLabel = isChinese ? '左右滑动查看 ↔' : 'Swipe to view ↔';
  const scrollTargets = [...document.querySelectorAll('.table-scroll, .math-block')];
  const updates = [];

  scrollTargets.forEach((target) => {
    const frame = document.createElement('div');
    const isTable = target.classList.contains('table-scroll');
    frame.className = `scroll-affordance scroll-affordance-${isTable ? 'table' : 'math'}`;
    target.before(frame);
    frame.append(target);

    const hint = document.createElement('span');
    hint.className = 'scroll-hint';
    hint.setAttribute('aria-hidden', 'true');
    hint.textContent = scrollLabel;
    frame.prepend(hint);

    const update = () => {
      const overflowing = target.scrollWidth > target.clientWidth + 2;
      const atEnd = target.scrollLeft + target.clientWidth >= target.scrollWidth - 2;
      frame.classList.toggle('is-overflowing', overflowing);
      frame.classList.toggle('at-end', !overflowing || atEnd);
    };

    updates.push(update);
    target.addEventListener('scroll', update, { passive: true });
    new ResizeObserver(update).observe(target);
    new MutationObserver(update).observe(target, { childList: true, subtree: true });
    requestAnimationFrame(update);
  });

  window.addEventListener('load', () => updates.forEach((update) => update()));
})();
