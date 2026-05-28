/**
 * Homepage: prevent Trustindex widget from flashing oversized icons on resize.
 */
(function () {
  'use strict';

  if (!document.body.classList.contains('home')) return;

  var resizeTimer;
  var RESIZE_CLASS = 'ti-is-resizing';

  function onResize() {
    document.body.classList.add(RESIZE_CLASS);
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      document.body.classList.remove(RESIZE_CLASS);
    }, 350);
  }

  window.addEventListener('resize', onResize, { passive: true });
})();
