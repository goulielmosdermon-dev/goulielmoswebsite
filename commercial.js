(function () {
  function showTitle(index, title) {
    if (!title) return;
    document.querySelectorAll(`[data-commercial-title="${index}"]`).forEach(el => {
      el.textContent = (el.classList.contains('sub') ? '/ ' : '') + title;
      if (el.tagName === 'H1') document.title = title + ' — Goulielmos Dermon';
    });
    try { localStorage.setItem('commercial-title-' + index, title); } catch {}
  }
  for (let index = 1; index <= 4; index++) {
    try { showTitle(index, localStorage.getItem('commercial-title-' + index)); } catch {}
  }
  if (!window.Vimeo) return;
  // Vimeo supplies the same poster and title as the linked video, including unlisted videos.
  const seen = new Set();
  document.querySelectorAll('iframe[data-commercial-preview], iframe[data-commercial-video]').forEach(frame => {
    const index = frame.dataset.commercialPreview || frame.dataset.commercialVideo;
    if (seen.has(index)) return;
    seen.add(index);
    new Vimeo.Player(frame).getVideoTitle().then(title => showTitle(index, title)).catch(() => {});
  });
})();
