import { LitElement, customElement, property, html, css } from 'lit-element';

@customElement('x-unity')
export class UnityComponent extends LitElement {
  @property()
  src: string = '';

  render() {
    return html`<iframe src="${this.src}"></iframe>`;
  }

  static get styles() {
    return css`
      iframe {
        width: 100%;
        height: 100%;
        border: none;
      }
    `;
  }
}
