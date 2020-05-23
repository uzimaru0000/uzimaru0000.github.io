import { render, html } from 'lit-html';

type HandleType = 'top' | 'bottom' | 'left' | 'right' | 'bar';

const Handle = (ev: (types: HandleType[]) => void) => (
  ...type: HandleType[]
) => html`
  <div class="handle ${type.join(' ')}" @mousedown=${() => ev(type)}></div>
`;

export class Window extends HTMLElement {
  static get observedAttributes() {
    return ['x', 'y', 'width', 'height'];
  }

  x: number;
  y: number;
  width: number;
  height: number;
  private clickHandle: HandleType[];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.x = 0;
    this.y = 0;
    this.width = 160;
    this.height = 90;
    this.clickHandle = [];
  }

  attributeChangedCallback(
    name: 'x' | 'y' | 'width' | 'height',
    _: string,
    newValue: string
  ) {
    switch (name) {
      case 'x':
        this.x = Number(newValue) || 0;
        break;
      case 'y':
        this.y = Number(newValue) || 0;
        break;
      case 'width':
        this.width = Number(newValue) || 0;
        break;
      case 'height':
        this.height = Number(newValue) || 0;
        break;
    }

    this.render();
  }

  connectedCallback() {
    this.render();

    document.addEventListener('mousemove', (e) => {
      if (this.clickHandle.length > 0) {
        this.clickHandle.forEach((x) => {
          switch (x) {
            case 'bar':
              this.x += e.movementX;
              this.y += e.movementY;
              break;
            case 'top':
              this.y += e.movementY;
              this.height -= e.movementY;
              break;
            case 'bottom':
              this.height += e.movementY;
              break;
            case 'left':
              this.x += e.movementX;
              this.width -= e.movementX;
              break;
            case 'right':
              this.width += e.movementX;
              break;
          }
        });

        this.render();
      }
    });
    document.addEventListener('mouseup', () => (this.clickHandle = []));
  }

  get handleTemplate() {
    return Handle((ts) => this.clickHandle.push(...ts));
  }

  get template() {
    return html`<div class="frame">
      ${this.handleTemplate('top')} ${this.handleTemplate('bottom')}
      ${this.handleTemplate('left')} ${this.handleTemplate('right')}
      ${this.handleTemplate('top', 'right')}
      ${this.handleTemplate('top', 'left')}
      ${this.handleTemplate('bottom', 'left')}
      ${this.handleTemplate('bottom', 'right')}
      <div class="bar" @mousedown=${() => this.clickHandle.push('bar')}>
        <div
          class="close"
          @click=${() => this.dispatchEvent(new Event('close'))}
        ></div>
        <div
          class="hide"
          @click=${() => this.dispatchEvent(new Event('hide'))}
        ></div>
      </div>
      <div class="body"><slot></slot></div>
    </div>`;
  }

  get css() {
    return html`<style>
      * {
        box-sizing: border-box;
      }

      :host {
        position: absolute;
        top: 0;
        left: 0;
      }

      div.frame {
        transform: translate(${this.x}px, ${this.y}px);
        border-radius: 4px;
      }

      div.bar {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        height: 16px;
        background: gray;
        padding: 0 0.5rem;
        border-radius: 4px 4px 0 0;
      }

      div.bar div {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 4px;
      }

      div.bar .close {
        background: red;
      }

      div.bar .hide {
        background: orange;
      }

      div.body {
        width: ${this.width}px;
        height: ${this.height}px;
        min-width: 32px;
        min-height: 32px;
        padding: 1rem;
        background: white;
        overflow: scroll;
        border-radius: 0 0 4px 4px;
      }

      div.handle {
        position: absolute;
      }

      div.handle.top,
      div.handle.bottom {
        width: 100%;
        height: 8px;
        cursor: ns-resize;
      }

      div.handle.left,
      div.handle.right {
        height: 100%;
        width: 8px;
        cursor: ew-resize;
      }

      div.handle.top.left,
      div.handle.top.right,
      div.handle.bottom.left,
      div.handle.bottom.right {
        width: 8px;
        height: 8px;
      }

      div.handle.top.left,
      div.handle.bottom.right {
        cursor: nwse-resize;
      }

      div.handle.top.right,
      div.handle.bottom.left {
        cursor: nesw-resize;
      }

      div.handle.top {
        top: -4px;
      }

      div.handle.bottom {
        bottom: -4px;
      }

      div.handle.left {
        left: -4px;
      }

      div.handle.right {
        right: -4px;
      }
    </style>`;
  }

  render() {
    this.shadowRoot &&
      render(html`${this.css} ${this.template}`, this.shadowRoot);
  }
}
