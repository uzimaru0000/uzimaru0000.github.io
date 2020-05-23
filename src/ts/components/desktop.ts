import { html } from 'lit-html';

export type App = {
  name: string;
  icon: string;
  isActive: boolean;
};

export const Desktop = (apps: Array<App>) => html`
  <article>
    <x-window x="10" y="100">こんにちは</x-window>
    <section>
      <div class="dock">
        ${apps.map((x) => App(x.name, x.icon, x.isActive))}
      </div>
    </section>
  </article>
`;

const App = (
  name: string,
  icon: string,
  isActive: boolean,
  onClick?: () => void
) => html`
  <div class="app ${isActive ? 'active' : ''}" @click=${onClick}>
    <div class="tooltip">${name}</div>
    <img src="${icon}" />
  </div>
`;
