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
