import { LitElement, html, css } from 'lit';

export class PremiumAppointment extends LitElement {
  static properties = {
    step: { type: Number },
    viewDate: { type: Object },
    selectedDate: { type: String },
    selectedTime: { type: String },
    userName: { type: String },
    userPhone: { type: String },
    userEmail: { type: String },
    selectedCountry: { type: String },
    userChoices: { type: Object },
    isSending: { type: Boolean },
    bookedSlots: { type: Array }
  };

  static styles = css`
    :host {
      display: block;
      width: min(1400px, 90vw);
      margin: 28px auto;
      color: #1a1a1a;
      font-family: "Inter", "Helvetica Neue", Arial, sans-serif;
    }
    *, *::before, *::after { box-sizing: border-box; }
    .shell { background: #fff; border: 1px solid #ece9e6; }
    .modal-header { padding: 30px; border-bottom: 1px solid #f2efec; text-align: center; }
    .modal-content { display: flex; min-height: 550px; }
    .selection-side { flex: 1.2; padding: 30px; border-right: 1px solid #f2efec; }
    .info-side { flex: 1; padding: 30px; background: #faf8f6; }
    h2 { font-size: 18px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 20px; }
    .calendar-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; font-weight: 600; }
    .nav-btn { cursor: pointer; padding: 5px 15px; border: 1px solid #eee; background: #fff; }
    .calendar-grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 5px; text-align: center; }
    .day-name { font-size: 11px; color: #9f9a94; padding: 10px 0; font-weight: 600; }
    .day { padding: 12px 0; font-size: 14px; cursor: pointer; border: 1px solid transparent; }
    .day:hover:not(.disabled) { background: #f5f5f5; }
    .day.selected { background: #000; color: #fff; }
    .day.disabled { color: #ddd; cursor: not-allowed; text-decoration: line-through; }
    .slots-grid { display: grid; grid-template-columns: 1fr; gap: 8px; }
    .slot { border: 1px solid #eee; padding: 14px; font-size: 13px; cursor: pointer; display: flex; justify-content: space-between; background: #fff; }
    .slot.selected { border-color: #000; background: #000; color: #fff; }
    .slot.booked { background: #f2f2f2; color: #bbb; cursor: not-allowed; opacity: .7; pointer-events: none; border-style: dashed; }
    .status-tag { font-size: 10px; font-weight: 700; }
    .form-group { margin-bottom: 20px; }
    label { display: block; font-size: 11px; font-weight: 600; color: #807a73; margin-bottom: 8px; text-transform: uppercase; }
    .std-input { width: 100%; padding: 14px; border: 1px solid #e0e0e0; font-size: 14px; outline: none; }
    .std-input:focus { border-color: #000; }
    .phone-row { width: 100%; display: flex; border: 1px solid #e0e0e0; background: #fff; overflow: hidden; min-height: 50px; }
    .country-box { display: flex; align-items: center; padding: 0 12px; background: #fcfcfc; border-right: 1px solid #eee; min-width: 108px; }
    .country-box select { width: 100%; border: none; background: transparent; font-size: 14px; font-weight: 500; outline: none; }
    .phone-input { border: none; min-width: 0; width: 100%; padding: 0 12px; font-size: 14px; outline: none; }
    .footer-nav { padding: 25px 30px; display: flex; justify-content: space-between; align-items: center; gap: 12px; border-top: 1px solid #f2efec; }
    .btn-black { background: #000; color: #fff; padding: 16px 30px; border: none; cursor: pointer; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .btn-black:disabled { background: #eee; color: #aaa; cursor: not-allowed; }

    @media (max-width: 900px) {
      :host { width: 100%; margin: 0; }
      .shell { border-left: none; border-right: none; }
      .modal-content { flex-direction: column; }
      .selection-side,
      .info-side { width: 100%; padding: 18px 14px; border-right: none; }
      .footer-nav { padding: 16px 14px 20px; flex-direction: column; align-items: stretch; }
      .btn-black { width: 100%; }
    }
  `;

  constructor() {
    super();
    this.step = 1;
    this.viewDate = new Date();
    this.selectedDate = '';
    this.selectedTime = '';
    this.selectedCountry = '+90';
    this.userName = '';
    this.userEmail = '';
    this.userPhone = '';
    this.isSending = false;
    this.userChoices = {};

    this.loadBookedSlots();

    this.countries = [
      { code: '+90', flag: '🇹🇷' }, { code: '+49', flag: '🇩🇪' }, { code: '+44', flag: '🇬🇧' },
      { code: '+33', flag: '🇫🇷' }, { code: '+31', flag: '🇳🇱' }, { code: '+32', flag: '🇧🇪' }
    ];
  }

  loadBookedSlots() {
    const saved = localStorage.getItem('annabella_booked_slots');
    this.bookedSlots = saved ? JSON.parse(saved) : [];
  }

  saveNewBooking(date, time) {
    this.bookedSlots = [...this.bookedSlots, { date, time }];
    localStorage.setItem('annabella_booked_slots', JSON.stringify(this.bookedSlots));
  }

  changeMonth(offset) {
    const newDate = new Date(this.viewDate);
    newDate.setMonth(newDate.getMonth() + offset);
    this.viewDate = newDate;
  }

