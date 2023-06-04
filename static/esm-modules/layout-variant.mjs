const DEFAULT_BREAKPOINT = 992 // refer to Bootstrap's responsive design

const createLayoutVariantEvent = (variant, detail = {}) => {
  const event = new CustomEvent('layout-variant', {
    bubbles: true,
    composed: true,
    detail: { variant, ...detail },
  })
  return event
}

/**
 *
 *
 * {@link https://gist.github.com/renoirb/16f391e0cbd4e4e04f368c06b396e650#layoutvariant | This class is coming from onMounted}
 */
class LayoutVariantManager {
  constructor(host, breakPoint = DEFAULT_BREAKPOINT) {
    this._host = host
    this._breakPoint = breakPoint
    const hasOwnerDocument = Reflect.has(this._host, 'ownerDocument')
    if (hasOwnerDocument) {
      const { defaultView } = this._host.ownerDocument
      defaultView.addEventListener('resize', this.checkLayoutVariantChanged)
      this.checkLayoutVariantChanged()
    } else {
      const message = `Please make sure you attach onMounted event handler to a Vue mounted lifecycle hook`
      throw new Error(message)
    }
  }

  checkLayoutVariantChanged = () => {
    let changed = false
    const { hidden = false } = this._host.ownerDocument
    const currentVariant = this._host.getAttribute('data-layout-variant')
    const smallerThanBreakPoint = this.checkIfSmallerThan(
      this._host,
      this._breakPoint,
    )
    const layoutVariant = smallerThanBreakPoint
      ? 'variant-smaller'
      : 'variant-bigger'
    changed = currentVariant !== layoutVariant
    if (!hidden && changed) {
      this._host.setAttribute('data-layout-variant', layoutVariant)
      const details = { breakPoint: this._breakPoint, smallerThanBreakPoint }
      this._host.dispatchEvent(createLayoutVariantEvent(layoutVariant, details))
    }
    return changed
  }

  checkIfSmallerThan = ({ ownerDocument }, breakPoint = WIDTH) => {
    if (!!ownerDocument) {
      let out = false
      let bodyRectWidth = breakPoint
      let hasMethodName = false
      const { body } = ownerDocument
      hasMethodName = 'getBoundingClientRect' in body
      if (hasMethodName) {
        const bodyRect = body.getBoundingClientRect()
        bodyRectWidth = bodyRect.width
      }
      out = bodyRectWidth - 1 < this._breakPoint
      return out
    } else {
      const message = `Unexpected error, did you specify the HTMLElement you wanted to use?`
      throw new Error(message)
    }
  }
}

export default LayoutVariantManager
