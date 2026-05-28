/**
 * Mobile menu fix: make toggle clickable and work without theme AJAX.
 * Also close on overlay/close button.
 */
(function() {
  function openMenu() {
    document.body.classList.add('material-ocm-open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    document.body.classList.remove('material-ocm-open');
    document.body.style.overflow = '';
  }
  function toggleMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    if (document.body.classList.contains('material-ocm-open')) closeMenu();
    else openMenu();
  }
  document.addEventListener('DOMContentLoaded', function() {
    // Toggle on menu icon click
    document.querySelectorAll('.slide-out-widget-area-toggle a').forEach(function(a) {
      a.addEventListener('click', toggleMenu);
      a.setAttribute('href', '#');
    });
    // Close on overlay (bg) click
    var bg = document.getElementById('slide-out-widget-area-bg');
    if (bg) bg.addEventListener('click', function(e) { e.preventDefault(); closeMenu(); });
    // Close on close button
    document.querySelectorAll('.slide_out_area_close').forEach(function(btn) {
      btn.addEventListener('click', function(e) { e.preventDefault(); closeMenu(); });
    });
  });
})();
