import $ from 'utils/methods'

export default {
  methods: {
    listenMoveEleCenterCoordinate (id) {
      let { cx, cy } = $.saveElementCenterCoordinate(this, id)
      Object.entries(this.elementCenterCoordinate).forEach(([key, value]) => {
        if (key !== id) {
          if (Math.abs(value.x - cx)) {
            cx = value.x
          }
          if (Math.abs(value.y - cy)) {
            cy = value.y
          }
        }
      })
    },
    resetStatus () {
      this.startMove = false
      this.newConnection = false
      this.new = false
      this.moveEl.el = null
      this.newElement.el = null
    },
    // 设置拆线各点的坐标
    setConnectionPolylinePoints (e) {
      const PX = e.clientX / this.transform.scaleX - this.bpmnEl.getBoundingClientRect().left
      const PY = e.clientY / this.transform.scaleX - this.bpmnEl.getBoundingClientRect().top
      const IP = $.getCircleIntersectionPoint(this.newElement.startX, this.newElement.startY, PX, PY, 20)
      return `${IP.x}, ${IP.y}, ${PX}, ${PY}`
    },
    removeNewElement () {
      this.newElement.el && this.bpmnEl.children[0].removeChild(this.newElement.el)
      this.resetStatus()
    },
    // 保存连接终点的dataId
    handleNewConnectDataId (dataId) {
      if (this.newConnection) {
        this.newConnectDataId.length >= 2 && this.newConnectDataId.pop()
        this.newConnectDataId.unshift(dataId)
      }
    }
  }
}
