/*!
 * https://renoirb.com/esm-modules/app-layout-element.mjs v1.0.0
 *
 * Maintainer: Renoir Boulanger <contribs@renoirboulanger.com>
 *
 * MIT
 *
 * © 2003-2023 Renoir Boulanger
 */

/**
 * Custom Element to manage application layout (what's dressing up the page).
 *
 * This was initially worked on https://github.com/renoirb/site/ as a Vue.js
 * and then extracted the rendered HTML to make a CustomElement.
 *
 * Time spent below is since then.
 *
 * Time spent:
 *   20230211: 2h
 */

import { createLinkStlesheets } from './element-utils.mjs'

const STYLES_EXTERNAL = [
  'https://renoirb.github.io/site/_nuxt/vendors/app.css',
  'https://renoirb.github.io/site/_nuxt/app.css',
]

const TEMPLATE = `
  <div id="__layout">
    <div class="layouts--homepage">
      <nav class="app-side-bar--component fixed z-40 w-full top">
        <div
          class="zone__sandwich__top container flex items-center justify-between py-4 mx-auto"
          style="position: relative"
        >
          <div class="app-side-bar__identity md:px-5 flex items-center">
            <button aria-label="Open Menu" class="md:hidden ml-5 mr-2">
              <svg
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                class="w-8 h-8"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <div part="slot-parent-top-left">
              <slot name="top-left">
                <a
                  href="https://renoirb.github.io/site/"
                  class="identity__text text-2xl"
                >
                  Renoir Boulanger
                </a>
              </slot>
            </div>
          </div>
          <div class="app-side-bar__nav flex items-center" part="slot-parent-top-right">
            <slot name="top-right">
              <div
                class="md:flex md:justify-between md:bg-transparent text-is-italicized hidden"
              >
                <a
                  href="https://renoirb.github.io/site/blog"
                  class="hover:opacity-100 opacity-80 hover:underline flex items-center p-3 px-4 py-2 mr-2 font-medium text-center rounded"
                >
                  Blog </a
                ><a
                  href="https://renoirb.github.io/site/resume"
                  class="hover:opacity-100 opacity-80 hover:underline flex items-center p-3 px-4 py-2 mr-2 font-medium text-center rounded"
                >
                  Resume </a
                ><a
                  href="https://renoirb.github.io/site/hello"
                  class="hover:opacity-100 opacity-80 hover:underline flex items-center p-3 px-4 py-2 mr-2 font-medium text-center rounded"
                >
                  About
                </a>
              </div>
            </slot>
          </div>
        </div>
        <aside
          class="md:invisible app-side-bar__aside fixed top-0 left-0 visible w-64 h-full overflow-auto transition-all duration-500 ease-in-out transform -translate-x-full"
        >
          <div
            class="app-side-bar__identity flex items-center w-full h-16 p-4 border-b"
          >
            <a
              href="https://renoirb.github.io/site/"
              aria-current="page"
              class="identity__text nuxt-link-exact-active nuxt-link-active"
              >Renoir Boulanger</a
            >
          </div>
          <div part="left-bottom-sidebar">
            <slot name="left-bottom-sidebar">
              <a
                href="https://renoirb.github.io/site/blog"
                class="hover:bg-teal-500 hover:text-white flex items-center p-4"
                ><span class="mr-2"> Blog </span></a
              ><a
                href="https://renoirb.github.io/site/projects"
                class="hover:bg-teal-500 hover:text-white flex items-center p-4"
                ><span class="mr-2"> Projects </span></a
              ><a
                href="https://renoirb.github.io/site/resume"
                class="hover:bg-teal-500 hover:text-white flex items-center p-4"
                ><span class="mr-2"> Resume </span></a
              ><a
                href="https://renoirb.github.io/site/hello"
                class="hover:bg-teal-500 hover:text-white flex items-center p-4"
                ><span class="mr-2"> About </span></a
              >
            </slot>
          </div>
        </aside>
      </nav>
      <main class="zone__sandwich__meat middle container mx-auto">
        <div class="grid">
          <div class="m-20">
            <div class="pages__index--parent nuxt-content" part="slot-parent-default">
              <slot>
                <p><!-- Content goes here -->&hellip;</p>
              </slot>
            </div>
          </div>
        </div>
      </main>
      <div class="app-footer--component disposition-parent w-full bottom">
        <footer
          class="zone__sandwich__bottom container flex items-center justify-between p-10 mx-auto"
          style="position: relative"
        >
          <dl class="contact items-item disposition-item">
            <dt class="mb-4 font-serif text-2xl">Contact</dt>
            <dd>
              Renoir Boulanger ✪ Full-Stack Developer &amp; Web Hosting systems
              reliability professional
            </dd>
            <dd class="underline">
              <a rel="me" href="https://mastodon.social/@renoirb"
                >@renoirb@mastodon.social</a
              >
            </dd>
            <dt>CV</dt>
            <dd>
              <a
                href="https://github.com/renoirb/site/blob/2020/content/resume/jsonresume-renoirb.yaml"
                target="_blank"
                >source stored on GitHub</a
              >
            </dd>
            <dd>
              <a
                href="https://renoirb.github.io/site/files/resume/Resume-Renoir-Boulanger.doc"
                target="_blank"
                >Word</a
              >
            </dd>
            <dd>
              <a
                href="https://renoirb.github.io/site/files/resume/Resume-Renoir-Boulanger.pdf"
                target="_blank"
                >PDF</a
              >
            </dd>
            <dd>
              <a href="http://registry.jsonresume.org/renoirb" target="_blank"
                >HTML</a
              >
            </dd>
          </dl>
          <div class="items-item disposition-item">
            <dl class="see-also">
              <dt>See also…</dt>
              <dd>
                <a href="https://renoirb.github.io/site/glossary"> Glossary </a>
              </dd>
              <dd>
                <a href="https://renoirb.github.io/site/code-review">
                  Code-Review notes
                </a>
              </dd>
            </dl>
          </div>
        </footer>
      </div>
    </div>
  </div>
  <div style="position: static !important"></div>
`

