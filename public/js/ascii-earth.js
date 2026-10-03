(function () {
  var el = document.getElementById("ascii-earth");
  if (!el) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var W = 44;
  var H = 22;
  var R = 0.95;
  var CHARS = " .,:;+*#@";
  var accentColor =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim() || "#5eabd4";
  var mutedColor =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--muted")
      .trim() || "#8a97a8";

  var MAP_H = 36;
  var MAP_W = 72;
  var earthData = decode(
    "000000000000000000000000000000000000000000000000000000000000000000000000" +
    "000000000000000000000000000001111100000000000000000000000000000000000000" +
    "000000000000000000000011100011111110000000000000000011100000000000000000" +
    "000000000000000000001111110011111111000000000000001111110000000000000000" +
    "000000000000001111111111111111111111100000000000011111111100000000000000" +
    "000000000001111111111111111111111111110000000001111111111110000000000000" +
    "000000000011111111111111111111111111111000000011111111111111100000000000" +
    "000000000111111111111111111111111111111100001111111111111111110000000000" +
    "000000001111111111111111111111111111111100011111111111111111111000000000" +
    "000000001111111111111111111111111111111110111111111111111111111000000000" +
    "000000011111111111111111111111111111111111111111111111111111111100000000" +
    "000001111111111111111111111111111111111111111111111111111111111100000000" +
    "000011111111111111111111111111111111111111111111111111111111111110000000" +
    "000011111111111111111111111111111111111111111111111111111111111100000000" +
    "000011111111111111111011111111111111111111111111111111111111111100000000" +
    "000001111111111111100001111111111111111111111111111011111111111000000000" +
    "000001111111111110000001111111111111111111111111100001111111110000000000" +
    "000000111111111100000001111111111111111111111110000000111111100000000000" +
    "000000011111111000000000111111111101111111111100000000011111000000000000" +
    "000000001111100000000000011111110000111111111000000000001110000000000000" +
    "000000000111000000000000001111100000011111110000000000000100000000000000" +
    "000000000010000000000000000111000000001111100000000000000000000000000000" +
    "000000000000000000000000000010000000000111100000000000000000000000000000" +
    "000000000000000000000000000000000000000011110000000000000000000000000000" +
    "000000000000000000000000000000000000000001110000000000000000000000000000" +
    "000000000000000000000000000000000000000000110000000000000000000000000000" +
    "000000000000000000000000000000000000000000010000000000000000000000000000" +
    "000000000000000000000000000000000000000000000000000000000000000000000000" +
    "000000000000000000000000000000000000000000011100000000000000000000000000" +
    "000000000000000000000000000000000000000001111100000000000000000000000000" +
    "000000000000000000000000000000000000000011111110000000000000000000000000" +
    "000000000000000000000000000000000000000111111111000000000000000000000000" +
    "000000000000000000000000000000000000001111111111100000000000000000000000" +
    "000000000000000000000000000000000000001111111111100000000000000000000000" +
    "000000000000000000000000000000000000000111111111000000000000000000000000" +
    "000000000000000000000000000000000000000001111100000000000000000000000000"
  );

  function decode(s) {
    var arr = [];
    for (var i = 0; i < s.length; i++) arr.push(s.charCodeAt(i) - 48);
    return arr;
  }

  function isLand(lat, lon) {
    var y = Math.floor(((Math.PI / 2 - lat) / Math.PI) * MAP_H);
    var x = Math.floor(((lon + Math.PI) / (2 * Math.PI)) * MAP_W);
    var row = Math.max(0, Math.min(MAP_H - 1, y));
    var col = ((x % MAP_W) + MAP_W) % MAP_W;
    return earthData[row * MAP_W + col] === 1;
  }

  var angle = 0;
  var raf = null;
  var out = document.createElement("pre");
  out.setAttribute("aria-hidden", "true");
  out.style.cssText =
    "font-family:var(--font-mono),'Courier New',monospace;font-size:15px;line-height:1.1;" +
    "letter-spacing:0.08em;margin:0;white-space:pre;overflow:hidden;" +
    "user-select:none;pointer-events:none;";
  el.appendChild(out);

  function render() {
    var cosA = Math.cos(angle);
    var sinA = Math.sin(angle);
    var tilt = 0.4;
    var cosT = Math.cos(tilt);
    var sinT = Math.sin(tilt);

    var lightDir = [0.6, -0.4, -0.8];
    var lLen = Math.sqrt(lightDir[0] * lightDir[0] + lightDir[1] * lightDir[1] + lightDir[2] * lightDir[2]);
    lightDir[0] /= lLen;
    lightDir[1] /= lLen;
    lightDir[2] /= lLen;

    var lines = [];
    for (var j = 0; j < H; j++) {
      var row = "";
      for (var i = 0; i < W; i++) {
        var sx = (i - W / 2 + 0.5) / (W / 2);
        var sy = (j - H / 2 + 0.5) / (H / 2);
        sy *= 1.8;

        var r2 = sx * sx + sy * sy;

        if (r2 > R * R) {
          row += " ";
          continue;
        }

        var sz = Math.sqrt(R * R - r2);

        var nx = sx / R;
        var ny = sy / R;
        var nz = sz / R;

        var rx = nx * cosA + nz * sinA;
        var ry = ny;
        var rz = -nx * sinA + nz * cosA;

        var tx = rx;
        var ty = ry * cosT - rz * sinT;
        var tz = ry * sinT + rz * cosT;

        var lat = Math.asin(Math.max(-1, Math.min(1, ty)));
        var lon = Math.atan2(tx, tz);

        var dot = nx * lightDir[0] + ny * lightDir[1] + nz * lightDir[2];
        var lum = Math.max(0.08, (dot + 1) / 2);

        var land = isLand(lat, lon);
        var ci;
        if (land) {
          ci = Math.min(CHARS.length - 1, Math.floor(lum * CHARS.length * 0.9 + 2));
          ci = Math.max(3, ci);
        } else {
          ci = Math.min(3, Math.floor(lum * 3.5));
          ci = Math.max(0, ci);
        }
        var ch = CHARS[ci];

        if (ch === " ") {
          row += " ";
        } else {
          var color = land ? accentColor : mutedColor;
          var opacity = land ? (0.5 + lum * 0.5).toFixed(2) : (0.15 + lum * 0.25).toFixed(2);
          row += '<span style="color:' + color + ";opacity:" + opacity + '">' + ch + "</span>";
        }
      }
      lines.push(row);
    }
    out.innerHTML = lines.join("\n");
  }

  function tick() {
    angle += 0.006;
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
    { threshold: 0.1 }
  );
  obs.observe(el);

  render();
  tick();
})();
