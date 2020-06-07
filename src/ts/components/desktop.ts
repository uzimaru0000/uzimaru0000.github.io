import {
  html,
  TemplateResult,
  LitElement,
  customElement,
  css,
  property,
} from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { repeat } from 'lit-html/directives/repeat';

import './window';

export type App = {
  name: string;
  icon: string;
  state: 'active' | 'hide' | 'inactive';
  view: () => TemplateResult;
};

@customElement('x-desktop')
export class Desktop extends LitElement {
  @property({ type: Array })
  apps: Array<App> = [];

  static get styles() {
    return css`
      article {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        height: calc(100vh - 32px);
      }

      section {
        display: flex;
        justify-content: center;
      }
    `;
  }

  render() {
    return html`
      <article>
        ${repeat(
          this.apps.filter((x) => x.state !== 'inactive'),
          (x) => x.name,
          (x) =>
            html`<x-window
              x="10"
              y="100"
              state="${x.state}"
              @close=${() =>
                this.dispatchEvent(
                  new CustomEvent<App>('close', { detail: x })
                )}
              @hide=${() =>
                this.dispatchEvent(
                  new CustomEvent<App>('hide', { detail: x })
                )}
              >${x.view()}</x-window
            >`
        )}
        <section>
          <x-dock>
            ${this.apps.map(
              (x) =>
                html`<x-app
                  name=${x.name}
                  icon=${x.icon}
                  state=${x.state}
                  @click=${() =>
                    this.dispatchEvent(
                      new CustomEvent('active', { detail: x })
                    )}
                ></x-app>`
            )}
          </x-dock>
        </section>
      </article>
    `;
  }
}

@customElement('x-dock')
export class Dock extends LitElement {
  static get styles() {
    return css`
      div {
        display: flex;
        background: var(--base25);
        padding: 1rem 1rem 1.5rem;
        border-radius: 8px 8px 0 0;
        backdrop-filter: blur(50px);
      }

      ::slotted(*) {
        margin-right: 1.5rem;
      }

      ::slotted(*:last-child) {
        margin-right: 0;
      }
    `;
  }

  render() {
    return html`<div>
      <slot></slot>
    </div>`;
  }
}

@customElement('x-app')
export class AppView extends LitElement {
  @property()
  state: 'active' | 'hide' | 'inactive' = 'inactive';

  @property()
  icon: string = '';

  @property()
  name: string = '';

  static get appStyle() {
    return css`
      .app {
        display: flex;
        position: relative;
        width: 64px;
        height: 64px;
        transition: 150ms ease;
      }

      .app:hover {
        width: 96px;
        height: 96px;
        margin-bottom: -32px;
        transform: translateY(-32px);
      }

      .app:active {
        filter: brightness(0.8);
      }

      .app.active::after {
        content: '';
        position: absolute;
        left: calc((100% - 8px) / 2);
        bottom: -16px;
        display: block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--text);
      }

      .app img {
        width: 100%;
        height: auto;
      }
    `;
  }

  static get tooltip() {
    return css`
      .app:hover .tooltip {
        display: block;
      }

      .tooltip {
        display: none;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -150%);
        background: var(--base50);
        color: var(--text);
        backdrop-filter: blur(50px);
        border-radius: 4px;
        padding: 0.25rem 1rem;
        text-align: center;
      }

      .tooltip::before {
        content: '';
        position: absolute;
        bottom: -16px;
        right: calc((100% - 16px) / 2);
        display: block;
        border: 8px solid transparent;
        border-top-color: var(--black50);
      }
    `;
  }

  static get styles() {
    return [this.appStyle, this.tooltip];
  }

  render() {
    return html` <div
      class="${classMap({ app: true, active: this.state !== 'inactive' })}"
      @click=${() => this.dispatchEvent(new CustomEvent('click'))}
    >
      <div class="tooltip">${this.name}</div>
      <img src="${this.icon}" />
    </div>`;
  }
}
