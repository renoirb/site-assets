import {
  isNotNullOrStringEmptyOrNull,
  createLinkStlesheets,
} from './element-utils.mjs'

// rel=#MakePurgeCSSNotPurgeThisPlease
// Idea is to have inventory of all possible permutations
// so that PurgeCSS won't purge them in the component
const ALL_VARIANTS = new Set(['info', 'warn', 'error'])

const DEFAULT_VARIANT = 'info'

const OBSERVED_ATTRIBUTES = Object.freeze(['variant'])

const pickColor = (type) /*: IColorTextColor */ => {
  let color = 'yellow'
  // Think about contrast for textColor
  let textColor = 'black'
  switch (type) {
    case 'warn':
      color = 'yellow'
      break

    case 'error':
      color = 'red'
      textColor = 'white'
      break

    case 'info':
    default:
      color = 'blue'
      textColor = 'white'
      break
  }

  return { color, textColor }
}

/**
 *
 * Copy from {@link https://github.com/renoirb/site/blob/2020/lib/runtime/tailwind/alert.ts}
 *
 * @param {C} type
 * @param {*} andRestForHackishPostCssThing
 * @returns
 */
export const styleMap = (
  type /*: IAlertType */,
  andRestForHackishPostCssThing = false,
) /*: IStyleMapAlert */ => {
  const allTypes = new Set([...ALL_VARIANTS])
  allTypes.delete(type)

  const outer = []
  const heading = []

  const outerTokens = (cfg /*: IColorTextColor*/) /*: string[]*/ => [
    `bg-${cfg.color}-200`,
    `border-${cfg.color}-400`,
    `text-${cfg.textColor}-800`,
  ]

  const headingTokens = (cfg /*: IColorTextColor*/) /*: string[]*/ => [
    `bg-${cfg.color}-400`,
    `text-${cfg.textColor}`,
  ]

  outer.push(...outerTokens(pickColor(type)))
  heading.push(...headingTokens(pickColor(type)))

  if (andRestForHackishPostCssThing) {
    for (const other of [...allTypes]) {
      outer.push(...outerTokens(pickColor(other)))
      heading.push(...headingTokens(pickColor(other)))
    }
  }

  return {
    outer,
    heading,
  }
}

const assertValidVariant = (input) => {
  if (!ALL_VARIANTS.has(input)) {
    const these = [...ALL_VARIANTS].join(', ')
    const message = `Invalid variant "${input}", we only support ${these}`
    throw new Error(message)
  }
}

class NoticeBoxElement extends HTMLElement {
  static get observedAttributes() {
    return OBSERVED_ATTRIBUTES
  }

  get variant() {
    if (this.hasAttribute('variant')) {
      return this.getAttribute('variant')
    }
    return DEFAULT_VARIANT
  }

  set variant(input = DEFAULT_VARIANT) {
    if (isNotNullOrStringEmptyOrNull(input)) {
      assertValidVariant(input)
      const changed = this.variant !== input
      changed && this.setAttribute('variant', input)
    }
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    const template = document.createElement('template')
    template.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .disposition-parent {
          padding: .75rem 1rem;
          border-radius: .5rem;
        }
        .disposition-parent header {
          font-weight: 700;
          margin-bottom: .5rem;
        }

        /** ---- BEGIN ---- Dirty scavenging from TailwindCSS ---- */
        .text-yellow-800 {
          --text-opacity: 1;
          color: #975a16;
          color: rgba(151,90,22,var(--text-opacity));
        }
        .border-yellow-400 {
          --border-opacity: 1;
          border-color: #f6e05e;
          border-color: rgba(246,224,94,var(--border-opacity));
        }
        .bg-yellow-200 {
          --bg-opacity: 1;
          background-color: #fefcbf;
          background-color: rgba(254,252,191,var(--bg-opacity));
        }
        text-blue-800 {
          --text-opacity: 1;
          color: #2c5282;
          color: rgba(44,82,130,var(--text-opacity));
        }
        .text-yellow-800 {
          --text-opacity: 1;
          color: #975a16;
          color: rgba(151,90,22,var(--text-opacity));
        }
        .border-blue-400 {
          --border-opacity: 1;
          border-color: #63b3ed;
          border-color: rgba(99,179,237,var(--border-opacity));
        }
        .bg-blue-200 {
          --bg-opacity: 1;
          background-color: #bee3f8;
          background-color: rgba(190,227,248,var(--bg-opacity));
        }
        .border-red-400 {
          --border-opacity: 1;
          border-color: #fc8181;
          border-color: rgba(252,129,129,var(--border-opacity));
        }
        .bg-red-200 {
          --bg-opacity: 1;
          background-color: #fed7d7;
          background-color: rgba(254,215,215,var(--bg-opacity));
        }
        /** ----  END  ---- Dirty scavenging from TailwindCSS ---- */


      </style>
      <div
        class="disposition-parent foo"
        data-alert-type="warn"
        role="alert"
      >
        <header class="disposition-item" part="slot-parent-header">
          <!-- Do not keep parent in the DOM tree when empty -->
          <slot name="header"></slot>
        </header>
        <div class="disposition-item">
          <!-- TODO: see https://github.com/renoirb/site/blob/2020/lib/runtime/tailwind/alert.ts make as WC -->
          <slot></slot>
        </div>
      </div>
    `
    const innerHtml = template.content.cloneNode(true)
    shadowRoot.appendChild(innerHtml)
  }

  _setHeaderTitle(textContent) {
    const target = this.shadowRoot.querySelector('slot[name="header"]')
    if (target) {
      target.textContent = textContent
    }
  }

  _setDataType(alertType) {
    const target = this.shadowRoot.querySelector('[data-alert-type]')
    if (target) {
      target.dataset.alertType = alertType
    }
  }

  _setStylingTokens = (variant) => {
    const { outer, heading } = styleMap(variant)
    const targetOuter = this.shadowRoot.querySelector('.disposition-parent')
    const targetBody = this.shadowRoot.querySelector(
      '.disposition-parent > div.disposition-item',
    )
    for (const className of targetBody.classList) {
      if (className !== 'disposition-item') {
        targetOuter.classList.remove(className)
      }
    }
    for (const className of targetOuter.classList) {
      if (className !== 'disposition-parent') {
        targetOuter.classList.remove(className)
      }
    }
    for (const className of outer) {
      targetOuter.classList.add(className)
    }
    for (const className of heading) {
      targetBody.classList.add(className)
    }
  }

  _handle = (variant) => {
    this._setStylingTokens(variant)
    this._setDataType(variant)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const changedWithValue =
      oldValue !== newValue && isNotNullOrStringEmptyOrNull(newValue)
    if (changedWithValue) {
      if (name === 'variant') {
        try {
          assertValidVariant(newValue)
          this._setHeaderTitle(newValue)
          this._handle(newValue)
        } catch {
          this.setAttribute('variant', DEFAULT_VARIANT)
          this._handle(DEFAULT_VARIANT)
        }
      }
    }
  }
}

export default NoticeBoxElement
