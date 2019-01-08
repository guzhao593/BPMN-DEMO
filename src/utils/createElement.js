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
// 创建图形盒子
const creatBoxRect = (attrs) => {
  const rect = document.createElementNS(NS, 'rect')
  $.setAttr(rect, attrs)
  rect.style.cssText = 'fill: #fff;fill-opacity: 0; stroke-width: 1px; stroke: #333; stroke-dasharray: 3 3;shape-rendering: crispEdges'
  return rect
}
// 生成随机的dataId
const generateDataId = (type) => {
  return `${type}--${Date.now()}`
}
// 计算鼠标在画布的坐标
const computedCxAndCy = (e, vm) => {
  const bpmnElOffset = vm.bpmnEl.getBoundingClientRect()
  return {
    cx: e.clientX / vm.transform.scaleX - bpmnElOffset.left,
    cy: e.clientY / vm.transform.scaleX - bpmnElOffset.top
  }
}
// 创建任务图形
const task = (e, vm) => {
  const dataId = generateDataId('task')
  const client = computedCxAndCy(e, vm)
  const g = createGroup(vm, dataId)
  const task = document.createElementNS(NS, 'rect')
  $.setAttr(task, {
    'data-id': dataId,
    x: client.cx - 40,
    y: client.cy - 25,
    width: 80,
    height: 50,
    rx: 5,
    ry: 5
  })
  task.style.cssText = 'stroke: #333; fill: #fff'
  g.appendChild(task)
  const rect = creatBoxRect({
    'data-id': dataId,
    'data-box': dataId,
    x: client.cx - 45,
    y: client.cy - 30,
    width: 90,
    height: 60
  })
  g.appendChild(rect)
  document.querySelector('.g-box').appendChild(g)
  return g
}
// 创建网关
const gateway = (e, vm) => {
  const dataId = generateDataId('gateway')
  const c = computedCxAndCy(e, vm)
  const g = createGroup(vm, dataId)
  const polygon = document.createElementNS(NS, 'polygon')
  $.setAttr(polygon, {
    'data-id': dataId,
    points: `${c.cx - 20} ${c.cy}, ${c.cx} ${c.cy - 20}, ${c.cx + 20} ${c.cy}, ${c.cx} ${c.cy + 20}`,
    'data-r': 20
  })
  polygon.style.cssText = 'stroke: #333; fill: #fff; stroke-width: 2'
  g.appendChild(polygon)
  const rect = creatBoxRect({
    'data-id': dataId,
    'data-box': dataId,
    x: c.cx - 25,
    y: c.cy - 25,
    width: 50,
    height: 50
  })
  g.appendChild(rect)
  document.querySelector('.g-box').appendChild(g)
  return g
}
// 创建起始事件图形
const creatEvent = (type, e, vm) => {
  const dataId = generateDataId(type)
  const client = computedCxAndCy(e, vm)
  const g = createGroup(vm, dataId)

  const circle = document.createElementNS(NS, 'circle')
  $.setAttr(circle, {
    'data-id': dataId,
    cx: client.cx,
    cy: client.cy,
    r: 20
  })
  circle.style.cssText = 'stroke: #333; fill: #fff'
  circle.style.strokeWidth = type === 'startEvent' ? 2 : 5
  g.appendChild(circle)
  const rect = creatBoxRect({
    'data-id': dataId,
    'data-box': dataId,
    x: client.cx - 25,
    y: client.cy - 25,
    height: 50,
    width: 50
  })
  g.appendChild(rect)
  document.querySelector('.g-box').appendChild(g)
  return g
}
// 创建开始事件图形
const startEvent = (e, vm) => {
  return creatEvent('startEvent', e, vm)
}
// 创建结束事件图形
const endEvent = (e, vm) => {
  return creatEvent('endEvent', e, vm)
}
// 创建连接线图形
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
// 创建序列线图形
const sequenceFlow = (e, vm, { x: ex, y: ey }) => {
  const dataId = generateDataId('sequenceFlow')
  const g = createGroup(vm, dataId)
  const polyline = document.createElementNS(NS, 'polyline')
  $.setAttr(polyline, {
    points: $.setSequenceFlowPoints(vm.newEl.startX, vm.newEl.startY, ex, ey, $.getEleRxAndRy(vm.connectStartEleId), $.getEleRxAndRy(vm.connectEndEleId)),
    'data-id': dataId
  })
  polyline.style.cssText = 'stroke: #333; stroke-width: 2; fill: none; marker-end: url(#arrow)'
  g.appendChild(polyline)
  document.querySelector('.g-box').appendChild(g)
  // 记录序列线信息
  $.recordSequenceFlowInfo(vm, dataId)
  return g
}
// 创建定位线图形
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
  endEvent,
  connection,
  sequenceFlow,
  locationLine,
  gateway,
  task
}
