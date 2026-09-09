(function () {
  'use strict';

  const API_URL = 'https://script.google.com/macros/s/AKfycbw8KdVwuTvAOGnOLgmsHSzkh-zFCXxtgJrCI0KLcx1yMa8jma8ehMgadKVHuIo6HLbT/exec';
  const panel = document.getElementById('photo');
  if (!panel) return;

  const oldGrid = panel.querySelector('.photo-grid');
  const oldNote = panel.querySelector('.photo-note');

  const shell = document.createElement('section');
  shell.className = 'drive-gallery-shell';
  shell.setAttribute('aria-label', 'Jeon Lab photo gallery');
  shell.innerHTML = '<p class="drive-gallery-status" role="status">Loading photos…</p><div class="drive-gallery" hidden></div>';

  if (oldGrid) oldGrid.replaceWith(shell);
  else panel.appendChild(shell);
  if (oldNote) oldNote.remove();

  const status = shell.querySelector('.drive-gallery-status');
  const grid = shell.querySelector('.drive-gallery');

  const dialog = document.createElement('dialog');
  dialog.className = 'photo-lightbox';
  dialog.innerHTML = '<button class="photo-lightbox-close" type="button" aria-label="Close photo">×</button><img alt=""><p></p>';
  panel.appendChild(dialog);

  const dialogImg = dialog.querySelector('img');
  const dialogCaption = dialog.querySelector('p');
  dialog.querySelector('.photo-lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });

  function cleanName(name) {
    return String(name || '')
      .replace(/\.[^.]+$/, '')
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function render(photos) {
    if (!Array.isArray(photos) || photos.length === 0) {
      status.textContent = 'No photos have been added yet.';
      grid.hidden = true;
      return;
    }

    grid.innerHTML = '';
    photos.forEach((photo, index) => {
      const title = cleanName(photo.name) || ('Photo ' + (index + 1));
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'drive-photo-card';
      card.setAttribute('aria-label', 'Open ' + title);

      const img = document.createElement('img');
      img.loading = index < 6 ? 'eager' : 'lazy';
      img.decoding = 'async';
      img.alt = title;
      img.src = photo.image;

      const caption = document.createElement('span');
      caption.className = 'drive-photo-caption';
      caption.textContent = title;

      card.append(img, caption);
      card.addEventListener('click', () => {
        dialogImg.src = photo.image;
        dialogImg.alt = title;
        dialogCaption.textContent = title;
        if (typeof dialog.showModal === 'function') dialog.showModal();
        else window.open(photo.image, '_blank', 'noopener');
      });
      grid.appendChild(card);
    });

    status.textContent = photos.length + (photos.length === 1 ? ' photo' : ' photos');
    status.classList.add('drive-gallery-count');
    grid.hidden = false;
  }

  function fail() {
    status.textContent = 'Photos could not be loaded. Please try again later.';
    grid.hidden = true;
  }

  window.jeonLabPhotos = function (photos) {
    render(photos);
    try { delete window.jeonLabPhotos; } catch (_) {}
  };

  const script = document.createElement('script');
  script.src = API_URL + '?callback=jeonLabPhotos&_=' + Date.now();
  script.async = true;
  script.onerror = fail;
  document.head.appendChild(script);
})();
