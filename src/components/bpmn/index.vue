<template>
  <div class="container">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="bpmn"
      width="800"
      height="300"
      @mousedown="mousedown"
      @mousemove="mousemove"
      @mouseup="mouseup"
      @mouseover="mouseover"
    >
      <g
        class="g-box"
        :transform="`matrix(${transform.scaleX},0,0,${transform.scaleY},${transform.translateX},${transform.translateY})`"
      >
      </g>
    </svg>

    <div class="tool-box">
      <div class="tool" @mousedown="newConnect">
        <img src="../../assets/tool/connection.svg"/>
      </div>
      <div class="tool" @mousedown="newStartEvent('startEvent', $event)">
        <img src="../../assets/tool/start-event.svg"/>
      </div>
    </div>

    <zoom :transform="transform"></zoom>
  </div>
</template>

<script>
import Zoom from './zoom'
import createElement from 'utils/createElement.js'
import $ from 'utils/methods.js'
export default {
  components: {
    Zoom
  },
  data () {
    return {
      select: false,
      transform: {
        scaleX: 1,
        scaleY: 1,
        translateX: 0,
        translateY: 0
      },
      new: false,
      newElement: {
        el: '',
        id: '',
        startX: 0,
        startY: 0
      },
      moveEl: {
        el: '',
        startX: 0,
        startY: 0
      },
      connectEl: {
        startX: 0,
        startY: 0
      },
      startMove: false,
      bpmnEl: null,
      newConnection: false,
      type: [
        'startEvent',
        'connection'
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.bpmnEl = document.getElementById('bpmn')
    },
    newStartEvent (type, e) {
      this.new = true
      this.newElement.startX = e.clientX / this.transform.scaleX
      this.newElement.startY = e.clientY / this.transform.scaleX
      createElement[type](e, this)
      this.newElement.el = document.getElementById(this.newElement.id)
    },
    newConnect (e) {
      this.newConnection = true
    },
    mouseover (e) {
      const dataId = e.target.getAttribute('data-id')
      if (dataId && this.type.includes(dataId.split('--')[0])) {
        document.getElementById(dataId).classList.toggle('target-hover')
      }
    },
    mouseout (e) {
      const dataId = e.target.getAttribute('data-id')
      if (dataId && this.type.includes(dataId.split('--')[0])) {
        document.getElementById(dataId).classList.toggle('target-hover')
      }
    },
    mousedown (e) {
      if (this.new) return (this.new = false)
      this.startMove = true
      if (e.target.getAttribute('data-id') && e.target.getAttribute('data-id').includes('startEvent')) {
        this.moveEl.el = document.getElementById(`${e.target.getAttribute('data-id')}`)
        this.moveEl.oldTranslateX = $.getMatrix(this.moveEl.el).e
        this.moveEl.oldTranslateY = $.getMatrix(this.moveEl.el).f
        this.moveEl.startX = e.clientX
        this.moveEl.startY = e.clientY
      }
      if (this.newConnection) {
        if (!e.target.getAttribute('data-id')) return (this.startMove = false)
        createElement.connection(e, this)
        this.newElement.el = document.querySelector(`#${this.newElement.id}`)
      }
    },
    mousemove (e) {
      if (this.new) {
        this.newElement.el.setAttribute('transform', `translate(${e.clientX / this.transform.scaleX - this.newElement.startX}, ${e.clientY / this.transform.scaleX - this.newElement.startY})`)
      }
      if (this.startMove && this.moveEl.el && !this.newConnection) {
        this.moveEl.el.setAttribute('transform', `translate(${e.clientX / this.transform.scaleX - this.moveEl.startX / this.transform.scaleX + this.moveEl.oldTranslateX}, ${e.clientY / this.transform.scaleX - this.moveEl.startY / this.transform.scaleX + this.moveEl.oldTranslateY})`)
      }
      if (this.startMove && this.newConnection) {
        this.newElement.el.childNodes[0].setAttribute('points', this.setPolylinePoints(e))
      }
    },
    // 设置拆线各点的坐标
    setPolylinePoints (e) {
      const PX = e.clientX / this.transform.scaleX - this.bpmnEl.getBoundingClientRect().left
      const PY = e.clientY / this.transform.scaleX - this.bpmnEl.getBoundingClientRect().top
      const IP = $.getCircleIntersectionPoint(this.newElement.startX, this.newElement.startY, PX, PY, 20)
      return `${IP.x}, ${IP.y}, ${PX}, ${PY}`
    },

    mouseup () {
      this.startMove = false
      this.newConnection = false
      this.new = false
      this.moveEl.el = null
    }
  }
}
</script>

<style lang="scss" scoped>
  * {
    box-sizing: border-box;
  }
  .container {
    position: relative;
    width: 800px;
    height: 300px;
    border: 1px dashed #333;
    .tool-box {
      position: absolute;
      top: 20px;
      left: 30px;
      border: 1px solid #999;
      width: 60px;
      height: 260px;
      padding: 10px 10px;
      .tool {
        width: 40px;
        height: 40px;
      }
    }
  }
  #bpmn {
    position: relative;
  }
  .circle {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
