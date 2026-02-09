/* Mobile menu: make toggle clickable and use body class so overlay works */
(function() {
  /* Ensure menu is closed on load (body may have material-ocm-open from theme or #sidewidgetarea hash) */
  if (document.body) document.body.classList.remove('material-ocm-open');
  if (typeof history !== 'undefined' && location.hash === '#sidewidgetarea') history.replaceState(null, '', location.pathname + location.search);
  function openMenu() {
    document.body.classList.add('material-ocm-open');
  }
  function closeMenu() {
    document.body.classList.remove('material-ocm-open');
  }
  function init() {
    /* Always start with menu closed (prevents green screen on load if theme added material-ocm-open) */
    document.body.classList.remove('material-ocm-open');
    window.addEventListener('load', function() { document.body.classList.remove('material-ocm-open'); });
    document.querySelectorAll('.slide-out-widget-area-toggle a').forEach(function(a) {
      a.addEventListener('click', function(e) {
        e.preventDefault();
        openMenu();
      });
    });
    var bg = document.getElementById('slide-out-widget-area-bg');
    if (bg) bg.addEventListener('click', closeMenu);
    document.querySelectorAll('.slide_out_area_close').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        closeMenu();
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
