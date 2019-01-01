const getTargetDataId = (e) => {
  return e.target.getAttribute('data-id')
}

const getTargetEleGroup = (e) => {
  return document.getElementById(getTargetDataId(e))
}

const getMatrix = (ele) => {
  return ele.transform.baseVal[0].matrix
}
export default {
  getTargetDataId,
  getTargetEleGroup,
  getMatrix
}
