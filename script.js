(() => {
  const root = document.documentElement;
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');
  const themeButtons = [...document.querySelectorAll('[data-theme-choice]')];
  let preference = root.dataset.preference;
  function applyTheme() {
    root.dataset.preference = preference;
    root.dataset.theme = preference === 'auto' ? (systemTheme.matches ? 'dark' : 'light') : preference;
    themeButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.themeChoice === preference)));
  }
  applyTheme();
  themeButtons.forEach(button => button.addEventListener('click', () => {
    preference = button.dataset.themeChoice;
    applyTheme();
    try { localStorage.setItem('edwei-theme', preference); } catch {}
  }));
  systemTheme.addEventListener('change', () => { if (preference === 'auto') applyTheme(); });
  window.addEventListener('storage', event => {
    if (event.key !== 'edwei-theme' && event.key !== null) return;
    preference = ['light','dark'].includes(event.newValue) ? event.newValue : 'auto';
    applyTheme();
  });

  const mobile = matchMedia('(max-width: 760px)');
  const toggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('#sidebar');
  const backdrop = document.querySelector('.sidebar-backdrop');
  function syncSidebar() {
    const open = mobile.matches ? document.body.classList.contains('sidebar-mobile-open') : !document.body.classList.contains('sidebar-collapsed');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '收合側邊欄' : '展開側邊欄');
    backdrop.hidden = !(mobile.matches && open);
    sidebar.inert = !open;
    if (mobile.matches && open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }
  toggle.addEventListener('click', () => {
    document.body.classList.toggle(mobile.matches ? 'sidebar-mobile-open' : 'sidebar-collapsed');
    syncSidebar();
  });
  function closeMobile() { document.body.classList.remove('sidebar-mobile-open'); syncSidebar(); }
  backdrop.addEventListener('click', closeMobile);
  mobile.addEventListener('change', closeMobile);
  sidebar.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobile));
  const categories = [...document.querySelectorAll('.category')];
  categories.forEach(category => category.addEventListener('toggle', () => {
    if (category.open) categories.forEach(other => { if (other !== category) other.open = false; });
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.body.classList.contains('sidebar-mobile-open')) { closeMobile(); toggle.focus(); }
    if (event.key === 'Tab' && mobile.matches && document.body.classList.contains('sidebar-mobile-open')) {
      const controls = [toggle, ...sidebar.querySelectorAll('a, button, summary')].filter(item => item.getClientRects().length);
      const index = controls.indexOf(document.activeElement);
      if (event.shiftKey && index <= 0) { event.preventDefault(); controls.at(-1).focus(); }
      else if (!event.shiftKey && (index === controls.length - 1 || index === -1)) { event.preventDefault(); toggle.focus(); }
    }
  });
  syncSidebar();

  const select = document.querySelector('#category-filter');
  const search = document.querySelector('#search');
  const posts = [...document.querySelectorAll('.post')];
  const chips = [...document.querySelectorAll('.filter-chips button')];
  const pageCategory = document.body.dataset.category;
  const categoryPaths = { '技術': '/blog/tech/', '網路基礎': '/blog/tech/?topic=網路基礎', '工具應用': '/blog/tech/?topic=工具應用', '旅行': '/blog/travel/', '美食': '/blog/foodie/' };
  function filterPosts() {
    const query = search.value.trim().toLocaleLowerCase();
    const category = select.value;
    let count = 0;
    posts.forEach(post => {
      const visible = (category === '全部' || post.dataset.categories.split(' ').includes(category)) && post.textContent.toLocaleLowerCase().includes(query);
      post.hidden = !visible;
      if (visible) count++;
    });
    chips.forEach(chip => {
      const active = chip.dataset.filter === category || (['網路基礎','工具應用'].includes(category) && chip.dataset.filter === '技術');
      chip.classList.toggle('active', active);
      chip.setAttribute('aria-pressed', String(active));
    });
    document.querySelector('.empty-state').hidden = count > 0;
    document.querySelector('#results-status').textContent = `${category}，找到 ${count} 篇規劃中的筆記`;
    document.querySelector('.journal-number').textContent = count ? `01 — ${String(count).padStart(2, '0')}` : '00 — 00';
  }
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    if (pageCategory && button.closest('.sidebar')) {
      const target = button.dataset.filter;
      const inPage = target === pageCategory || (pageCategory === '技術' && ['網路基礎', '工具應用'].includes(target));
      if (!inPage) {
        location.href = categoryPaths[target] || `/?topic=${encodeURIComponent(target)}#journal`;
        return;
      }
    }
    select.value = button.dataset.filter;
    filterPosts();
    if (button.closest('.sidebar')) {
      closeMobile();
      document.querySelector('#journal').scrollIntoView();
      document.querySelector('#journal-title').focus({preventScroll:true});
    }
  }));
  select.addEventListener('change', filterPosts);
  search.addEventListener('input', filterPosts);
  document.querySelector('#clear-filters').addEventListener('click', () => { select.value = '全部'; search.value = ''; filterPosts(); search.focus(); });
  const requestedTopic = new URLSearchParams(location.search).get('topic');
  if (requestedTopic && [...select.options].some(option => option.value === requestedTopic)) select.value = requestedTopic;
  filterPosts();

  const articles = {
    network: { title:'AI 伺服器背後，為什麼有這麼多線？', description:'《你看不見的網路》系列的第一個題目，寫給剛接觸伺服器與資料中心、想把設備與連線串起來的人。', outline:['GPU 負責運算，為什麼還需要網路？','NIC、交換器、線材與光模組各自做什麼？','兩台伺服器之間，一筆資料大致如何傳遞？'] },
    travel: { title:'走遠一點，看看日常以外的風景。', description:'未來想用自己的步調，留下旅途中的觀察。目前尚未發布旅行文章，這裡先留給下一次出發。', outline:['出發前，有哪些值得整理的準備？','沿途有哪些想記住的風景與小事？','哪些親身經驗，可以幫助下一位旅人？'] },
    food: { title:'好好吃飯，也是認識生活的方式。', description:'未來想收集日常裡的美味，也寫下用餐當下的感受。目前尚未發布食記，這裡先留下寫作方向。', outline:['這家店的味道與氛圍，有什麼特別？','想分享哪些實際品嚐過的餐點？','交通、價位與用餐細節，如何整理才實用？'] }
  };
  const dialog = document.querySelector('#article-dialog');
  document.querySelectorAll('[data-article]').forEach(button => button.addEventListener('click', () => {
    const article = articles[button.dataset.article];
    document.querySelector('#dialog-title').textContent = article.title;
    document.querySelector('#dialog-description').textContent = article.description;
    const outline = document.querySelector('#dialog-outline');
    outline.replaceChildren(...article.outline.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
    dialog.showModal();
  }));
  document.querySelectorAll('.dialog-close,.dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
  document.querySelectorAll('.year').forEach(year => { year.textContent = new Date().getFullYear(); });
})();
