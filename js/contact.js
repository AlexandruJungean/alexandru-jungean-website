/* Shared contact form; bot protection is requested only upon submission. */
(() => {
  'use strict';
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const siteKey = '6LdLBEwsAAAAAFNoPxIwGfSA-vYornPZmn5JC2OQ';
  let loading, sending = false;
  const loadProtection = () => {
    if (loading) return loading;
    loading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const fail = () => { clearTimeout(timeout); script.remove(); loading = null; reject(new Error('Verification could not load. Please retry or contact me by email.')); };
      const timeout = setTimeout(fail, 15000);
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.onload = () => {
        if (!window.grecaptcha) return fail();
        window.grecaptcha.ready(() => { clearTimeout(timeout); resolve(); });
      };
      script.onerror = fail;
      document.head.appendChild(script);
    });
    return loading;
  };
  const submit = form.querySelector('[type="submit"]');
  const success = form.parentElement.querySelector('.success-message');
  const error = form.parentElement.querySelector('.error-message');
  for (const box of [success, error]) {
    if (!box) continue;
    box.setAttribute('role', box === error ? 'alert' : 'status');
    box.tabIndex = -1;
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    sending = true;
    const original = submit.value;
    submit.disabled = true; submit.value = 'Sending…';
    form.setAttribute('aria-busy', 'true');
    if (error) error.style.display = 'none';
    if (success) success.style.display = 'none';
    try {
      await loadProtection();
      const token = await Promise.race([
        window.grecaptcha.execute(siteKey, {action: 'contact'}),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Verification timed out. Please retry.')), 15000))
      ]);
      const response = await fetch('/.netlify/functions/contact', {
        method: 'POST', headers: {'Content-Type': 'application/json'}, signal: AbortSignal.timeout(45000),
        body: JSON.stringify({name: form.elements.name.value.trim(), email: form.elements.email.value.trim(),
          subject: form.elements.service.value, message: form.elements.message.value.trim(), recaptchaToken: token})
      });
      if (response.status === 429) throw new Error('Too many attempts. Please wait a minute before trying again, or contact me by email.');
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Your message could not be sent. Please try again or use email.');
      success.querySelector('div').textContent = 'Thank you. Your message has been sent.';
      success.style.display = 'block'; success.focus(); form.reset();
    } catch (failure) {
      error.querySelector('div').textContent = failure.name === 'TimeoutError' ? 'The request timed out. Please check your connection and try again.' : failure.message;
      error.style.display = 'block'; error.focus();
    } finally {
      sending = false; submit.disabled = false; submit.value = original; form.removeAttribute('aria-busy');
    }
  });
})();
