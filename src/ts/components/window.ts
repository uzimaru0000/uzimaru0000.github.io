import { render, html } from 'lit-html';

type Handle = 'top' | 'bottom' | 'left' | 'right' | 'bar';

export class Window extends HTMLElement {
  static get observedAttributes() {
    return ['x', 'y'];
  }

  x: number;
  y: number;
  width: number;
  height: number;
  private clickHandle: Handle[];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.x = 100;
    this.y = 100;
    this.width = 100;
    this.height = 100;
    this.clickHandle = [];
  }

  connectedCallback() {
    this.render();

    [
      'bar',
      'top',
      'bottom',
      'left',
      'right',
      'top.left',
      'top.right',
      'bottom.left',
      'bottom.right',
    ]
      .map<[Element | null | undefined, Handle]>((x) => [
        this.shadowRoot?.querySelector(`div.${x}`),
        x as Handle,
      ])
      .forEach(([elm, x]) => {
        elm?.addEventListener('mousedown', () => {
          this.clickHandle.push(...(x.split('.') as Handle[]));
        });
      });
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

  get template() {
    return html`<div class="frame">
      <div class="top anchor"></div>
      <div class="bottom anchor"></div>
      <div class="left anchor"></div>
      <div class="right anchor"></div>
      <div class="top right anchor"></div>
      <div class="top left anchor"></div>
      <div class="bottom right anchor"></div>
      <div class="bottom left anchor"></div>
      <div class="bar"></div>
      <div class="body">(${this.x},${this.y})<slot></slot></div>
    </div>`;
  }

  get css() {
    return html`<style>
      * {
        box-sizing: border-box;
      }

      div.frame {
        position: absolute;
        top: ${this.y}px;
        left: ${this.x}px;
        border-radius: 4px;
      }

      div.bar {
        width: 100%;
        height: 16px;
        background: gray;
        padding: 0 1rem;
        border-radius: 4px 4px 0 0;
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

      div.anchor {
        position: absolute;
      }

      div.anchor.top,
      div.anchor.bottom {
        width: 100%;
        height: 8px;
        cursor: ns-resize;
      }

      div.anchor.left,
      div.anchor.right {
        height: 100%;
        width: 8px;
        cursor: ew-resize;
      }

      div.anchor.top.left,
      div.anchor.top.right,
      div.anchor.bottom.left,
      div.anchor.bottom.right {
        width: 8px;
        height: 8px;
      }

      div.anchor.top.left,
      div.anchor.bottom.right {
        cursor: nwse-resize;
      }

      div.anchor.top.right,
      div.anchor.bottom.left {
        cursor: nesw-resize;
      }

      div.anchor.top {
        top: -4px;
      }

      div.anchor.bottom {
        bottom: -4px;
      }

      div.anchor.left {
        left: -4px;
      }

      div.anchor.right {
        right: -4px;
      }
    </style>`;
  }

  render() {
    this.shadowRoot &&
      render(html`${this.css} ${this.template}`, this.shadowRoot);
  }
}
