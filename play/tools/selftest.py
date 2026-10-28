#!/usr/bin/env python3
"""最小自测：python3 apps/play/tools/selftest.py
校验 data/test.json 与 data/deck.json 的字段、数量，并扫页面里的外部引用与禁用字样。"""
import json
import re
import sys
from pathlib import Path

PLAY = Path(__file__).resolve().parents[1]
SCENES = {"itchy", "stop", "watch", "journal", "rest", "crowd", "chart", "calm"}
TYPES = ["zn-g", "zn-f", "zs-g", "zs-f", "dn-g", "dn-f", "ds-g", "ds-f"]
DECK_FIELDS = ["id", "name", "itch", "do", "dont", "saying", "verdict", "soup", "scene", "episode"]
BANNED = ["MBTI", "SBTI", "GBTI"]
ALLOWED_URLS = ("https://x.com/yinbonotes", "https://www.youtube.com/@yinbonotes", "https://eyot424.github.io/yinbo-tools/play/", "https://x.com/yinbonotes/status/")
errors = []


def check(cond, msg):
    if not cond:
        errors.append(msg)


def test_json():
    t = json.loads((PLAY / "data/test.json").read_text(encoding="utf-8"))
    dims = {d["id"]: d for d in t["dimensions"]}
    check(list(dims) == ["d1", "d2", "d3", "d4"], "维度应为 d1–d4")
    for d in dims.values():
        for end in ("a", "b"):
            check(all(d[end].get(k) for k in ("key", "label", "gloss")), f"{d['id']}.{end} 字段不全")
    qs = t["questions"]
    check(len(qs) == 12, f"题目应为 12 道，实际 {len(qs)}")
    for d in dims:
        n = sum(q["dim"] == d for q in qs)
        check(n == 3, f"维度 {d} 应有 3 题，实际 {n}")
    for q in qs:
        check(all(q.get(k) for k in ("id", "dim", "text", "a", "b", "aMeans")), f"第 {q.get('id')} 题字段不全")
        check(q["dim"] in dims and q["aMeans"] == dims[q["dim"]]["a"]["label"], f"第 {q['id']} 题 aMeans 与维度 A 端不符")
    check(sorted(t["types"]) == sorted(TYPES), f"8 型不全：{sorted(t['types'])}")
    # 编码要能由 d1–d3 的 key 拼出来
    codes = {
        a1["key"] + a2["key"] + "-" + a3["key"]
        for a1 in (dims["d1"]["a"], dims["d1"]["b"])
        for a2 in (dims["d2"]["a"], dims["d2"]["b"])
        for a3 in (dims["d3"]["a"], dims["d3"]["b"])
    }
    check(codes == set(TYPES), f"由维度 key 拼出的编码与 8 型不一致：{sorted(codes)}")
    for code, ty in t["types"].items():
        for k in ("code", "chips", "nickname", "tagline", "habits", "episode"):
            check(ty.get(k), f"{code}.{k} 缺失")
        check(ty["code"] == code, f"{code}.code 不一致")
        check(len(ty["habits"]) == 3, f"{code} 习惯描述应为 3 行")
        ep = ty["episode"]
        check(all(ep.get(k) for k in ("no", "title", "fit")), f"{code}.episode 字段不全")
        check(ep.get("url", "") == "" or ep["url"].startswith("https://x.com/yinbonotes/status/"), f"{code} 链接形态不对")
    check(set(t["modifiers"]) == {"watch", "zen"}, "修饰应为 watch 与 zen")
    for k, m in t["modifiers"].items():
        for f in ("suffix", "name", "tagline", "second"):
            check(m.get(f), f"modifier {k}.{f} 缺失")
        check(m["second"].get("no") and m["second"].get("title"), f"modifier {k}.second 不全")
    return t


def deck_json():
    deck = json.loads((PLAY / "data/deck.json").read_text(encoding="utf-8"))
    check(len(deck) == 36, f"deck 应为 36 张，实际 {len(deck)}")
    ids = [c.get("id") for c in deck]
    check(len(set(ids)) == len(ids), "deck 编号有重复")
    for c in deck:
        check(list(c) == DECK_FIELDS, f"{c.get('id')} 字段/顺序不对：{list(c)}")
        check(c["scene"] in SCENES, f"{c['id']} scene 不在 8 个场景内：{c['scene']}")
        check(isinstance(c["itch"], int) and 1 <= c["itch"] <= 5, f"{c['id']} itch 非 1–5 整数")
        check(all(str(c[k]).strip() for k in DECK_FIELDS), f"{c['id']} 有空字段")
    return deck


def pages():
    files = [PLAY / "index.html", PLAY / "test/index.html", PLAY / "card/index.html", PLAY / "assets/app.js", PLAY / "assets/style.css"]
    for f in files:
        s = f.read_text(encoding="utf-8")
        for w in BANNED:
            check(w not in s, f"{f.name} 含禁用字样 {w}")
        for url in re.findall(r"https?://[^\s\"')<>]+", s):
            check(url.startswith(ALLOWED_URLS), f"{f.relative_to(PLAY)} 含未放行的外部地址 {url}")
        if f.suffix == ".html":
            for src in re.findall(r'(?:src|href)="([^"]+)"', s):
                check(not src.startswith("/"), f"{f.relative_to(PLAY)} 用了根路径 {src}")


def main():
    test_json()
    deck_json()
    pages()
    if errors:
        print("自测失败：")
        for e in errors:
            print(" -", e)
        sys.exit(1)
    print("自测通过：12 题（每维度 3 题）、8 型、2 种修饰、36 张卡、scene 均在 8 个之内，页面无外部引用与禁用字样")


if __name__ == "__main__":
    main()
