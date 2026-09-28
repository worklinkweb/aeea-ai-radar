#!/usr/bin/env python3
"""Build the presentation.

  python3 build.py

Outputs
  index.html          學員版（GitHub Pages 根目錄）：無講者模式、無講者備註
  tr/index.html       講師版（/tr/）：含講者模式與備註
  st/index.html       舊網址轉址 → 學員版
  student/index.html  舊網址轉址 → 學員版
  dist/artifact.html  claude.ai Artifact 版（講師版內容）
  dist/index.html     離線單檔（講師版內容）

QR Code 一律指向學員版的 #radar（RADAR_URL 可覆寫）。需要 `pip install qrcode`。
"""
import os, io
from pathlib import Path
import qrcode, qrcode.image.svg

ROOT = Path(__file__).parent
SRC = ROOT / 'src'
DIST = ROOT / 'dist'
DIST.mkdir(exist_ok=True)

STUDENT_URL = os.environ.get('STUDENT_URL', 'https://worklinkweb.github.io/aeea-ai-radar/')
RADAR_URL = os.environ.get('RADAR_URL', STUDENT_URL + '#radar')

DATA_ORDER = ['policySources.js', 'courseSources.js', 'courseSnapshot.js', 'prompts.js',
              'speakerNotes.js', 'shots.js', 'slides.js']

# QR code (baked SVG + PNG copy for checking)
qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, border=2)
qr.add_data(RADAR_URL)
qr.make(fit=True)
buf = io.BytesIO()
qr.make_image(image_factory=qrcode.image.svg.SvgPathImage).save(buf)
svg = buf.getvalue().decode('utf-8')
svg = svg[svg.index('<svg'):]
qr.make_image(fill_color='black', back_color='white').save(DIST / 'qr.png')
qr_js = f"window.DECK.QR_SVG = {svg!r};\nwindow.DECK.RADAR_URL = {RADAR_URL!r};\n"

css = (SRC / 'styles.css').read_text(encoding='utf-8')
app = (SRC / 'radar.js').read_text(encoding='utf-8') + '\n' + (SRC / 'app.js').read_text(encoding='utf-8')


def data_js(student):
    parts = []
    for f in DATA_ORDER:
        if student and f == 'speakerNotes.js':
            parts.append("window.DECK = window.DECK || {}; window.DECK.speakerNotes = {};")
        else:
            parts.append((SRC / 'data' / f).read_text(encoding='utf-8'))
    return '\n'.join(parts)


def head(title):
    return f"""<title>{title}</title>
<meta name="description" content="AEEA AI 最新應用趨勢 × AI 學習雷達｜互動式 Web Presentation（Lynn Lin，2026/09/28）">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800&family=Noto+Sans+TC:wght@300;400;500;700;800;900&display=swap">
"""


def body(student):
    flag = "window.DECK = window.DECK || {}; window.DECK.STUDENT = true;\n" if student else "window.DECK = window.DECK || {};\n"
    return f"""<style>
{css}
</style>
<div id="app"></div>
<script>
{flag}{data_js(student)}
{qr_js}
</script>
<script>
{app}
</script>
"""


def full_doc(title, student):
    return ('<!doctype html>\n<html lang="zh-Hant">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            + head(title) + '</head>\n<body>\n' + body(student) + '</body>\n</html>\n')


def redirect_doc():
    return ('<!doctype html>\n<html lang="zh-Hant"><head><meta charset="utf-8">\n'
            '<title>AI 學習雷達</title>\n'
            '<meta http-equiv="refresh" content="0; url=../">\n'
            f'<link rel="canonical" href="{STUDENT_URL}">\n'
            "<script>location.replace('../' + location.hash);</script>\n"
            f'</head><body><p>網址已更新：<a href="../">{STUDENT_URL}</a></p></body></html>\n')


TEACHER_TITLE = 'AEEA AI 學習雷達｜講師版'
STUDENT_TITLE = 'AEEA AI 學習雷達'

(ROOT / 'index.html').write_text(full_doc(STUDENT_TITLE, True), encoding='utf-8')
for d in ['tr', 'st', 'student']:
    (ROOT / d).mkdir(exist_ok=True)
(ROOT / 'tr' / 'index.html').write_text(full_doc(TEACHER_TITLE, False), encoding='utf-8')
(ROOT / 'st' / 'index.html').write_text(redirect_doc(), encoding='utf-8')
(ROOT / 'student' / 'index.html').write_text(redirect_doc(), encoding='utf-8')
(DIST / 'artifact.html').write_text(head(TEACHER_TITLE) + body(False), encoding='utf-8')
(DIST / 'index.html').write_text(full_doc(TEACHER_TITLE, False), encoding='utf-8')
print('built: index.html (學員版), tr/index.html (講師版), st/ & student/ (轉址), dist/*  QR ->', RADAR_URL)
