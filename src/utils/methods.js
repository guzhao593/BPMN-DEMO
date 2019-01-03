const getTargetDataId = (e) => {
  return e.target.getAttribute('data-id')
}

const getTargetEleGroup = (e) => {
  return document.getElementById(getTargetDataId(e))
}

const getMatrix = (ele) => {
  return ele.transform.baseVal[0].matrix
}

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
  getCircleIntersectionPoint
}
