(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var canvas = document.createElement("canvas");
  canvas.id = "ascii-bg";
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "position:fixed;inset:0;z-index:-1;width:100%;height:100%;" +
    "pointer-events:none;opacity:0.35;";
  document.body.prepend(canvas);

  var ctx = canvas.getContext("2d");
  var CHARS = ".,:;i1tfLCG08@";
  var FONT_SIZE = 10;
  var cols, rows, cellW, cellH;
  var t = 0;
  var w, h;

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cellW = FONT_SIZE * 0.6;
    cellH = FONT_SIZE * 1.1;
    cols = Math.ceil(w / cellW);
    rows = Math.ceil(h / cellH);
  }

  // permutation table
  var perm = new Uint8Array(512);
  (function () {
    var p = new Uint8Array(256);
    for (var i = 0; i < 256; i++) p[i] = i;
    for (var i = 255; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = p[i]; p[i] = p[j]; p[j] = tmp;
    }
    for (var i = 0; i < 512; i++) perm[i] = p[i & 255];
  })();

  var grad2 = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];

  function noise2(x, y) {
    var F2 = 0.3660254037844386;
    var G2 = 0.21132486540518713;
    var s = (x + y) * F2;
    var i = Math.floor(x + s);
    var j = Math.floor(y + s);
    var tt = (i + j) * G2;
    var x0 = x - (i - tt);
    var y0 = y - (j - tt);
    var i1 = x0 > y0 ? 1 : 0;
    var j1 = x0 > y0 ? 0 : 1;
    var x1 = x0 - i1 + G2;
    var y1 = y0 - j1 + G2;
    var x2 = x0 - 1 + 2 * G2;
    var y2 = y0 - 1 + 2 * G2;
    var ii = i & 255;
    var jj = j & 255;
    var g0 = grad2[perm[ii + perm[jj]] % 8];
    var g1 = grad2[perm[ii + i1 + perm[jj + j1]] % 8];
    var g2 = grad2[perm[ii + 1 + perm[jj + 1]] % 8];
    var n0 = 0, n1 = 0, n2 = 0;
    var t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 > 0) { t0 *= t0; n0 = t0 * t0 * (g0[0] * x0 + g0[1] * y0); }
    var t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 > 0) { t1 *= t1; n1 = t1 * t1 * (g1[0] * x1 + g1[1] * y1); }
    var t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 > 0) { t2 *= t2; n2 = t2 * t2 * (g2[0] * x2 + g2[1] * y2); }
    return 70 * (n0 + n1 + n2);
  }

  function fbm(x, y) {
    return 0.5 * noise2(x, y) +
           0.25 * noise2(x * 2.0, y * 2.0) +
           0.125 * noise2(x * 4.0, y * 4.0) +
           0.0625 * noise2(x * 8.0, y * 8.0);
  }

  // organic blobs that drift
  var blobs = [];
  for (var b = 0; b < 10; b++) {
    blobs.push({
      x: Math.random(),
      y: Math.random(),
      r: 0.18 + Math.random() * 0.3,
      sx: (Math.random() - 0.5) * 0.03,
      sy: (Math.random() - 0.5) * 0.02,
      phase: Math.random() * Math.PI * 2
    });
  }

  function render() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    ctx.font = FONT_SIZE + "px 'JetBrains Mono Variable','Courier New',monospace";
    ctx.textBaseline = "top";

    var noiseScale = 0.025;
    var speed = t * 0.3;

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var u = c / cols;
        var v = r / rows;

        // base noise field
        var n = fbm(c * noiseScale + speed * 0.5, r * noiseScale * 1.4 + speed * 0.2);
        n = (n + 1) * 0.5;

        // add blob influences
        var blobVal = 0;
        for (var b = 0; b < blobs.length; b++) {
          var bl = blobs[b];
          var bx = bl.x + Math.sin(t * 0.5 + bl.phase) * 0.15;
          var by = bl.y + Math.cos(t * 0.4 + bl.phase * 1.3) * 0.12;
          var dx = u - bx;
          var dy = v - by;
          var d = Math.sqrt(dx * dx + dy * dy);
          var influence = Math.max(0, 1 - d / bl.r);
          influence = influence * influence * influence;
          blobVal += influence;
        }
        blobVal = Math.min(1, blobVal);

        // combine noise with blobs
        var brightness = n * 0.35 + blobVal * 0.75;

        // add fine detail
        brightness += 0.12 * noise2(c * 0.08 + speed, r * 0.08);

        // ensure minimum brightness so every cell has a character
        brightness = Math.max(0.05, Math.min(1, brightness));

        var ci = Math.floor(brightness * (CHARS.length - 1));
        var ch = CHARS[ci];

        var alpha = (0.1 + brightness * 0.55).toFixed(2);
        ctx.fillStyle = "rgba(200,210,220," + alpha + ")";
        ctx.fillText(ch, c * cellW, r * cellH);
      }
    }
  }

  var raf = null;
  function tick() {
    t += 0.005;
    // slowly drift blobs
    for (var b = 0; b < blobs.length; b++) {
      blobs[b].x += blobs[b].sx * 0.01;
      blobs[b].y += blobs[b].sy * 0.01;
      if (blobs[b].x < -0.2) blobs[b].x = 1.2;
      if (blobs[b].x > 1.2) blobs[b].x = -0.2;
      if (blobs[b].y < -0.2) blobs[b].y = 1.2;
      if (blobs[b].y > 1.2) blobs[b].y = -0.2;
    }
    render();
    raf = requestAnimationFrame(tick);
  }

  var obs = new IntersectionObserver(
    function (entries) {
      if (entries[0].isIntersecting) {
        if (!raf) tick();
      } else {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
      }
    },
    { threshold: 0 }
  );

  resize();
  window.addEventListener("resize", resize);
  obs.observe(canvas);
  tick();
})();
