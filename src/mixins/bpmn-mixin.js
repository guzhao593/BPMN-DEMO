import $ from 'utils/methods'
export default {
  data () {
    return {
      locationLine: {
        yEl: null,
        xEl: null
      }
    }
  },
  methods: {
    changeSequenceFlow (id, {cx, cy}) {
      Object.entries(this.allSequenceFlowInfo).forEach(([sid, item]) => {
        if (item.start.id === id) {
          item.start.x = cx
          item.start.y = cy
          document.getElementById(sid).children[0].setAttribute('points', $.setSequenceFlowPolylinePoints(cx, cy, item.end.x, item.end.y))
        }
        if (item.end.id === id) {
          item.end.x = cx
          item.end.y = cy
          document.getElementById(sid).children[0].setAttribute('points', $.setSequenceFlowPolylinePoints(item.start.x, item.start.y, cx, cy))
        }
      })
    },
    listenMoveEleCenterCoordinate (id) {
      let { cx, cy } = $.saveElementCenterCoordinate(this, id)
      let flag = {x: null, y: null}
      
      Object.entries(this.elementCenterCoordinate).forEach(([key, value]) => {
        if (key !== id) {
          if (Math.abs(value.cx - cx) < 10) {
            flag.x = value.cx
          }
          if (Math.abs(value.cy - cy) < 10) {
            flag.y = value.cy
          }
        }
      })
      this.changeSequenceFlow(id, {cx: flag.x || cx, cy: flag.y || cy})
      if (flag.x) {
        $.setElementTransform(id, 'x', flag.x)
        this.locationLine.yEl.setAttribute('x1', flag.x)
        this.locationLine.yEl.setAttribute('x2', flag.x)
        this.locationLine.yEl.style.display = 'block'
      } else {
        this.locationLine.yEl.style.display = 'none'
      }
      if (flag.y) {
        $.setElementTransform(id, 'y', flag.y)
        this.locationLine.xEl.setAttribute('y1', flag.y)
        this.locationLine.xEl.setAttribute('y2', flag.y)
        this.locationLine.xEl.style.display = 'block'
      } else {
        this.locationLine.xEl.style.display = 'none'
      }
    },
    resetStatus () {
      this.move = false
      this.connetion = false
      this.createNew = false
      this.moveEl.el = null
      this.newEl.el = null
      this.locationLine.yEl.style.display = 'none'
      this.locationLine.xEl.style.display = 'none'
    },
    // 设置拆线各点的坐标
    setConnectionPolylinePoints (e) {
      const PX = e.clientX / this.transform.scaleX - this.bpmnEl.getBoundingClientRect().left
      const PY = e.clientY / this.transform.scaleX - this.bpmnEl.getBoundingClientRect().top
      const IP = $.getCircleIntersectionPoint(this.newEl.startX, this.newEl.startY, PX, PY, 20)
      return `${IP.x}, ${IP.y}, ${PX}, ${PY}`
    },
    removeNewElement () {
      this.newEl.el && this.bpmnEl.children[0].removeChild(this.newEl.el)
      this.resetStatus()
    },
    // 保存连接终点的dataId
    handleNewConnectDataId (dataId) {
      if (this.connetion) {
        this.newConnectDataId.length >= 2 && this.newConnectDataId.pop()
        this.newConnectDataId.unshift(dataId)
      }
    }
  }
}
