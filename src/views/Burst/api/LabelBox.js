// Handle label box drawing for CLEVERGIRL.
var Emitter = require('./wildemitter.js');

function LabelBox(context, options) {
  d3.select('#' + options.canvasId).remove(); // get rid of any existing canvas
  var self = this;
  this.options = options;
  this.context = context;
  let imageSize = this.imageSize();
  this.height = imageSize.height;
  this.width = imageSize.width;
  this.createSVG();
  this.augmentLabels()
  this.updateLabels();
}

Emitter.mixin(LabelBox); // build in some event capabilities.

LabelBox.prototype.augmentLabels = function() {
  this.context.labels.forEach(label => {
    label.isSelected = false;
    label.isActive = false;
  });
};

LabelBox.prototype.createSVG = function() {
  var self = this;
  var addLabel = self.makeAddLabel();
  self.svg = d3
    .select('#label-container')
    .append('svg')
    .attr('id', self.options.canvasId)
    .attr('width', self.imageSize().width)
    .attr('height', this.imageSize().height);
  this.addCrosshair();
  var updateCrosshair = self.makeCrosshairUpdate();
  self.svg.on('mousemove', updateCrosshair);
  self.svg.call(
    d3
      .drag()
      .on('start', addLabel.start)
      .on('drag', addLabel.drag)
      .on('end', addLabel.end),
  );
};

LabelBox.prototype.imageSize = function() {
  var self = this;
  let imageSize = d3
    .select('#' + self.options.targetImageId)
    .node()
    .getBoundingClientRect();
  return {
    width: imageSize.width,
    height: imageSize.height,
  };
};

LabelBox.prototype.addCrosshair = function() {
  var self = this;
  self.svg.append('line').attr('class', 'vCrossTop crosshair');
  self.svg.append('line').attr('class', 'vCrossBot crosshair');
  self.svg.append('line').attr('class', 'hCrossLeft crosshair');
  self.svg.append('line').attr('class', 'hCrossRight crosshair');
  self.svg.append('circle').attr('class', 'reticle crosshair');
};

LabelBox.prototype.makeCrosshairUpdate = function() {
  var self = this;
  updateCrosshair = function() {
    // Update crosshair in response to mouse movement.
    var m = d3.mouse(this);
    var x = m[0];
    var y = m[1];
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
  };
  return updateCrosshair;
};

LabelBox.prototype.mousePosition = function() {
  var m = d3.event;
  return m;
};

