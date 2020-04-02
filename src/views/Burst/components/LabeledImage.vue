<template>
  <div id="label-container" class="label-container">
    <img id="active-image" class="image-box" :src="imageUrl" />
  </div>
</template>

<script>
// import Component from "../component_location"

export default {
  components: {},

  props: ['imageUrl'],

  data() {
    return {
      imageDetails: {},
      height: 0,
      width: 0,
      drawingLabel: false,
      labels: [],
      handleSize: 24,
      selectedLabel: {},
      dragPoint: 'lowerRightDrag'
    };
  },

  watch: {
    imageUrl: function() {
      this.initLabeler();
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

    getImageDetails() {
      // Get the shape of the image.
      this.imageDetails = d3
        .select('#active-image')
        .node()
        .getBoundingClientRect();
      this.width = this.imageDetails.width;
      this.height = this.imageDetails.height;
    },

    initLabeler() {
      // Remove existing canvas.
      console.log('Initializing the canvas');
      var self = this;
      d3.selectAll('.label').each(d => {
        d.isActive = false;
      });
      d3.select('#canvas').remove();
      this.getImageDetails();
      var container = d3
        .select('#label-container')
        .append('svg')
        .attr('id', 'canvas')
        .attr('width', this.width)
        .attr('height', this.height);

      container.append('line').attr('class', 'vCrossTop crosshair');
      container.append('line').attr('class', 'vCrossBot crosshair');
      container.append('line').attr('class', 'hCrossLeft crosshair');
      container.append('line').attr('class', 'hCrossRight crosshair');
      container.append('circle').attr('class', 'reticle crosshair');

      function render(context) {
        if (context == undefined) {
          context = this; // so we can call from inside a drag event.
        }
        var x = d3.mouse(context)[0];
        var y = d3.mouse(context)[1];
        console.log(d3.event.dx)
        d3.selectAll('.vCrossTop')
          .transition()
          .ease(d3.easeCubic)
          .duration(10)
          .attr('x1', x)
          .attr('x2', x)
          .attr('y1', 2)
          .attr('y2', y - 10);
        d3.selectAll('.vCrossBot')
          .transition()
          .ease(d3.easeCubic)
          .duration(10)
          .attr('x1', x)
          .attr('x2', x)
          .attr('y1', y + 10)
          .attr('y2', self.height - 2);
        d3.selectAll('.hCrossLeft')
          .transition()
          .ease(d3.easeLinear)
          .duration(10)
          .attr('x1', 2)
          .attr('x2', x - 10)
          .attr('y1', y)
          .attr('y2', y);
        d3.selectAll('.hCrossRight')
          .transition()
          .ease(d3.easeLinear)
          .duration(10)
          .attr('x1', self.width - 2)
          .attr('x2', x + 10)
          .attr('y1', y)
          .attr('y2', y);
        d3.selectAll('.reticle')
          .transition()
          .ease(d3.easeLinear)
          .duration(10)
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', 10);

        // Handle label drawing.
        if (self.drawingLabel) {
          // Update active label dimensions.
          d3.selectAll('.label')
            .filter(d => {
              return d.isActive;
            })
            .attr('width', d => {
              if (self.dragPoint == 'lowerRightDrag') {
                if (x < d.ox) {
                  d.width = d.ox - x;
                } else {
                  d.width = x - d.ox;
                }
              } else {
              }
              return d.width;
            })
            .attr('x', d => {
              if (x < d.ox) {
                d.x = x;
              } else if (x > d.ox) {
                d.x = d.ox;
              }
              return d.x;
            })
            .attr('y', d => {
              if (y < d.oy) {
                d.y = y;
              } else if (y > d.oy) {
                d.y = d.oy;
              }
              return d.y;
            })
            .attr('height', d => {
              if (y < d.oy) {
                d.height = d.oy - y;
              } else {
                d.height = y - d.oy;
              }
              return d.height;
            });

          // Update handle position.
          d3.selectAll('.lowerRight')
            .filter(d => {
              return d.isActive;
            })
            .attr('x', d => {
              return d.x + d.width - self.handleSize / 2;
            })
            .attr('y', d => {
              return d.y + d.height - self.handleSize / 2;
            })
            .attr('width', d => {
              return self.handleSize;
            })
            .attr('height', d => {
              return self.handleSize;
            });

          // Update handle position.
          d3.selectAll('.upperRight')
            .filter(d => {
              return d.isActive;
            })
            .attr('x', d => {
              return d.x + d.width - self.handleSize / 2;
            })
            .attr('y', d => {
              return d.y + d.height - self.handleSize / 2;
            })
            .attr('width', d => {
              return self.handleSize;
            })
            .attr('height', d => {
              return self.handleSize;
            });

          // Update text-rect
          d3.selectAll('.text-rect')
            .filter(d => {
              return d.isActive;
            })
            .attr('width', d => {
              return Math.max(x - d.x - self.handleSize / 2, 0);
            })
            .attr('y', d => {
              if (d.y < 30) {
                return d.y + d.height;
              } else {
                return d.y - 30;
              }
            });

          // Update text-label
          d3.selectAll('.text-label')
            .filter(d => {
              return d.isActive;
            })
            .attr('width', d => {
              return x - d.x - self.handleSize / 2;
            })
            .attr('y', d => {
              if (d.y < 30) {
                return d.y + d.height + 20;
              } else {
                return d.y - 10;
              }
            })
            .attr('opacity', d => {
              // Only display text when there is enough room.
              var textBoxWidth = d3
                .selectAll('.text-rect')
                .filter(d => {
                  return d.isActive;
                })
                .node()
                .getBBox().width;
              var textWidth = d3
                .selectAll('.text-label')
                .filter(d => {
                  return d.isActive;
                })
                .node()
                .getBBox().width;
              var opacity = 0;
              if (textBoxWidth > textWidth) {
                opacity = 1;
              } else {
                opacity = 0;
              }
              return opacity;
            });
        }
      } // end RENDER

      var deselectEverything = function() {
        d3.selectAll('rect.text-rect')
          .each(d => {
            d.isSelected = false;
          })
          .classed('selected', false);
      };

      var selectLabel = function(d) {
        d3.event.stopPropagation();
        if (!d.isSelected) {
          // Deselect everything.
          deselectEverything();
          // Select the current label
          d.isSelected = true;
          d3.selectAll('rect.text-rect')
            .filter(d => {
              return d.isSelected;
            })
            .classed('selected', true);
          self.selectedLabel = d;
        } else {
          // Just deselect everything... we done here.
          deselectEverything();
        }
      };

      var addLabels = function() {
        console.log('Adding the labels.');
        console.log(self.labels);
        d3.select('#canvas')
          .selectAll('.label')
          .data(self.labels)
          .enter()
          .append('rect')
          .attr('class', 'label')
          .attr('x', d => d.x)
          .attr('y', d => d.y)
          .attr('width', d => d.width)
          .attr('height', d => d.height)
          .exit()
          .remove();

        // Add upper left handle.
        d3.select('#canvas')
          .selectAll('.upperLeft')
          .data(self.labels)
          .enter()
          .append('rect')
          .attr('class', 'upperLeft handle')
          .attr('x', d => {
            return d.x - self.handleSize / 2;
          })
          .attr('y', d => {
            return d.y - self.handleSize / 2;
          })
          .attr('width', d => {
            return self.handleSize;
          })
          .attr('height', d => {
            return self.handleSize;
          })
          .on('click', d => {
            if (d.isActive) {
              d.isActive = false;
              return;
            } else {
              d3.event.stopPropagation();
              d.isActive = true;
              self.drawingLabel = true;
              self.dragPoint = 'upperLeftDrag';
            }
          });

        // Add lower right handle.
        d3.select('#canvas')
          .selectAll('.lowerRight')
          .data(self.labels)
          .enter()
          .append('rect')
          .attr('class', 'lowerRight handle')
          .attr('x', d => {
            return d.x + d.width - self.handleSize / 2;
          }) .attr('y', d => {
            return d.y + d.height - self.handleSize / 2;
          })
          .attr('width', d => {
            return self.handleSize;
          })
          .attr('height', d => {
            return self.handleSize;
          })
          .on('click', d => {
            if (d.isActive) {
              d.isActive = false;
              return;
            } else {
              d3.event.stopPropagation();
              d.isActive = true;
              console.log('OVER');
              self.drawingLabel = true;
              self.dragPoint = 'lowerRightDrag'
            }
          });

        // Add text rectangle.
        console.log('Adding text rectangle.');
        d3.select('#canvas')
          .selectAll('.text-rect')
          .data(self.labels)
          .enter()
          .append('rect')
          .attr('class', 'text-rect')
          .attr('x', d => {
            if (d.y < 30) {
              return d.x;
            } else {
              return d.x + self.handleSize / 2;
            }
          })
          .attr('y', d => {
            return d.y - 30;
          })
          .attr('width', d => {
            return d.width - self.handleSize / 2;
          })
          .attr('height', 30)
          .on('click', selectLabel);

        d3.select('#canvas')
          .selectAll('.text-label')
          .data(self.labels)
          .enter()
          .append('text')
          .attr('class', 'text-label')
          .attr('x', d => {
            if (d.y < 30) {
              return d.x + 10;
            } else {
              return d.x + 10 + self.handleSize / 2;
            }
          })
          .attr('y', d => {
            if (d.y < 30) {
              return d.y + d.height + 10;
            } else {
              return d.y - 10;
            }
          })
          .attr('opacity', d => {
            if (d.width > 0) {
              return 1;
            } else {
              return 0;
            }
          })
          .text('White Tailed Deer')
          .on('click', selectLabel);

        d3.select('#canvas').on('mousemove', render);
        d3.select('#canvas').on('mouseenter', function(e) {});
        d3.select('#canvas').on('mouseout', function() {});
      };

      // Clicking the canvas adds a new label to the scene.
      d3.select('#canvas').on('click', function() {
        var mouse = d3.mouse(this);
        var x = mouse[0];
        var y = mouse[1];
        self.drawingLabel = !self.drawingLabel;
        if (self.drawingLabel) {
          d3.selectAll('.label').each(d => {
            d.isActive = false;
          });

          // Push a new label into the label list.
          self.labels.push({
            x: x,
            y: y,
            ox: x,
            oy: y,
            width: 0,
            height: 0,
            isActive: true,
            isSelected: false,
          });

          addLabels();
        }
      });

      // Add rectangles to the scene.
      addLabels();
    },
  },

  computed: {},

  mounted() {
    this.initLabeler();

    // Listen for delete event.
    window.addEventListener('keydown', e => {
      if (e.keyCode == 8) {
        this.deleteLabel();
      }
    });
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
.text-rect {
  fill: #47e5f2;
  fill-opacity: 0.8;
  cursor: pointer;
}
.selected {
  fill: #ffffff;
}
</style>
