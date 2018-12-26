<template>
  <div class="about">
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
      <use xlink:href="#whiskers" transform="scale(-1 1) translate(-100 0)"></use>
    </svg>
  </div>
</template>
