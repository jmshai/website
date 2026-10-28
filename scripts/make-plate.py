#!/usr/bin/env python3
"""Turn a scan of an engraving into a transparent image whose opacity follows the ink.

The site colors it with CSS (mask-image), so one file works in both themes.

Usage:
  python3 scripts/make-plate.py SCAN.jpg public/plate.webp
  python3 scripts/make-plate.py SCAN.jpg public/plate.webp --crop 120,80,1480,1990 --width 1100

Options:
  --crop L,T,R,B   crop in source pixels first (removes borders, captions, plate marks)
  --width N        output width in pixels (default 1100)
  --black P        percent of tonal range treated as solid ink (default 18)
  --white P        percent of tonal range treated as bare paper (default 78)

Raise --white if fine lines disappear; lower --white to clean up a blotchy or yellowed scan.
Requires Pillow: pip3 install pillow
"""
import argparse
import os
from PIL import Image, ImageOps

ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument("src")
ap.add_argument("dst", help="output path ending in .webp or .png")
ap.add_argument("--crop")
ap.add_argument("--width", type=int, default=1100)
ap.add_argument("--black", type=float, default=18)
ap.add_argument("--white", type=float, default=78)
a = ap.parse_args()

Image.MAX_IMAGE_PIXELS = None
im = Image.open(a.src).convert("L")
if a.crop:
    l, t, r, b = (int(v) for v in a.crop.split(","))
    im = im.crop((l, t, r, b))
if im.width > a.width:
    im = im.resize((a.width, round(im.height * a.width / im.width)), Image.LANCZOS)

im = ImageOps.autocontrast(im, cutoff=1)
lo, hi = round(255 * a.black / 100), round(255 * a.white / 100)
ramp = [0 if v <= lo else 255 if v >= hi else round((v - lo) * 255 / (hi - lo)) for v in range(256)]
alpha = im.point([255 - v for v in ramp])

out = Image.new("RGBA", im.size, (255, 255, 255, 0))
out.putalpha(alpha)
if a.dst.lower().endswith(".webp"):
    out.save(a.dst, "WEBP", quality=88, method=6)
else:
    out.save(a.dst, optimize=True)

print(f"wrote {a.dst}  {out.width}x{out.height}")
rel = a.dst.split("public/")[-1] if "public/" in a.dst else os.path.basename(a.dst)
print(f'use in src/pages/index.astro:  <Plate src="/{rel}" ratio="{out.width} / {out.height}" label="..." />')
