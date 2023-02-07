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

import { boolean } from 'https://renoirb.github.io/site-assets/static/esm-modules/stringificator-boolean.mjs'

const OBSERVED_ATTRIBUTES = ['value', 'variant']

const { format, deserialize } = boolean

export class ValueBooleanElement extends HTMLElement {
  static get observedAttributes() {
    return OBSERVED_ATTRIBUTES
  }

  get value() {
    return this.getAttribute('value')
  }

  get variant() {
    return this.getAttribute('variant')
  }

  constructor() {
    super()
    Object.assign(this, { stringificator: Object.freeze(boolean) })
    const variant = this.getAttribute('variant')
    const value = this.getAttribute('value')
    const parsed = deserialize(value)
    console.log('RBx value-boolean ctor', {
      value: parsed,
      variant,
    })
  }

  connectedCallback() {
    const variant = this.getAttribute('variant')
    const value = this.getAttribute('value')
    const parsed = deserialize(value)
    console.log('RBx value-boolean connectedCallback', {
      value: parsed,
      variant,
    })
  }

  attributeChangedCallback(name, previousAttributeValue, newAttributeValue) {
    console.log('RBx value-boolean attributeChangedCallback', {
      name,
      previousAttributeValue,
      newAttributeValue,
      'OBSERVED_ATTRIBUTES.includes(name)': OBSERVED_ATTRIBUTES.includes(name),
    })
    const localVariant = this.getAttribute('variant')
    const localValue = this.getAttribute('value')
    if (OBSERVED_ATTRIBUTES.includes(name)) {
      if (name === 'value' && localValue !== newAttributeValue) {
        this.textContent = format(newAttributeValue, localVariant)
      }
      if (name === 'variant' && localVariant !== newAttributeValue) {
        const isFormatVariant = boolean.isFormatVariant(newAttributeValue)
        if (isFormatVariant) {
          const value = this.getAttribute('value')
          this.textContent = format(value, newAttributeValue)
        }
      }
    }
  }
}

export const registerCustomElement = (
  { customElements },
  localName = 'value-boolean',
) => {
  let pickedName = localName.toLowerCase()
  if (/^[a-z]([\w\d-])+$/.test(pickedName) === false) {
    const message = `Invalid element name "${pickedName}", it must only contain letters and dash.`
    console.warn(message)
    pickedName = 'value-boolean'
  }
  if (!customElements.get(pickedName)) {
    console.log(`OK \t customElements.define <${pickedName} />`)
    customElements.define(pickedName, ValueBooleanElement)
  } else {
    console.log(
      `ERR\t customElements.define <${pickedName} />, already defined.`,
    )
  }
}

const registerElement = new URL(import.meta.url).searchParams.get(
  'registerElement',
)

/**
 * When we provide ?registerElement, we register to the DOM.
 */
if (registerElement) {
  try {
    window && registerCustomElement(window, registerElement)
  } catch (e) {
    console.log(`ERR\t No access to global window: ${e}`)
  }
}
