import $ from './methods'

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
  const rect = document.createElementNS(NS, 'rect')
  rect.setAttribute('data-id', dataId)
  rect.setAttribute('x', e.clientX / vm.transform.scaleX - bpmnElOffset.left - 25)
  rect.setAttribute('y', e.clientY / vm.transform.scaleX - bpmnElOffset.top - 25)
  rect.setAttribute('height', 50)
  rect.setAttribute('width', 50)
  rect.style.cssText = 'fill: #fff;fill-opacity: 0; stroke-width: 1px; stroke: #333; stroke-dasharray: 3 3;shape-rendering: crispEdges'
  g.appendChild(rect)
  document.querySelector('.g-box').appendChild(g)
}

const connection = (e, vm) => {
  const dataId = 'connection--' + Date.now()
  const g = document.createElementNS(NS, 'g')
  vm.newElement.id = g.id = dataId
  vm.newElement.startX = $.getMatrix($.getTargetEleGroup(e)).e + Number(e.target.getAttribute('x')) + Number(e.target.getAttribute('width') / 2)
  vm.newElement.startY = $.getMatrix($.getTargetEleGroup(e)).f + Number(e.target.getAttribute('y')) + Number(e.target.getAttribute('height') / 2)
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
