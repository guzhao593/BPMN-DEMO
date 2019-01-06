import $ from './methods'
// 命名空间
const NS = 'http://www.w3.org/2000/svg'
// 创建组元素
const createGroup = (vm, dataId) => {
  const g = document.createElementNS(NS, 'g')
  vm.newEl.id = g.id = dataId
  $.setAttr(g, {
    'data-id': dataId,
    transform: 'translate(0, 0)'
  })
  return g
}
// 生成随机的dataId
const generateDataId = (type) => {
  return `${type}--${Date.now()}`
}
// 创建起始事件图标
const startEvent = (e, vm) => {
  const dataId = generateDataId('startEvent')
  const bpmnElOffset = vm.bpmnEl.getBoundingClientRect()
  const g = createGroup(vm, dataId)

  const circle = document.createElementNS(NS, 'circle')
  $.setAttr(circle, {
    'data-id': dataId,
    cx: e.clientX / vm.transform.scaleX - bpmnElOffset.left,
    cy: e.clientY / vm.transform.scaleX - bpmnElOffset.top,
    r: 20
  })
  circle.style.cssText = 'stroke: #333; fill: #fff'
  g.appendChild(circle)

  const rect = document.createElementNS(NS, 'rect')
  $.setAttr(rect, {
    'data-id': dataId,
    'data-box': dataId,
    x: e.clientX / vm.transform.scaleX - bpmnElOffset.left - 25,
    y: e.clientY / vm.transform.scaleX - bpmnElOffset.top - 25,
    height: 50,
    width: 50
  })
  rect.style.cssText = 'fill: #fff;fill-opacity: 0; stroke-width: 1px; stroke: #333; stroke-dasharray: 3 3;shape-rendering: crispEdges'
  g.appendChild(rect)
  document.querySelector('.g-box').appendChild(g)
  return g
}
// 创建连接线图标
const connection = (e, vm) => {
  const dataId = generateDataId('connection')
  const g = createGroup(vm, dataId)
  vm.newEl.startX = $.getMatrix($.getTargetEleGroup(e)).e + Number(e.target.getAttribute('x')) + Number(e.target.getAttribute('width') / 2)
  vm.newEl.startY = $.getMatrix($.getTargetEleGroup(e)).f + Number(e.target.getAttribute('y')) + Number(e.target.getAttribute('height') / 2)

  const polyline = document.createElementNS(NS, 'polyline')
  $.setAttr(polyline, {
    points: `${vm.newEl.startX}, ${vm.newEl.startY}`,
    'data-id': dataId
  })
  polyline.style.cssText = 'stroke: #333; stroke-width: 1;stroke-dasharray: 2 2'
  g.appendChild(polyline)
  document.querySelector('.g-box').appendChild(g)
  return g
}
// 创建序列线图标
const sequenceFlow = (e, vm, { x: ex, y: ey }) => {
  const dataId = generateDataId('sequenceFlow')
  const g = createGroup(vm, dataId)
  const polyline = document.createElementNS(NS, 'polyline')
  $.setAttr(polyline, {
    points: $.setSequenceFlowPolylinePoints(vm.newEl.startX, vm.newEl.startY, ex, ey),
    'data-id': dataId
  })
  polyline.style.cssText = 'stroke: #333; stroke-width: 2; fill: none; marker-end: url(#arrow)'
  g.appendChild(polyline)
  document.querySelector('.g-box').appendChild(g)
  // 记录序列线信息
  $.recordSequenceFlowInfo(vm, dataId)
  return g
}
// 创建定位线图标
const locationLine = (x1, y1, x2, y2) => {
  const dataId = generateDataId('locationLine')
  const line = document.createElementNS(NS, 'line')
  $.setAttr(line, { 'data-id': dataId, x1, x2, y1, y2 })
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