LabelBox.prototype.updateLabels = function() {
  var self = this;

  updateCrosshair = self.makeCrosshairUpdate();
  var onLabelAdd = d3
    .select('#canvas')
    .selectAll('g.group')
    .data(self.context.labels)
    .enter()
    .append('g')
    .attr('class', 'group');

  // Add the rects
  dragLabel = self.makeDragLabel();
  onLabelAdd
    .append('rect')
    .attr('class', 'label')
    .call(
      d3
        .drag()
        .on('start', dragLabel.start)
        .on('drag', dragLabel.drag)
        .on('end', dragLabel.end),
    );

  // Add the handles.
  onLabelAdd.append('rect').attr('class', 'handle upperLeft');
  onLabelAdd.append('rect').attr('class', 'handle lowerRight');

  // Add the label.
  onLabelAdd
    .append('rect')
    .attr('class', 'text-rect')
    .attr('height', self.options.textHeight);
  onLabelAdd
    .append('text')
    .attr('class', 'text-label')
    .style('color', 'black');

  d3.selectAll('rect.label').each(d => {
    d.x = d.x_frac * self.width;
    d.y = d.y_frac * self.height;
    d.x0 = d.x0_frac * self.width;
    d.y0 = d.y0_frac * self.height;
    d.width = d.width_frac * self.width;
    d.height = d.height_frac * self.height;
  });

  d3.selectAll('rect.label')
    .attr('x', d => {
      return d.x;
    })
    .attr('y', d => {
      return d.y;
    })
    .attr('width', d => {
      return Math.abs(d.width);
    })
    .attr('height', d => {
      return Math.abs(d.height);
    });

  handleDrag = self.makeHandleDrag();
  d3.selectAll('rect.upperLeft')
    .attr('x', d => {
      return d.x - self.options.handleSize / 2;
    })
    .attr('y', d => {
      return d.y - self.options.handleSize / 2;
    })
    .attr('width', d => {
      return self.options.handleSize;
    })
    .attr('height', d => {
      return self.options.handleSize;
    })
    .call(
      d3
        .drag()
        .on('start', handleDrag.start)
        .on('drag', handleDrag.drag)
        .on('end', handleDrag.end),
    );

  d3.selectAll('rect.lowerRight')
    .attr('x', d => {
      return d.x + Math.abs(d.width) - self.options.handleSize / 2;
    })
    .attr('y', d => {
      return d.y + Math.abs(d.height) - self.options.handleSize / 2;
    })
    .attr('width', d => {
      return self.options.handleSize;
    })
    .attr('height', d => {
      return self.options.handleSize;
    })
    .call(
      d3
        .drag()
        .on('start', handleDrag.start)
        .on('drag', handleDrag.drag)
        .on('end', handleDrag.end),
    );

  d3.selectAll('.text-rect')
    .attr('width', d => {
      // GOD is there no better way to do this?!
      var secretText = d3
        .select('body')
        .append('text')
        .text(d.target.common_name)
        .attr('class', 'text-label-secret secret')
        .attr('opacity', 0);
      var textWidth = d3
        .select('.secret')
        .node()
        .getBoundingClientRect().width;
      secretText.remove(); // remove the secret text
      return Math.max(
        textWidth + 30,
        Math.max(Math.abs(d.width) + 1 - self.options.handleSize / 2, 0),
      );
      return Math.max(Math.abs(d.width) - self.options.handleSize / 2, 0);
    })
    .attr('x', d => {
      if (d.y < 30) {
        return d.x - 1;
      } else {
        return d.x + self.options.handleSize / 2;
      }
    })
    .attr('y', d => {
      if (d.y < 30) {
        return d.y + d.height - 1;
      } else {
        return d.y - 30;
      }
    });

  d3.select('body').on('keydown', function(e) {
    if (d3.event.code != 'Backspace' || d3.event.target.nodeName == 'INPUT') {
      // Allow user to delete if editing an INPUT field.
      return;
    }
    d3.selectAll('g.group')
      .filter(d => {
        if (d.isSelected) {
        }
        return d.isSelected;
      })
      .each(d => {
        // Delete each selected label (from both array and server).
        var toDelete = null;
        self.context.labels.forEach(l => {
          if (l.x == d.x) {
            toDelete = l;
          }
        });
        if (toDelete) {
          var idx = self.context.labels.indexOf(toDelete);
          self.context.labels.splice(idx, 1);
          self.emit('deleteLabel', toDelete);
        }
      })
      .remove();
  });

  // text-label
  d3.selectAll('rect.label,text.text-label,rect.text-rect')
    .on('click', d => {
      d3.event.preventDefault();
      d3.event.stopPropagation();
      if (!d.hasOwnProperty('isSelected')) {
        d.isSelected = false
      }
      d.isSelected = !d.isSelected;
      d3.selectAll('rect.label,rect.text-rect,rect.handle').classed(
        'selected',
        d => {
          return d.isSelected;
        },
      );
    })
    .call(
      d3
        .drag()
        .on('start', dragLabel.start)
        .on('drag', dragLabel.drag)
        .on('end', dragLabel.end),
    );

  // Update text-label
  d3.selectAll('.text-label')
    .text(d => {
      return d.target.common_name;
    })
    .attr('x', d => {
      var offset = self.options.handleSize;
      if (d.y < 30) {
        offset = 10;
      }
      return d.x + offset;
    })
    .attr('y', d => {
      if (d.y < 30) {
        return d.y + d.height + 20;
      } else {
        return d.y - 9;
      }
    });
}; // updateLabels

