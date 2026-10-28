# 隐波小玩法（apps/play）

静态站，无后端、无统计、无外部字体与 CDN。两个模块：交易习惯图鉴（`test/`）与每日抽卡（`card/`）。契约见 `plans/02-小玩法站.md` 第四节。所有资源都是相对路径，放在 `https://eyot424.github.io/yinbo-tools/play/` 子路径下也能用。

## 本地预览

在工作区根目录：

```bash
python3 -m http.server 8765 --directory apps/play
```

打开 `http://localhost:8765/`。不要直接双击 html 打开：页面要用 `fetch` 读 `data/*.json`，`file://` 下会被浏览器拦住。

## 更新题库与卡组

- 题目、8 型文案、对口集与链接：直接改 `data/test.json`。某一集发出后，把它的 X 链接填进对应型的 `episode.url`（取自 `content/publish-log.csv`）；链接为空串时页面显示"即将发布"。
- 抽卡：先改 `content/cards/deck-v1.md` 的大表，再在工作区根目录转换（不要手改 `data/deck.json`）：

  ```bash
  python3 apps/play/tools/deck_md_to_json.py
  ```

  `画面提示` 到 8 个场景名的映射规则在脚本顶部的 `SCENE_RULES`；映射不到的用 `calm`。
- 每次改完跑自测：

  ```bash
  python3 apps/play/tools/selftest.py
  ```

  它检查 12 题每维度 3 题、8 型齐全、36 张卡、`scene` 都在 8 个之内，并扫页面里有没有外部引用与 MBTI/SBTI/GBTI 字样。

## 插画与二维码

不在本目录的代码里生成：`assets/types/<code>.png`（8 张）、`assets/scenes/<name>.png`（8 张）、`assets/card-back.png`、`assets/qr-xhs.png`、`assets/qr-x.png` 由别处提供。缺图时页面和分享卡自动退化成纯色渐变块，不会报错。

## 部署到 yinbo-tools

公开仓库 `Eyot424/yinbo-tools`，GitHub Pages 从 `main` 根目录发布，本站放在其 `play/` 目录：

1. 把 `apps/play/` 的内容（`tools/` 与 `README.md` 可以不带）复制到 `yinbo-tools/play/`，保持目录结构。
2. 在 yinbo-tools 里提交并推送；Pages 开启后地址是 `https://eyot424.github.io/yinbo-tools/play/`。
3. 推送后用手机打开一次：答完 12 题能出结果、能长按保存分享卡；抽卡当天固定。

## 行为说明

- 抽卡：`seed = localStorage.playSeed`（没有就随机生成并存）；`index = FNV-1a(seed + 'YYYY-MM-DD') % 36`，日期取本机时区。同一设备同一天固定，次日换。localStorage 不可用时每次随机，并在页面上提示。
- 习惯图鉴：每维度 3 题，选 A 的个数 ≥2 记 A 端，3:0"明显"，2:1"略偏"；第 4 维度只决定后缀（盯盘版 / 佛系版）、一句话和第二推荐。答案只在内存，不写任何存储。
- 分享卡：Canvas 画 1080×1440 与 1080×1080，导出成 `<img>` 供长按保存；失败时提示截屏。卡上只有账号名水印，无网址、无二维码。
- `og:image` 用了绝对地址（`https://eyot424.github.io/yinbo-tools/play/assets/card-back.png`），因为链接预览要求绝对地址；它只是元数据，页面本身不加载任何外部资源。
