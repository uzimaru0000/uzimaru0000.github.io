import { html } from 'lit-html';

export type App = {
  name: string;
  icon: string;
  isActive: boolean;
};

export const Desktop = (apps: Array<App>) => html`
  <article>
    <section>
      <x-window x="10" y="100">こんにちは</x-window>
      <div class="dock">
        ${apps.map((x) => App(x.name, x.icon, x.isActive))}
      </div>
    </section>
  </article>
`;

const App = (name: string, icon: string, isActive: boolean) => html`
  <div class="app ${isActive ? 'active' : ''}">
    <div class="tooltip">${name}</div>
    <img src="${icon}" />
  </div>
`;
