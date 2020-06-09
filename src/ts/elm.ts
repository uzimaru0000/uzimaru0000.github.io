import { LitElement, html, css, customElement } from 'lit-element';
// @ts-ignore
import { Elm } from '../Elm/Main.elm';

@customElement('x-elm')
export class ElmComponent extends LitElement {
  firstUpdated() {
    const mount = this.shadowRoot?.getElementById('mount');

    if (mount) {
      this.dispatchEvent(
        new CustomEvent('init', {
          detail: {
            width: mount.parentElement?.clientWidth,
            height: mount.parentElement?.clientHeight,
          },
        })
      );

      Elm.Main.init({ node: mount });
    }
  }

  render() {
    return html`<main>
      <div id="mount"></div>
    </main>`;
  }

  static get styles() {
    return css`
      * {
        box-sizing: border-box;
      }

      main {
        width: 100%;
        height: 100%;
      }
    `;
  }
}
