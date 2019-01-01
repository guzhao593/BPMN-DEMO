const NS = 'http://www.w3.org/2000/svg'

const startEvent = (e, vm) => {
  const dataId = 'startEvent--' + Date.now()
  const bpmnElOffset = vm.bpmnEl.getBoundingClientRect()
  const g = document.createElementNS(NS, 'g')
  vm.newElement.id = g.id = dataId
  g.setAttribute('data-id', dataId)
  g.setAttribute('transform', 'translate(0, 0)')
  const circle = document.createElementNS(NS, 'circle')
  circle.setAttribute('data-id', dataId)
  circle.setAttribute('cx', e.clientX / vm.transform.scaleX - bpmnElOffset.left)
  circle.setAttribute('cy', e.clientY / vm.transform.scaleX - bpmnElOffset.top)
  circle.setAttribute('r', 20)
  circle.style.cssText = 'stroke: #333; fill: #fff'
  g.appendChild(circle)
  document.querySelector('.g-box').appendChild(g)
}

const connection = (e, vm) => {
  const dataId = 'connection--' + Date.now()
  const bpmnElOffset = vm.bpmnEl.getBoundingClientRect()
  const g = document.createElementNS(NS, 'g')
  vm.newElement.id = g.id = dataId
  vm.newElement.startX = e.clientX / vm.transform.scaleX - bpmnElOffset.left
  vm.newElement.startY = e.clientY / vm.transform.scaleY - bpmnElOffset.top
  g.setAttribute('data-id', dataId)
  g.setAttribute('transform', 'translate(0, 0)')
  const polyline = document.createElementNS(NS, 'polyline')
  polyline.setAttribute('points', `${vm.newElement.startX}, ${vm.newElement.startY}`)
  polyline.setAttribute('data-id', dataId)
  polyline.style.cssText = 'stroke: #333; stroke-width: 2'
  g.appendChild(polyline)
  document.querySelector('.g-box').appendChild(g)
}

export default {
  startEvent,
  connection
}
