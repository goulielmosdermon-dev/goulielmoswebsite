document.querySelectorAll('.filmpage .player .hit, .film-preview .shot, .films .tile').forEach(hit => {
  const isPlayer = hit.classList.contains('hit');
  const target = hit.matches('.tile') ? hit.querySelector('img') : hit;

  const cursor = document.createElement('span');
  cursor.className = 'film-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<svg viewBox="0 0 12 14" focusable="false"><path d="M1 1L11 7L1 13Z"/></svg><span>' + (isPlayer ? 'play' : 'watch') + '</span>';
  hit.append(cursor);

  const move = event => {
    if (event.pointerType !== 'mouse') return;
    const rect = hit.getBoundingClientRect();
    cursor.style.left = `${event.clientX - rect.left}px`;
    cursor.style.top = `${event.clientY - rect.top}px`;
    hit.classList.add('cursor-visible');
  };
  const hide = () => hit.classList.remove('cursor-visible');
  target.addEventListener('pointerenter', move);
  target.addEventListener('pointermove', move);
  target.addEventListener('pointerleave', hide);
  target.addEventListener('pointercancel', hide);
  window.addEventListener('blur', hide);
  window.addEventListener('scroll', hide, { passive: true });
});
