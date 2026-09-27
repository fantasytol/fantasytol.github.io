/* ==========================================================================
   redirect.js — 根目录 index.html 入口跳转
   项目：SelfIntroduction

   规则：
   1. 默认进入中文页 zh-cn.html；
   2. 如果用户之前手动切过语言，记住选择并跳到对应语言。
   ========================================================================== */

(function () {
  'use strict';

  var STORAGE_KEY = 'fantasy-lang';
  var DEFAULT_LANG = 'zh-cn';

  var PAGES = {
    'zh-cn': 'html/SelfIntroduction/zh-cn.html',
    'en': 'html/SelfIntroduction/en.html'
  };

  var saved = null;

  try {
    saved = window.localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    saved = null;
  }

  var lang = Object.prototype.hasOwnProperty.call(PAGES, saved) ? saved : DEFAULT_LANG;

  window.location.replace(PAGES[lang]);
})();
