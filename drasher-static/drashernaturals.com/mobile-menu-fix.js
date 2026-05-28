/* Mobile menu: use theme panel as green modal. No slide. Our close on body. Simple click. */
(function() {
  var BODY_OPEN_CLASS = 'material-ocm-open';
  var PANEL_ID = 'slide-out-widget-area';

  function openMenu() {
    var panel = document.getElementById(PANEL_ID);
    var panelBg = document.getElementById('slide-out-widget-area-bg');
    document.body.classList.add(BODY_OPEN_CLASS);
    if (panel) {
      panel.style.setProperty('background-color', '#34a853', 'important');
      panel.style.setProperty('background', '#34a853', 'important');
    }
    if (panelBg) {
      panelBg.style.setProperty('background-color', '#34a853', 'important');
      panelBg.style.setProperty('background', '#34a853', 'important');
    }
  }

  function closeMenu() {
    var panel = document.getElementById(PANEL_ID);
    var panelBg = document.getElementById('slide-out-widget-area-bg');
    document.body.classList.remove(BODY_OPEN_CLASS);
    if (panel) {
      panel.style.removeProperty('background-color');
      panel.style.removeProperty('background');
    }
    if (panelBg) {
      panelBg.style.removeProperty('background-color');
      panelBg.style.removeProperty('background');
    }
    if (typeof history !== 'undefined') history.replaceState(null, '', location.pathname + location.search);
  }

  function createCloseButton() {
    var existing = document.getElementById('mobile-menu-close-btn');
    if (existing) return existing;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'mobile-menu-close-btn';
    btn.className = 'mobile-menu-close-btn';
    btn.setAttribute('aria-label', 'Close menu');
    btn.innerHTML = '<span class="screen-reader-text">Close menu</span><span class="mobile-menu-close-icon" aria-hidden="true"></span>';
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      closeMenu();
    }, false);
    document.body.appendChild(btn);
    return btn;
  }

  function init() {
    document.body.classList.remove(BODY_OPEN_CLASS);
    if (location.hash === '#sidewidgetarea') history.replaceState(null, '', location.pathname + location.search);
    window.addEventListener('load', function() {
      document.body.classList.remove(BODY_OPEN_CLASS);
    });

    createCloseButton();

    /* Hide theme's close – we use our own */
    document.querySelectorAll('.slide_out_area_close').forEach(function(el) {
      el.style.display = 'none';
    });

    /* Hamburger: single link, simple click opens panel */
    var toggles = document.querySelectorAll('.slide-out-widget-area-toggle a');
    toggles.forEach(function(a) {
      a.setAttribute('href', '#');
      a.setAttribute('aria-label', 'Open menu');
      a.innerHTML = '<span class="screen-reader-text">Menu</span><span class="mobile-menu-hamburger-icon" aria-hidden="true"></span>';
      a.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openMenu();
      }, false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
