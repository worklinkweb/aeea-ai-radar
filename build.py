#!/usr/bin/env python3
"""Build the single-file presentation.

  python3 build.py                      -> dist/index.html (standalone) + dist/artifact.html (for claude.ai Artifact)
  RADAR_URL=https://... python3 build.py -> also embeds a real QR code pointing to RADAR_URL
"""
import os, io, html
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / 'src'
DIST = ROOT / 'dist'
DIST.mkdir(exist_ok=True)

DATA_ORDER = ['policySources.js', 'courseSources.js', 'courseSnapshot.js', 'prompts.js', 'speakerNotes.js', 'slides.js']

radar_url = os.environ.get('RADAR_URL', '').strip()
qr_js = ''
if radar_url:
    import qrcode, qrcode.image.svg
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, border=2)
    qr.add_data(radar_url)
    qr.make(fit=True)
    img = qr.make_image(image_factory=qrcode.image.svg.SvgPathImage)
    buf = io.BytesIO(); img.save(buf)
    svg = buf.getvalue().decode('utf-8')
    svg = svg[svg.index('<svg'):]
    # PNG copy for QA decoding
    qr.make_image(fill_color='black', back_color='white').save(DIST / 'qr.png')
    qr_js = f"window.DECK.QR_SVG = {svg!r};\nwindow.DECK.RADAR_URL = {radar_url!r};\n"

css = (SRC / 'styles.css').read_text(encoding='utf-8')
data = '\n'.join((SRC / 'data' / f).read_text(encoding='utf-8') for f in DATA_ORDER)
app = (SRC / 'radar.js').read_text(encoding='utf-8') + '\n' + (SRC / 'app.js').read_text(encoding='utf-8')

head = """<title>AEEA AI 學習雷達</title>
<meta name="description" content="AEEA AI 最新應用趨勢 × AI 學習雷達｜互動式 Web Presentation（Lynn Lin，2026/09/28）">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800&family=Noto+Sans+TC:wght@300;400;500;700;800;900&display=swap">
"""
body = f"""<style>
{css}
</style>
<div id="app"></div>
<script>
{data}
{qr_js}
</script>
<script>
{app}
</script>
"""

(DIST / 'artifact.html').write_text(head + body, encoding='utf-8')

# GitHub Pages build: QR Code is generated at runtime from the page's own URL (+#radar)
if os.environ.get('PAGES'):
    lib = (ROOT / 'vendor' / 'qrcode-generator-1.4.4.js').read_text(encoding='utf-8')
    pages_body = body.replace('<div id="app"></div>', '<div id="app"></div>\n<script>\n' + lib + '\nwindow.DECK = window.DECK || {}; window.DECK.QR_RUNTIME = true;\n</script>', 1)
    (ROOT / 'index.html').write_text(
        '<!doctype html>\n<html lang="zh-Hant">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        + head + '</head>\n<body>\n' + pages_body + '</body>\n</html>\n', encoding='utf-8')
    print('built index.html for GitHub Pages')
(DIST / 'index.html').write_text(
    '<!doctype html>\n<html lang="zh-Hant">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    + head + '</head>\n<body>\n' + body + '</body>\n</html>\n', encoding='utf-8')
print('built', (DIST / 'index.html').stat().st_size, 'bytes', 'QR' if radar_url else 'no QR')
