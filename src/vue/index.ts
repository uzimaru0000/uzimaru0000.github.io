import { LitElement, customElement, html, css } from 'lit-element';
import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
// @ts-ignore
import App from './App.vue';

Vue.use(VueCompositionApi);

@customElement('x-vue')
export class VueComponent extends LitElement {
  firstUpdated() {
    const mount = this.shadowRoot?.getElementById('mount');

    if (mount) {
      new Vue({
        el: mount,
        render: (h) => h(App),
      });
    }
  }

  render() {
    return html`
      <main>
        <div id="mount"></div>
      </main>
    `;
  }

  static get styles() {
    return css`
      main {
        width: 100%;
        height: 100%;
      }

      .field {
        position: relative;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: repeat(8, 1fr);
        grid-template-columns: repeat(8, 1fr);
        gap: 1px;
        background: var(--gray);
      }

      .panel {
        position: relative;
        width: 100%;
        height: 100%;
        background: var(--main);
        justify-content: center;
        align-items: center;
      }

      .panel.clickable {
        filter: brightness(1.5);
        cursor: pointer;
      }

      .stone {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        height: 80%;
        border-radius: 50%;
        box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.25);
      }

      .stone.black {
        background: var(--black);
      }

      .stone.white {
        background: var(--white);
      }

      .stone-enter-active {
        transition: all 300ms ease;
      }

      .stone-enter-to {
        transform: translate(-50%, -50%) rotateY(0);
      }

      .stone-enter {
        transform: translate(-50%, -50%) rotateY(90deg);
      }

      .result {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: var(--base50);
        color: var(--text);
        backdrop-filter: blur(5px);
        font-size: 3rem;
      }

      .result > *:not(:last-child) {
        margin-bottom: 1rem;
      }

      .result button {
        font-size: 2rem;
        padding: 0.5rem 3rem;
        border-radius: 100px;
        border: none;
        background: var(--accent);
        color: var(--text);
        outline: none;
        transition: 300ms ease;
      }

      .result button:hover {
        filter: brightness(0.9);
      }

      .result button:active {
        filter: brightness(0.8);
      }
    `;
  }
}
