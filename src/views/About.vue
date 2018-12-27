<template>
  <div class="about">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="800"
      height="300"
      class="bpmn"
    >
      <g>
        <title>一个圆</title>
        <desc>一个圆</desc>
        <circle cx="50" cy="50" r="20" style="stroke: yellow; fill: #fff" class="circle" draggable="true"></circle>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  data () {
    return {
      select: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.handleMoveElement()
      // this.handleDraggableElement()
    },
    handleDraggableElement () {
      document.querySelector('.circle').ondragstart = (e) => {
        console.log(e)
      }
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .about {
    position: relative;
    width: 800px;
    height: 300px;
    border: 1px dashed #333;
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
