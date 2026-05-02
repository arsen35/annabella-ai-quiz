import { LitElement, html, css } from 'lit';
import { fetchShopifyProducts, selectBestMatches } from '../products.js';

export class BridalRecommendations extends LitElement {
  static properties = {
    userChoices: { type: Object },
    loading: { type: Boolean },
    error: { type: String },
    products: { type: Array }
  };

  static styles = css`
    :host {
      display: block;
      width: 100vw;
      max-width: 100vw;
      margin: 24px calc(50% - 50vw);
      padding-inline: clamp(12px, 2.4vw, 36px);
      font-family: "Inter", "Helvetica Neue", Arial, sans-serif;
      color: #171717;
      box-sizing: border-box;
    }
    *, *::before, *::after { box-sizing: border-box; }
    .shell { width: min(1560px, 100%); margin: 0 auto; border: 1px solid #ece9e6; background: #fff; padding: clamp(20px, 2.4vw, 36px); }
    h2 { margin: 0 0 8px; font-size: clamp(24px, 2.3vw, 34px); font-weight: 300; }
    .lead { margin: 0 0 24px; color: #7a7772; text-transform: uppercase; letter-spacing: .13em; font-size: 11px; }
    .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
    .card { border: 1px solid #ece9e6; background: #fff; }
    .media-link { display: block; }
    .card img { width: 100%; aspect-ratio: 3/4; object-fit: cover; display: block; background:#f4f1ed; }
    .meta { padding: 14px; display: grid; gap: 10px; }
    .name { font-size: 14px; line-height: 1.4; min-height: 40px; }
    .price { color: #5f5b56; font-size: 13px; }
    .inspect-btn {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      text-decoration: none;
      border: 1px solid #161616;
      color: #161616;
      background: #fff;
      padding: 10px 14px;
      text-transform: uppercase;
      letter-spacing: .14em;
      font-size: 10px;
      font-weight: 400;
      transition: background-color .2s ease, color .2s ease;
    }
    .inspect-btn:hover {
      background: #121212;
      color: #fff;
    }
    .actions { margin-top: 24px; display:flex; justify-content:flex-end; }
    button { border: 1px solid #171717; background:#171717; color:#fff; padding: 14px 18px; text-transform: uppercase; letter-spacing:.08em; font-size: 12px; cursor:pointer; }

    @media (max-width: 920px) {
      :host { width: 100%; max-width: 100%; margin: 0; padding-inline: 0; }
      .shell { width: 100%; padding: 24px 14px; border-left: none; border-right: none; }
      .grid { grid-template-columns: 1fr; }
      .actions { justify-content: stretch; }
      button { width: 100%; }
    }
  `;

  constructor() {
    super();
    this.userChoices = {};
    this.loading = false;
    this.error = '';
    this.products = [];
  }

  async willUpdate(changed) {
    if (changed.has('userChoices') && Object.keys(this.userChoices || {}).length) {
      await this.loadRecommendations();
    }
  }

  async loadRecommendations() {
    this.loading = true;
    this.error = '';

    const all = await fetchShopifyProducts();
    if (!all.length) {
      this.error = 'Ürünler şu anda getirilemedi. Lütfen tekrar deneyin.';
      this.loading = false;
      return;
    }

    this.products = selectBestMatches(all, this.userChoices, 3);
    this.loading = false;
  }

  formatPrice(amount, currency = 'TRY') {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount || 0);
  }

  renderBody() {
    if (this.loading) return html`<p>Size en uygun modeller seçiliyor…</p>`;
    if (this.error) return html`<p>${this.error}</p>`;

    return html`
      <div class="grid">
        ${this.products.map((p) => html`
          <article class="card">
            <a class="media-link" href=${p.url} target="_blank" rel="noopener noreferrer" aria-label=${`${p.name} ürün detayını aç`}>
              <img src=${p.img} alt=${p.imgAlt} loading="lazy" />
            </a>
            <div class="meta">
              <div class="name">${p.name}</div>
              <div class="price">${this.formatPrice(p.price, p.currencyCode)}</div>
              <a class="inspect-btn" href=${p.url} target="_blank" rel="noopener noreferrer">Ürünü İncele</a>
            </div>
          </article>
        `)}
      </div>
      <div class="actions">
        <button @click=${() => this.dispatchEvent(new CustomEvent('startAppointment', { bubbles: true, composed: true }))}>
          Randevu Oluştur
        </button>
      </div>
    `;
  }

  render() {
    return html`
      <section class="shell">
        <h2>Sizin İçin Seçilen 3 Model</h2>
        <p class="lead">Quiz yanıtlarınıza göre akıllı filtreleme uygulandı</p>
        ${this.renderBody()}
      </section>
    `;
  }
}

customElements.define('bridal-recommendations', BridalRecommendations);
