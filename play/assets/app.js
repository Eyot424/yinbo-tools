/* 隐波小玩法 共用脚本：种子、日期、图片兜底、Canvas 分享卡、保存提示。
   不发任何网络请求（除了读本站的 data/*.json 与图片），不写任何统计。 */
(function (global) {
  'use strict';

  var FONT = '-apple-system, "PingFang SC", "Noto Sans CJK SC", sans-serif';
  var WATERMARK = '隐波的 AI 量化笔记';
  var FOOTER_LINE = '娱乐，不是任何预测；回测不代表未来';
  var C = { cyan: '#D3ECF2', magenta: '#F6D9D5', text: '#2c2a36', dim: '#6b6878', bg0: '#F5F6F8', bg1: '#E2E3E8', yellow: '#FBEFC8', mint: '#DDF0DA', paper: '#ffffff', ink: '#2c2a36', redText: '#6B3FC4', line: '#E2E3E8' };
  // 16 型分 4 组 4 色：t 浅底、d 深色
  var THEMES = { zn: { t: '#E6DDF8', d: '#6B3FC4' }, zs: { t: '#DDF0DA', d: '#3E9A4F' }, dn: { t: '#D3ECF2', d: '#2A8BA3' }, ds: { t: '#FBEFC8', d: '#C2901A' } };
  function themeOf(code) { return THEMES[code.replace('-', '').slice(0, 2).toLowerCase()] || THEMES.zn; }

  /* ---------- 哈希、日期、种子 ---------- */

  // FNV-1a 32 位
  function fnv1a(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h >>> 0;
  }

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  // 本机时区的 YYYY-MM-DD
  function todayStr(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  function randomSeed() {
    var a = new Uint32Array(2);
    if (global.crypto && global.crypto.getRandomValues) {
      global.crypto.getRandomValues(a);
    } else {
      a[0] = Math.random() * 4294967296;
      a[1] = Math.random() * 4294967296;
    }
    return a[0].toString(36) + a[1].toString(36);
  }

  // 返回 {seed, persisted}。localStorage 不可用时每次随机，persisted=false。
  function getSeed() {
    try {
      var s = global.localStorage.getItem('playSeed');
      if (!s) {
        s = randomSeed();
        global.localStorage.setItem('playSeed', s);
      }
      return { seed: s, persisted: true };
    } catch (e) {
      return { seed: randomSeed(), persisted: false };
    }
  }

  function pickIndex(seed, dateStr, n) {
    return fnv1a(seed + dateStr) % n;
  }

  /* ---------- 加载 ---------- */

  function getJSON(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) { throw new Error(url + ' ' + r.status); }
      return r.json();
    });
  }

  // 加载失败（缺文件）返回 null，不抛错：页面和分享卡都退化成纯色块。
  function loadImage(src) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { resolve(null); };
      img.src = src;
    });
  }

  // 页面里的 <img> 加载失败就隐藏，露出父元素的渐变底。
  function installImgFallback() {
    function mark(img) { img.classList.add('img-failed'); }
    document.addEventListener('error', function (e) {
      if (e.target && e.target.tagName === 'IMG') { mark(e.target); }
    }, true);
    var imgs = document.getElementsByTagName('img');
    for (var i = 0; i < imgs.length; i++) {
      if (imgs[i].complete && imgs[i].naturalWidth === 0) { mark(imgs[i]); }
    }
  }

  /* ---------- Canvas 绘制 ---------- */

  function rr(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  function setFont(ctx, size, weight) {
    ctx.font = (weight || 400) + ' ' + size + 'px ' + FONT;
  }

  // 浅灰白底
  function drawBackdrop(ctx, W, H) {
    ctx.fillStyle = C.bg0;
    ctx.fillRect(0, 0, W, H);
  }

  // 白色圆角卡片 + 细边
  function drawSticker(ctx, x, y, w, h, r, fill) {
    ctx.fillStyle = fill || C.paper;
    rr(ctx, x, y, w, h, r);
    ctx.fill();
    ctx.strokeStyle = C.line;
    ctx.lineWidth = 2;
    rr(ctx, x, y, w, h, r);
    ctx.stroke();
  }

  // 插画铺满圆角框（cover 裁切）；没有图就画底色。bg 可指定主题色
  function drawArt(ctx, img, x, y, w, h, radius, bg) {
    ctx.save();
    rr(ctx, x, y, w, h, radius);
    ctx.clip();
    ctx.fillStyle = bg || '#E6DDF8';
    ctx.fillRect(x, y, w, h);
    if (img) {
      var s = Math.max(w / img.width, h / img.height);
      var dw = img.width * s, dh = img.height * s;
      ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
    }
    ctx.restore();
  }

  // 透明底人物：放在主题色块里，按框内完整显示（contain），底边对齐
  function drawFigure(ctx, img, x, y, w, h) {
    if (!img) { return; }
    var s = Math.min(w / img.width, h / img.height);
    var dw = img.width * s, dh = img.height * s;
    ctx.drawImage(img, x + (w - dw) / 2, y + h - dh, dw, dh);
  }

  // 逐字断行（中文为主）
  function wrapLines(ctx, text, maxW) {
    var lines = [], cur = '';
    for (var i = 0; i < text.length; i++) {
      var ch = text.charAt(i);
      if (ctx.measureText(cur + ch).width > maxW && cur) {
        lines.push(cur);
        cur = ch;
      } else {
        cur += ch;
      }
    }
    if (cur) { lines.push(cur); }
    return lines;
  }

  // 写一段文字，超出 maxLines 加省略号；返回下一行的 y
  function drawParagraph(ctx, text, x, y, maxW, lineH, maxLines, opt) {
    opt = opt || {};
    setFont(ctx, opt.size || 34, opt.weight);
    ctx.fillStyle = opt.color || C.text;
    ctx.textAlign = opt.align || 'left';
    ctx.textBaseline = 'alphabetic';
    var lines = wrapLines(ctx, text, maxW);
    if (maxLines && lines.length > maxLines) {
      lines = lines.slice(0, maxLines);
      lines[maxLines - 1] = lines[maxLines - 1].replace(/.$/, '…');
    }
    for (var i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], x, y + i * lineH);
    }
    return y + lines.length * lineH;
  }

  // 单行文字，太宽就缩字号
  function drawFit(ctx, text, x, y, maxW, size, minSize, weight, color, align) {
    while (size > minSize) {
      setFont(ctx, size, weight);
      if (ctx.measureText(text).width <= maxW) { break; }
      size -= 2;
    }
    setFont(ctx, size, weight);
    ctx.fillStyle = color;
    ctx.textAlign = align || 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(text, x, y);
    return size;
  }

  function drawChip(ctx, text, x, y, w, h, color) {
    drawSticker(ctx, x, y, w - 6, h - 6, h / 2, color || C.mint);
    drawFit(ctx, text, x + (w - 6) / 2, y + (h - 6) / 2 + 12, w - 36, 32, 22, 700, C.ink, 'center');
  }

  // 维度条：上方维度名，两端标签，较强一侧着主题色并带"明显/略偏"，两色进度条（无数字）。
  // side 为 'a' 或 'b'，frac 为较强一侧的长度比例（明显 0.8，略偏 0.6）。
  function drawBar(ctx, x, y, w, dim, d, side, strong, theme, sizes) {
    var z = sizes || {};
    var nameSize = z.name || 22, labSize = z.label || 32, barH = z.bar || 14;
    var frac = strong ? 0.8 : 0.6;
    drawFit(ctx, dim.split('').join(' '), x + w / 2, y, w, nameSize, 14, 700, '#8b8896', 'center');
    var ly = y + nameSize + labSize * 0.55;
    var on = side === 'a' ? d.a.label : d.b.label;
    var tail = strong ? '明显' : '略偏';
    function lab(txt, xx, al, isOn) {
      setFont(ctx, labSize, isOn ? 800 : 600);
      ctx.fillStyle = isOn ? theme.d : '#9a97a5';
      ctx.textAlign = al; ctx.textBaseline = 'alphabetic';
      ctx.fillText(txt, xx, ly);
      if (isOn) {
        var tw = ctx.measureText(txt).width;
        setFont(ctx, Math.round(labSize * 0.58), 600);
        ctx.fillText(tail, al === 'left' ? xx + tw + 10 : xx - tw - 10, ly);
      }
    }
    // 较强一侧的标签在右端时，"明显"写在标签左边，需要右对齐
    if (side === 'a') {
      lab(d.a.label, x, 'left', true);
      setFont(ctx, labSize, 600); ctx.fillStyle = '#9a97a5'; ctx.textAlign = 'right'; ctx.fillText(d.b.label, x + w, ly);
    } else {
      lab(d.b.label, x + w, 'right', true);
      setFont(ctx, labSize, 600); ctx.fillStyle = '#9a97a5'; ctx.textAlign = 'left'; ctx.fillText(d.a.label, x, ly);
    }
    var by = ly + 14;
    ctx.fillStyle = C.line;
    rr(ctx, x, by, w, barH, barH / 2); ctx.fill();
    ctx.fillStyle = theme.d;
    var fw = w * frac;
    rr(ctx, side === 'a' ? x : x + w - fw, by, fw, barH, barH / 2); ctx.fill();
    return by + barH;
  }

  // 底部：免责小字 + 账号名水印（卡上只有账号名，无网址、无二维码）
  function drawFooter(ctx, W, H) {
    drawFit(ctx, FOOTER_LINE, W / 2, H - 92, W - 120, 26, 20, 400, C.dim, 'center');
    drawFit(ctx, WATERMARK, W / 2, H - 48, W - 120, 34, 24, 800, C.ink, 'center');
  }

  /* ---------- 分享卡面板 ---------- */

  // render(kind) -> Promise<canvas>，kind 为 '34'(1080×1440) 或 '11'(1080×1080)
  function canvasToUrl(canvas) {
    return new Promise(function (resolve, reject) {
      try {
        if (canvas.toBlob) {
          canvas.toBlob(function (blob) {
            if (!blob) { reject(new Error('toBlob empty')); return; }
            resolve({ url: URL.createObjectURL(blob), blob: true });
          }, 'image/png');
        } else {
          resolve({ url: canvas.toDataURL('image/png'), blob: false });
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  function mountShare(mount, render, filename) {
    var cur = null, lastUrl = null, token = 0;
    mount.innerHTML = '';
    var tabs = document.createElement('div');
    tabs.className = 'share-tabs';
    var kinds = [['34', '3:4（小红书）'], ['11', '1:1（X）']];
    var btns = {};
    kinds.forEach(function (k) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = k[1];
      b.onclick = function () { show(k[0]); };
      tabs.appendChild(b);
      btns[k[0]] = b;
    });
    var out = document.createElement('div');
    out.className = 'share-out';
    mount.appendChild(tabs);
    mount.appendChild(out);

    function fail(msg) {
      out.innerHTML = '';
      var p = document.createElement('p');
      p.className = 'share-err';
      p.textContent = msg || '分享卡生成失败了。请直接对本页截屏保存。';
      out.appendChild(p);
    }

    function show(kind) {
      cur = kind;
      var my = ++token;
      for (var k in btns) { btns[k].className = (k === kind ? 'on' : ''); }
      out.innerHTML = '<p class="muted">正在生成……</p>';
      var ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
      ready.then(function () { return render(kind); })
        .then(canvasToUrl)
        .then(function (res) {
          if (my !== token) { return; }
          if (lastUrl && lastUrl.blob) { URL.revokeObjectURL(lastUrl.url); }
          lastUrl = res;
          out.innerHTML = '';
          var img = document.createElement('img');
          img.alt = '分享卡，长按图片保存';
          img.src = res.url;
          out.appendChild(img);
          var hint = document.createElement('p');
          hint.className = 'share-hint';
          hint.textContent = '长按图片，选“存储图像”或“保存图片”。电脑上可点下面的下载。';
          out.appendChild(hint);
          var a = document.createElement('a');
          a.className = 'btn btn-ghost';
          a.textContent = '下载这张图';
          a.href = res.url;
          a.download = filename + '-' + (kind === '34' ? '3x4' : '1x1') + '.png';
          var row = document.createElement('div');
          row.className = 'btn-row';
          row.appendChild(a);
          out.appendChild(row);
        })
        .catch(function () { if (my === token) { fail(); } });
    }
    show('34');
  }

  global.Play = {
    C: C, FONT: FONT, WATERMARK: WATERMARK, FOOTER_LINE: FOOTER_LINE,
    fnv1a: fnv1a, todayStr: todayStr, getSeed: getSeed, pickIndex: pickIndex,
    getJSON: getJSON, loadImage: loadImage, installImgFallback: installImgFallback,
    rr: rr, setFont: setFont, drawBackdrop: drawBackdrop, drawArt: drawArt, drawFigure: drawFigure, drawBar: drawBar, themeOf: themeOf, THEMES: THEMES,
    wrapLines: wrapLines, drawParagraph: drawParagraph, drawFit: drawFit,
    drawChip: drawChip, drawSticker: drawSticker, drawFooter: drawFooter, mountShare: mountShare
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installImgFallback);
  } else {
    installImgFallback();
  }
})(window);
