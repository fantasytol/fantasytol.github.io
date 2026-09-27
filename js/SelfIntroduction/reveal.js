/* ==========================================================================
   reveal.js — 滚动淡入动画
   项目：SelfIntroduction

   元素滚入视口时加 .is-visible。不支持 IntersectionObserver 时直接全部显示，
   保证内容永远可见。
   ========================================================================== */

(function () {
  'use strict';

  var items = document.querySelectorAll('.reveal');

  if (!items.length) { return; }

  function showAll() {
    Array.prototype.forEach.call(items, function (el) {
      el.classList.add('is-visible');
    });
  }

  if (!('IntersectionObserver' in window)) {
    showAll();
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) { return; }
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

  Array.prototype.forEach.call(items, function (el, index) {
    /* 同组元素错开一点，形成依次出现的节奏 */
    el.style.transitionDelay = (index % 4) * 70 + 'ms';
    observer.observe(el);
  });
})();
