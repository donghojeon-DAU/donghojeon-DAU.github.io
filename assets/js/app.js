(function () {
 'use strict';
 const root = document.getElementById('jeonlab');
 if (!root) return;
 const panels = Array.from(root.querySelectorAll('[data-page]'));
 const tabs = Array.from(root.querySelectorAll('.nav [data-tab]'));
 const names = new Set(panels.map(p => p.dataset.page));
 const aliases = {people:'team', member:'team', members:'team', professor:'team', news:'home', contact:'home', patent:'patents'};
 const pageKey = name => aliases[name] || name;
 const normalize = value => value.toLowerCase().normalize('NFKC').replace(/[\u2010-\u2015]/g,'-');
 let current = root.dataset.defaultPage || 'home';
 function revealActiveTab() {
  const nav=root.querySelector('.nav');
  const selected=root.querySelector('.nav [aria-selected="true"]');
  if(!nav || !selected || nav.scrollWidth<=nav.clientWidth) return;
  const a=nav.getBoundingClientRect(), b=selected.getBoundingClientRect();
  if(b.right>a.right-6) nav.scrollLeft += b.right-a.right+8;
  else if(b.left<a.left+6) nav.scrollLeft -= a.left-b.left+8;
 }
 window.addEventListener('resize',revealActiveTab);
 function activate(name, updateHash, scroll) {
  name = pageKey(name);
  if (!names.has(name)) name = root.dataset.defaultPage || 'home';
  current = name;
  panels.forEach(panel => { panel.hidden = panel.dataset.page !== name; });
  tabs.forEach(tab => {
   const active = tab.dataset.tab === name;
   tab.classList.toggle('active', active);
   tab.setAttribute('aria-selected', String(active));
   tab.tabIndex = active ? 0 : -1;
  });
  root.dataset.currentPage = name;
  const activeTab = tabs.find(tab => tab.dataset.tab === name);
  document.title = (activeTab ? activeTab.textContent.trim() + ' | ' : '') + 'Jeon Lab · Dong-A University';
  revealActiveTab();
  if (updateHash) {
   try { if (window.location.hash !== '#' + name) window.location.hash = name; }
   catch (_) { /* Sandboxed embeds may disallow location changes; tabs still work. */ }
  }
  if (scroll) window.scrollTo({ top: 0, behavior: 'auto' });
 }
 function routeHash(scroll) {
  let key = '';
  try { key = decodeURIComponent(location.hash.slice(1)); } catch (_) {}
  key = pageKey(key);
  if (names.has(key)) { activate(key, false, scroll); return; }
  const target = key ? document.getElementById(key) : null;
  const parent = target && target.closest('[data-page]');
  activate(parent ? parent.dataset.page : (root.dataset.defaultPage || 'home'), false, false);
  if (target && scroll) target.scrollIntoView({ block:'start', behavior:'auto' });
 }
 root.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const hash = pageKey(link.getAttribute('href').slice(1));
  if (names.has(hash)) { event.preventDefault(); activate(hash, true, true); }
  else {
   const target = document.getElementById(hash);
   const panel = target && target.closest('[data-page]');
   if (panel) {
    event.preventDefault(); activate(panel.dataset.page, false, false);
    target.scrollIntoView({block:'start',behavior:'auto'});
   }
  }
 });
 const tablist = root.querySelector('[role="tablist"]');
 if (tablist) tablist.addEventListener('keydown', event => {
  if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
  const index = tabs.indexOf(document.activeElement); if (index < 0) return;
  event.preventDefault();
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length-1 : (index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
  tabs[next].focus(); activate(tabs[next].dataset.tab, true, true);
 });
 window.addEventListener('hashchange', () => routeHash(false));
 routeHash(false);

 // Keep the publication page synchronized with newly published work.
 const publications = root.querySelector('#publications');
 if (publications) {
  const newTitle = 'Localization of steel rebar embedded in cementitious materials using frequency-difference electrical resistance tomography (ERT): Effects of measurement configuration and validation by micro-CT';
  const year2026 = publications.querySelector('#publications-2026');
  const list2026 = year2026 && year2026.querySelector('.paper-list');
  if (list2026 && !list2026.querySelector('.paper[data-number="58"]')) {
   const item = document.createElement('li');
   item.className = 'paper';
   item.dataset.kind = 'journal';
   item.dataset.number = '58';
   item.dataset.year = '2026';
   item.innerHTML = '<div class="paper-number">#58</div><div><h3>'+newTitle+'</h3><p class="authors"><strong>D Jeon</strong>, S Yoon*</p><div class="journal-line"><p class="journal">Construction and Building Materials</p><a class="paper-link" href="https://scholar.google.com/scholar?q='+encodeURIComponent('"'+newTitle+'"')+'" rel="noopener noreferrer" target="_blank">Search title ↗</a></div><p class="source-metric">Impact factor: 8.0 · JCR rank: 4.1%</p></div>';
   list2026.prepend(item);
  }
  if (year2026) {
   const yearCount = year2026.querySelector('h2 span');
   if (yearCount) yearCount.textContent = '8 entries';
  }
  const overviewCount = publications.querySelector('.pub-overview b');
  if (overviewCount) overviewCount.textContent = '58';
  const allYearCount = publications.querySelector('[data-year-filter="all"] span');
  if (allYearCount) allYearCount.textContent = '58';
  const filter2026Count = publications.querySelector('[data-year-filter="2026"] span');
  if (filter2026Count) filter2026Count.textContent = '8';

  const oldReviewTitle = 'High-spatial-resolution mapping of steel rebar-embedded cementitious matrix using frequency-difference electrical resistance tomography (ERT) and performance evaluation via micro-CT';
  const manuscriptItems = Array.from(publications.querySelectorAll('.paper[data-kind="manuscript"]'));
  manuscriptItems.forEach(item => {
   const title = item.querySelector('h3');
   if (title && title.textContent.trim() === oldReviewTitle) item.remove();
  });
  const remainingManuscripts = Array.from(publications.querySelectorAll('.paper[data-kind="manuscript"]'));
  remainingManuscripts.forEach((item, index) => {
   const n = index + 1;
   item.dataset.number = String(n);
   const label = item.querySelector('.paper-number');
   if (label) label.textContent = 'M' + String(n).padStart(2,'0');
  });
  const reviewCount = publications.querySelector('#manuscripts-heading span');
  if (reviewCount) reviewCount.textContent = ' · 5 source entries';
  const consolidated = publications.querySelector('.pub-source p');
  if (consolidated) consolidated.textContent = 'Publication data last consolidated: 10 September 2026.';
 }

 // All bibliographic entries remain in the HTML. Filtering never removes source records.
 const search = root.querySelector('#pub-search');
 if (search) {
  const yearButtons = Array.from(root.querySelectorAll('[data-year-filter]'));
  const journalEntries = Array.from(root.querySelectorAll('.paper[data-kind="journal"]'));
  const manuscriptEntries = Array.from(root.querySelectorAll('.paper[data-kind="manuscript"]'));
  const groups = Array.from(root.querySelectorAll('.pub-year'));
  const reviews = root.querySelector('#manuscripts');
  const count = root.querySelector('#pub-results');
  const noResults = root.querySelector('#no-results');
  let year = 'all';
  function filter() {
   const words = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
   let journals=0;
   const manuscripts=manuscriptEntries.length;
   function matches(el) { const text=normalize(el.textContent); return words.every(word=>text.includes(word)); }
   journalEntries.forEach(entry => {
    entry.hidden = !((year==='all' || entry.dataset.year===year) && matches(entry));
    if (!entry.hidden) journals++;
   });
   groups.forEach(group => { group.hidden = !Array.from(group.querySelectorAll('.paper')).some(p=>!p.hidden); });
   // Manuscripts are a separate, permanently expanded list, independent of journal filters.
   manuscriptEntries.forEach(entry => { entry.hidden = false; });
   reviews.hidden = false;
   const milestones=root.querySelectorAll('.milestone');
   milestones.forEach(node=>{node.hidden=year!=='all'||words.length>0;});
   count.textContent = journals+' of '+journalEntries.length+' journal entries · '+manuscripts+' manuscript entries';
   noResults.hidden = journals!==0;
   root.querySelector('#clear-search').hidden = search.value.length===0;
   yearButtons.forEach(button=>{
    const selected=button.dataset.yearFilter===year;
    button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected));
   });
  }
  yearButtons.forEach(button=>button.addEventListener('click',()=>{ year=button.dataset.yearFilter;filter(); }));
  search.addEventListener('input',filter);
  root.querySelector('#clear-search').addEventListener('click',()=>{ search.value=''; filter(); search.focus(); });
  root.querySelector('#show-review').addEventListener('click',()=>{
   reviews.scrollIntoView({block:'start',behavior:'auto'});
  });
  root.addEventListener('input', event=>{if(event.target.isContentEditable)filter();});
  filter();
 }
 
 // A supplied remote portrait has a neutral initials fallback if the host is unavailable.
 root.querySelectorAll('[data-photo-slot] img').forEach(img => {
  const show = () => { img.hidden=false; };
  const hide = () => { img.hidden=true; };
  img.addEventListener('load',show); img.addEventListener('error',hide);
  if (img.complete) { if (img.naturalWidth) show(); else hide(); }
 });

 root.dataset.ready='true';
})();
