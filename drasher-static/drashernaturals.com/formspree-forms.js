/* Submit contact forms via Formspree (static site – no WordPress backend). */
(function() {
  var FALLBACK_EMAIL = 'drasherdc@yahoo.com';

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

  function phoneField(form) {
    return form.querySelector('[type="tel"], [name="contact-form-phone"], [name="your-phone"], [name="phone"]');
  }

  function ensureSmsCompliance(form) {
    if (!phoneField(form) || form.querySelector('.formspree-sms-compliance')) return;

    var wrap = document.createElement('div');
    wrap.className = 'formspree-sms-compliance';
    wrap.innerHTML =
      '<label class="formspree-sms-optin">' +
      '<input type="checkbox" name="sms-opt-in" value="yes" /> ' +
      'Yes, I agree to receive SMS appointment reminders, updates, and informative messages from Dr. Asher Natural Chiropractic at the phone number provided.' +
      '</label>' +
      '<p class="formspree-sms-disclosure">' +
      'Message frequency varies. Message and data rates may apply. Reply <strong>STOP</strong> to unsubscribe or <strong>HELP</strong> for help. ' +
      'Consent is not a condition of purchase. See our ' +
      '<a href="/privacy-policy/">Privacy Policy</a> and <a href="/terms-conditions/">Terms &amp; Conditions</a>. ' +
      'Mobile opt-in data will not be shared, sold, or rented.' +
      '</p>';

    var submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn && submitBtn.parentNode) {
      submitBtn.parentNode.insertBefore(wrap, submitBtn);
    } else {
      form.appendChild(wrap);
    }
  }

  function smsComplianceOk(form) {
    var phone = phoneField(form);
    if (!phone || !phone.value.trim()) return true;

    var optIn = form.querySelector('input[name="sms-opt-in"]');
    if (!optIn || optIn.checked) return true;

    var msg = messageEl(form, true);
    msg.textContent = 'Please check the SMS opt-in box to continue, or leave the phone field blank if you do not wish to receive text messages.';
    msg.style.display = 'block';
    msg.style.visibility = 'visible';
    msg.classList.remove('formspree-success-visible');
    msg.classList.add('formspree-error-visible');
    return false;
  }

  function messageEl(form, createIfMissing) {
    var msg = form.querySelector('.wpcf7-response-output, .mse-form-success-message, .formspree-success-banner, [data-formspree-success]');
    if (!msg && createIfMissing) {
      msg = document.createElement('div');
      msg.className = 'formspree-success-banner';
      msg.setAttribute('role', 'status');
      msg.setAttribute('aria-live', 'polite');
      form.appendChild(msg);
    }
    return msg;
  }

  function showSuccess(form) {
    form.classList.remove('init', 'submitting', 'failed', 'invalid', 'spam');
    form.classList.add('sent');
    form.setAttribute('data-status', 'sent');

    var msg = messageEl(form, true);
    msg.textContent = 'Thank you! Your message has been sent. We will get back to you soon.';
    msg.style.display = 'block';
    msg.style.visibility = 'visible';
    msg.removeAttribute('aria-hidden');
    msg.classList.remove('formspree-error-visible');
    msg.classList.add('formspree-success-visible');

    try {
      msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (err) { /* ignore */ }
  }

  function showError(form) {
    form.classList.remove('sent');
    form.classList.add('failed');

    var msg = messageEl(form, true);
    msg.textContent = 'Sorry, something went wrong. Please email ' + FALLBACK_EMAIL + ' directly.';
    msg.style.display = 'block';
    msg.style.visibility = 'visible';
    msg.removeAttribute('aria-hidden');
    msg.classList.remove('formspree-success-visible');
    msg.classList.add('formspree-error-visible');
  }

  function setupForm(form) {
    if (form.getAttribute('data-formspree-ready') === 'true') return;
    var url = endpoint();
    form.setAttribute('data-formspree-ready', 'true');
    form.setAttribute('method', 'POST');
    /* Basic HTML fallback: posts to Formspree if JS is disabled */
    if (url) form.setAttribute('action', url);
    else form.setAttribute('action', '#');

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

    ensureSmsCompliance(form);

    form.addEventListener('submit', function(e) {
      var url = endpoint();
      if (!url) {
        e.preventDefault();
        window.location.href = 'mailto:' + FALLBACK_EMAIL + '?subject=Contact%20from%20doctorasher.com';
        return;
      }

      if (!smsComplianceOk(form)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

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
    /* Disable Contact Form 7 if its script was cached/loaded elsewhere */
    if (typeof window.wpcf7 !== 'undefined' && window.wpcf7.init) {
      window.wpcf7.init = function() {};
    }

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
