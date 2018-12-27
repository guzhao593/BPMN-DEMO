<template>
  <div class="container">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="800"
      height="300"
      class="bpmn"
    >
      <g
        :transform="`matrix(${transform.scaleX},0,0,${transform.scaleY},${transform.translateX},${transform.translateY})`"
      >
        <circle cx="50" cy="50" r="20" style="stroke: #333; fill: #fff" class="circle"></circle>
      </g>
    </svg>
    <div class="zoom-box">
      <div class="zoom reset-zoom" @click="resetZoom(1)">
        <img src="../assets/reset-zoom.svg"/>
      </div>
      <div class="zoom zoom-in" @click="zoomIn(1)">
        <img src="../assets/zoom-in.svg"/>
      </div>
      <div class="zoom zoom-out" @click="zoomOut(1)">
        <img src="../assets/zoom-out.svg"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      select: false,
      transform: {
        scaleX: 1,
        scaleY: 1,
        translateX: 0,
        translateY: 0
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.handleMoveElement()
    },
    handleMoveElement () {
      const VM = this
      document.querySelector('.circle').addEventListener('mousedown', function (e) {
        VM.select = true
        var disX = e.clientX - this.cx.baseVal.value
        var disY = e.clientY - this.cy.baseVal.value
        document.addEventListener('mousemove', (evt) => {
          if (!VM.select) return
          this.setAttribute('cy', evt.clientY - disY)
          this.setAttribute('cx', evt.clientX - disX)
        })
        document.addEventListener('mouseup', function () {
          VM.select = false
        })
      })
    },
    zoomIn (multiple = 1) {
      this.transform.scaleX = this.transform.scaleX > 3
        ? this.transform.scaleX
        : this.transform.scaleX + (0.1 * multiple)
      this.transform.scaleY = this.transform.scaleY > 3
        ? this.transform.scaleY
        : this.transform.scaleY + (0.1 * multiple)
    },
    // 缩小Svg
    zoomOut (multiple = 1) {
      this.transform.scaleX = this.transform.scaleX < 0.3
        ? this.transform.scaleX
        : this.transform.scaleX - (0.1 * multiple)
      this.transform.scaleY = this.transform.scaleY < 0.3
        ? this.transform.scaleY
        : this.transform.scaleY - (0.1 * multiple)
    },
    resetZoom () {
      this.transform.scaleX = this.transform.scaleY = 1
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
    .zoom-box {
      position: absolute;
      bottom: 10px;
      right: 10px;
      border: 1px solid #999;
      width: 30px;
      height: 90px;
      .zoom {
        width: 29px;
        height: 29px;
        border-bottom: 1px solid #999;
      }
      .zoom-out {
        border-bottom: none;
      }
    }
  }
  .bpmn {
    position: relative;
  }
  .circle {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
