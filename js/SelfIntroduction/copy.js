/* ==========================================================================
   copy.js — 联系卡片「一键复制」
   项目：SelfIntroduction

   每张 .contact-card 上用 data-copy 声明要复制的内容，
   卡片内的 .copy-btn 触发复制，复制成功后按钮短暂变为已复制状态。

   优先使用 navigator.clipboard；在 file:// 等非安全上下文下回退到
   document.execCommand('copy')。两者都不可用时提示用户手动复制。
   ========================================================================== */

(function () {
  'use strict';

  var cards = document.querySelectorAll('.contact-card[data-copy]');

  if (!cards.length) { return; }

  /* ---- 复制文案从页面语言推导，中英各一套 ---- */
  var isEnglish = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var TEXT = isEnglish
    ? { ok: 'Copied', fail: 'Press Ctrl+C' }
    : { ok: '已复制', fail: '请手动复制' };

  var ICON_COPY = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  var ICON_DONE = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>';

  /* ---- 回退方案：临时 textarea + execCommand ---- */
  function fallbackCopy(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '-1000px';
    area.style.opacity = '0';
    document.body.appendChild(area);

    var ok = false;
    try {
      area.select();
      area.setSelectionRange(0, area.value.length);
      ok = document.execCommand('copy');
    } catch (error) {
      ok = false;
    }

    document.body.removeChild(area);
    return ok;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(
        function () { return true; },
        function () { return fallbackCopy(text); }
      );
    }
    return Promise.resolve(fallbackCopy(text));
  }

  /* ---- 反馈：按钮短暂显示结果 ---- */
  function flash(button, ok) {
    if (button.dataset.busy === '1') { return; }
    button.dataset.busy = '1';

    var original = button.innerHTML;
    button.innerHTML = ok ? ICON_DONE : ICON_COPY;
    button.classList.toggle('is-copied', ok);
    button.classList.add('is-feedback');

    var label = ok ? TEXT.ok : TEXT.fail;
    if (!ok) {
      button.title = label;
      button.setAttribute('aria-label', label);
    }

    window.setTimeout(function () {
      button.innerHTML = original;
      button.classList.remove('is-copied', 'is-feedback');
      button.dataset.busy = '0';
    }, ok ? 1400 : 1800);
  }

  /* ---- 绑定 ---- */
  Array.prototype.forEach.call(cards, function (card) {
    var button = card.querySelector('.copy-btn');
    if (!button) { return; }

    button.addEventListener('click', function (event) {
      /* 卡片现在是 div，但保留阻止冒泡以防将来改回链接 */
      event.preventDefault();
      event.stopPropagation();

      var text = card.getAttribute('data-copy') || '';
      if (!text) { return; }

      copyText(text).then(function (ok) { flash(button, ok); });
    });
  });
})();