LabelBox.prototype.makeAddLabel = function() {
  var self = this;

  start = function() {
    var m = self.mousePosition();
    label = {
      x: m.x,
      y: m.y,
      x0: m.x,
      y0: m.y,
      width: 1,
      height: 1,
      x_frac: m.x / self.width,
      y_frac: m.y / self.height,
      x0_frac: m.x / self.width,
      y0_frac: m.y / self.height,
      height_frac: 1 / self.height,
      width_frac: 1 / self.width,
      isActive: true,
      isSelected: false,
      target: self.context.target,
      target_id: self.context.target.id,
    };
    self.context.labels.push(label);
    self.updateLabels();
  };

  drag = function() {
    var dx = d3.event.dx;
    var dy = d3.event.dy;
    var x = d3.event.x;
    var y = d3.event.y;

    d3.selectAll('rect.label')
      .filter(d => {
        return d.isActive;
      })
      .each(d => {
        d.width = d.width + dx;
        d.height = d.height + dy;
        d.x = Math.min(x, d.x0);
        d.y = Math.min(y, d.y0);
        self.updateFractions(d);
      });
    self.updateLabels();
  };

  end = function() {
    d3.selectAll('rect.label').each(d => {
      d.isActive = false;
      d.width = Math.abs(d.width);
      d.height = Math.abs(d.height);
    });
    self.emit('createLabel', self.context.labels.slice(-1)[0]);
  };

  return {start: start, drag: drag, end: end};
};

LabelBox.prototype.makeHandleDrag = function() {
  var self = this;

  start = function(d) {
    d.isActive = true;
  };

  drag = function(d) {
    var dx = d3.event.dx;
    var dy = d3.event.dy;
    var x = d3.event.x;
    var y = d3.event.y;
    handleType = d3
      .select(this)
      .attr('class')
      .split(' ')[1];

    if (handleType == 'lowerRight') {
      if (d.width < self.options.handleSize && dx < 0) {
        d.width = self.options.handleSize;
      } else {
        d.width += dx;
      }
      if (d.height < self.options.handleSize && dy < 0) {
        d.height = self.options.handleSize;
      } else {
        d.height += dy;
      }
    } else {
      if (d.width <= self.options.handleSize && dx > 0) {
        d.width = self.options.handleSize;
      } else {
        d.x += dx;
        d.width -= dx;
      }
      if (d.height <= self.options.handleSize && dy > 0) {
        d.height = self.options.handleSize;
      } else {
        d.y += dy;
        d.height -= dy;
      }
    }
    // Update the relative measurements.
    d.width_frac = d.width / self.width;
    d.height_frac = d.height / self.height;
    d.x_frac = d.x / self.width;
    d.y_frac = d.y / self.height;
    self.updateLabels();
  };

  end = function(d) {
    d.isActive = false;
    self.emit('updateLabel', d);
  };

  return {start: start, drag: drag, end: end};
};

LabelBox.prototype.makeDragLabel = function() {
  var self = this;

  start = function(d) {
    d.isActive = true;
  };

  drag = function(d) {
    var dx = d3.event.dx;
    var dy = d3.event.dy;
    var x = d3.event.x;
    var y = d3.event.y;
    d.x += dx;
    d.y += dy;
    d.x_frac = d.x / self.width;
    d.y_frac = d.y / self.height;
    self.updateLabels();
  };

  end = function(d) {
    d.isActive = false;
    self.emit('updateLabel', d);
  };

  return {start: start, drag: drag, end: end};
};

LabelBox.prototype.updateTarget = function(currentTarget) {
  // Update all currently selected labels with the new target.
  d3.selectAll('rect.label')
    .filter(d => {
      return d.isSelected;
    })
    .each(d => {
      d.target = currentTarget;
      d.target_id = currentTarget.id;
      this.emit('updateLabel', d);
    });
  this.updateLabels();
};

LabelBox.prototype.updateFractions = function(d) {
  var self = this;
  d.x_frac = d.x / self.width;
  d.y_frac = d.y / self.height;
  d.x0_frac = d.x0 / self.width;
  d.y0_frac = d.y0 / self.height;
  d.width_frac = d.width / self.width;
  d.height_frac = d.height / self.height;
};

module.exports = LabelBox;
