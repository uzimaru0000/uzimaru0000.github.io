import { html, render } from 'lit-html';
// @ts-ignore
import reactIcon from '../../assets/react.svg';
// @ts-ignore
import elmIcon from '../../assets/elm.svg';
// @ts-ignore
import vueIcon from '../../assets/vue.svg';

import { Header } from './header';
import { Desktop, App } from './desktop';

export class System extends HTMLElement {
  apps: Array<App>;

  constructor() {
    super();

    this.apps = [
      { name: 'React', icon: reactIcon, isActive: false },
      { name: 'Elm', icon: elmIcon, isActive: true },
      { name: 'Vue', icon: vueIcon, isActive: false },
    ];
  }

  connectedCallback() {
    this.render();
  }

  get template() {
    return html` ${Header()} ${Desktop(this.apps)} `;
  }

  render() {
    render(html`${this.template}`, this);
  }
}
