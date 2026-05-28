/* Submit contact forms via Formspree (static site – no WordPress backend). */
(function() {
  var FALLBACK_EMAIL = 'info@doctorasher.com';

  function endpoint() {
    var url = window.FORMSPREE_ENDPOINT;
    if (!url || url.indexOf('REPLACE_WITH_YOUR_FORM_ID') !== -1) return null;
    return url;
  }

  function replyToField(form) {
    return form.querySelector('[name="your-email"], [name="contact-form-email"]');
  }

  function ensureHidden(form, name, value) {
    var el = form.querySelector('input[name="' + name + '"]');
    if (!el) {
      el = document.createElement('input');
      el.type = 'hidden';
      el.name = name;
      form.appendChild(el);
    }
    el.value = value;
  }

  function showSuccess(form) {
    var msg = form.querySelector('.wpcf7-response-output, .mse-form-success-message, [data-formspree-success]');
    if (msg) {
      msg.textContent = 'Thank you! Your message has been sent.';
      msg.style.display = 'block';
      msg.removeAttribute('aria-hidden');
      msg.classList.add('formspree-success-visible');
    } else {
      alert('Thank you! Your message has been sent.');
    }
  }

  function showError(form) {
    var msg = form.querySelector('.wpcf7-response-output, .mse-form-success-message');
    if (msg) {
      msg.textContent = 'Sorry, something went wrong. Please email ' + FALLBACK_EMAIL + ' directly.';
      msg.style.display = 'block';
      msg.removeAttribute('aria-hidden');
    } else {
      alert('Sorry, something went wrong. Please email ' + FALLBACK_EMAIL + ' directly.');
    }
  }

  function setupForm(form) {
    if (form.getAttribute('data-formspree-ready') === 'true') return;
    form.setAttribute('data-formspree-ready', 'true');
    form.setAttribute('method', 'POST');
    form.setAttribute('action', '#');

    var label = form.getAttribute('data-formspree') || 'website';
    ensureHidden(form, '_subject', 'Dr. Asher website – ' + label);

    var reply = replyToField(form);
    if (reply && !form.querySelector('input[name="_replyto"]')) {
      ensureHidden(form, '_replyto', '');
      form.addEventListener('input', function() {
        var r = replyToField(form);
        if (r) form.querySelector('input[name="_replyto"]').value = r.value;
      });
    }

    form.addEventListener('submit', function(e) {
      var url = endpoint();
      if (!url) {
        e.preventDefault();
        window.location.href = 'mailto:' + FALLBACK_EMAIL + '?subject=Contact%20from%20doctorasher.com';
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      var formData = new FormData(form);
      var replyInput = replyToField(form);
      if (replyInput && replyInput.value) {
        formData.set('_replyto', replyInput.value);
      }

      fetch(url, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      })
        .then(function(res) {
          if (res.ok) {
            showSuccess(form);
            form.reset();
          } else {
            throw new Error('Formspree error');
          }
        })
        .catch(function() {
          showError(form);
        })
        .finally(function() {
          if (submitBtn) submitBtn.disabled = false;
        });
    }, true);
  }

  function init() {
    document.querySelectorAll('#stickyelements-form, form.wpcf7-form, form[data-formspree]').forEach(setupForm);

    if (new URLSearchParams(window.location.search).get('sent') === '1') {
      var main = document.querySelector('form.wpcf7-form');
      if (main) showSuccess(main);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
