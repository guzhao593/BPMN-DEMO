<template>
  <div class="container">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="bpmn"
      width="100%"
      height="500"
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

      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M 0 0 3 3 0 6 Z" style="fill: #333"></path>
        </marker>
      </defs>
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
import BpmnMixin from '@/mixins/bpmn-mixin'
export default {
  components: {
    Zoom
  },
  mixins: [BpmnMixin],
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
        id: '',
        startX: 0,
        startY: 0
      },
      connectEl: {
        startX: 0,
        startY: 0
      },
      allSequenceFlowInfo: {},
      elementCenterCoordinate: {},
      startMove: false,
      bpmnEl: null,
      newConnection: false,
      connectStartEleId: null,
      newConnectDataId: [],
      type: [
        'startEvent',
        'connection'
      ]
    }
  },
  computed: {
    // 连接线的终点元素ID
    connectEndEleId () {
      return this.newConnectDataId[1]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.bpmnEl = document.getElementById('bpmn')
      this.initEvent()
      this.initLocationLine()
    },
    initEvent () {
      document.documentElement.addEventListener('mouseup', (e) => {
        // 鼠标松开时，如果指针不在bpmn范围内，则删除连接线
        if (this.newConnection && this.newElement.el) {
          this.removeNewElement()
        }
      })
    },
    initLocationLine () {
      this.locationLine.yEl = createElement.locationLine(0, 0, 0, this.bpmnEl.getBoundingClientRect().height)
      this.locationLine.xEl = createElement.locationLine(0, 0, this.bpmnEl.getBoundingClientRect().width, 0)
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
      const dataId = $.getTargetDataId(e)
      this.handleNewConnectDataId(dataId)
      if (dataId && this.type.includes(dataId.split('--')[0])) {
        document.getElementById(dataId).classList.toggle('target-hover')
      }
    },
    mousedown (e) {
      const DATA_ID = $.getTargetDataId(e)
      if (!DATA_ID) return
      if (this.new) {
        $.saveElementCenterCoordinate(this, this.newElement.id)
        this.new = false
        return
      }
      this.startMove = true
      if (DATA_ID && DATA_ID.includes('startEvent')) {
        this.moveEl.el = document.getElementById(DATA_ID)
        this.moveEl.id = DATA_ID
        this.moveEl.oldTranslateX = $.getMatrix(this.moveEl.el).e
        this.moveEl.oldTranslateY = $.getMatrix(this.moveEl.el).f
        this.moveEl.startX = e.clientX
        this.moveEl.startY = e.clientY
      }
      if (this.newConnection) {
        if (!DATA_ID) return (this.startMove = false)
        createElement.connection(e, this)
        this.connectStartEleId = $.getTargetDataId(e)
        this.newElement.el = document.getElementById(this.newElement.id)
      }
    },
    mousemove (e) {
      if (this.new) {
        this.newElement.el.setAttribute('transform', `translate(${e.clientX / this.transform.scaleX - this.newElement.startX}, ${e.clientY / this.transform.scaleX - this.newElement.startY})`)
        this.listenMoveEleCenterCoordinate(this.newElement.id)
      }
      if (this.startMove && this.moveEl.el && !this.newConnection) {
        this.moveEl.el.setAttribute('transform', `translate(${e.clientX / this.transform.scaleX - this.moveEl.startX / this.transform.scaleX + this.moveEl.oldTranslateX}, ${e.clientY / this.transform.scaleX - this.moveEl.startY / this.transform.scaleX + this.moveEl.oldTranslateY})`)
        this.listenMoveEleCenterCoordinate(this.moveEl.id)
      }
      if (this.startMove && this.newConnection) {
        this.newElement.el.childNodes[0].setAttribute('points', this.setConnectionPolylinePoints(e))
      }
    },

    mouseup (e) {
      if (this.newConnection) {
        if (this.connectEndEleId) {
          const endCenterPoint = $.getCenterPoint(this.connectEndEleId)
          createElement.sequenceFlow(e, this, endCenterPoint)
        }
        this.removeNewElement()
      } else if (this.startMove) {
        $.saveElementCenterCoordinate(this, this.moveEl.id)
      }
      this.resetStatus()
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
    width: 100%;
    height: 100%;
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
