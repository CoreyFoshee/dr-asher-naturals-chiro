/* Mobile menu: make toggle clickable and use body class so overlay works */
(function() {
  function openMenu() {
    document.body.classList.add('material-ocm-open');
  }
  function closeMenu() {
    document.body.classList.remove('material-ocm-open');
  }
  function init() {
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
