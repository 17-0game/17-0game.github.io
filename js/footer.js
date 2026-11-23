/* <site-footer> component: site links, disclaimer, copyright year */
class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="wrap ft">
        <div class="ft-brand">
          <img src="/images/logo.webp" width="48" height="48" alt="" loading="lazy">
          <p><strong>17-0 Game</strong><br>Draft a roster. Play the season. Chase 17-0.</p>
        </div>
        <nav aria-label="Footer">
          <ul>
            <li><a href="/#play">Play the game</a></li>
            <li><a href="/#how-it-works">How it works</a></li>
            <li><a href="/#strategy">Strategy</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy">Privacy</a></li>
            <li><a href="/terms">Terms</a></li>
            <li><a href="/disclaimer">Disclaimer</a></li>
            <li><a href="/#faq">FAQ</a></li>
          </ul>
        </nav>
        <p class="fine">&copy; ${new Date().getFullYear()} 17-0 Game. An unofficial fan-made game. Not affiliated with or endorsed by the NFL or any team or player. Team and player names are used for identification only.</p>
      </div>`;
  }
}
customElements.define('site-footer', SiteFooter);
