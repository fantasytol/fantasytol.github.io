/* ==========================================================================
   nav.js — 导航交互
   项目：SelfIntroduction

   职责：
   1. 标记 JS 可用（用于滚动淡入的初始隐藏，禁用 JS 时内容仍可见）；
   2. 语言切换时记住用户选择；
   3. 滚动时给导航栏加分隔线；
   4. 移动端汉堡菜单展开 / 收起；
   5. 滚动时高亮当前所在分区。
   ========================================================================== */

(function () {
  'use strict';

  var STORAGE_KEY = 'fantasy-lang';
  var root = document.documentElement;

  /* ---- 1. 标记 JS 已就绪 ---- */
  root.classList.add('js-ready');

  /* ---- 2. 语言切换：记住选择，供 index.html 入口读取 ---- */
  var switchLinks = document.querySelectorAll('.lang-switch');

  Array.prototype.forEach.call(switchLinks, function (link) {
    link.addEventListener('click', function () {
      var lang = link.getAttribute('data-lang');
      if (!lang) { return; }
      try {
        window.localStorage.setItem(STORAGE_KEY, lang);
      } catch (error) {
        /* 隐私模式下 localStorage 不可用，忽略即可 */
      }
    });
  });

  /* ---- 3. 滚动时导航栏加分隔线 ---- */
  var nav = document.querySelector('.nav');

  function updateNavBorder() {
    if (!nav) { return; }
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  }

  window.addEventListener('scroll', updateNavBorder, { passive: true });
  updateNavBorder();

  /* ---- 4. 移动端菜单 ---- */
  var toggle = document.querySelector('.nav__toggle');
  var list = document.querySelector('.nav__list');

  function closeMenu() {
    if (!toggle || !list) { return; }
    list.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && list) {
    toggle.addEventListener('click', function () {
      var isOpen = list.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    /* 点击菜单项后自动收起 */
    Array.prototype.forEach.call(list.querySelectorAll('a'), function (link) {
      link.addEventListener('click', closeMenu);
    });

    /* 点击菜单外部或按 Esc 收起 */
    document.addEventListener('click', function (event) {
      if (!list.classList.contains('is-open')) { return; }
      if (list.contains(event.target) || toggle.contains(event.target)) { return; }
      closeMenu();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') { closeMenu(); }
    });
  }

  /* ---- 5. 滚动高亮当前分区 ---- */
  var links = Array.prototype.slice.call(
    document.querySelectorAll('.nav__link[href^="#"]')
  );

  var sections = links
    .map(function (link) {
      return document.querySelector(link.getAttribute('href'));
    })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        links.forEach(function (link) {
          link.classList.toggle(
            'is-active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (section) { spy.observe(section); });
  }
})();
