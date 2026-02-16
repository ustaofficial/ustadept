from __future__ import annotations

import base64
from pathlib import Path
from typing import Tuple, Optional

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
LOGOS_DIR = ROOT / "logos"
OUT_USTADEPT = ROOT / "branding" / "ustadept"
OUT_FOUNDATION = ROOT / "branding" / "foundation"
OUT_TOKEN = ROOT / "branding" / "token"

THRESH = 18  # bg difference threshold


def _bg_color(img: Image.Image) -> Tuple[int, int, int]:
    w, h = img.size
    corners = [
        img.getpixel((0, 0)),
        img.getpixel((w - 1, 0)),
        img.getpixel((0, h - 1)),
        img.getpixel((w - 1, h - 1)),
    ]
    return max(set(corners), key=corners.count)


def _mask_non_bg(img_rgb: Image.Image, bg: Tuple[int, int, int]) -> Image.Image:
    w, h = img_rgb.size
    mask = Image.new("L", (w, h), 0)
    px = img_rgb.load()
    mp = mask.load()
    br, bgc, bb = bg
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            if abs(r - br) + abs(g - bgc) + abs(b - bb) > THRESH:
                mp[x, y] = 255
    return mask


def _bbox_from_mask(mask: Image.Image) -> Optional[Tuple[int, int, int, int]]:
    return mask.getbbox()


def _icon_bbox(img_rgb: Image.Image, mask: Image.Image, full_bbox: Tuple[int, int, int, int]) -> Tuple[int, int, int, int]:
    # Separate icon (top cluster) from wordmark (lower clusters) by row density.
    x0, y0, x1, y1 = full_bbox
    cropped_mask = mask.crop((x0, y0, x1, y1))
    w, h = cropped_mask.size
    rows = [0] * h
    mpx = cropped_mask.load()

    for y in range(h):
        s = 0
        for x in range(w):
            if mpx[x, y]:
                s += 1
        rows[y] = s

    runs = []
    in_run = False
    start = 0
    for y in range(h):
        if rows[y] > 0 and not in_run:
            in_run = True
            start = y
        if (rows[y] == 0 or y == h - 1) and in_run:
            end = y if rows[y] == 0 else y + 1
            runs.append((start, end))
            in_run = False

    if len(runs) >= 2:
        iy0, iy1 = runs[0]
        pad = 6
        iy0 = max(0, iy0 - pad)
        iy1 = min(h, iy1 + pad)
        return (x0, y0 + iy0, x1, y0 + iy1)

    return full_bbox


def _square_icon(img_rgba: Image.Image, size: int) -> Image.Image:
    w, h = img_rgba.size
    scale = min(size / w, size / h)
    nw, nh = max(1, int(w * scale)), max(1, int(h * scale))
    resized = img_rgba.resize((nw, nh), Image.LANCZOS)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ox = (size - nw) // 2
    oy = (size - nh) // 2
    out.paste(resized, (ox, oy), resized)
    return out


def _write_svg_with_embedded_png(png_bytes: bytes, out_path: Path, size: int = 32) -> None:
    b64 = base64.b64encode(png_bytes).decode("ascii")
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 {size} {size}">
  <image width="{size}" height="{size}" href="data:image/png;base64,{b64}"/>
</svg>
"""
    out_path.write_text(svg, encoding="utf-8")


def process_png(png_path: Path) -> None:
    stem = png_path.stem
    group = "foundation" if "foundation" in stem.lower() else "ustadept"
    out_dir = OUT_FOUNDATION if group == "foundation" else OUT_USTADEPT
    out_dir.mkdir(parents=True, exist_ok=True)

    img = Image.open(png_path).convert("RGB")
    bg = _bg_color(img)
    mask = _mask_non_bg(img, bg)
    bbox = _bbox_from_mask(mask)
    if not bbox:
        print(f"[skip] no content detected: {png_path.name}")
        return

    icon_bbox = _icon_bbox(img, mask, bbox)

    icon_rgb = img.crop(icon_bbox)
    icon_mask = _mask_non_bg(icon_rgb, bg).convert("L")
    icon_rgba = icon_rgb.convert("RGBA")
    icon_rgba.putalpha(icon_mask)

    # icon 64 png
    icon64 = _square_icon(icon_rgba, 64)
    out_png64 = out_dir / f"{stem}_64.png"
    icon64.save(out_png64, "PNG")

    # icon 32 svg (embedded png)
    icon32 = _square_icon(icon_rgba, 32)
    from io import BytesIO
    buf = BytesIO()
    icon32.save(buf, "PNG")
    out_svg32 = out_dir / f"{stem}_32.svg"
    _write_svg_with_embedded_png(buf.getvalue(), out_svg32, 32)

    # keep original full
    out_full = out_dir / f"{stem}_full.png"
    if not out_full.exists():
        out_full.write_bytes(png_path.read_bytes())

    print(f"[ok] {png_path.name} -> {out_png64.name}, {out_svg32.name} (+ full)")


def build_token_icons() -> None:
    # Token icon should use the "official" (red/blue) set. Prefer _2.
    preferred = LOGOS_DIR / "ustadept_official_2.png"
    src = preferred if preferred.exists() else None
    if not src:
        cands = sorted(LOGOS_DIR.glob("ustadept_official_*.png"))
        src = cands[0] if cands else None
    if not src:
        print("[warn] no ustadept_official_*.png found for token icon")
        return

    OUT_TOKEN.mkdir(parents=True, exist_ok=True)

    img = Image.open(src).convert("RGB")
    bg = _bg_color(img)
    mask = _mask_non_bg(img, bg)
    bbox = _bbox_from_mask(mask)
    if not bbox:
        print(f"[warn] token icon: no content detected: {src.name}")
        return

    icon_bbox = _icon_bbox(img, mask, bbox)
    icon_rgb = img.crop(icon_bbox)
    icon_mask = _mask_non_bg(icon_rgb, bg).convert("L")
    icon_rgba = icon_rgb.convert("RGBA")
    icon_rgba.putalpha(icon_mask)

    icon64 = _square_icon(icon_rgba, 64)
    (OUT_TOKEN / "usta_64.png").write_bytes(b"")  # ensure path exists on some systems
    icon64.save(OUT_TOKEN / "usta_64.png", "PNG")

    icon32 = _square_icon(icon_rgba, 32)
    from io import BytesIO
    buf = BytesIO()
    icon32.save(buf, "PNG")
    _write_svg_with_embedded_png(buf.getvalue(), OUT_TOKEN / "usta_32.svg", 32)

    print(f"[ok] token icons -> usta_64.png, usta_32.svg (source: {src.name})")


def main() -> None:
    if not LOGOS_DIR.exists():
        raise SystemExit(f"logos folder not found: {LOGOS_DIR}")

    pngs = sorted(LOGOS_DIR.glob("*.png"))
    if not pngs:
        raise SystemExit(f"no .png found under: {LOGOS_DIR}")

    for p in pngs:
        process_png(p)

    build_token_icons()


if __name__ == "__main__":
    main()
