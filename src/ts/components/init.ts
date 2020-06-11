import { LitElement, html, customElement, css, property } from 'lit-element';
// @ts-ignore
import egg from '../../assets/egg.svg';
import { styleMap } from 'lit-html/directives/style-map';
import { classMap } from 'lit-html/directives/class-map';

@customElement('x-init')
export class InitAnimation extends LitElement {
  rate: number = 0;
  allGreen: boolean = false;

  firstUpdated() {
    const process = [...Array(50)]
      .map((_) => Math.random() * 2.5)
      .map(
        (n) =>
          new Promise((res) =>
            setTimeout(() => {
              this.rate += 1 / 50;
              this.requestUpdate();
              res();
            }, n * 1000)
          )
      );

    Promise.all(process).then(() => {
      setTimeout(() => {
        this.allGreen = true;
        this.requestUpdate();
      }, 500);
    });
  }

  render() {
    return html`<main class=${classMap({ hide: this.allGreen })}>
      ${!this.allGreen
        ? html`<svg
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
          </svg>`
        : html`
            <svg
              width="368"
              height="428"
              viewBox="0 0 368 428"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="chick"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M186.24 362.24C86.2102 362.24 5.11996 281.15 5.11996 181.12C5.11996 149.051 13.4547 118.928 28.076 92.8L0 40.96L65.5367 46.08C97.575 17.4233 139.873 0 186.24 0C286.27 0 367.36 81.0902 367.36 181.12C367.36 230.451 367.36 322.56 365.44 362.24H216.32V427.52H129.28V400.64H189.44V362.24H186.24ZM33.28 181.12C33.28 281.15 113.28 335.36 186.24 335.36H338.56V181.12C338.56 81.0902 254.72 30.08 186.24 30.08C86.2102 30.08 33.28 107.52 33.28 181.12Z"
              />
              <path
                d="M149.12 69.12C165.76 69.12 173.44 82.56 173.44 91.52C173.44 100.48 168.32 116.48 150.4 116.48C132.48 116.48 126.08 102.4 126.08 91.52C126.08 80.64 135.04 69.12 149.12 69.12Z"
              />
              <path
                d="M92.16 181.76C92.16 234.24 133.12 274.56 185.6 274.56V248.96C151.04 248.96 118.4 218.88 118.4 181.76H92.16Z"
              />
            </svg>
          `}
      <x-indicator
        rate="${this.rate}"
        class=${classMap({ hide: this.allGreen })}
      ></x-indicator>
    </main>`;
  }

  static get styles() {
    return css`
      main {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 1000;
        background: var(--base);
      }

      main.hide {
        animation-name: main-hide;
        animation-duration: 500ms;
        animation-delay: 2000ms;
        animation-fill-mode: forwards;
      }

      @keyframes main-hide {
        0% {
          opacity: 1;
        }

        100% {
          opacity: 0;
        }
      }

      svg {
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -40%);
        width: auto;
        height: 25%;
      }

      svg path {
        fill: var(--text);
      }

      svg.chick {
        animation: icon-show 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }

      @keyframes icon-show {
        0% {
          transform: translate(-50%, -100%);
        }

        100% {
          transform: translate(-50%, -40%);
        }
      }

      x-indicator {
        position: absolute;
        top: 75%;
        left: 50%;
        transform: translate(-50%, -75%);
        width: 20%;
        height: 1%;
      }
    `;
  }
}

@customElement('x-indicator')
class Indicator extends LitElement {
  @property({ type: Number })
  rate: number = 0;

  render() {
    const style = {
      '--size': `${this.rate * 100}%`,
    };

    return html`<div>
      <div class="display" style="${styleMap(style)}"></div>
    </div>`;
  }

  static get styles() {
    return css`
      div {
        width: 100%;
        height: 100%;
        background: var(--gray);
        border-radius: 100px;
        overflow: hidden;
        transition: ease-in-out 300ms;
      }

      .display {
        width: var(--size, 0);
        background: var(--text);
        border-radius: 0;
      }
    `;
  }
}
