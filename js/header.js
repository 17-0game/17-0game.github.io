/* <site-header> component: logo, main navigation, mobile menu toggle */
class SiteHeader extends HTMLElement {
  connectedCallback() {
    const links = [
      ['/#play', 'Play'],
      ['/#how-it-works', 'How it works'],
      ['/#strategy', 'Strategy'],
      ['/about.html', 'About'],
      ['/#faq', 'FAQ']
    ];
    this.innerHTML = `
      <div class="wrap hd">
        <a class="brand" href="/" aria-label="17-0 Game home">
          <img src="/images/logo.webp" width="40" height="40" alt="17-0 Game logo">
          <span>17-0 Game</span>
        </a>
        <button class="menu-btn" type="button" aria-expanded="false" aria-controls="main-nav">Menu</button>
        <nav id="main-nav" aria-label="Main">
          <ul>${links.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul>
        </nav>
      </div>`;
    const btn = this.querySelector('.menu-btn');
    const nav = this.querySelector('nav');
    const toggle = open => {
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    };
    btn.addEventListener('click', () => toggle(!nav.classList.contains('open')));
    nav.addEventListener('click', e => { if (e.target.closest('a')) toggle(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
  }
}
customElements.define('site-header', SiteHeader);
