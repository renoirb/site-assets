/**
 * Normally "boolean" attribute on HTML elements is when
 * the attribute is there or not.
 *
 * @param {*} input
 * @returns
 */
export const isNotNullOrStringEmptyOrNull = (input) =>
  typeof input === 'string' && input !== '' && input !== 'null'

export const assertIsValidCustomElementName = (
  elementName /*: string */ = '',
) /*: assert is ... */ => {
  if (/^[a-z]([\w\d-])+$/.test(elementName) === false) {
    const message = `Invalid element name "${elementName}", it must only contain letters and dash.`
    throw new Error(message)
  }
}

export const registerCustomElement = (
  { customElements },
  elementName = '',
  elementClass = Error,
) => {
  assertIsValidCustomElementName(elementName)
  if (!customElements.get(elementName)) {
    customElements.define(elementName, elementClass)
  } else {
    const message = `ERR customElements.define <${elementName} />, already defined.`
    throw new Error(message)
  }
}

export const createLinkStlesheets = (
  { document },
  elementName,
  stylesExternal = [],
) => {
  const frag = document.createDocumentFragment()
  for (const href of stylesExternal) {
    const linkElem = document.createElement('link')
    linkElem.setAttribute('rel', 'stylesheet')
    linkElem.setAttribute('href', href)
    linkElem.setAttribute('data-related-to', elementName)
    frag.appendChild(linkElem)
  }
  return frag
}
