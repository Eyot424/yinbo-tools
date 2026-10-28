// 美股数据日倒计时 · Scriptable 小组件（隐波的 AI 量化笔记）
// 小号：下一个数据日与 D-N；中号：加公布时间与历史统计一行。
// 数据：官方日程 + 本号回测统计。历史统计不代表未来，非建议。MIT。
// 内置数据由 python -m pipeline.dataday ics 生成，勿手改标记之间的内容。

// 留空则只用内置数据；填公开的 dataday.json 链接则联网时用最新版，联网失败仍用内置数据。
const DATA_URL = "https://raw.githubusercontent.com/Eyot424/yinbo-tools/main/dataday.json";

// <<< DATADAY-DATA
const FALLBACK = [
  {"date": "2026-10-28", "event_key": "FOMC", "event": "FOMC利率决议", "release_sgt": "2026-10-29 02:00", "stats": {"period": "2012–2026", "samples": 117, "move": "0.77%", "normal_move": "0.66%", "up": "49.57%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": "0.76R", "delay_after": "0.37R"}},
  {"date": "2026-11-05", "event_key": "NFP", "event": "非农就业报告", "release_sgt": "2026-11-06 21:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.84%", "normal_move": "0.66%", "up": "57.95%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}},
  {"date": "2026-11-09", "event_key": "CPI", "event": "CPI通胀数据", "release_sgt": "2026-11-10 21:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.73%", "normal_move": "0.66%", "up": "59.66%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": "0.21R", "delay_after": "-0.08R"}},
  {"date": "2026-11-16", "event_key": "RETAIL", "event": "零售销售数据", "release_sgt": "2026-11-17 21:30", "stats": {"period": "2012–2026", "samples": 178, "move": "0.68%", "normal_move": "0.66%", "up": "50.56%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}},
  {"date": "2026-12-03", "event_key": "NFP", "event": "非农就业报告", "release_sgt": "2026-12-04 21:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.84%", "normal_move": "0.66%", "up": "57.95%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}},
  {"date": "2026-12-09", "event_key": "FOMC", "event": "FOMC利率决议", "release_sgt": "2026-12-10 03:00", "stats": {"period": "2012–2026", "samples": 117, "move": "0.77%", "normal_move": "0.66%", "up": "49.57%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": "0.76R", "delay_after": "0.37R"}},
  {"date": "2026-12-09", "event_key": "CPI", "event": "CPI通胀数据", "release_sgt": "2026-12-10 21:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.73%", "normal_move": "0.66%", "up": "59.66%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": "0.21R", "delay_after": "-0.08R"}},
  {"date": "2026-12-15", "event_key": "RETAIL", "event": "零售销售数据", "release_sgt": "2026-12-16 21:30", "stats": {"period": "2012–2026", "samples": 178, "move": "0.68%", "normal_move": "0.66%", "up": "50.56%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}},
  {"date": "2027-01-07", "event_key": "NFP", "event": "非农就业报告", "release_sgt": "2027-01-08 21:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.84%", "normal_move": "0.66%", "up": "57.95%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}},
  {"date": "2027-01-12", "event_key": "CPI", "event": "CPI通胀数据", "release_sgt": "2027-01-13 21:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.73%", "normal_move": "0.66%", "up": "59.66%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": "0.21R", "delay_after": "-0.08R"}},
  {"date": "2027-01-14", "event_key": "RETAIL", "event": "零售销售数据", "release_sgt": "2027-01-15 21:30", "stats": {"period": "2012–2026", "samples": 178, "move": "0.68%", "normal_move": "0.66%", "up": "50.56%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}},
  {"date": "2027-01-27", "event_key": "FOMC", "event": "FOMC利率决议", "release_sgt": "2027-01-28 03:00", "stats": {"period": "2012–2026", "samples": 117, "move": "0.77%", "normal_move": "0.66%", "up": "49.57%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": "0.76R", "delay_after": "0.37R"}},
  {"date": "2027-02-04", "event_key": "NFP", "event": "非农就业报告", "release_sgt": "2027-02-05 21:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.84%", "normal_move": "0.66%", "up": "57.95%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}},
  {"date": "2027-02-10", "event_key": "CPI", "event": "CPI通胀数据", "release_sgt": "2027-02-11 21:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.73%", "normal_move": "0.66%", "up": "59.66%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": "0.21R", "delay_after": "-0.08R"}},
  {"date": "2027-02-16", "event_key": "RETAIL", "event": "零售销售数据", "release_sgt": "2027-02-17 21:30", "stats": {"period": "2012–2026", "samples": 178, "move": "0.68%", "normal_move": "0.66%", "up": "50.56%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}},
  {"date": "2027-03-04", "event_key": "NFP", "event": "非农就业报告", "release_sgt": "2027-03-05 21:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.84%", "normal_move": "0.66%", "up": "57.95%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}},
  {"date": "2027-03-09", "event_key": "CPI", "event": "CPI通胀数据", "release_sgt": "2027-03-10 21:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.73%", "normal_move": "0.66%", "up": "59.66%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": "0.21R", "delay_after": "-0.08R"}},
  {"date": "2027-03-16", "event_key": "RETAIL", "event": "零售销售数据", "release_sgt": "2027-03-16 20:30", "stats": {"period": "2012–2026", "samples": 178, "move": "0.68%", "normal_move": "0.66%", "up": "50.56%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}},
  {"date": "2027-03-17", "event_key": "FOMC", "event": "FOMC利率决议", "release_sgt": "2027-03-18 02:00", "stats": {"period": "2012–2026", "samples": 117, "move": "0.77%", "normal_move": "0.66%", "up": "49.57%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": "0.76R", "delay_after": "0.37R"}},
  {"date": "2027-04-02", "event_key": "NFP", "event": "非农就业报告", "release_sgt": "2027-04-02 20:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.84%", "normal_move": "0.66%", "up": "57.95%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}},
  {"date": "2027-04-13", "event_key": "CPI", "event": "CPI通胀数据", "release_sgt": "2027-04-13 20:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.73%", "normal_move": "0.66%", "up": "59.66%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": "0.21R", "delay_after": "-0.08R"}},
  {"date": "2027-04-16", "event_key": "RETAIL", "event": "零售销售数据", "release_sgt": "2027-04-16 20:30", "stats": {"period": "2012–2026", "samples": 178, "move": "0.68%", "normal_move": "0.66%", "up": "50.56%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}},
  {"date": "2027-04-28", "event_key": "FOMC", "event": "FOMC利率决议", "release_sgt": "2027-04-29 02:00", "stats": {"period": "2012–2026", "samples": 117, "move": "0.77%", "normal_move": "0.66%", "up": "49.57%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": "0.76R", "delay_after": "0.37R"}},
  {"date": "2027-05-07", "event_key": "NFP", "event": "非农就业报告", "release_sgt": "2027-05-07 20:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.84%", "normal_move": "0.66%", "up": "57.95%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}},
  {"date": "2027-05-12", "event_key": "CPI", "event": "CPI通胀数据", "release_sgt": "2027-05-12 20:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.73%", "normal_move": "0.66%", "up": "59.66%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": "0.21R", "delay_after": "-0.08R"}},
  {"date": "2027-05-14", "event_key": "RETAIL", "event": "零售销售数据", "release_sgt": "2027-05-14 20:30", "stats": {"period": "2012–2026", "samples": 178, "move": "0.68%", "normal_move": "0.66%", "up": "50.56%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}},
  {"date": "2027-06-04", "event_key": "NFP", "event": "非农就业报告", "release_sgt": "2027-06-04 20:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.84%", "normal_move": "0.66%", "up": "57.95%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}},
  {"date": "2027-06-09", "event_key": "FOMC", "event": "FOMC利率决议", "release_sgt": "2027-06-10 02:00", "stats": {"period": "2012–2026", "samples": 117, "move": "0.77%", "normal_move": "0.66%", "up": "49.57%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": "0.76R", "delay_after": "0.37R"}},
  {"date": "2027-06-10", "event_key": "CPI", "event": "CPI通胀数据", "release_sgt": "2027-06-10 20:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.73%", "normal_move": "0.66%", "up": "59.66%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": "0.21R", "delay_after": "-0.08R"}},
  {"date": "2027-06-16", "event_key": "RETAIL", "event": "零售销售数据", "release_sgt": "2027-06-16 20:30", "stats": {"period": "2012–2026", "samples": 178, "move": "0.68%", "normal_move": "0.66%", "up": "50.56%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}},
  {"date": "2027-07-02", "event_key": "NFP", "event": "非农就业报告", "release_sgt": "2027-07-02 20:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.84%", "normal_move": "0.66%", "up": "57.95%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}},
  {"date": "2027-07-14", "event_key": "CPI", "event": "CPI通胀数据", "release_sgt": "2027-07-14 20:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.73%", "normal_move": "0.66%", "up": "59.66%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": "0.21R", "delay_after": "-0.08R"}},
  {"date": "2027-07-16", "event_key": "RETAIL", "event": "零售销售数据", "release_sgt": "2027-07-16 20:30", "stats": {"period": "2012–2026", "samples": 178, "move": "0.68%", "normal_move": "0.66%", "up": "50.56%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}},
  {"date": "2027-07-28", "event_key": "FOMC", "event": "FOMC利率决议", "release_sgt": "2027-07-29 02:00", "stats": {"period": "2012–2026", "samples": 117, "move": "0.77%", "normal_move": "0.66%", "up": "49.57%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": "0.76R", "delay_after": "0.37R"}},
  {"date": "2027-08-06", "event_key": "NFP", "event": "非农就业报告", "release_sgt": "2027-08-06 20:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.84%", "normal_move": "0.66%", "up": "57.95%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}},
  {"date": "2027-08-11", "event_key": "CPI", "event": "CPI通胀数据", "release_sgt": "2027-08-11 20:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.73%", "normal_move": "0.66%", "up": "59.66%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": "0.21R", "delay_after": "-0.08R"}},
  {"date": "2027-08-16", "event_key": "RETAIL", "event": "零售销售数据", "release_sgt": "2027-08-16 20:30", "stats": {"period": "2012–2026", "samples": 178, "move": "0.68%", "normal_move": "0.66%", "up": "50.56%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}},
  {"date": "2027-09-03", "event_key": "NFP", "event": "非农就业报告", "release_sgt": "2027-09-03 20:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.84%", "normal_move": "0.66%", "up": "57.95%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}},
  {"date": "2027-09-14", "event_key": "CPI", "event": "CPI通胀数据", "release_sgt": "2027-09-14 20:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.73%", "normal_move": "0.66%", "up": "59.66%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": "0.21R", "delay_after": "-0.08R"}},
  {"date": "2027-09-15", "event_key": "FOMC", "event": "FOMC利率决议", "release_sgt": "2027-09-16 02:00", "stats": {"period": "2012–2026", "samples": 117, "move": "0.77%", "normal_move": "0.66%", "up": "49.57%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": "0.76R", "delay_after": "0.37R"}},
  {"date": "2027-09-16", "event_key": "RETAIL", "event": "零售销售数据", "release_sgt": "2027-09-16 20:30", "stats": {"period": "2012–2026", "samples": 178, "move": "0.68%", "normal_move": "0.66%", "up": "50.56%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}},
  {"date": "2027-10-08", "event_key": "NFP", "event": "非农就业报告", "release_sgt": "2027-10-08 20:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.84%", "normal_move": "0.66%", "up": "57.95%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}},
  {"date": "2027-10-14", "event_key": "CPI", "event": "CPI通胀数据", "release_sgt": "2027-10-14 20:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.73%", "normal_move": "0.66%", "up": "59.66%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": "0.21R", "delay_after": "-0.08R"}},
  {"date": "2027-10-15", "event_key": "RETAIL", "event": "零售销售数据", "release_sgt": "2027-10-15 20:30", "stats": {"period": "2012–2026", "samples": 178, "move": "0.68%", "normal_move": "0.66%", "up": "50.56%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}},
  {"date": "2027-10-27", "event_key": "FOMC", "event": "FOMC利率决议", "release_sgt": "2027-10-28 02:00", "stats": {"period": "2012–2026", "samples": 117, "move": "0.77%", "normal_move": "0.66%", "up": "49.57%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": "0.76R", "delay_after": "0.37R"}},
  {"date": "2027-11-05", "event_key": "NFP", "event": "非农就业报告", "release_sgt": "2027-11-05 20:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.84%", "normal_move": "0.66%", "up": "57.95%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}},
  {"date": "2027-11-09", "event_key": "CPI", "event": "CPI通胀数据", "release_sgt": "2027-11-10 21:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.73%", "normal_move": "0.66%", "up": "59.66%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": "0.21R", "delay_after": "-0.08R"}},
  {"date": "2027-11-15", "event_key": "RETAIL", "event": "零售销售数据", "release_sgt": "2027-11-16 21:30", "stats": {"period": "2012–2026", "samples": 178, "move": "0.68%", "normal_move": "0.66%", "up": "50.56%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}},
  {"date": "2027-12-02", "event_key": "NFP", "event": "非农就业报告", "release_sgt": "2027-12-03 21:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.84%", "normal_move": "0.66%", "up": "57.95%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}},
  {"date": "2027-12-08", "event_key": "FOMC", "event": "FOMC利率决议", "release_sgt": "2027-12-09 03:00", "stats": {"period": "2012–2026", "samples": 117, "move": "0.77%", "normal_move": "0.66%", "up": "49.57%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": "0.76R", "delay_after": "0.37R"}},
  {"date": "2027-12-09", "event_key": "CPI", "event": "CPI通胀数据", "release_sgt": "2027-12-10 21:30", "stats": {"period": "2012–2026", "samples": 176, "move": "0.73%", "normal_move": "0.66%", "up": "59.66%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": "0.21R", "delay_after": "-0.08R"}},
  {"date": "2027-12-14", "event_key": "RETAIL", "event": "零售销售数据", "release_sgt": "2027-12-15 21:30", "stats": {"period": "2012–2026", "samples": 178, "move": "0.68%", "normal_move": "0.66%", "up": "50.56%", "normal_up": "54.98%", "normal_samples": 2501, "delay_before": null, "delay_after": null}}
];
// >>> DATADAY-DATA

const SGT_MS = 8 * 3600 * 1000;

// release_sgt 是新加坡时间 "YYYY-MM-DD HH:MM"
function releaseMs(item) {
  const m = item.release_sgt.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/);
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) - SGT_MS;
}

function sgtDay(ms) {
  return Math.floor((ms + SGT_MS) / 86400000);
}

function daysUntil(item, nowMs) {
  return sgtDay(releaseMs(item)) - sgtDay(nowMs);
}

function upcoming(data, nowMs) {
  return data
    .filter((d) => releaseMs(d) > nowMs)
    .sort((a, b) => releaseMs(a) - releaseMs(b) || a.event_key.localeCompare(b.event_key));
}

async function loadData() {
  if (DATA_URL) {
    try {
      const req = new Request(DATA_URL);
      req.timeoutInterval = 10;
      const data = await req.loadJSON();
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (e) {
      // 联网失败：用内置数据
    }
  }
  return FALLBACK;
}

function whenText(item) {
  return item.release_sgt.slice(5) + " 新加坡时间";
}

function statsLine(item) {
  const s = item.stats;
  return "样本 " + s.samples + " 次 · 涨跌幅 " + s.move + " 对 " + s.normal_move + " · 上涨 " + s.up + " 对 " + s.normal_up;
}

function addText(w, text, size, color, bold) {
  const t = w.addText(text);
  t.font = bold ? Font.boldSystemFont(size) : Font.systemFont(size);
  t.textColor = new Color(color);
  return t;
}

function buildWidget(data, family) {
  const w = new ListWidget();
  w.backgroundColor = new Color("#14181f");
  w.setPadding(14, 16, 14, 16);
  const now = Date.now();
  const next = upcoming(data, now)[0];

  if (!next) {
    addText(w, "日历待更新", 18, "#ffffff", true);
    w.addSpacer();
    addText(w, "历史统计不代表未来", 10, "#8a93a3", false);
    return w;
  }

  const n = daysUntil(next, now);
  const count = n === 0 ? "今天" : "D-" + n;
  const medium = family !== "small";

  addText(w, "下一个 " + next.event, medium ? 15 : 14, "#c9d1de", false);
  addText(w, count, medium ? 34 : 40, "#ffffff", true);
  if (medium) {
    addText(w, whenText(next), 12, "#c9d1de", false);
    w.addSpacer(4);
    addText(w, statsLine(next), 11, "#8a93a3", false);
  }
  w.addSpacer();
  addText(w, "历史统计不代表未来 · 隐波的 AI 量化笔记", 9, "#6b7380", false);
  return w;
}

const data = await loadData();
const family = config.widgetFamily || "medium";
const widget = buildWidget(data, family);
if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  await widget.presentMedium();
}
Script.complete();
