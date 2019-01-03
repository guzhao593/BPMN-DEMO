const getTargetDataId = (e) => {
  return e.target.getAttribute('data-id')
}

const getTargetEleGroup = (e) => {
  return document.getElementById(getTargetDataId(e))
}

const getMatrix = (ele) => {
  return ele.transform.baseVal[0].matrix
}

const getCenterPoint = (id) => {
  switch (true) {
    case id.includes('startEvent'):
      return getCircleCenterPoint(id)
  }
}

const getCircleCenterPoint = (id) => {
  const el = document.getElementById(id)
  return {
    x: getMatrix(el).e + Number(el.childNodes[1].getAttribute('x')) + Number(el.childNodes[1].getAttribute('width') / 2),
    y: getMatrix(el).f + Number(el.childNodes[1].getAttribute('y')) + Number(el.childNodes[1].getAttribute('height') / 2)
  }
}
/**
 * 计算SequenceFlow各个point
 * @param {*} sx 起点中心x坐标
 * @param {*} sy 起点中心y坐标
 * @param {*} ex 终点点中心x坐标
 * @param {*} ey 终点点中心y坐标
 * @param {*} r  半径
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

export default {
  getTargetDataId,
  getTargetEleGroup,
  getMatrix,
  getCircleIntersectionPoint,
  getCenterPoint,
  getCircleCenterPoint,
  setSequenceFlowPolylinePoints
}
