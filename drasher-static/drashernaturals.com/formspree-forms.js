/* Submit contact forms via the Maileroo contact API. */
(function() {
  var FALLBACK_EMAIL = 'drasherdc@yahoo.com';

  function endpoint() {
    return window.CONTACT_API_URL || '/api/contact';
  }

  function field(form, selectors) {
    for (var i = 0; i < selectors.length; i++) {
      var el = form.querySelector(selectors[i]);
      if (el) return el;
    }
    return null;
  }

  function val(el) {
    return el && el.value ? el.value.trim() : '';
  }

  function phoneField(form) {
    return field(form, ['[type="tel"]', '[name="contact-form-phone"]', '[name="your-phone"]', '[name="phone"]']);
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

  function ensureHoneypot(form) {
    if (form.querySelector('[name="company_website"]')) return;
    var hp = document.createElement('input');
    hp.type = 'text';
    hp.name = 'company_website';
    hp.tabIndex = -1;
    hp.autocomplete = 'off';
    hp.setAttribute('aria-hidden', 'true');
    hp.style.cssText = 'position:absolute;left:-9999px;height:0;width:0;opacity:0;';
    form.appendChild(hp);
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

  function showError(form, text) {
    form.classList.remove('sent');
    form.classList.add('failed');

    var msg = messageEl(form, true);
    msg.textContent = text || ('Sorry, something went wrong. Please email ' + FALLBACK_EMAIL + ' directly.');
    msg.style.display = 'block';
    msg.style.visibility = 'visible';
    msg.removeAttribute('aria-hidden');
    msg.classList.remove('formspree-success-visible');
    msg.classList.add('formspree-error-visible');
  }

  function payloadFromForm(form) {
    return {
      name: val(field(form, ['[name="your-name"]', '[name="contact-form-name"]', '[name="name"]'])),
      email: val(field(form, ['[name="your-email"]', '[name="contact-form-email"]', '[name="email"]', '[type="email"]'])),
      phone: val(phoneField(form)),
      subject: val(field(form, ['[name="your-subject"]', '[name="subject"]'])),
      message: val(field(form, ['[name="your-message"]', '[name="contact-form-message"]', '[name="message"]', 'textarea'])),
      smsOptIn: !!(form.querySelector('input[name="sms-opt-in"]') && form.querySelector('input[name="sms-opt-in"]').checked),
      source: form.getAttribute('data-formspree') || 'website',
      page: window.location.href,
      company_website: val(form.querySelector('[name="company_website"]'))
    };
  }

  function setupForm(form) {
    if (form.getAttribute('data-formspree-ready') === 'true') return;
    form.setAttribute('data-formspree-ready', 'true');
    form.setAttribute('method', 'POST');
    form.setAttribute('action', endpoint());

    ensureSmsCompliance(form);
    ensureHoneypot(form);

    form.addEventListener('submit', function(e) {
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

      fetch(endpoint(), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payloadFromForm(form))
      })
        .then(function(res) {
          return res.json().then(function(body) {
            if (res.ok && body && body.ok) {
              showSuccess(form);
              form.reset();
              ensureSmsCompliance(form);
              ensureHoneypot(form);
            } else {
              throw new Error((body && body.message) || 'Send failed');
            }
          });
        })
        .catch(function(err) {
          showError(form, err && err.message);
        })
        .finally(function() {
          if (submitBtn) submitBtn.disabled = false;
        });
    }, true);
  }

  function init() {
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
