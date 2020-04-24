<template>
  <div id="label-container" class="label-container" v-if="currentImage">
    <img id="active-image" class="image-box" :src="imageUrl" />
  </div>
</template>

<script>
var LabelBox = require('../api/LabelBox.js');
var WildEmitter = require('../api/wildemitter.js');
window.WildEmitter = WildEmitter;
import {
  updateLabel,
  createLabelAPI,
  getLabels,
  deleteLabel,
} from '../api/api.js';

export default {
  components: {},

  props: ['target', 'currentImage'],

  data() {
    return {
      labels: [],
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
    target: function() {
      try {
        this.box.updateTarget(this.target);
      } catch {}
    },
    imageUrl: function() {
      if (this.currentImage) {
        this.initLabeler();
      }
    },
  },

  methods: {
    createLabel(label) {
      createLabelAPI(this.currentImage.id, label)
        .then(result => {
          this.labels = result.data;
          this.refreshBox();
        })
        .catch(res => {
          let message = `Unable to create label (${res.message})`;
          this.$toasted.show(message, {type: 'error', duration: 5000});
        });
    },

    refreshBox(label) {
      this.box = new LabelBox(this, this.options);
      this.box.on('createLabel', this.createLabel);
      this.box.on('updateLabel', this.updateLabel);
      this.box.on('deleteLabel', this.deleteLabel);
      this.box.updateLabels();
    },

    updateLabel(label) {
      console.log('Updating the label.');
      updateLabel(label);
    },
    deleteLabel(label) {
      deleteLabel(label.id);
    },

    initLabeler() {
      getLabels(this.currentImage.id).then(res => {
        this.labels = res.data;
        this.box = new LabelBox(this, this.options);
        this.box.on('createLabel', this.createLabel);
        this.box.on('updateLabel', this.updateLabel);
        this.box.on('deleteLabel', this.deleteLabel);
        this.box.updateLabels();
      });
    },
  },

  computed: {
    imageUrl() {
      if (this.currentImage) {
        return this.currentImage.url;
      } else {
        return '';
      }
    },
  },

  mounted() {
    var img = document.getElementById(this.options.targetImageId);
    img.onload = this.initLabeler;
    d3.select('aside.SmColumnBoxRight').remove(); // how to get rid of this?
  },
};
</script>

<style>
.image-box {
  border: 2px solid black;
  height: 600px;
  float: right;
}
.label-container {
  position: relative;
  float: right;
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
.upperLeft {
  cursor: nwse-resize;
}
.handle:hover {
  fill: #47e5f2;
  fill-opacity: 1;
  stroke: #47e5f2;
  stroke-width: 1;
}
.text-label {
  fill: 'black';
  z-index: 100;
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
  fill-opacity: 1;
  cursor: pointer;
}
.selected {
  fill: #ffffff;
  stroke: #ffffff;
}
</style>
