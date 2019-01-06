/**
 * 获取目标对象的data-id
 * @param {Ojbect} e 事件源对象
 * @return {String} dataId
 */
const getTargetDataId = (e) => {
  return e.target.getAttribute('data-id')
}
/**
 * 获取目标元素的组元素
 * @param {Ojbect} e 事件源对象
 * @return {element} 目标元素的组元素
 */
const getTargetEleGroup = (e) => {
  return document.getElementById(getTargetDataId(e))
}
// 获取包含自定义属性data-box的子元素
const getChildHasDataBox = (id) => {
  return document.getElementById(id).querySelector(`[data-box=${id}]`)
}
/**
 * 获取元素的矩阵信息
 * @param {element} ele 元素
 * @return {Ojbect} 元素的矩阵信息
 */
const getMatrix = (ele) => {
  return ele.transform.baseVal[0].matrix
}
/**
 * 获取元素的中心点坐标
 * @param {id} id 元素id
 * @return {Ojbect} 元素的中心点坐标
 */
const getCenterPoint = (id) => {
  switch (true) {
    case id.includes('startEvent'):
      return getCircleCenterPoint(id)
  }
}
/**
 * 获取圆的中心点坐标
 * @param {id} id 元素id
 * @return {Ojbect} 元素的中心点坐标
 */
const getCircleCenterPoint = (id) => {
  const el = document.getElementById(id)
  return {
    x: getMatrix(el).e + Number(getChildHasDataBox(id).getAttribute('x')) + Number(getChildHasDataBox(id).getAttribute('width') / 2),
    y: getMatrix(el).f + Number(getChildHasDataBox(id).getAttribute('y')) + Number(getChildHasDataBox(id).getAttribute('height') / 2)
  }
}
/**
 * 设置元素的transform属性
 * @param {String} id 元素id
 * @param {String} attr 属性 x或y
 * @param {Number} value 值
 */
const setElementTransform = (id, attr, value) => {
  const el = document.getElementById(id)
  if (attr === 'x') {
    el.setAttribute('transform', `translate(${value - Number(getChildHasDataBox(id).getAttribute('x')) - Number(getChildHasDataBox(id).getAttribute('width') / 2)}, ${getMatrix(el).f})`)
  } else {
    el.setAttribute('transform', `translate(${getMatrix(el).e}, ${value - Number(getChildHasDataBox(id).getAttribute('y')) - Number(getChildHasDataBox(id).getAttribute('height') / 2)})`)
  }
}
/**
 * 批量设置元素的属性
 * @param {Node} el 要设置的元素
 * @param {Object} attrs 属性及属性值
 */
const setAttr = (el, attrs) => {
  Object.entries(attrs).forEach(([attr, value]) => {
    el.setAttribute(attr, value)
  })
}
/**
 * 计算SequenceFlow各个point
 * @param {*} sx 起点中心x坐标
 * @param {*} sy 起点中心y坐标
 * @param {*} ex 终点点中心x坐标
 * @param {*} ey 终点点中心y坐标
 * @param {*} r  半径
 * @return {String} point
 */
const setSequenceFlowPolylinePoints = (sx, sy, ex, ey, r = 20) => {
  const MIX_DISTANCE = 4 * r
  let p1, p2, p3, p4
  const func = () => {
    if (sy <= ey) {
      p1 = { x: sx, y: sy + r }
      p2 = { x: sx, y: sy + (ey - sy) / 2 }
      p3 = { x: ex, y: sy + (ey - sy) / 2 }
      p4 = { x: ex, y: ey - r }
    } else {
      p1 = { x: sx, y: sy - r }
      p2 = { x: sx, y: sy - (sy - ey) / 2 }
      p3 = { x: ex, y: sy - (sy - ey) / 2 }
      p4 = { x: ex, y: ey + r }
    }
  }
  if (sx >= ex) {
    if (sx - ex > MIX_DISTANCE) {
      p1 = { x: sx - r, y: sy }
      p2 = { x: sx - (sx - ex) / 2, y: sy }
      p3 = { x: sx - (sx - ex) / 2, y: ey }
      p4 = { x: ex + r, y: ey }
    } else {
      func()
    }
  } else {
    if (ex - sx > MIX_DISTANCE) {
      p1 = { x: sx + r, y: sy }
      p2 = { x: sx + (ex - sx) / 2, y: sy }
      p3 = { x: sx + (ex - sx) / 2, y: ey }
      p4 = { x: ex - r, y: ey }
    } else {
      func()
    }
  }
  return `${p1.x} ${p1.y},${p2.x} ${p2.y},${p3.x} ${p3.y},${p4.x} ${p4.y}`
}
/**
 * 计算圆与直线的交点
 * @param {*} ox 圆心 x坐标
 * @param {*} oy 圆心 y坐标
 * @param {*} px 鼠标 x坐标
 * @param {*} py 鼠标 y坐标
 * @param {*} r  圆半径
 * @return {Object} 交点坐标
 */
const getCircleIntersectionPoint = (ox, oy, px, py, r) => {
  const W = px - ox
  const H = py - oy
  const C = Math.sqrt(Math.pow(W, 2) + Math.pow(H, 2))
  const SIN = H / C
  const COS = W / C
  return {
    x: ox + COS * r,
    y: oy + SIN * r
  }
}
/**
 * 保存已新建的图标的中心坐标
 * @param {*} vm 组件实例
 * @param {*} id 图标id
 */
const saveElementCenterCoordinate = (vm, id) => {
  const center = getCenterPoint(id)
  vm.elementCenterCoordinate[id] = {
    cx: center.x,
    cy: center.y
  }
  return vm.elementCenterCoordinate[id]
}

/**
 * 删除已新建的图标的中心坐标
 * @param {*} vm 组件实例
 * @param {*} id 图标id
 * @param {*} cx 图标中心X坐标
 * @param {*} cy 图标中心Y坐标
 */
const deleteElementCenterCoordinate = (vm, id, cx, cy) => {
  delete vm.elementCenterCoordinate[id]
}
/**
 * 记录序列号的信息
 * @param {*} vm  组件实例
 * @param {*} dataId 图标id
 */
const recordSequenceFlowInfo = (vm, dataId) => {
  const startCoordinate = getCenterPoint(vm.connectStartEleId)
  const endCoordinate = getCenterPoint(vm.connectEndEleId)
  vm.allSequenceFlowInfo[dataId] = {
    start: {
      id: vm.connectStartEleId,
      x: startCoordinate.x,
      y: startCoordinate.y
    },
    end: {
      id: vm.connectEndEleId,
      x: endCoordinate.x,
      y: endCoordinate.y
    }
  }
}
export default {
  getTargetDataId,
  getTargetEleGroup,
  getMatrix,
  getCircleIntersectionPoint,
  getCenterPoint,
  getCircleCenterPoint,
  setAttr,
  setSequenceFlowPolylinePoints,
  saveElementCenterCoordinate,
  deleteElementCenterCoordinate,
  setElementTransform,
  recordSequenceFlowInfo
}
