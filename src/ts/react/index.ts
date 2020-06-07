import { LitElement, customElement, html, css } from 'lit-element';
import { render } from 'react-dom';
import retargetEvent from 'react-shadow-dom-retarget-events';
import { createElement } from 'react';
import App from './app';
import { Style } from './style';

@customElement('x-react')
export class ReactComponent extends LitElement {
  firstUpdated() {
    const mount = this.shadowRoot?.querySelector('main');

    if (mount) {
      render(createElement(App), mount);

      this.dispatchEvent(
        new CustomEvent('init', {
          detail: {
            width: mount.clientWidth,
            height: mount.clientHeight,
          },
        })
      );

      this.shadowRoot && retargetEvent(this.shadowRoot);
    }
  }

  render() {
    const styleElement = Style.getStyles();
    return html`<style>
        ${styleElement}
      </style>
      <main></main>`;
  }

  static get styles() {
    return css`
      main {
        width: 100%;
        height: 100%;

        min-width: 480px;
        min-height: 320px;
      }
    `;
  }
}
