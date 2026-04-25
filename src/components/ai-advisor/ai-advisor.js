import { LitElement, html } from 'lit';
import { advisorStyles } from './styles.js';

const QUIZ_STEPS = [
  { title: 'Hayalindeki silüeti nasıl tarif edersin?', category: 'style', options: ['Minimal & Sade', 'Prenses & Kabarık', 'Modern & Cesur', 'Vintage & Romantik'] },
  { title: 'Düğün mekanın seçimimizi nasıl etkileyecek?', category: 'concept', options: ['Kır Düğünü', 'Salon / Otel', 'Sahil', 'Tarihi Mekan'] },
  { title: 'Hangi bölgeni ön plana çıkarmak istersin?', category: 'focus', options: ['Omuzlar', 'Bel Hattı', 'Sırt Dekoltesi', 'Bacaklar'] },
  { title: 'Kumaş dokusu tercihin ne olurdu?', category: 'fabric', options: ['Pürüzsüz Saten', 'Romantik Dantel', 'Uçuşan Tül', 'Dokulu Jakar'] },
  { title: 'Vücut tipini en iyi ne tanımlar?', category: 'bodyType', options: ['Kum Saati', 'Armut', 'Dikdörtgen', 'Elma'] },
  { title: 'Bütçe planlaman nasıl?', category: 'budget', options: ['40-60K', '60-80K', '80-120K', 'Limitim Yok'] }
];

const FEEDBACKS = ['Harika bir seçim.', 'Bu tarz size çok yakışacak.', 'Zevkiniz hayranlık uyandırıcı.', 'Vizyonunuz çok net.'];

export class BridalAiAdvisor extends LitElement {
  static styles = advisorStyles;

  static properties = {
    step: { type: Number },
    selections: { type: Object },
    isAnalyzing: { type: Boolean },
    feedbackMsg: { type: String }
  };

  constructor() {
    super();
    this.step = 1;
    this.selections = {};
    this.isAnalyzing = false;
    this.feedbackMsg = '';
  }

  handleSelection(category, value) {
    this.selections = { ...this.selections, [category]: value };
    this.feedbackMsg = FEEDBACKS[Math.floor(Math.random() * FEEDBACKS.length)];

    window.setTimeout(() => {
      this.feedbackMsg = '';
      this.step += 1;
    }, 700);
  }

  startAnalysis() {
    this.isAnalyzing = true;
    window.setTimeout(() => {
      this.isAnalyzing = false;
      this.dispatchEvent(new CustomEvent('advisorCompleted', {
        detail: this.selections,
        bubbles: true,
        composed: true
      }));
    }, 2200);
  }

  renderQuestion() {
    const active = QUIZ_STEPS[this.step - 1];

    if (active) {
      return html`
        <div class="question-shell">
          <h2>${active.title}</h2>
          <div class="options-grid">
            ${active.options.map((opt) => html`
              <button @click=${() => this.handleSelection(active.category, opt)}>${opt}</button>
            `)}
          </div>
        </div>
      `;
    }

    return html`
      <div class="question-shell" style="text-align: center; justify-content:center;">
        <h2>Analiziniz Hazır</h2>
        <p style="margin:0 0 24px; color:#6f6b66; text-transform: uppercase; letter-spacing: .16em; font-size: 11px;">Size özel modeller listeleniyor</p>
        <div class="options-grid" style="grid-template-columns: 1fr; max-width: 360px; margin: 0 auto;">
          <button @click=${this.startAnalysis}>Sonuçları Listele →</button>
        </div>
      </div>
    `;
  }

  render() {
    if (this.isAnalyzing) {
      return html`
        <div class="analyzing-screen">
          <h2>Profiliniz analiz ediliyor</h2>
          <p>Uzman algoritmamız devrede</p>
        </div>
      `;
    }

    return html`
      <section class="advisor-wrapper">
        <div class="visual-side">
          <img src="https://cdn.shopify.com/s/files/1/0733/2285/6611/files/kalp-yaka-3d-floral-fransiz-dantel-cikarilabilir-kollu-drape-detayli-balik-gelinlik-annabella-bridal-7413791.jpg?v=1774448409" alt="Annabella Bridal" />
        </div>
        <div class="quiz-side">
          <div class="progress-bar"><div class="progress-fill" style=${`width:${(this.step / 7) * 100}%`}></div></div>
          ${this.renderQuestion()}
          <div class=${`feedback ${this.feedbackMsg ? 'visible' : ''}`}>${this.feedbackMsg}</div>
        </div>
      </section>
    `;
  }
}

customElements.define('bridal-ai-advisor', BridalAiAdvisor);
