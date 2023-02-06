/// <reference lib="dom" />

import { boolean } from 'https://renoirb.github.io/site-assets/static/esm-modules/stringificator-boolean.mjs'
// import { boolean } from './stringificator-boolean.mjs'

const OBSERVED_ATTRIBUTES = ['value', 'variant']

export class ValueBooleanElement extends HTMLElement {
  static get stringificator() {
    return boolean
  }

  static get observedAttributes() {
    return OBSERVED_ATTRIBUTES
  }

  constructor() {
    super()
    const variant = this.getAttribute('variant')
    const value = this.getAttribute('value')
    const parsed = JSON.parse(value.toLowerCase())
    console.log('RBx value-boolean ctor', {
      value: parsed,
      variant,
    })
  }

  connectedCallback() {
    const variant = this.getAttribute('variant')
    const value = this.getAttribute('value')
    const parsed = JSON.parse(value.toLowerCase())
    console.log('RBx value-boolean connectedCallback', {
      value: parsed,
      variant,
    })
  }

  attributeChangedCallback(name, previousValue, currentValue) {
    if (OBSERVED_ATTRIBUTES.includes(name)) {
      const parsedPrevious = JSON.parse(previousValue.toLowerCase())
      const parsedCurrent = JSON.parse(currentValue.toLowerCase())
      const areSame = parsedCurrent === parsedPrevious
      console.log('RBx value-boolean attributeChangedCallback', {
        attribute: name,
        areSame,
        previousValue,
        parsedPrevious,
        currentValue,
        parsedCurrent,
      })
      if (name === 'value') {
        const variant = this.getAttribute('variant')
        const stringified = ValueBooleanElement.stringificator.format(
          parsedCurrent,
          variant,
        )
        this.textContent = stringified
      }
      const isFormatVariant =
        ValueBooleanElement.stringificator.isFormatVariant(currentValue)
      if (name === 'variant' && isFormatVariant) {
        const value = this.getAttribute('value')
        const stringified = ValueBooleanElement.stringificator.format(
          value,
          parsedCurrent,
        )
        this.textContent = stringified
      }
    }
  }
}

export const setup = ({ customElements }) => {
  console.log('RBx value-boolean setup')
  if (!customElements.get('value-boolean')) {
    customElements.define('value-boolean', ValueBooleanElement)
  }
}

if (window) {
  console.log('RBx value-boolean window')
  setup(window)
}
