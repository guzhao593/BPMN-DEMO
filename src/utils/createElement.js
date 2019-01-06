import $ from './methods'

const NS = 'http://www.w3.org/2000/svg'

const createGroup = (vm, dataId) => {
  const g = document.createElementNS(NS, 'g')
  vm.newElement.id = g.id = dataId
  g.setAttribute('data-id', dataId)
  g.setAttribute('transform', 'translate(0, 0)')
  return g
}

const startEvent = (e, vm) => {
  const dataId = 'startEvent--' + Date.now()
  const bpmnElOffset = vm.bpmnEl.getBoundingClientRect()
  const g = createGroup(vm, dataId)
  const circle = document.createElementNS(NS, 'circle')
  circle.setAttribute('data-id', dataId)
  circle.setAttribute('cx', e.clientX / vm.transform.scaleX - bpmnElOffset.left)
  circle.setAttribute('cy', e.clientY / vm.transform.scaleX - bpmnElOffset.top)
  circle.setAttribute('r', 20)
  circle.style.cssText = 'stroke: #333; fill: #fff'
  g.appendChild(circle)
  const rect = document.createElementNS(NS, 'rect')
  rect.setAttribute('data-id', dataId)
  rect.setAttribute('data-box', dataId)
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
  const g = createGroup(vm, dataId)
  vm.newElement.startX = $.getMatrix($.getTargetEleGroup(e)).e + Number(e.target.getAttribute('x')) + Number(e.target.getAttribute('width') / 2)
  vm.newElement.startY = $.getMatrix($.getTargetEleGroup(e)).f + Number(e.target.getAttribute('y')) + Number(e.target.getAttribute('height') / 2)
  const polyline = document.createElementNS(NS, 'polyline')
  polyline.setAttribute('points', `${vm.newElement.startX}, ${vm.newElement.startY}`)
  polyline.setAttribute('data-id', dataId)
  polyline.style.cssText = 'stroke: #333; stroke-width: 1;stroke-dasharray: 2 2'
  g.appendChild(polyline)
  document.querySelector('.g-box').appendChild(g)
}

const sequenceFlow = (e, vm, { x: ex, y: ey }) => {
  const dataId = 'sequenceFlow--' + Date.now()
  const g = createGroup(vm, dataId)
  $.recordSequenceFlowInfo(vm, dataId)
  const polyline = document.createElementNS(NS, 'polyline')
  polyline.setAttribute('points', $.setSequenceFlowPolylinePoints(vm.newElement.startX, vm.newElement.startY, ex, ey))
  polyline.setAttribute('data-id', dataId)
  polyline.style.cssText = 'stroke: #333; stroke-width: 2; fill: none; marker-end: url(#arrow)'
  g.appendChild(polyline)
  document.querySelector('.g-box').appendChild(g)
}

const locationLine = (x1, y1, x2, y2) => {
  const dataId = 'locationLine--' + Date.now()
  const line = document.createElementNS(NS, 'line')
  line.setAttribute('data-id', dataId)
  line.setAttribute('x1', x1)
  line.setAttribute('y1', y1)
  line.setAttribute('x2', x2)
  line.setAttribute('y2', y2)
  line.style.cssText = 'stroke: #ff7400; stroke-width: 1;display: none;'
  document.querySelector('.g-box').appendChild(line)
  return line
}

export default {
  startEvent,
  connection,
  sequenceFlow,
  locationLine
}
