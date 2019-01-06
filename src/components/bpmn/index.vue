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
      <div class="tool" @mousedown="createNewElement('startEvent', $event)">
        <img src="../../assets/tool/start-event.svg"/>
      </div>
      <div class="tool" @mousedown="createNewElement('endEvent', $event)">
        <img src="../../assets/tool/end-event.svg"/>
      </div>
      <div class="tool" @mousedown="createNewElement('gateway', $event)">
        <img src="../../assets/tool/gateway.svg"/>
      </div>
      <div class="tool" @mousedown="createNewElement('task', $event)">
        <img src="../../assets/tool/task.svg"/>
      </div>
    </div>

    <zoom :transform="transform"></zoom>
  </div>
</template>

<script>
import Zoom from './zoom'
import create from 'utils/createElement.js'
import $ from 'utils/methods.js'
import BpmnMixin from '@/mixins/bpmn-mixin'
export default {
  components: {
    Zoom
  },
  mixins: [BpmnMixin],
  data () {
    return {
      transform: {
        scaleX: 1,
        scaleY: 1,
        translateX: 0,
        translateY: 0
      },
      // 新建元素
      newEl: {
        el: '',
        id: '',
        startX: 0,
        startY: 0
      },
      // 移动元素
      moveEl: {
        el: '',
        id: '',
        startX: 0,
        startY: 0
      },
      // 连接元素
      connectEl: {
        startX: 0,
        startY: 0
      },
      // 所有序列线信息
      allSequenceFlowInfo: {},
      // 所有图标中心坐标
      elementCenterCoordinate: {},
      // bpmn图标
      bpmnEl: null,
      // 创建新元素状态
      createNew: false,
      // 移动状态
      move: false,
      // 连接线状态
      connetion: false,
      // 连接线起点元素id
      connectStartEleId: null,
      // 鼠标经过的最后两个元素dataId，最后一个为连接线的id,倒数第二个为最后经过的元素id
      newConnectDataId: [],
      type: [
        'startEvent',
        'endEvent',
        'task',
        'gateway'
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
      // 初始化定位线
      this.initLocationLine()
    },
    initEvent () {
      document.documentElement.addEventListener('mouseup', (e) => {
        // 鼠标松开时，如果指针不在bpmn范围内，则删除连接线
        if (this.connetion && this.newEl.el) {
          this.removeNewElement()
        }
      })
    },
    initLocationLine () {
      this.locationLine.yEl = create.locationLine(0, 0, 0, this.bpmnEl.getBoundingClientRect().height)
      this.locationLine.xEl = create.locationLine(0, 0, this.bpmnEl.getBoundingClientRect().width, 0)
    },
    createNewElement (type, e) {
      this.createNew = true
      this.newEl.startX = e.clientX / this.transform.scaleX
      this.newEl.startY = e.clientY / this.transform.scaleX
      this.newEl.el = create[type](e, this)
    },
    newConnect (e) {
      this.connetion = true
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
      if (this.createNew) {
        $.saveElementCenterCoordinate(this, this.newEl.id)
        this.createNew = false
        return
      }
      this.move = true
      if (this.type.some(type => DATA_ID.includes(type))) {
        this.moveEl.el = document.getElementById(DATA_ID)
        this.moveEl.id = DATA_ID
        this.moveEl.oldTranslateX = $.getMatrix(this.moveEl.el).e
        this.moveEl.oldTranslateY = $.getMatrix(this.moveEl.el).f
        this.moveEl.startX = e.clientX
        this.moveEl.startY = e.clientY
      }
      if (this.connetion) {
        this.newEl.el = create.connection(e, this)
        this.connectStartEleId = $.getTargetDataId(e)
      }
    },
    mousemove (e) {
      // 移动新元素移动
      if (this.createNew) {
        const TX = e.clientX / this.transform.scaleX - this.newEl.startX
        const TY = e.clientY / this.transform.scaleX - this.newEl.startY
        this.newEl.el.setAttribute('transform', `translate(${TX}, ${TY})`)
        this.listenMoveEleCenterCoordinate(this.newEl.id)
      }
      // 移动已创建元素
      if (this.move && this.moveEl.el && !this.connetion) {
        const TX = e.clientX / this.transform.scaleX - this.moveEl.startX / this.transform.scaleX + this.moveEl.oldTranslateX
        const TY = e.clientY / this.transform.scaleX - this.moveEl.startY / this.transform.scaleX + this.moveEl.oldTranslateY
        this.moveEl.el.setAttribute('transform', `translate(${TX}, ${TY})`)
        this.listenMoveEleCenterCoordinate(this.moveEl.id)
      }
      // 连接线移动
      if (this.move && this.connetion) {
        this.newEl.el.childNodes[0].setAttribute('points', this.setConnectionPolylinePoints(e))
      }
    },

    mouseup (e) {
      if (this.connetion) {
        if (this.connectEndEleId) {
          const endCenterPoint = $.getCenterPoint(this.connectEndEleId)
          create.sequenceFlow(e, this, endCenterPoint)
        }
        this.removeNewElement()
      }
      if (this.move) {
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
      background: #fff;
      .tool {
        width: 40px;
        height: 40px;
        margin-bottom: 10px;
        img {
          color: #ff7400;
        }
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
