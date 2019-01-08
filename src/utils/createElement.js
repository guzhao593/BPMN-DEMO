import $ from './methods'

// 命名空间
const NS = 'http://www.w3.org/2000/svg'
// 盒子与图形的间距
const GAP = 5
// 创建组元素
const createGroup = (vm, dataId) => {
  const g = document.createElementNS(NS, 'g')
  vm.newEl.id = g.id = dataId
  $.setAttr(g, {
    'data-id': dataId,
    transform: 'translate(0, 0)',
    class: 'djs-group'
  })
  return g
}

// 创建图形盒子
const creatBoxRect = (attrs) => {
  const rect = document.createElementNS(NS, 'rect')
  $.setAttr(rect, attrs)
  rect.setAttribute('class', 'djs-box')
  rect.dataset.box = attrs['data-id']
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
  const C = computedCxAndCy(e, vm)
  const RX = 40
  const RY = 25
  const g = createGroup(vm, dataId)
  const task = document.createElementNS(NS, 'rect')
  $.setAttr(task, {
    'data-id': dataId,
    x: C.cx - RX,
    y: C.cy - RY,
    width: 2 * RX,
    height: 2 * RY,
    rx: 5,
    ry: 5
  })
  task.style.cssText = 'stroke: #333; fill: #fff'
  g.appendChild(task)
  const rect = creatBoxRect({
    'data-id': dataId,
    x: C.cx - (RX + GAP),
    y: C.cy - (RY + GAP),
    width: 2 * (RX + GAP),
    height: 2 * (RY + GAP)
  })
  g.appendChild(rect)
  document.querySelector('.g-box').appendChild(g)
  return g
}

// 创建网关
const gateway = (e, vm) => {
  const dataId = generateDataId('gateway')
  const C = computedCxAndCy(e, vm)
  const R = 30
  const BOX_R = R + GAP
  const g = createGroup(vm, dataId)
  const polygon = document.createElementNS(NS, 'polygon')
  $.setAttr(polygon, {
    'data-id': dataId,
    points: `${C.cx - R} ${C.cy}, ${C.cx} ${C.cy - R}, ${C.cx + R} ${C.cy}, ${C.cx} ${C.cy + R}`,
    'data-r': R
  })
  polygon.style.cssText = 'stroke: #333; fill: #fff; stroke-width: 2'
  g.appendChild(polygon)
  const rect = creatBoxRect({
    'data-id': dataId,
    x: C.cx - BOX_R,
    y: C.cy - BOX_R,
    width: 2 * BOX_R,
    height: 2 * BOX_R
  })
  g.appendChild(rect)
  document.querySelector('.g-box').appendChild(g)
  return g
}

// 创建起始事件图形
const creatEvent = (type, e, vm) => {
  const dataId = generateDataId(type)
  const C = computedCxAndCy(e, vm)
  const R = 20
  const BOX_R = R + GAP
  const g = createGroup(vm, dataId)

  const circle = document.createElementNS(NS, 'circle')
  $.setAttr(circle, {
    'data-id': dataId,
    cx: C.cx,
    cy: C.cy,
    r: R
  })
  circle.style.cssText = 'stroke: #333; fill: #fff'
  circle.style.strokeWidth = type === 'startEvent' ? 2 : 5
  g.appendChild(circle)
  const rect = creatBoxRect({
    'data-id': dataId,
    x: C.cx - BOX_R,
    y: C.cy - BOX_R,
    height: 2 * BOX_R,
    width: 2 * BOX_R
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
