import { ContextRequestEvent } from './context.mjs'

// Can use Symbol, but let's not make this more complex.
/**
 * Context Request event for signaling Markdown needing to be parsed.
 */
export const ContextRequest_MarkdownContent = 'markdown-content-context'

class MarkdownContent extends HTMLElement {
  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    const template = document.createElement('template')

    template.innerHTML = `
      <style>
        :host {
          display: block;
        }
        #markdown-source {
          display: none;
        }
        .is-not-transformed #markdown-loading {
          display: block;
        }
        .is-not-transformed #markdown-transformed {
          display: none;
        }
        .is-transformed #markdown-loading {
          display: none;
        }
        .is-transformed #markdown-transformed {
          display: block;
        }
      </style>
      <div class="disposition-parent">
        <div
          id="markdown-viewer"
          part="markdown-viewer"
          class="disposition-item is-not-transformed"
        >
          <div id="markdown-loading">
            <slot name="skeleton">
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_ajPY{transform-origin:center;animation:spinner_AtaB .75s infinite linear}@keyframes spinner_AtaB{100%{transform:rotate(360deg)}}</style><path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" class="spinner_ajPY"/></svg>
            </slot>
          </div>
          <div id="markdown-transformed"></div>
        </div>
        <div
          id="markdown-source"
          part="markdown-source"
          class="disposition-item"
        >
          <pre>
            <slot></slot>
          </pre>
        </div>
      </div>
    `
    const innerHtml = template.content.cloneNode(true)
    shadowRoot.appendChild(innerHtml)
    let slot = this.shadowRoot.querySelector('slot:not([name])')
    slot.addEventListener('slotchange', this._onSlotChange)
  }

  _updateMarkdownTransformed = (html = '') => {
    const transformed = html !== ''
    const elementViewer = this.shadowRoot.querySelector('#markdown-viewer')
    const elementMarkdownTransformed = this.shadowRoot.querySelector(
      '#markdown-transformed',
    )
    if (transformed) {
      elementMarkdownTransformed.innerHTML = html
      elementViewer.classList.remove('is-not-transformed')
      elementViewer.classList.add('is-transformed')
    } else {
      elementMarkdownTransformed.innerHTML = ''
      elementViewer.classList.add('is-not-transformed')
      elementViewer.classList.remove('is-transformed')
    }
  }

  /**
   * Listen on changes only on default slot, that's the trigger to ask for HTML.
   */
  _onSlotChange = (event /*: HTMLElementEventMap['slotchange'] */) => {
    this.dispatchEvent(
      new ContextRequestEvent(
        ContextRequest_MarkdownContent,
        this._onMarkdownContextEvent,
      ),
    )
  }

  _onMarkdownContextEvent = ({ html = '' }) => {
    this._updateMarkdownTransformed(html)
  }
}

export default MarkdownContent