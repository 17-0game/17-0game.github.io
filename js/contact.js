/* Contact form: opens the visitor's email app with the message filled in. */
(() => {
  const f = document.getElementById('contact-form');
  if (!f) return;
  f.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(f);
    const body = `Name: ${d.get('name')}\nEmail: ${d.get('email')}\n\n${d.get('message')}`;
    location.href = `mailto:${f.dataset.email}?subject=${encodeURIComponent('17-0 Game: ' + d.get('topic'))}&body=${encodeURIComponent(body)}`;
  });
})();
