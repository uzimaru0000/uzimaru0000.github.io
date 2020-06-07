import { html, LitElement, customElement, property, css } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { styleMap } from 'lit-html/directives/style-map';

type HandleType = 'top' | 'bottom' | 'left' | 'right' | 'bar';

const Handle = (ev: (types: HandleType[]) => void) => (
  ...type: HandleType[]
) => html`
  <div class="handle ${type.join(' ')}" @mousedown=${() => ev(type)}></div>
`;

@customElement('x-window')
export class Window extends LitElement {
  @property({ type: Number })
  x: number;
  @property({ type: Number })
  y: number;
  @property({ type: Number })
  width: number;
  @property({ type: Number })
  height: number;
  @property()
  state: 'active' | 'hide' = 'active';

  private clickHandle: HandleType[];
  private mouseMoveEvent = (e: MouseEvent) => {
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
    }
  };
  private mouseUpEvent = () => (this.clickHandle = []);

  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.width = 160;
    this.height = 90;
    this.clickHandle = [];
  }

  disconnectedCallback() {
    document.removeEventListener('mousemove', this.mouseMoveEvent);
    document.removeEventListener('mouseup', this.mouseUpEvent);
    super.disconnectedCallback();
  }

  firstUpdated() {
    document.addEventListener('mousemove', this.mouseMoveEvent);
    document.addEventListener('mouseup', this.mouseUpEvent);
  }

  get handleTemplate() {
    return Handle((ts) => this.clickHandle.push(...ts));
  }

  render() {
    const bodyStyle = {
      width: `${this.width}px`,
      height: `${this.height}px`,
    };

    return html`${this.stylesheet}
      <div class="${classMap({ frame: true, hide: this.state === 'hide' })}">
        ${this.handleTemplate('top')} ${this.handleTemplate('bottom')}
        ${this.handleTemplate('left')} ${this.handleTemplate('right')}
        ${this.handleTemplate('top', 'right')}
        ${this.handleTemplate('top', 'left')}
        ${this.handleTemplate('bottom', 'left')}
        ${this.handleTemplate('bottom', 'right')}
        <div class="bar" @mousedown=${() => this.clickHandle.push('bar')}>
          <div
            class="close"
            @click=${() => this.dispatchEvent(new CustomEvent('close'))}
          ></div>
          <div
            class="hide"
            @click=${() => this.dispatchEvent(new CustomEvent('hide'))}
          ></div>
        </div>
        <div class="body" style="${styleMap(bodyStyle)}"><slot></slot></div>
      </div>`;
  }

  get stylesheet() {
    return html`
      <style>
        :host {
          position: absolute;
          top: 0;
          left: 0;
          transform: translate(${this.x}px, ${this.y}px);
        }
      </style>
    `;
  }

  static get styles() {
    return css`
      * {
        box-sizing: border-box;
      }

      div.frame {
        border-radius: 4px;
        box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.25);
      }

      div.frame.hide {
        display: none;
      }

      div.bar {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        height: 24px;
        background: var(--gray);
        padding: 0 0.5rem;
        border-radius: 4px 4px 0 0;
      }

      div.bar div {
        position: relative;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 6px;
      }
      div.bar div:active {
        filter: brightness(0.8);
      }

      div.bar .close {
        background: red;
      }

      div.bar:hover .close::before,
      div.bar:hover .close::after {
        content: '';
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 70%;
        height: 2px;
        background: rgba(0, 0, 0, 0.5);
      }
      div.bar .close::before {
        transform: translate(-50%, -50%) rotate(45deg);
      }
      div.bar .close::after {
        transform: translate(-50%, -50%) rotate(-45deg);
      }

      div.bar .hide {
        background: orange;
      }
      div.bar:hover .hide::before {
        content: '';
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 70%;
        height: 2px;
        background: rgba(0, 0, 0, 0.5);
      }

      div.body {
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
    `;
  }
}
