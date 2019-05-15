var CanvasUtils = {
  resetCanvas: function (ctx, color) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  },
  drawPath: function (ctx, width, style, coords, opts) {
    opts = opts || {};

    ctx.strokeStyle = style;
    ctx.lineWidth = Math.max(Math.round(width), 1);
    ctx.lineCap = 'round';

    ctx.setLineDash(opts.dash || []);
    ctx.beginPath();
    ctx.moveTo(Math.round(coords[0][0]), Math.round(coords[0][1]));

    for (var i = 1; i < coords.length; i++) {
      ctx.lineTo(Math.round(coords[i][0]), Math.round(coords[i][1]));
    }
    ctx.stroke();
    if (opts.fill) {
      ctx.fillStyle = opts.fill;
      ctx.fill();
    }
  },
  drawFilledCircle: function (ctx, center, radius, lineWidth, stroke, fill) {
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.beginPath();
    ctx.arc(Math.round(center[0]), Math.round(center[1]), radius, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.fill();
  },
  drawArc: function (ctx, center, radius, from, to, lineWidth, stroke) {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = stroke;
    ctx.beginPath();
    ctx.arc(Math.round(center[0]), Math.round(center[1]), radius, from, to, false);
    ctx.stroke();
  }
};
