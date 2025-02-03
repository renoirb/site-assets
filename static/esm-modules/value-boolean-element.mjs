/*!
 * https://renoirb.com/esm-modules/value-boolean-element.mjs v1.0.0
 *
 * Maintainer: Renoir Boulanger <contribs@renoirboulanger.com>
 *
 * MIT
 *
 * © 2003-2023 Renoir Boulanger
 */

/**
 * Custom Element made to display a boolean value with an emoji.
 *
 * Time spent:
 *   20230211: 2h
 */

import { boolean, isFormatVariant } from './stringificator-boolean.mjs'
import { isNotNullOrStringEmptyOrNull } from './element-utils.mjs'

const { format } = boolean

class ValueBooleanElement extends HTMLElement {
  static get observedAttributes() {
    return ['value', 'variant']
  }

  set variant(input = '') {
    console.warn('RBx value-boolean set variant', { input })
    if (isNotNullOrStringEmptyOrNull(input)) {
      const currentValue = this.getAttribute('variant')
      const changed = currentValue !== input
      if (changed && isFormatVariant(input)) {
        this.setAttribute('variant', input)
      }
    }
  }

  set value(input = '') {
    console.warn('RBx value-boolean set value', { input })
    if (isNotNullOrStringEmptyOrNull(input)) {
      const currentValue = this.getAttribute('value')
      const changed = currentValue !== input
      changed && this.setAttribute('value', input)
    }
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    const template = document.createElement('template')
    template.innerHTML = `
      <style>
        :host {
          display: inline;
        }
      </style>
      <span></span>
    `
    const innerHtml = template.content.cloneNode(true)
    shadowRoot.appendChild(innerHtml)
  }

  connectedCallback() {
    const value = this.getAttribute('value') ?? 'true'
    const variant = this.getAttribute('variant') ?? 'thumb'
    console.warn('RBx value-boolean connectedCallback', { value, variant })
    this._changeTextContent(value, variant)
  }

  _changeTextContent = (value, variant) => {
    const textContent = format(value, variant)
    const targetToInsert = this.shadowRoot.querySelector('span')
    if (targetToInsert) {
      targetToInsert.textContent = textContent
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const changedWithValue =
      oldValue !== null &&
      oldValue !== newValue &&
      isNotNullOrStringEmptyOrNull(newValue)
    console.warn('RBx value-boolean attributeChangedCallback', {
      name,
      oldValue,
      newValue,
      changedWithValue,
    })
    if (name === 'variant') {
      // Variant is invalid, let's not change
      if (!boolean.isFormatVariant(newValue)) {
        changedWithValue = false
      }
    }
    if (changedWithValue) {
      let variant = this.getAttribute('variant')
      let value = this.getAttribute('value')
      if (name === 'value') {
        value = newValue
      }
      if (name === 'variant') {
        if (boolean.isFormatVariant(newValue)) {
          variant = newValue
        }
      }
      this._changeTextContent(value, variant)
    }
  }
}

export default ValueBooleanElement
