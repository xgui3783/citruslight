import { citruslight } from 'http://localhost:5000/citruslight.js'

(() => {
  const h1 = document.getElementById('h1')
  const div = document.getElementById('div')
  const span = document.getElementById('span')
  let dismissOverlay

  for (const el of [h1, div, span]) {

    const eventHandlers = [{
      name: 'click', 
      handler: () => {
        if (dismissOverlay) dismissOverlay()
      }
    }]

    el.addEventListener('click', () => {
      dismissOverlay = citruslight(el, { eventHandlers })
    })
  }
})()