
const BORDERWIDTH = 10000
const ANIMATION_DURATION = 500
const Z_INDEX = 99999

export const citruslightHandlerSet = new Set()

/**
 * 
 * @param {Options} options 
 * @param {*} param1 
 * @returns 
 */
function createOverlay({ center, width, height, inverted } = {}, { eventHandlers = [] } = {}){

  // create the elment
  const overlay = document.createElement('div')

  // set style param
  overlay.style.padding = `1px`
  overlay.style.borderWidth = `${BORDERWIDTH}px`
  overlay.style.borderColor = inverted ? `rgba(128, 128, 128, 0.5)` : `rgba(0, 0, 0, 0.5)`
  overlay.style.borderStyle = `solid`

  overlay.style.position = `absolute`
  overlay.style.top = `0`
  overlay.style.left = `0`
  overlay.style.zIndex = Z_INDEX

  // to animate
  overlay.style.opacity = 0
  overlay.style.transition = `opacity ${ANIMATION_DURATION}ms ease-in-out`

  // set body style to disable scrolling
  document.body.style.overflow = `hidden`

  // append element
  document.body.appendChild(overlay)

  // set transform param to center on focus
  const { x: baseX, y: baseY } = overlay.getBoundingClientRect()
  const { x, y } = center
  overlay.style.transform = `translate(${BORDERWIDTH * (-1) - 1 - baseX + x}px, ${BORDERWIDTH * (-1) - 1 - baseY + y}px) scale(${width / 2}, ${height / 2})`

  // initiate animation
  overlay.style.opacity = 1

  // setup event handlers
  for (const evHandler of eventHandlers) {
    const { name, handler } = evHandler
    overlay.addEventListener(name, handler)
  }

  const cb = () => {
    // remove self from citruslightHandlers

    citruslightHandlerSet.delete(cb)

    // initiate animation
    overlay.style.opacity = 0

    // remove ev handler

    for (const evHandler of eventHandlers) {
      const { name, handler } = evHandler
      overlay.removeEventListener(name, handler)
    }

    setTimeout(() => {
      document.body.removeChild(overlay)
      document.body.style.overflow = null
    }, ANIMATION_DURATION)
  }

  citruslightHandlerSet.add(cb)
  return cb
}

/**
 * 
 * @typedef {Object} Options
 * @property {number} center
 * @property {number} width
 * @property {number} height
 * @property {boolean} inverted
 * @property {*} eventHandlers
 * 
 * @param {HTMLElement} el 
 * @param {Options} param1 
 * @returns {() => void}
 */
export function citruslight(el, { center: suppliedCenter, width: suppliedWidth, height: suppliedHeight, eventHandlers, inverted } = {}){

  if (suppliedCenter) {
    if (!suppliedWidth) throw new Error(`If center is defined, width must also be defined`)
    if (!suppliedHeight) throw new Error(`If center is defined, height must also be defined`)
    return createOverlay({
      center: suppliedCenter,
      width: suppliedWidth,
      height: suppliedHeight,
      inverted,
    }, {
      eventHandlers
    })
  } else {
    const { top, left, width: boundingClientWidth, height: boundingClientHeight } = el.getBoundingClientRect()

    const x = left + boundingClientWidth / 2
    const y = top + boundingClientHeight / 2

    const center = { x, y }
    
    return createOverlay({
      center: suppliedCenter || center,
      width: suppliedWidth || boundingClientWidth,
      height: suppliedHeight || boundingClientHeight,
      inverted,
    }, {
      eventHandlers
    })
  }
}

export function clearAll(){
  Array.from(citruslightHandlerSet).forEach(cb => cb())
}