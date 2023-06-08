import { registerCustomElement } from './element-utils.mjs'

const VERSION_SHOWDOWN = '2.1.0'
const IMPORT_DEP_SHOWDOWN = `https://ga.jspm.io/npm:showdown@${VERSION_SHOWDOWN}/dist/showdown.js`

/**
 * Our own components, but not loading them just yet.
 */
const OUR_COMPONENTS = [
  ['bt-app-layout', './app-layout-element.mjs'],
  ['bt-notice', './notice-box-element.mjs'],
  ['bt-markdown', './markdown-content.mjs'],
]

const contentParser = async (opts = {}) => {
  const imported = await import(IMPORT_DEP_SHOWDOWN)
  const showdown = imported?.default
  const converter = new showdown.Converter({ metadata: true, ...opts })
  converter.setOption('openLinksInNewWindow', true)

  return converter
}

const main = async ({ components = [], utils = [] }) => {
  const selectedComponents = [...OUR_COMPONENTS, ...components]
  for (const [name, path] of selectedComponents) {
    const imported = await import(path)
    const classObj = imported?.default
    const prototypeOf = Object.getPrototypeOf(classObj)
    const isHtmlElement = prototypeOf.name === 'HTMLElement'
    if (isHtmlElement) {
      // TODO: detect imported or use ours.
      registerCustomElement(window, name, classObj)
    }
  }

  // TODO make this better
  const OUR_UTILS = new Map([['contentParser', contentParser], ...utils])

  return OUR_UTILS
}

export default main
