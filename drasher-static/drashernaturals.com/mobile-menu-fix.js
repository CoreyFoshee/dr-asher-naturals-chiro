/**
 * Custom full-screen mobile nav (replaces broken Salient off-canvas panel).
 * Hamburger morphs to X on the header toggle; links and close are fully clickable.
 */
(function () {
  'use strict';

  var OPEN_CLASS = 'drasher-mobile-nav-open';
  var ROOT_ID = 'drasher-mobile-nav';
  var MQ = window.matchMedia('(max-width: 1030px)');
  var HIDDEN_ITEMS = ['menu-item-537']; /* Testimonials */

  var root;
  var toggles = [];

  function isMobile() {
    return MQ.matches;
  }

  function setOpen(open) {
    document.body.classList.toggle(OPEN_CLASS, open);
    document.body.classList.remove('material-ocm-open');
    document.body.style.overflow = open ? 'hidden' : '';

    if (root) {
      root.setAttribute('aria-hidden', open ? 'false' : 'true');
    }

    toggles.forEach(function (wrap) {
      var btn = wrap.querySelector('a');
      if (!btn) return;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.classList.toggle('is-active', open);
    });
  }

  function toggleMenu(e) {
    if (!isMobile()) return;
    if (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
    setOpen(!document.body.classList.contains(OPEN_CLASS));
  }

  function closeMenu() {
    setOpen(false);
  }

  function setupToggles() {
    toggles = Array.prototype.slice.call(
      document.querySelectorAll('.slide-out-widget-area-toggle')
    );

    toggles.forEach(function (wrap) {
      var btn = wrap.querySelector('a');
      if (!btn) return;

      btn.setAttribute('href', '#');
      btn.setAttribute('role', 'button');
      btn.innerHTML =
        '<span class="screen-reader-text">Menu</span>' +
        '<span class="drasher-hamburger" aria-hidden="true">' +
        '<span></span><span></span><span></span></span>';

      btn.addEventListener('click', toggleMenu, true);
    });
  }

  function shouldSkipItem(li) {
    return HIDDEN_ITEMS.some(function (id) {
      return li.classList.contains(id);
    });
  }

  function processItem(li) {
    var link = li.querySelector(':scope > a');
    var sub = li.querySelector(':scope > ul.sub-menu');
    if (!link) return null;

    var item = document.createElement('li');
    var href = link.getAttribute('href') || '#';
    var titleEl = link.querySelector('.menu-title-text');
    var text = titleEl
      ? titleEl.textContent.replace(/\s+/g, ' ').trim()
      : (link.textContent || '').replace(/\s+/g, ' ').trim();

    if (sub) {
      item.className = 'drasher-mobile-nav__item--has-children';

      var row = document.createElement('div');
      row.className = 'drasher-mobile-nav__row';

      var a = document.createElement('a');
      a.href = href;
      a.textContent = text;
      row.appendChild(a);

      var expand = document.createElement('button');
      expand.type = 'button';
      expand.className = 'drasher-mobile-nav__expand';
      expand.setAttribute('aria-label', 'Show submenu for ' + a.textContent);
      expand.setAttribute('aria-expanded', 'false');
      row.appendChild(expand);

      item.appendChild(row);

      var subUl = document.createElement('ul');
      subUl.className = 'drasher-mobile-nav__submenu';
      subUl.hidden = true;

      Array.prototype.forEach.call(sub.children, function (childLi) {
        var child = processItem(childLi);
        if (child) subUl.appendChild(child);
      });

      item.appendChild(subUl);

      expand.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var open = item.classList.toggle('is-expanded');
        subUl.hidden = !open;
        expand.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    } else {
      var solo = document.createElement('a');
      solo.href = href;
      if (link.querySelector('.menu-title-text')) {
        solo.innerHTML = link.querySelector('.menu-title-text').innerHTML;
      } else if (link.querySelector('img')) {
        solo.innerHTML = link.innerHTML;
      } else {
        solo.textContent = text;
      }
      item.appendChild(solo);
    }

    return item;
  }

  function buildMenuList() {
    var source = document.querySelector(
      '#slide-out-widget-area .off-canvas-menu-container ul.menu'
    );
    var ul = document.createElement('ul');
    ul.className = 'drasher-mobile-nav__list';

    if (!source) return ul;

    Array.prototype.forEach.call(source.children, function (li) {
      if (shouldSkipItem(li)) return;
      var item = processItem(li);
      if (item) ul.appendChild(item);
    });

    return ul;
  }

  function createOverlay() {
    if (document.getElementById(ROOT_ID)) {
      root = document.getElementById(ROOT_ID);
      return;
    }

    root = document.createElement('div');
    root.id = ROOT_ID;
    root.setAttribute('aria-hidden', 'true');

    var backdrop = document.createElement('button');
    backdrop.type = 'button';
    backdrop.className = 'drasher-mobile-nav__backdrop';
    backdrop.setAttribute('aria-label', 'Close menu');
    backdrop.addEventListener('click', closeMenu);

    var panel = document.createElement('div');
    panel.className = 'drasher-mobile-nav__panel';

    var nav = document.createElement('nav');
    nav.className = 'drasher-mobile-nav__menu';
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Mobile navigation');
    nav.appendChild(buildMenuList());

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a[href]') && !e.target.closest('.drasher-mobile-nav__expand')) {
        closeMenu();
      }
    });

    panel.appendChild(nav);
    root.appendChild(backdrop);
    root.appendChild(panel);
    document.body.appendChild(root);
  }

  function removeLegacy() {
    var legacyClose = document.getElementById('mobile-menu-close-btn');
    if (legacyClose) legacyClose.remove();
    document.body.classList.remove('material-ocm-open');
    if (location.hash === '#sidewidgetarea') {
      history.replaceState(null, '', location.pathname + location.search);
    }
  }

  function onKeydown(e) {
    if (e.key === 'Escape' && document.body.classList.contains(OPEN_CLASS)) {
      closeMenu();
    }
  }

  function onResize() {
    if (!isMobile()) closeMenu();
  }

  function init() {
    removeLegacy();
    createOverlay();
    setupToggles();

    document.addEventListener('keydown', onKeydown);
    window.addEventListener('resize', onResize);
    MQ.addEventListener('change', onResize);

    window.addEventListener('load', closeMenu);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
