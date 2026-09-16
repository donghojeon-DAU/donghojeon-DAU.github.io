(function () {
  'use strict';

  // Home refinements requested for the current layout.
  const homeLead = document.querySelector('.home-hero .home-lead');
  if (homeLead) homeLead.remove();
  const recruitment = document.getElementById('students');
  const homeContact = document.querySelector('.home-contact');
  if (recruitment && homeContact) homeContact.before(recruitment);

  // Replace Research at a glance with Recent Research Highlights.
  const homeResearch = document.getElementById('home-research');
  if (homeResearch) {
    homeResearch.innerHTML = '<div class="home-section-head"><h2>Recent Research Highlights</h2><a href="#publications">View publications ↗</a></div>' +
      '<ol class="recent-research-highlights" style="margin:0;padding-left:1.5rem;display:grid;gap:1.2rem">' +
      '<li><strong>Physics-Informed Neural Network Surrogate for Predicting Hydration Heat Evolution Profiles of Portland Limestone Cement (PLC)</strong><div style="margin-top:.3rem;font-size:1.02em"><em>Developments in the Built Environment</em> · JCR Top 3% · 2026</div></li>' +
      '<li><strong>Multi-Mode Piezoelectric (PZT) Sensing for In-Situ Profiling of the Evolution of Dynamic Properties in Cement-Based Materials</strong><div style="margin-top:.3rem;font-size:1.02em"><em>Cement and Concrete Composites</em> · JCR Top 0.5% · 2026</div></li>' +
      '<li><strong>Hybrid Machine Learning Framework for Predicting Pozzolanic Reactivity: Integration of R3 Test and GAN-Augmented Data</strong><div style="margin-top:.3rem;font-size:1.02em"><em>Construction and Building Materials</em> · JCR Top 4% · 2026</div></li>' +
      '<li><strong>Deep Learning-Based Site-Specific Prediction of Rail Joint-Gap Variations on Curved Ballasted Track Using Field-Measured Rail Data</strong><div style="margin-top:.3rem;font-size:1.02em"><em>Case Studies in Construction Materials</em> · JCR Top 8% · 2025</div></li>' +
      '<li><strong>High-Accuracy Rebar Position Detection Using Deep Learning–Based Frequency-Difference Electrical Resistance Tomography</strong><div style="margin-top:.3rem;font-size:1.02em"><em>Automation in Construction</em> · JCR Top 0.3% · 2022</div></li>' +
      '</ol>';
  }

  // Remove publication result-count text.
  const publicationResults = document.getElementById('pub-results');
  if (publicationResults) publicationResults.remove();

  // Show publication year directly after the journal name.
  document.querySelectorAll('#publications .paper[data-kind="journal"][data-year]').forEach(paper => {
    const year = paper.dataset.year;
    if (!year) return;
    const journal = paper.querySelector('.journal');
    if (!journal) return;
    const oldYear = journal.querySelector('.publication-year');
    if (oldYear) oldYear.remove();
    const yearSpan = document.createElement('span');
    yearSpan.className = 'publication-year';
    yearSpan.textContent = ' (' + year + ')';
    yearSpan.style.fontSize = '1.08em';
    yearSpan.style.fontWeight = '700';
    yearSpan.style.marginLeft = '.28em';
    journal.appendChild(yearSpan);
    journal.style.fontSize = '1.08em';
  });

  // Add PI email under the affiliation on the Team page.
  const piIntro = document.querySelector('#member-pi .pi-intro');
  if (piIntro && !piIntro.querySelector('.pi-email')) {
    const affiliation = piIntro.querySelector('.member-affiliation');
    const email = document.createElement('p');
    email.className = 'pi-email';
    email.style.marginTop = '.55rem';
    email.innerHTML = '<a href="mailto:donghojeon@dau.ac.kr">donghojeon@dau.ac.kr</a>';
    if (affiliation) affiliation.after(email); else piIntro.appendChild(email);
  }

  // Google Analytics 4 (GA4).
  const GA_MEASUREMENT_ID = 'G-3FSHGF4PRY';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);
  if (!document.querySelector('script[data-jeonlab-ga4]')) {
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_MEASUREMENT_ID);
    gaScript.dataset.jeonlabGa4 = 'true';
    document.head.appendChild(gaScript);
  }

  // Additional Jeon Lab news item.
  const homeNews = document.getElementById('home-news');
  if (homeNews && !homeNews.querySelector('[data-news-id="otim-ucu-2026-09"]')) {
    const year2026 = Array.from(homeNews.querySelectorAll('.news-year')).find(el => el.textContent.trim() === '2026');
    const list2026 = year2026 && year2026.nextElementSibling;
    if (list2026 && list2026.classList.contains('news-list')) {
      const item = document.createElement('li');
      item.className = 'news-item';
      item.dataset.newsId = 'otim-ucu-2026-09';
      item.innerHTML = '<time datetime="2026-09">2026.09</time><p>Otim Kelvin Kennedy (M.S. graduate) Lecturer 임용 (Uganda Christian University, Department of Engineering and Environment)</p>';
      list2026.prepend(item);
    }
  }

  // Update award news titles and links.
  if (homeNews) {
    const newsItems = Array.from(homeNews.querySelectorAll('.news-item'));
    const researchAward = newsItems.find(item => item.textContent.includes('최우수 연구업적 교원'));
    if (researchAward) {
      const p = researchAward.querySelector('p');
      if (p) p.innerHTML = '2026학년도 최우수 연구업적 교원 (동아대학교) <a href="https://www.donga.ac.kr/kor/CMS/Board/Board.do?mCode=MN044&amp;mode=view&amp;mgr_seq=54&amp;board_seq=8516311" rel="noopener noreferrer" target="_blank">News Link ↗</a>';
    }
    const teachingAward = newsItems.find(item => item.textContent.includes('최우수 강의교원'));
    if (teachingAward) {
      const p = teachingAward.querySelector('p');
      if (p) p.innerHTML = '2025 최우수 강의교원 (동아대학교) <a href="https://www.donga.ac.kr/kor/CMS/Board/Board.do?mcode=&amp;mCode=MN044&amp;searchID=sch002&amp;searchKeyword=%EC%A0%84%EB%8F%99%ED%98%B8&amp;searchCategory=&amp;mgr_seq=54&amp;mode=view&amp;mgr_seq=54&amp;board_seq=8420707" rel="noopener noreferrer" target="_blank">News Link ↗</a>';
    }
  }

  // Move Otim Kelvin Kennedy from current members to alumni.
  const memberSection = document.getElementById('member-students');
  const alumniSection = document.getElementById('member-alumni');
  if (memberSection && alumniSection) {
    const kelvinProfile = Array.from(memberSection.querySelectorAll('.student-profile')).find(profile => {
      const name = profile.querySelector('h3');
      return name && name.textContent.trim() === 'Otim Kelvin Kennedy';
    });
    if (kelvinProfile) kelvinProfile.remove();
    const memberCount = memberSection.querySelector('.heading-count');
    if (memberCount) memberCount.textContent = '01';
    const alumniCount = alumniSection.querySelector('.heading-count');
    if (alumniCount) alumniCount.textContent = '07';
    if (!alumniSection.querySelector('[data-alumni-id="otim-kelvin-kennedy"]')) {
      const undergraduateTitle = alumniSection.querySelector('.alumni-subtitle');
      const graduateTitle = document.createElement('h3');
      graduateTitle.className = 'alumni-subtitle';
      graduateTitle.dataset.alumniId = 'otim-kelvin-kennedy';
      graduateTitle.innerHTML = 'M.S. graduates <span lang="ko">· 석사 졸업생</span>';
      const graduateTable = document.createElement('table');
      graduateTable.className = 'alumni-table';
      graduateTable.innerHTML = '<caption class="visually-hidden">Master alumni, graduation dates, and affiliations or careers</caption><thead><tr><th scope="col">Name</th><th scope="col">Graduation</th><th scope="col">Affiliation / career</th></tr></thead><tbody><tr><th scope="row">Otim Kelvin Kennedy</th><td>2026.08</td><td>Uganda Christian University</td></tr></tbody>';
      if (undergraduateTitle) alumniSection.insertBefore(graduateTitle, undergraduateTitle);
      else alumniSection.appendChild(graduateTitle);
      alumniSection.insertBefore(graduateTable, undergraduateTitle || null);
    }
  }

  const API_URL = 'https://script.google.com/macros/s/AKfycbw8KdVwuTvAOGnOLgmsHSzkh-zFCXxtgJrCI0KLcx1yMa8jma8ehMgadKVHuIo6HLbT/exec';
  const panel = document.getElementById('photo');
  if (!panel) return;
  const oldGrid = panel.querySelector('.photo-grid');
  const oldNote = panel.querySelector('.photo-note');
  const shell = document.createElement('section');
  shell.className = 'drive-gallery-shell';
  shell.setAttribute('aria-label', 'Jeon Lab photo gallery');
  shell.innerHTML = '<p class="drive-gallery-status" role="status">Loading photos…</p><div class="drive-gallery" hidden></div>';
  if (oldGrid) oldGrid.replaceWith(shell); else panel.appendChild(shell);
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
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

  function cleanName(name) {
    return String(name || '').replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function render(photos) {
    if (!Array.isArray(photos) || photos.length === 0) {
      status.textContent = 'No photos have been added yet.'; grid.hidden = true; return;
    }
    grid.innerHTML = '';
    photos.forEach((photo, index) => {
      const title = cleanName(photo.name) || ('Photo ' + (index + 1));
      const card = document.createElement('button');
      card.type = 'button'; card.className = 'drive-photo-card'; card.setAttribute('aria-label', 'Open ' + title);
      const img = document.createElement('img');
      img.loading = index < 6 ? 'eager' : 'lazy'; img.decoding = 'async'; img.alt = title; img.src = photo.image;
      const caption = document.createElement('span'); caption.className = 'drive-photo-caption'; caption.textContent = title;
      card.append(img, caption);
      card.addEventListener('click', () => {
        dialogImg.src = photo.image; dialogImg.alt = title; dialogCaption.textContent = title;
        if (typeof dialog.showModal === 'function') dialog.showModal(); else window.open(photo.image, '_blank', 'noopener');
      });
      grid.appendChild(card);
    });
    status.textContent = photos.length + (photos.length === 1 ? ' photo' : ' photos');
    status.classList.add('drive-gallery-count'); grid.hidden = false;
  }
  function fail() { status.textContent = 'Photos could not be loaded. Please try again later.'; grid.hidden = true; }
  window.jeonLabPhotos = function (photos) { render(photos); try { delete window.jeonLabPhotos; } catch (_) {} };
  const script = document.createElement('script');
  script.src = API_URL + '?callback=jeonLabPhotos&_=' + Date.now(); script.async = true; script.onerror = fail;
  document.head.appendChild(script);
})();
