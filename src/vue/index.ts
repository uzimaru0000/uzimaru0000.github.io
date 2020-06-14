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
    `;
  }
}
