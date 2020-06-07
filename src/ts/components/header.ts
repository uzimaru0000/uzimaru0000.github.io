import { html, css, LitElement, customElement } from 'lit-element';

@customElement('x-header')
export class Header extends LitElement {
  static get styles() {
    return css`
      :host {
        z-index: 100;
      }

      header {
        height: 32px;
        background: var(--base25);
        padding: 0 1rem;
        display: flex;
        flex-direction: row;
      }

      header div {
        display: flex;
        padding: 0.1rem 0.5rem;
        color: var(--text);
        cursor: pointer;
      }

      header div:hover {
        background: var(--main);
      }

      .svg-wrapper {
        position: relative;
        width: 100%;
        padding-top: 100%;
      }
      .svg-wrapper svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .svg-wrapper svg path {
        fill: var(--text);
      }
    `;
  }

  render() {
    return html`
      <header>
        <div>
          <div class="svg-wrapper">
            <svg
              width="309"
              height="411"
              viewBox="0 0 309 411"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M309 253.039C309 340.279 239.828 411 154.5 411C69.172 411 0 340.279 0 253.039C0 165.8 69.172 0 154.5 0C239.828 0 309 165.8 309 253.039ZM154.5 385C226.573 385 285 322.57 285 246.793C278 171 226.5 31.5 154.5 27C97.4906 31.3853 53.5139 120.96 34.2286 195L69.5 182L98 220.5L149 165.5L186 210.5L149 177L98 249L63 210.5L26.9883 228.5C25.9091 234.92 25.0762 241.047 24.5 246.793C24.5 322.57 82.4268 385 154.5 385Z"
              />
            </svg>
          </div>
        </div>
        <div>Info</div>
        <div>Contact</div>
      </header>
    `;
  }
}
