#!/usr/bin/env python3
"""把 content/cards/deck-v1.md 的大表转成 apps/play/data/deck.json。

用法（在工作区根目录）：
    python3 apps/play/tools/deck_md_to_json.py
    python3 apps/play/tools/deck_md_to_json.py --src 其它.md --out 其它.json

场景映射：按"画面提示"里的关键词，从上到下第一条命中的规则胜出，
都不命中就用 calm。要改映射，只改下面的 SCENE_RULES。
场景名固定 8 个：itchy stop watch journal rest crowd chart calm。
"""
import argparse
import json
import re
import sys
from pathlib import Path

SCENES = ["itchy", "stop", "watch", "journal", "rest", "crowd", "chart", "calm"]

# (场景, 关键词列表)；顺序即优先级。
SCENE_RULES = [
    ("rest", ["合上", "懒腰", "夕阳", "溜出门", "下班"]),
    ("crowd", ["人山人海", "人群", "挤", "排队", "小吃摊", "广场"]),
    ("stop", ["警戒线", "止损", "保安", "安全带", "护膝", "护具", "拽住"]),
    ("journal", ["账本", "记账", "日记", "日志", "纸条", "算盘", "信封"]),
    ("itchy", ["鼠标", "手指", "按钮", "发抖", "手机", "购物车", "秒表"]),
    ("watch", ["屏幕", "多屏", "显示器", "黑眼圈"]),
    ("calm", ["茶", "沙发", "窗外", "草地", "打瞌睡"]),
    ("chart", ["K线", "白板", "曲线", "粉笔", "画一条", "水晶球", "放大镜", "细线", "形态"]),
]

ROOT = Path(__file__).resolve().parents[3]
FIELDS = {
    "编号": "id", "运势名": "name", "手痒指数": "itch", "宜": "do", "忌": "dont",
    "今日老话": "saying", "回测一句": "verdict", "毒鸡汤": "soup",
    "画面提示": "scene", "对应集": "episode",
}


def map_scene(hint: str) -> str:
    for scene, words in SCENE_RULES:
        if any(w in hint for w in words):
            return scene
    return "calm"


def parse_itch(text: str, card_id: str) -> int:
    n = text.count("★")
    if not 1 <= n <= 5:
        sys.exit(f"{card_id}: 手痒指数解析不出 1–5 颗星：{text!r}")
    return n


def split_row(line: str) -> list:
    return [c.strip() for c in line.strip().strip("|").split("|")]


def read_table(md: str) -> list:
    lines = md.splitlines()
    for i, line in enumerate(lines):
        if line.startswith("|") and "编号" in line and "运势名" in line:
            header = split_row(line)
            break
    else:
        sys.exit("找不到含「编号」「运势名」的表头")
    missing = [h for h in FIELDS if h not in header]
    if missing:
        sys.exit(f"表头缺列：{missing}")
    col = {FIELDS[h]: header.index(h) for h in FIELDS}
    rows = []
    for line in lines[i + 2:]:  # 跳过分隔行
        if not line.startswith("|"):
            break
        cells = split_row(line)
        if len(cells) != len(header):
            sys.exit(f"列数不对（{len(cells)} != {len(header)}）：{line[:40]}")
        rows.append({k: cells[v] for k, v in col.items()})
    return rows


def convert(md: str) -> list:
    cards = []
    for r in read_table(md):
        cards.append({
            "id": r["id"],
            "name": r["name"],
            "itch": parse_itch(r["itch"], r["id"]),
            "do": r["do"],
            "dont": r["dont"],
            "saying": r["saying"],
            "verdict": r["verdict"],
            "soup": r["soup"],
            "scene": map_scene(r["scene"]),
            "episode": r["episode"],
        })
    return cards


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", default=str(ROOT / "content/cards/deck-v1.md"))
    ap.add_argument("--out", default=str(ROOT / "apps/play/data/deck.json"))
    a = ap.parse_args()
    cards = convert(Path(a.src).read_text(encoding="utf-8"))
    ids = [c["id"] for c in cards]
    if len(set(ids)) != len(ids):
        sys.exit("编号有重复")
    Path(a.out).write_text(json.dumps(cards, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    dist = {s: sum(c["scene"] == s for c in cards) for s in SCENES}
    print(f"{len(cards)} 张 -> {a.out}")
    print("场景分布：" + "，".join(f"{k} {v}" for k, v in dist.items()))


if __name__ == "__main__":
    main()
