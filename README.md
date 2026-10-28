# 美股数据日：日历订阅与倒计时小组件

CPI、FOMC、非农就业、零售销售四类美国数据的公布时间，做成三样东西：日历订阅、iOS 小组件（Scriptable）、Mac 菜单栏插件（SwiftBar）。每个数据日附该类事件的历史统计（SPY，2012–2026）。作者：隐波的 AI 量化笔记。MIT 协议。

时间一律是新加坡时间（UTC+8）。美国夏令时的切换已换算进去（2027 年为 3 月 14 日起、11 月 7 日止）。

## 1. 日历订阅

1. 复制订阅链接：`https://raw.githubusercontent.com/Eyot424/yinbo-tools/main/dataday.ics`。
2. iOS：设置，日历，账户，添加账户，其他，添加已订阅的日历，粘贴链接。
3. Mac：日历 App，文件，新建日历订阅，粘贴链接。
4. 安卓（Google 日历）：网页版 calendar.google.com，左侧“其他日历”旁的加号，选“通过网址添加”，粘贴链接。

每个事件提前 1 小时提醒，备注里写样本次数、当天涨跌幅（绝对值）均值与上涨占比，各自对比普通日。

## 2. iOS 小组件（Scriptable）

1. 在 App Store 装 Scriptable。
2. 打开 Scriptable，右上角加号新建脚本，把 `scriptable/DataDay.js` 的全部内容粘进去，命名为 DataDay。
3. 回到主屏幕，长按空白处，左上角加号，选 Scriptable，选小号或中号，添加后长按小组件，选 Edit Widget，Script 选 DataDay。

小号显示“下一个事件”与 D-N；中号再加公布时间与一行统计。没有未来事件时显示“日历待更新”。数据已内置，不联网也能用；脚本顶部的 `DATA_URL` 已指向本仓库的 `dataday.json`，有网时自动拿最新日历；想完全离线就把它改成空字符串。

## 3. Mac 菜单栏（SwiftBar）

1. 装 SwiftBar（`brew install --cask swiftbar` 或其官网下载），首次启动时选一个插件目录。
2. 把 `swiftbar/dataday.1h.py` 复制进该目录，并确保可执行：`chmod +x dataday.1h.py`（文件名里的 `1h` 表示每小时刷新）。
3. 菜单栏显示“事件 D-N”，点开列出未来 5 个数据日、新加坡时间和统计一行。需要系统自带的 `python3`，不用装任何库。

脚本里的 `DATA_URL` 同样已指向本仓库的 `dataday.json`；想完全离线就改成空字符串。

## 数据从哪来

- 日程：美联储 FOMC 日历 https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm；BLS 的 CPI 与非农日程 https://www.bls.gov/schedule/news_release/cpi.htm 、https://www.bls.gov/schedule/news_release/empsit.htm ；Census 经济指标日历 https://www.census.gov/economic-indicators/calendar-listview.html 。官方日程会改，以官方页面为准。
- 覆盖范围：2026 年 10 月 17 日起的已公布日程；2027 年的美联储、BLS（CPI、非农）、Census（零售销售）日程已全部包含。2028 年日程公布后更新。
- 统计：本号对 SPY 的日线回测，期间 2012–2026。“涨跌幅”是日涨跌幅取绝对值后的均值；“普通日”是期内不属于核心事件日的交易日。CPI 与 FOMC 另附一句回测中“事件前推迟入场”的每笔 R 变化。
- 数据由工作区的 `python -m pipeline.dataday ics` 一次生成：`dataday.ics`、`dataday.json`，以及两个脚本里标记之间的内置数据。

`dataday.json` 是数组，每项：`date`（发帖日）、`event_key`、`event`、`release_sgt`（新加坡时间）、`stats`。

## 免责声明

历史统计不代表未来，非投资建议。本项目只含公开日程与回测统计，不含行情数据，不给任何标的的买卖时点、价位或方向判断。官方日程可能调整，使用前请以官方页面为准。

## 协议

MIT，见 `LICENSE`。

## 小玩法（play/）

交易习惯图鉴（12 题、8 种习惯型）与每日抽卡（一天一张）。纯静态、无登录、不存任何数据。地址：https://eyot424.github.io/yinbo-tools/play/ 。娱乐，不是任何预测；回测不代表未来；插画由 AI 生成。
