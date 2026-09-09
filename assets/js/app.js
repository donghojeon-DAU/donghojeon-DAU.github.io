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
   catch (_) {}
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

 // Full news archive on the Home page.
 const homeNews = root.querySelector('#home-news');
 if (homeNews) {
  homeNews.innerHTML = '<div class="home-section-head"><h2>News</h2></div>'+
   '<div class="news-archive">'+
   '<h3 class="news-year">2026</h3><ul class="news-list">'+
   '<li class="news-item"><time datetime="2026-09">2026.09</time><p>2026년 부산도시공사 기술자문위원회 위원 위촉</p></li>'+
   '<li class="news-item"><time datetime="2026-09">2026.09</time><p>IABSE Congress Incheon 2026. Session Organizer (S05: Physics-informed machine learning for structural and concrete systems)</p></li>'+
   '<li class="news-item"><time datetime="2026-08">2026.08</time><p>2026년 부산지역 연구개발 우수성과 선정 (BISTEP) - 석사과정 변예림</p></li>'+
   '<li class="news-item"><time datetime="2026-08">2026.08</time><p>2026학년도 후기 대학원 우수연구상 수상 (동아대학교) - 석사과정 Otim Kelvin Kennedy</p></li>'+
   '<li class="news-item"><time datetime="2026-08">2026.08</time><p>콘크리트 다중모드 압전센싱 연구 뉴스 보도 <a href="https://www.kookje.co.kr/news2011/asp/newsbody.asp?code=0300&amp;key=20260804.99099000879" rel="noopener noreferrer" target="_blank">News Link ↗</a></p></li>'+
   '<li class="news-item"><time datetime="2026-08">2026.08</time><p>2026년 부산교통공사 기술자문위원회 위원 위촉</p></li>'+
   '<li class="news-item"><time datetime="2026-07">2026.07</time><p>2026년 부산광역시 건설기술심의위원회 위원 위촉</p></li>'+
   '<li class="news-item"><time datetime="2026-04">2026.04</time><p>2026 여대학원생 공학연구팀제 심화과정 선정 (과기정통부·WISET) - 석사과정 변예림 <a href="https://www.kyosu.net/news/articleView.html?idxno=203489" rel="noopener noreferrer" target="_blank">News Link ↗</a></p></li>'+
   '<li class="news-item"><time datetime="2026-03">2026.03</time><p>2025 최우수 강의교원 선정 (동아대학교)</p></li>'+
   '<li class="news-item"><time datetime="2026-01">2026.01</time><p>기술이전(노하우) 계약 (타스(TASS)) - 금속 잔재물 활용 콘크리트 배합 및 제조 실험</p></li>'+
   '</ul>'+
   '<h3 class="news-year">2025</h3><ul class="news-list">'+
   '<li class="news-item"><time datetime="2025-03">2025.03</time><p>변예림 학생 석사과정 입학</p></li>'+
   '</ul>'+
   '<h3 class="news-year">2024</h3><ul class="news-list">'+
   '<li class="news-item"><time datetime="2024-12">2024.12</time><p>2024 콘크리트 기술경연대회 학부생 수상 (한국콘크리트학회) - 학부과정 임동훈·김준영·변예림·송윤섭·이재혁·최성호 <a href="https://www.kci.or.kr/upload/mailing/217_250506164548352.pdf" rel="noopener noreferrer" target="_blank">News Link ↗</a></p></li>'+
   '<li class="news-item"><time datetime="2024-09">2024.09</time><p>Otim Kelvin Kennedy 학생 석사과정 입학 (GKS student)</p></li>'+
   '<li class="news-item"><time datetime="2024-02">2024.02</time><p>청촌장학재단 연구비 선정 (청촌장학재단, 디엔오토모티브) <a href="https://www.busan.com/view/busan/view.php?code=2024030616415332800" rel="noopener noreferrer" target="_blank">News Link ↗</a></p></li>'+
   '</ul>'+
   '<h3 class="news-year">2023</h3><ul class="news-list">'+
   '<li class="news-item"><time datetime="2023-03">2023.03</time><p>동아대학교 건설시스템공학과 조교수 임용</p></li>'+
   '</ul></div>';
 }

 // Keep the publication page synchronized with current publication/manuscript records.
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

  const manuscripts = [
   ['Hydration kinetics, phase evolution, and microstructural impacts of sodium bicarbonate–incorporated MgO–activated slag','Results in Engineering'],
   ['Synthesis of FAU-type microporous zeolite as a CO2-responsive internal reservoir for enhanced carbonation curing of Portland cement: Hydration and microstructural evolution','Journal of Building Engineering'],
   ['Rapid early strength development and phase evolution in a waste oyster shell-derived calcium carbonate binder via aluminate-induced reactions','Journal of Cleaner Production'],
   ['Fe-Doped Olivine–Derived Carbon Dioxide Removal (CDR) Binders Enabled by Thermally Driven Ca2+/Mg2+ Exchange and Carbonation-Induced Strength Development','Construction and Building Materials'],
   ['Influence of calcium nitrate-impregnated biochar on hydration of Portland cement paste','Case Studies in Construction Materials'],
   ['Triethanolamine (TEA)-induced enhancement and microstructural densification of biochar-incorporated CaO-NaOH-activated GGBFS binders','Case Studies in Construction Materials'],
   ['Calcium carboxylate-enabled water resistance in mechanochemically modified fly ash-based cementless binders with saturated fatty acids of varying chain lengths','Developments in the Built Environment'],
   ['Effect of oyster shell incorporation on the mechanical performance and reaction characteristics of metakaolin-based geopolymers','Journal of Building Engineering'],
   ['Ethylenediaminetetraacetic acid (EDTA)-regulated hydration-carbonation reactions for strength enhancement of water-mixed high-calcium fly ash under early CO2 curing','Journal of Building Engineering'],
   ['Triethanolamine (TEA)-induced strength enhancement and reaction characteristics of calcium formate-CaO-activated cementless GGBFS binders','Journal of Building Engineering']
  ];
  const reviewSection = publications.querySelector('#manuscripts');
  if (reviewSection) {
   const list = reviewSection.querySelector('.paper-list');
   if (list) {
    list.innerHTML = '';
    manuscripts.forEach((record,index) => {
     const n=index+1;
     const item=document.createElement('li');
     item.className='paper';
     item.dataset.kind='manuscript';
     item.dataset.number=String(n);
     item.dataset.year='';
     item.innerHTML='<div class="paper-number">M'+String(n).padStart(2,'0')+'</div><div><span class="review-status">Under revision</span><h3>'+record[0]+'</h3><div class="journal-line"><p class="journal">'+record[1]+'</p></div></div>';
     list.appendChild(item);
    });
   }
   const reviewCount = publications.querySelector('#manuscripts-heading span');
   if (reviewCount) reviewCount.textContent = ' · 10 entries';
   const subnote = reviewSection.querySelector('.subnote');
   if (subnote) subnote.textContent = 'Manuscripts currently under revision. These are not counted as journal publications and remain visible regardless of the publication filters above.';
  }
  const sourceParas = Array.from(publications.querySelectorAll('.pub-source p'));
  sourceParas.forEach(p => {
   if (p.textContent.includes('PLC hydration-heat manuscript')) p.remove();
  });
  const consolidated = publications.querySelector('.pub-source p');
  if (consolidated) consolidated.textContent = 'Publication data last consolidated: 10 September 2026.';
 }

 // All bibliographic entries remain in the HTML. Filtering never removes journal records.
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
   const manuscriptCount=manuscriptEntries.length;
   function matches(el) { const text=normalize(el.textContent); return words.every(word=>text.includes(word)); }
   journalEntries.forEach(entry => {
    entry.hidden = !((year==='all' || entry.dataset.year===year) && matches(entry));
    if (!entry.hidden) journals++;
   });
   groups.forEach(group => { group.hidden = !Array.from(group.querySelectorAll('.paper')).some(p=>!p.hidden); });
   manuscriptEntries.forEach(entry => { entry.hidden = false; });
   if (reviews) reviews.hidden = false;
   const milestones=root.querySelectorAll('.milestone');
   milestones.forEach(node=>{node.hidden=year!=='all'||words.length>0;});
   if (count) count.textContent = journals+' of '+journalEntries.length+' journal entries · '+manuscriptCount+' manuscript entries';
   if (noResults) noResults.hidden = journals!==0;
   const clear=root.querySelector('#clear-search');
   if (clear) clear.hidden = search.value.length===0;
   yearButtons.forEach(button=>{
    const selected=button.dataset.yearFilter===year;
    button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected));
   });
  }
  yearButtons.forEach(button=>button.addEventListener('click',()=>{ year=button.dataset.yearFilter;filter(); }));
  search.addEventListener('input',filter);
  const clear=root.querySelector('#clear-search');
  if (clear) clear.addEventListener('click',()=>{ search.value=''; filter(); search.focus(); });
  const showReview=root.querySelector('#show-review');
  if (showReview && reviews) showReview.addEventListener('click',()=>{ reviews.scrollIntoView({block:'start',behavior:'auto'}); });
  root.addEventListener('input', event=>{if(event.target.isContentEditable)filter();});
  filter();
 }

 root.querySelectorAll('[data-photo-slot] img').forEach(img => {
  const show = () => { img.hidden=false; };
  const hide = () => { img.hidden=true; };
  img.addEventListener('load',show); img.addEventListener('error',hide);
  if (img.complete) { if (img.naturalWidth) show(); else hide(); }
 });

 root.dataset.ready='true';
})();
