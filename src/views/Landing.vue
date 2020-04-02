<template>
  <div class="home">
    <SmColumnBox>
      <div id="canvas"></div>
    </SmColumnBox>
  </div>
</template>

<script>
import * as d3 from 'd3';
window.d3 = d3;
// import Component from "../component_location"

export default {
  components: {},

  props: [],

  data() {
    return {
      annotations: [
        {
          x: 50,
          y: 50,
          width: 100,
          height: 100,
        },
      ],
      grabberSize: 12,
      imageHeight: 800,
      imageWidth: 800,
    };
  },

  watch: {},

  methods: {},

  computed: {},

  mounted() {
    return;
    var self = this;
    var container = d3
      .select('#canvas')
      .append('svg')
      .attr('width', self.imageWidth)
      .attr('height', self.imageHeight);

    var upperPos = function(d) {
      var x = d.x - self.grabberSize / 2;
      var y = d.y - self.grabberSize / 2;
      return [x, y];
    };

    var lowerPos = function(d) {
      var x = d.x + d.width - self.grabberSize / 2;
      var y = d.y + d.height - self.grabberSize / 2;
      if (x > self.imageWidth - self.grabberSize / 2) {
        var dx = x - (self.imageWidth - self.grabberSize);
        x = self.imageWidth - self.grabberSize;
        d.width = d.width - dx;
      }
      return [x, y];
    };

    var drag = d3
      .drag()
      .on('drag', function(d, i) {
        d.x += d3.event.dx;
        d.y += d3.event.dy;
        if (d.x < 0) {
          d.x = 2;
        }
        if (d.y < 0) {
          d.y = 2;
        }
        if (d.x > self.imageWidth - 1 * d.width) {
          d.x = self.imageWidth - 1 * d.width - 2;
        }
        if (d.y > self.imageHeight - 1 * d.height) {
          d.y = self.imageHeight - 1 * d.height - 2;
        }
        d3.select(this)
          .attr('x', d.x)
          .attr('y', d.y);
        d3.selectAll('.upper')
          .filter(d => {
            return d.isActive;
          })
          .attr('x', d => {
            return upperPos(d)[0];
          })
          .attr('y', d => {
            return upperPos(d)[1];
          });
        d3.selectAll('.lower')
          .filter(d => {
            return d.isActive;
          })
          .attr('x', d => {
            return lowerPos(d)[0];
          })
          .attr('y', d => {
            return lowerPos(d)[1];
          });
      })
      .on('end', d => {
        d.isActive = false;
        console.log('Inactive.');
      });

    var dragLow = d3
      .drag()
      .on('drag', function(d, i) {
        d.width += d3.event.dx;
        d.height += d3.event.dy;
        console.log('Dragging lower!');
        d3.select(this)
          .filter(d => {
            return d.isActive;
          })
          .attr('x', d => {
            return lowerPos(d)[0];
          })
          .attr('y', d => {
            return lowerPos(d)[1];
          });
        d3.selectAll('.annotation-rect')
          .filter(d => {
            return d.isActive;
          })
          .attr('width', d => {
            return d.width;
          })
          .attr('height', d => {
            return d.height;
          });
      })
      .on('end', d => {
        d.isActive = false;
      });

    var dragUpper = d3.drag().on('drag', function(d, i) {
      d.x += d3.event.dx;
      d.y += d3.event.dy;
      d.width -= d3.event.dx;
      d.height -= d3.event.dy;
      // Translate the rectangle.
      d3.selectAll('.annotation-rect')
        .filter(d => {
          return d.isActive;
        })
        .attr('x', d => {
          return d.x;
        })
        .attr('y', d => {
          return d.y;
        })
        .attr('width', d => {
          return d.width;
        })
        .attr('height', d => {
          return d.height;
        });

      d3.selectAll('.upper')
        .filter(d => {
          return d.isActive;
        })
        .attr('x', d => {
          return upperPos(d)[0];
        })
        .attr('y', d => {
          return upperPos(d)[1];
        });
    });

    var annotations = container
      .selectAll('.annotations')
      .data(self.annotations);
    annotations
      .enter()
      .append('rect')
      .attr('class', 'annotation-rect')
      .attr('x', d => {
        return d.x;
      })
      .attr('y', d => {
        return d.y;
      })
      .attr('width', d => {
        return d.width;
      })
      .attr('height', d => {
        return d.height;
      })
      .on('mousedown', d => {
        d.isActive = true;
        d3.selectAll('.annotation-rect')
          .filter(d => {
            return d.isActive;
          })
          .attr('fill-opacity', 0.7);
        console.log('Is active.');
      })
      .call(drag);

    var uppers = container.selectAll('.upper').data(self.annotations);
    uppers
      .enter()
      .append('rect')
      .attr('class', 'grabber upper')
      .attr('x', d => {
        return upperPos(d)[0];
      })
      .attr('y', d => {
        return upperPos(d)[1];
      })
      .attr('width', self.grabberSize)
      .attr('height', self.grabberSize)
      .on('mousedown', d => {
        d.isActive = true;
        console.log('Upper Active');
      })
      .call(dragUpper);

    var lowers = container.selectAll('.lower').data(self.annotations);
    lowers
      .enter()
      .append('rect')
      .attr('class', 'grabber lower')
      .attr('x', d => {
        return lowerPos(d)[0];
      })
      .attr('y', d => {
        return lowerPos(d)[1];
      })
      .attr('width', self.grabberSize)
      .attr('height', self.grabberSize)
      .on('mousedown', d => {
        d.isActive = true;
      })
      .call(dragLow);
  },
};
</script>

<style>
.annotation-rect {
  fill: blue;
  fill-opacity: 0.2;
  stroke: red;
  stroke-width: 1;
}
.grabber {
  fill: black;
  stroke: white;
  stroke-width: 1;
}
.active {
  fill-opacity: 0.4;
}
</style>
