/*!
 * https://renoirb.com/esm-modules/load-from-github.mjs v1.0.0
 *
 * Maintainer: Renoir Boulanger <contribs@renoirboulanger.com>
 *
 * MIT
 *
 * © 2003-2023 Renoir Boulanger
 */

/**
 * Load things from GitHub Gists and pass them through a formatter
 *
 * Time spent:
 *   20221112: 3h
 *   20230212: 1h
 */

// https://github.com/showdownjs/showdown
// https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js
import showdown from 'https://ga.jspm.io/npm:showdown@2.1.0/dist/showdown.js'

const converter = new showdown.Converter({ metadata: true })
converter.setOption('openLinksInNewWindow', true)
const options = converter.getOptions()
// console.log('load-from-github showdown', { options })

export const parseMarkdown = (fileContents) => {
  const html = converter.makeHtml(fileContents)
  // Unfortunately, this implementation does not parse YAML properly
  // so many YAML features and nesting of objects are lost.
  const metadata = converter.getMetadata()
  // console.debug('load-from-github parseMarkdown', { metadata })
  return {
    html,
    metadata,
  }
}

/**
 * Convert the contents of a Gist, assuming it's Markdown, into HTML.
 *
 * @param {*} jsonpData
 * @param {*} fileName
 * @returns string HTML of the gist's file
 */
export const convertGistFileToHtml = (jsonpData, fileName = 'README.md') => {
  // console.log('step 1a: convertGistFileToHtml', jsonpData)
  const { data = {} } = jsonpData
  const { files = {}, forks = [], ...dataRest } = data
  const fileContents = Reflect.has(files, fileName)
    ? Reflect.get(files, fileName)
    : {}
  const { content = '' } = fileContents
  // console.log('step 1b: convertGistFileToHtml', { files, content })
  const { html, metadata } = parseMarkdown(content)
  const payload = { html, frontMatter: metadata, data: dataRest }
  // console.debug('step 1c: convertGistFileToHtml', payload)
  return payload
}

const loadFromGitHub = async (host, gistId, fileName = 'README.md') => {
  if (!gistId) {
    const message = `Error: we need a Gist ID`
    throw new Error(message)
  }
  host.dataset.loadFromGithub = gistId
  return fetch(`https://api.github.com/gists/${gistId}?callback=shazam`)
    .then((response) => {
      const content = response.text()
      // console.log('step 0: loadFromGitHub', { response, content });
      return content
    })
    .then((content) => {
      const transform = new Function('shazam', content)
      let innerHTML = '<p>Nothing.</p>'
      let dataRest = {}
      // TODO: Make this not specific to Markdown to HTML.
      transform(function (jsonp) {
        // For now, only support one file. TODO
        const contents = convertGistFileToHtml(jsonp, fileName)
        // console.log('step 2: loadFromGitHub then transform', contents);
        const { html = '', ...rest } = contents
        dataRest = rest
        innerHTML = html
      })
      return { html: innerHTML, ...dataRest }
    })
    .then(({ html = '', data = {} }) => {
      // TODO: Make this not specific to Markdown to HTML.
      //       ... So that we break out this bit too.
      // console.debug('step 3: loadFromGitHub then', data)
      host.innerHTML = html
      const title = Reflect.get(data, 'description')
      if (title) {
        host.ownerDocument.title = title
      }
      const gistUrl = Reflect.get(data, 'html_url')
      if (gistUrl) {
        const link = host.ownerDocument.createElement('a')
        link.textContent = 'Source Gist'
        link.setAttribute('href', gistUrl)
        host.dataset.loadFromGithub = gistUrl
        link.setAttribute('target', '_blank')
        const p = host.ownerDocument.createElement('p')
        p.setAttribute('lang', 'en')
        p.textContent = 'Contents from this page is coming from a GitHub Gist: '
        p.appendChild(link)
        host.append(host.ownerDocument.createElement('hr'))
        host.append(p)
      }
    })
}

export default loadFromGitHub
