import $ from 'utils/methods'
export default {
  data () {
    return {
      // 定位线
      locationLine: {
        // y轴定位线
        yEl: null,
        // x轴定位线
        xEl: null
      }
    }
  },
  methods: {
    // 移动图标时序列线跟随一起变化
    changeSequenceFlow (id, { cx, cy }) {
      Object.entries(this.allSequenceFlowInfo).forEach(([sid, item]) => {
        if (item.start.id === id) {
          item.start.x = cx
          item.start.y = cy
          this.setSequenceFlow(sid, item)
        }
        if (item.end.id === id) {
          item.end.x = cx
          item.end.y = cy
          this.setSequenceFlow(sid, item)
        }
      })
    },
    setSequenceFlow (sid, item) {
      const el = document.getElementById(sid).children[0]
      const start = $.getEleRxAndRy(item.start.id)
      const end = $.getEleRxAndRy(item.end.id)
      el.setAttribute('points', $.setSequenceFlowPoints(item.start.x, item.start.y, item.end.x, item.end.y, start, end))
    },
    // 监听移动坐标并处理
    listenMoveEleCenterCoordinate (id) {
      let { cx, cy } = $.saveElementCenterCoordinate(this, id)
      let flag = { x: null, y: null }
      Object.entries(this.elementCenterCoordinate).forEach(([key, value]) => {
        // 相隔距离
        const GAP = 10
        if (key !== id) {
          if (Math.abs(value.cx - cx) < GAP) {
            flag.x = value.cx
          }
          if (Math.abs(value.cy - cy) < GAP) {
            flag.y = value.cy
          }
        }
      })
      // 移动图标时序列线跟随一起变化
      this.changeSequenceFlow(id, { cx: flag.x || cx, cy: flag.y || cy })
      // 处理定位线
      this.handleLocationLine(flag, id)
    },
    // 处理定位线
    handleLocationLine (flag, id) {
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
    // 当操作完成时，清除状态
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
    // 删除新元素并清除状态
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
    },
    // 处理图形在鼠标滑动或点击时的样式
    handleBoxRectStyle (dataId, event) {
      switch (event) {
        case 'mouseover':
          if (dataId) {
            const isCanShowEl = this.type.includes(dataId.split('--')[0])
            const isCanShowStatus = !(this.createNew || this.move || this.connetion)
            this.overEl.el = document.querySelector(`[data-box=${dataId}]`)
            if (isCanShowEl && isCanShowStatus) {
              this.overEl.el.classList.add('hover')
            }
          } else {
            this.overEl.el && this.overEl.el.classList.remove('hover')
          }
          break
        case 'click':
          if (dataId) {
            const isCanShowEl = this.type.includes(dataId.split('--')[0])
            this.selectEl.el = document.querySelector(`[data-box=${dataId}]`)
            this.selectEl.id = dataId
            if (isCanShowEl) {
              this.selectEl.el.classList.add('selected')
            }
          } else {
            this.selectEl.el && this.selectEl.el.classList.remove('selected')
            this.select = false
            this.selectEl.el = null
            this.selectEl.id = null
          }
          break
        case 'mousemove':
          if (dataId && this.move && !this.connetion) {
            const isCanShowEl = this.type.includes(dataId.split('--')[0])
            if (isCanShowEl && this.move && !this.connetion) {
              this.selectEl.id && document.querySelector(`[data-box=${this.selectEl.id}]`).classList.remove('selected')
              document.querySelector(`[data-box=${dataId}]`).classList.remove('hover')
              document.querySelector(`[data-box=${dataId}]`).classList.remove('selected')
            }
          }
      }
    },
    clearOldSelectElStyle (newId) {
      if (newId && this.selectEl.id && newId !== this.selectEl.id) {
        document.querySelector(`[data-box=${this.selectEl.id}]`).classList.remove('selected')
      }
    }
  }
}
