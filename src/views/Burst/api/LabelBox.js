// Handle label box drawing for CLEVERGIRL.

function LabelBox(context, options) {
  d3.select('#' + options.canvasId).remove(); // get rid of any existing canvas
  var self = this;
  this.options = options;
  this.context = context;
  let imageSize = this.imageSize();
  this.height = imageSize.height;
  this.width = imageSize.width;
  this.createSVG();
  this.updateLabels();
}

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
  onLabelAdd = d3
    .select('#canvas')
    .selectAll('rect.label')
    .data(self.context.labels)
    .enter();

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

  onLabelAdd.append('text').attr('class', 'text-label');

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
        .text(d.targetName)
        .attr('class', 'text-label-secret secret')
        .attr('opacity', 0);
      var textWidth = d3
        .select('.secret')
        .node()
        .getBoundingClientRect().width;
      secretText.remove(); // remove the secret text
      return Math.max(
        textWidth + 30,
        Math.max(Math.abs(d.width)+1 - self.options.handleSize / 2, 0),
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

  d3.select('body').on('keydown', function() {
    d3.selectAll('text,label,rect')
      .filter(d => {
        return d.isSelected;
      })
      .each(d => {
        var idx = self.context.labels.indexOf(d);
        if (idx > -1) {
          self.context.labels.splice(idx, 1);
        }
      })
      .remove();
  });

  // text-label
  d3.selectAll('rect.label,text.text-label,rect.text-rect')
    .on('click', d => {
      d3.event.preventDefault();
      d3.event.stopPropagation();
      d.isSelected = !d.isSelected;
      d3.selectAll('rect.label,rect.text-rect,rect.handle').classed('selected', d => {
        return d.isSelected;
      });
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
      return d.targetName;
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
    })
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
      isActive: true,
      isSelected: false,
      targetName: 'White Tailed Deer',
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
      });
    self.updateLabels();
  };

  end = function() {
    d3.selectAll('rect.label').each(d => {
      d.isActive = false;
      d.width = Math.abs(d.width);
      d.height = Math.abs(d.height);
    });
    // Trigger Vue update of labels.
    self.context.labels.push({});
    self.context.labels.pop();
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
    self.updateLabels();
  };

  end = function(d) {
    d.isActive = false;
    // Trigger Vue update of labels.
    self.context.labels.push({});
    self.context.labels.pop();
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
    self.updateLabels();
  };

  end = function(d) {
    d.isActive = false;
    // Trigger Vue update of labels.
    self.context.labels.push({});
    self.context.labels.pop();
  };

  return {start: start, drag: drag, end: end};
};

module.exports = LabelBox;
