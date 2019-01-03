<template>
  <div class="zoom-box">
    <div class="zoom reset-zoom" @click="resetZoom(1)">
      <img src="../../../assets/zoom/reset-zoom.svg"/>
    </div>
    <div class="zoom zoom-in" @click="zoomIn(1)">
      <img src="../../../assets/zoom/zoom-in.svg"/>
    </div>
    <div class="zoom zoom-out" @click="zoomOut(1)">
      <img src="../../../assets/zoom/zoom-out.svg"/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    transform: Object
  },
  data () {
    return {}
  },
  methods: {
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
</style>
