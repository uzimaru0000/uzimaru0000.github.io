import { LitElement, html, customElement, property, css } from 'lit-element';
// @ts-ignore
import reactIcon from '../../assets/react.svg';
// @ts-ignore
import elmIcon from '../../assets/elm.svg';
// @ts-ignore
import vueIcon from '../../assets/vue.svg';

import { App } from './desktop';

import './header';
import './desktop';
import '../react';
import '../elm';
import '../unity';

@customElement('x-system')
export class System extends LitElement {
  @property({ type: Array })
  apps: Array<App>;

  constructor() {
    super();

    this.apps = [
      {
        name: 'React',
        icon: reactIcon,
        state: 'inactive',
        view: () => html`<x-react></x-react>`,
      },
      {
        name: 'Elm',
        icon: elmIcon,
        state: 'inactive',
        width: 320,
        height: 480,
        view: () => html`<x-elm></x-elm>`,
      },
      {
        name: 'Vue',
        icon: vueIcon,
        state: 'inactive',
        view: () => html`<div>Vue</div>`,
      },
      {
        name: 'Unity',
        icon: '',
        state: 'active',
        width: 480,
        height: 320,
        view: () => html`<x-unity src="./unity/index.html"></x-unity>`,
      },
    ];
  }

  private setApps(app: App) {
    this.apps = this.apps.map((x) => (x.name === app.name ? app : x));
    this.requestUpdate();
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        background: linear-gradient(
          45deg,
          rgb(61, 125, 197),
          rgb(174, 190, 200)
        );
      }
    `;
  }

  render() {
    return html`
      <x-header></x-header>
      <x-desktop
        .apps=${this.apps}
        @close=${({ detail }: CustomEvent<App>) =>
          this.setApps({ ...detail, state: 'inactive' })}
        @hide=${({ detail }: CustomEvent<App>) =>
          this.setApps({ ...detail, state: 'hide' })}
        @active=${({ detail }: CustomEvent<App>) =>
          this.setApps({ ...detail, state: 'active' })}
      ></x-desktop>
    `;
  }
}
