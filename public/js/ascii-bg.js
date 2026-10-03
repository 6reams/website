(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var canvas = document.createElement("canvas");
  canvas.id = "ascii-bg";
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "position:fixed;inset:0;z-index:-1;width:100%;height:100%;" +
    "pointer-events:none;opacity:0.18;";
  document.body.prepend(canvas);

  var ctx = canvas.getContext("2d");
  var CHARS = " .,:;|+*?%S#@";
  var CELL = 14;
  var cols, rows;
  var t = 0;

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(window.innerWidth / (CELL * 0.6));
    rows = Math.ceil(window.innerHeight / CELL);
  }

  var fg =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim() || "#5eabd4";

  // simplex-style noise (fast 2D)
  var perm = new Uint8Array(512);
  (function seedPerm() {
    var p = new Uint8Array(256);
    for (var i = 0; i < 256; i++) p[i] = i;
    for (var i = 255; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = p[i]; p[i] = p[j]; p[j] = tmp;
    }
    for (var i = 0; i < 512; i++) perm[i] = p[i & 255];
  })();

  var grad2 = [
    [1,1],[-1,1],[1,-1],[-1,-1],
    [1,0],[-1,0],[0,1],[0,-1]
  ];

  function dot2(gi, x, y) {
    var g = grad2[gi % 8];
    return g[0] * x + g[1] * y;
  }

  function noise2(x, y) {
    var F2 = 0.5 * (Math.sqrt(3) - 1);
    var G2 = (3 - Math.sqrt(3)) / 6;
    var s = (x + y) * F2;
    var i = Math.floor(x + s);
    var j = Math.floor(y + s);
    var tt = (i + j) * G2;
    var X0 = i - tt;
    var Y0 = j - tt;
    var x0 = x - X0;
    var y0 = y - Y0;
    var i1, j1;
    if (x0 > y0) { i1 = 1; j1 = 0; }
    else { i1 = 0; j1 = 1; }
    var x1 = x0 - i1 + G2;
    var y1 = y0 - j1 + G2;
    var x2 = x0 - 1 + 2 * G2;
    var y2 = y0 - 1 + 2 * G2;
    var ii = i & 255;
    var jj = j & 255;
    var gi0 = perm[ii + perm[jj]];
    var gi1 = perm[ii + i1 + perm[jj + j1]];
    var gi2 = perm[ii + 1 + perm[jj + 1]];
    var n0, n1, n2;
    var t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 < 0) n0 = 0;
    else { t0 *= t0; n0 = t0 * t0 * dot2(gi0, x0, y0); }
    var t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 < 0) n1 = 0;
    else { t1 *= t1; n1 = t1 * t1 * dot2(gi1, x1, y1); }
    var t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 < 0) n2 = 0;
    else { t2 *= t2; n2 = t2 * t2 * dot2(gi2, x2, y2); }
    return 70 * (n0 + n1 + n2);
  }

  function fbm(x, y) {
    var v = 0;
    v += 0.5 * noise2(x, y);
    v += 0.25 * noise2(x * 2, y * 2);
    v += 0.125 * noise2(x * 4, y * 4);
    return v;
  }

  function render() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.font = CELL + "px 'JetBrains Mono Variable','Courier New',monospace";
    ctx.fillStyle = fg;
    ctx.textBaseline = "top";

    var scale = 0.03;
    var speed = t * 0.4;

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var nx = c * scale + speed;
        var ny = r * scale * 1.6;

        var v = fbm(nx, ny + speed * 0.3);
        v += 0.3 * Math.sin(c * 0.05 + t * 0.8) * Math.cos(r * 0.04 + t * 0.5);

        v = (v + 1) * 0.5;
        v = Math.max(0, Math.min(1, v));

        var ci = Math.floor(v * (CHARS.length - 1));
        var ch = CHARS[ci];
        if (ch === " ") continue;

        ctx.globalAlpha = 0.3 + v * 0.7;
        ctx.fillText(ch, c * CELL * 0.6, r * CELL);
      }
    }
    ctx.globalAlpha = 1;
  }

  var raf;
  function tick() {
    t += 0.008;
    render();
    raf = requestAnimationFrame(tick);
  }

  var obs = new IntersectionObserver(
    function (entries) {
      if (entries[0].isIntersecting) {
        if (!raf) tick();
      } else {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = null;
        }
      }
    },
    { threshold: 0 }
  );

  resize();
  window.addEventListener("resize", resize);
  obs.observe(canvas);
  tick();
})();
