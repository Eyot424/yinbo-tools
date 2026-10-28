#!/usr/bin/env python3
# <swiftbar.title>美股数据日倒计时</swiftbar.title>
# <swiftbar.version>1.0</swiftbar.version>
# <swiftbar.author>Yinbo</swiftbar.author>
# <swiftbar.desc>CPI、FOMC、非农、零售销售的倒计时与历史统计（隐波的 AI 量化笔记）。历史统计不代表未来，非建议。</swiftbar.desc>
# <swiftbar.hideAbout>true</swiftbar.hideAbout>
# <swiftbar.hideRunInTerminal>true</swiftbar.hideRunInTerminal>
# <swiftbar.hideLastUpdated>true</swiftbar.hideLastUpdated>
# <swiftbar.hideDisablePlugin>true</swiftbar.hideDisablePlugin>
# <swiftbar.hideSwiftBar>true</swiftbar.hideSwiftBar>
#
# MIT。只用标准库。内置数据由 python -m pipeline.dataday ics 生成，勿手改标记之间的内容。
import json
import urllib.request
from datetime import datetime, timedelta, timezone

# 留空则只用内置数据；填公开的 dataday.json 链接则联网时用最新版，联网失败仍用内置数据。
DATA_URL = "https://raw.githubusercontent.com/Eyot424/yinbo-tools/main/dataday.json"

# <<< DATADAY-DATA
FALLBACK = json.loads(r"""[
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
]""")
# >>> DATADAY-DATA

SGT = timezone(timedelta(hours=8))
SHORT = {"CPI": "CPI", "FOMC": "FOMC", "NFP": "非农", "RETAIL": "零售"}
WEEKDAY = "一二三四五六日"


def load_data():
    if DATA_URL:
        try:
            with urllib.request.urlopen(DATA_URL, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            if isinstance(data, list) and data:
                return data
        except Exception:
            pass  # 联网失败：用内置数据
    return FALLBACK


def release(item):
    return datetime.strptime(item["release_sgt"], "%Y-%m-%d %H:%M").replace(tzinfo=SGT)


def stats_line(item):
    s = item["stats"]
    return "样本 {} 次 · 涨跌幅 {} 对 {} · 上涨 {} 对 {}".format(
        s["samples"], s["move"], s["normal_move"], s["up"], s["normal_up"]
    )


def main():
    now = datetime.now(SGT)
    future = sorted((d for d in load_data() if release(d) > now), key=lambda d: (release(d), d["event_key"]))
    if future:
        nxt = future[0]
        days = (release(nxt).date() - now.date()).days
        print("{} {}".format(SHORT.get(nxt["event_key"], nxt["event"]), "今天" if days == 0 else "D-{}".format(days)))
    else:
        print("数据日 日历待更新")
    print("---")
    for item in future[:5]:
        r = release(item)
        print("{} 周{} {}（新加坡）  {}".format(r.strftime("%m-%d"), WEEKDAY[r.weekday()], r.strftime("%H:%M"), item["event"]))
        print(stats_line(item) + " | size=11 color=gray")
    if not future:
        print("日历待更新")
    print("---")
    print("数据：隐波的 AI 量化笔记 · 历史统计不代表未来 | color=gray")


if __name__ == "__main__":
    main()
