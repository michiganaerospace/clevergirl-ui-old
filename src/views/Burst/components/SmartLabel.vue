<template>
  <div id="label-container" class="label-container">
    <img id="active-image" class="image-box" :src="imageUrl" />
  </div>
</template>

<script>
// import Component from "../component_location"
// import {LabelCanvas} from '../api/LabelCanvas.js';
var LabelBox = require('../api/LabelBox.js');

export default {
  components: {},

  props: ['imageUrl'],

  data() {
    return {
      labels: [],
      currentTarget: {common_name: 'White tailed deer'},
      options: {
        target: 'label-container',
        targetImageId: 'active-image',
        canvasId: 'canvas',
        handleSize: 24,
        textHeight: 30,
      },
    };
  },

  watch: {
    imageUrl: function() {
      this.initLabeler();
    },
    labels: function() {
      console.log(
        'Labels have changed (' + parseInt(Math.random() * 10 + 1) + ')',
      );
      console.log(this.labels);
    },
  },

  methods: {
    deleteLabel() {
      this.selectedLabel.delete = true;
      let idx = this.labels.indexOf(this.selectedLabel);
      this.labels = this.labels.splice(idx, idx);
      d3.selectAll('rect, text')
        .filter(d => {
          return d.delete;
        })
        .remove();
      console.log(this.labels);
    },

    initLabeler() {
      console.log('Making a new box!');
      this.box = new LabelBox(this, this.options);
    },
  },

  computed: {},

  mounted() {
    this.initLabeler();
    var img = document.getElementById(this.options.targetImageId);
    img.onload = this.initLabeler;
  },
};
</script>

<style>
.image-box {
  border: 2px solid black;
  max-height: 700px;
}
.label-container {
  position: relative;
}
#canvas {
  position: absolute;
  top: 0;
  left: 0;
}
.crosshair {
  stroke: #47e5f2;
  stroke-width: 2;
  fill: none;
}
.label {
  fill: #47e5f2;
  fill-opacity: 0.1;
  stroke: #47e5f2;
  stroke-width: 1;
}
.handle {
  fill: #47e5f2;
  fill-opacity: 0;
  stroke: #47e5f2;
  stroke-width: 1;
}
.lowerRight {
  cursor: nwse-resize;
}
.handle:hover {
  fill: #47e5f2;
  fill-opacity: 1;
  stroke: #47e5f2;
  stroke-width: 1;
}
.text-label {
  fill: 'white';
  cursor: pointer;
  text-transform: uppercase;
  font-size: 16px;
  font-family: 'Verdana';
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
}
.text-label-secret {
  fill: 'white';
  cursor: pointer;
  text-transform: uppercase;
  font-size: 16px;
  font-family: 'Verdana';
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
}
.text-rect {
  fill: #47e5f2;
  fill-opacity: 0.8;
  cursor: pointer;
}
.selected {
  fill: #ffffff;
  stroke: #ffffff;
}
</style>