const STYLES = `
  :host {
    display: block;
  }
  /**
   * What was as part of a normal root document,
   * but breaks in a CustomElement
   */
  #app-layout {
    line-height: 1.15;
    -webkit-text-size-adjust:100%;
    line-height:1.5;
  }
  #app-layout > .app-layout-body {
    margin: 0;
    background-color: #e5e5e5;
    background-color: var(--bg);
    color: #262626;
    color: var(--color-title);
    transition: background-color .3s;
  }

  /**
   * Other customizations
   */
  .nuxt-content a {
    text-decoration: underline;
    color: initial;
  }
  .nuxt-content ul strong {
    font-weight: bold;
  }
`

const STYLES_PRINT = `
  :host {
    line-height: 1.2 !important;
  }
  #__layout .nuxt-content p {
    page-break-inside: avoid !important;
  }
  #__layout .fixed {
    position: initial;
  }
  #__layout footer.zone__sandwich__bottom .contact {
    color: initial;
  }
  :host,
  #__layout .zone__sandwich__meat.container,
  #__layout footer.zone__sandwich__bottom {
    background-color: initial !important;
  }
  #__layout footer.zone__sandwich__bottom {
    display: initial;
  }
  #__layout .nuxt-content .app-image,
  #__layout .app-side-bar__identity button,
  #__layout footer.zone__sandwich__bottom .see-also,
  #__layout .app-side-bar--component {
    display: none !important;
  }
  #__layout .zone__sandwich__meat.container .grid .m-20 {
    margin: initial;
  }
  #__layout .zone__sandwich__meat.container {
    max-width: initial;
  }
  #__layout .zone__sandwich__top.container {
    background-color: initial;
    color: initial;
    width: 100% !important;
    max-width: initial !important;
  }
`

class AppLayoutElement extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    let style = document.createElement('style')
    style.textContent = STYLES
    shadow.appendChild(style)
    style = document.createElement('style')
    style.setAttribute('media', 'print')
    style.textContent = STYLES_PRINT
    shadow.appendChild(style)
    const template = document.createElement('template')
    template.innerHTML = TEMPLATE
    const elBody = template.content.cloneNode(true)
    const elRoot = document.createElement('div')
    elRoot.setAttribute('class', 'app-layout-body')
    elRoot.dataset.componentLocalName = this.localName
    elRoot.setAttribute('id', 'app-layout')
    elRoot.appendChild(elBody)
    shadow.appendChild(elRoot)
    /**
     * This is uggly, to add CSS to the parent. But whatever. For now
     */
    const frags = createLinkStlesheets(
      { document },
      this.localName,
      STYLES_EXTERNAL,
    )
    shadow.appendChild(frags)
    document.head.appendChild(
      createLinkStlesheets({ document }, this.localName, STYLES_EXTERNAL),
    )
  }

  /**
   * Enforce idea that this component must be as first child of body to ensure
   * that this component takes up all the available space as designed
   *
  connectedCallback() {
    const parentElement = this.parentElement
    const isBody = parentElement.localName === 'body'
    if (!isBody) {
      const message = `Invalid location to use <${this.localName} />, make sure it's a direct descendant of body`
      this.shadowRoot.innerHTML = `<div style="color: red;">${message}</div>`
      throw new Error(message)
    }
  }
  */
}

export default AppLayoutElement
