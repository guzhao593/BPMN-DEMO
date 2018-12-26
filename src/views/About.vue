<template>
  <div class="about">
    <div class="bpmn">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
      >
        <title>一个圆</title>
        <desc>一个圆</desc>
        <circle cx="50" cy="50" r="50" style="stroke: yellow; fill: #fff"></circle>
        <circle cx="25" cy="35" r="5" stroke="yellow" fill="yellow"></circle>
        <circle cx="75" cy="35" r="5" stroke="yellow" fill="yellow"></circle>
        <g id="whiskers">
          <line x1="50" y1="60" x2="100" y2="40" stroke="yellow"></line>
          <line x1="50" y1="60" x2="100" y2="80" stroke="yellow"></line>
        </g>
        <use xlink:href="#whiskers" transform="scale(-1 1) translate(-120 0)"></use>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      bpmn: null,
      select: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.bpmn = document.querySelector('.bpmn')
      this.bpmn.addEventListener('mousedown', function (evt) {
        var disX = evt.clientX - this.offsetLeft
        var disY = evt.clientY - this.offsetTop
        document.onmousemove = (event) => {
          this.style.top = event.clientY - disY + 'px'
          this.style.left = event.clientX - disX + 'px'
        }
        document.onmouseup = (e) => {
          document.onmousemove = document.onmouseup = null
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .about {
    position: relative;
    .bpmn {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
</style>