  handleDateClick(day) {
    const month = this.viewDate.getMonth() + 1;
    const year = this.viewDate.getFullYear();
    this.selectedDate = `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`;
    this.selectedTime = '';
  }

  validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

  isFormValid() {
    return this.validateEmail(this.userEmail)
      && this.userPhone.replace(/\D/g, '').length >= 10
      && this.userName.trim().length > 3;
  }

  async submitAppointment() {
    if (!this.isFormValid()) return;
    this.isSending = true;

    const payload = {
      access_key: '60ead8fa-e0c3-4f82-bfb8-0557f9c41471',
      subject: `YENİ RANDEVU: ${this.userName} (${this.selectedDate})`,
      Müşteri: this.userName,
      'E-posta': this.userEmail,
      Telefon: `${this.selectedCountry} ${this.userPhone}`,
      Tarih: this.selectedDate,
      Saat: this.selectedTime,
      'Gelinlik Tercihleri': JSON.stringify(this.userChoices)
    };

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        this.saveNewBooking(this.selectedDate, this.selectedTime);
        this.step = 3;
      }
    } catch (e) {
      alert('Bağlantı hatası oluştu. Lütfen tekrar deneyin.');
    } finally {
      this.isSending = false;
    }
  }

  renderDays() {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < offset; i += 1) days.push(html`<div></div>`);

    for (let d = 1; d <= daysInMonth; d += 1) {
      const dateObj = new Date(year, month, d);
      const dateStr = `${String(d).padStart(2, '0')}.${String(month + 1).padStart(2, '0')}.${year}`;
      const isPast = dateObj < today;
      days.push(html`
        <div
          class="day ${this.selectedDate === dateStr ? 'selected' : ''} ${isPast ? 'disabled' : ''}"
          @click=${() => !isPast && this.handleDateClick(d)}>
          ${d}
        </div>
      `);
    }

    return days;
  }

  renderSlots() {
    const hours = ['10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'];

    return html`
      <label>Saat Seçimi (${this.selectedDate || 'Önce Tarih Seçin'})</label>
      <div class="slots-grid">
        ${hours.map((h) => {
          const isBooked = this.bookedSlots.some((b) => b.date === this.selectedDate && b.time === h);
          return html`
            <div class="slot ${this.selectedTime === h ? 'selected' : ''} ${isBooked ? 'booked' : ''}" @click=${() => !isBooked && (this.selectedTime = h)}>
              <span>${h}</span>
              <span class="status-tag">${isBooked ? 'DOLU' : (this.selectedTime === h ? 'SEÇİLDİ' : 'MÜSAİT')}</span>
            </div>
          `;
        })}
      </div>
    `;
  }

  renderForm() {
    return html`
      <div class="form-group"><label>Ad Soyad</label><input type="text" class="std-input" @input=${(e) => { this.userName = e.target.value; }} /></div>
      <div class="form-group"><label>E-posta</label><input type="email" class="std-input" @input=${(e) => { this.userEmail = e.target.value; }} /></div>
      <div class="form-group">
        <label>Telefon</label>
        <div class="phone-row">
          <div class="country-box">
            <select @change=${(e) => { this.selectedCountry = e.target.value; }}>
              ${this.countries.map((c) => html`<option value=${c.code}>${c.flag} ${c.code}</option>`) }
            </select>
          </div>
          <input type="tel" class="phone-input" @input=${(e) => { this.userPhone = e.target.value; }} />
        </div>
      </div>
    `;
  }

  render() {
    if (this.step === 3) {
      return html`
        <div class="shell" style="text-align:center; padding:100px 40px;">
          <h2>✓ Randevunuz Oluşturuldu</h2>
          <p>Sayın ${this.userName}, ${this.selectedDate} saat ${this.selectedTime} için randevunuzu aldık.</p>
          <button class="btn-black" style="margin-top:20px;" @click=${() => window.location.reload()}>Kapat</button>
        </div>
      `;
    }

    return html`
      <div class="shell">
        <div class="modal-header"><h2>Showroom Randevu Kaydı</h2></div>
        <div class="modal-content">
          <div class="selection-side">
            <div class="calendar-nav">
              <button class="nav-btn" @click=${() => this.changeMonth(-1)}>←</button>
              <div>${this.viewDate.toLocaleString('tr-TR', { month: 'long', year: 'numeric' })}</div>
              <button class="nav-btn" @click=${() => this.changeMonth(1)}>→</button>
            </div>
            <div class="calendar-grid">
              ${['PT', 'SL', 'ÇR', 'PR', 'CM', 'CT', 'PZ'].map((d) => html`<div class="day-name">${d}</div>`)}
              ${this.renderDays()}
            </div>
          </div>
          <div class="info-side">${this.step === 1 ? this.renderSlots() : this.renderForm()}</div>
        </div>
        <div class="footer-nav">
          <div style="font-size:11px; font-weight:700; color:#aaa;">ADIM ${this.step} / 2</div>
          <button class="btn-black" ?disabled=${this.step === 1 ? !this.selectedTime : !this.isFormValid()} @click=${() => (this.step === 1 ? (this.step = 2) : this.submitAppointment())}>
            ${this.isSending ? 'İŞLENİYOR...' : (this.step === 1 ? 'SAATİ ONAYLA' : 'TAMAMLA')}
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('premium-appointment', PremiumAppointment);
