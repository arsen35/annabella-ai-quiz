import { css } from 'lit';

export const advisorStyles = css`
  :host {
    --ab-max-width: min(1600px, 90vw);
    --ab-border: #ece9e6;
    --ab-ink: #171717;
    --ab-soft: #6f6b66;
    --ab-bg: #faf8f6;
    display: block;
    width: 100%;
    margin: 32px auto;
    box-sizing: border-box;
    font-family: "Inter", "Helvetica Neue", Arial, sans-serif;
    color: var(--ab-ink);
  }

  *, *::before, *::after { box-sizing: border-box; }

  .advisor-wrapper {
    width: var(--ab-max-width);
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.05fr 1fr;
    border: 1px solid var(--ab-border);
    background: #fff;
    min-height: 680px;
  }

  .visual-side {
    min-height: 680px;
    overflow: hidden;
    background: #efe9e3;
  }

  .visual-side img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .quiz-side {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 42px;
  }

  .question-shell {
    min-height: 340px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  h2 {
    margin: 0 0 24px;
    font-size: clamp(26px, 2.4vw, 38px);
    font-weight: 300;
    line-height: 1.2;
    letter-spacing: 0.01em;
  }

  .progress-bar {
    width: 100%;
    height: 3px;
    background: #f2efec;
  }

  .progress-fill {
    height: 100%;
    background: #1b1b1b;
    transition: width 300ms ease;
  }

  .options-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  button {
    width: 100%;
    appearance: none;
    border: 1px solid var(--ab-border);
    background: #fff;
    color: #151515;
    padding: 15px 14px;
    text-align: center;
    font: inherit;
    font-size: 14px;
    line-height: 1.35;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background-color .2s, color .2s, border-color .2s;
  }

  button:hover {
    background: #171717;
    color: #fff;
    border-color: #171717;
  }

  .feedback {
    min-height: 22px;
    opacity: 0;
    transform: translateY(6px);
    transition: opacity 260ms ease, transform 260ms ease;
    color: var(--ab-soft);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 11px;
  }

  .feedback.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .analyzing-screen {
    width: var(--ab-max-width);
    margin: 0 auto;
    min-height: 380px;
    border: 1px solid var(--ab-border);
    display: grid;
    place-content: center;
    text-align: center;
    gap: 8px;
    background: var(--ab-bg);
    padding: 40px;
  }

  .analyzing-screen p {
    margin: 0;
    letter-spacing: .16em;
    text-transform: uppercase;
    color: var(--ab-soft);
    font-size: 11px;
  }

  @media (max-width: 920px) {
    :host { margin: 0; }
    .advisor-wrapper {
      width: 100%;
      border-left: none;
      border-right: none;
      grid-template-columns: 1fr;
      min-height: auto;
    }

    .visual-side { min-height: 42vh; }

    .quiz-side {
      padding: 24px 16px 28px;
      gap: 14px;
    }

    .question-shell { min-height: 360px; }

    .options-grid { grid-template-columns: 1fr; }

    button { padding: 14px 12px; }

    .analyzing-screen {
      width: 100%;
      border-left: none;
      border-right: none;
      min-height: 340px;
      padding: 24px 16px;
    }
  }
`;
