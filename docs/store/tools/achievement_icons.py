"""Draws the game achievement icons (512x512 PNG for Google Play Games), in
the style of the first ones: green felt, gold ring, gold symbol.
Usage: python3 achievement_icons.py <out dir>"""
import math, sys
from PIL import Image, ImageDraw, ImageFont

GOLD = (224, 179, 65)
RED = (214, 72, 58)
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
S = 512

def base():
    im = Image.new('RGB', (S, S))
    px = im.load()
    for y in range(S):
        for x in range(S):
            d = min(1, math.hypot(x - 256, y - 230) / 360)
            px[x, y] = tuple(int(a + (b - a) * d) for a, b in zip((30, 118, 78), (12, 63, 42)))
    d = ImageDraw.Draw(im)
    d.ellipse((48, 48, 464, 464), outline=GOLD, width=16)
    d.ellipse((80, 80, 432, 432), outline=(93, 127, 66), width=3)
    return im, d

def text(parts, size):
    """parts: [(text, color)] drawn on one line, centered."""
    im, d = base()
    f = ImageFont.truetype(FONT, size)
    widths = [d.textlength(t, font=f) for t, _ in parts]
    x = 256 - sum(widths) / 2
    for (t, c), w in zip(parts, widths):
        d.text((x, 256), t, font=f, fill=c, anchor='lm')
        x += w
    return im

G, R = GOLD, RED
ICONS = {
    'game_truco_12': ([('12!', G)], 170),
    'game_ran_won': ([('↩', G)], 230),
    'game_iron_hand': ([('11×11', G)], 108),
    'game_comadre': ([('☺', G)], 250),
    'game_ace_river': ([('A', G), ('♠', G)], 170),
    'game_666': ([('666', R)], 140),
    'game_seis_burro': ([('6!', G)], 200),
    'game_casal_maior': ([('♣', G), ('♥', R)], 170),
    'game_casal_menor': ([('♦', R), ('♠', G)], 170),
    'game_casal_preto': ([('♠', G), ('♣', G)], 170),
    'game_casal_vermelho': ([('♦', R), ('♥', R)], 170),
}

def card(symbol, size):
    """A playing card with a symbol: wins in the card game."""
    im, d = base()
    d.rounded_rectangle((176, 136, 336, 376), radius=18, outline=GOLD, width=12)
    f = ImageFont.truetype(FONT, size)
    d.text((256, 258), symbol, font=f, fill=GOLD, anchor='mm')
    return im

def under_table():
    """12 x 0 in the game: the losers go under the table."""
    im, d = base()
    f = ImageFont.truetype(FONT, 80)
    d.text((256, 200), '12×0', font=f, fill=GOLD, anchor='mm')
    d.rounded_rectangle((136, 262, 376, 284), radius=6, fill=GOLD)  # table top
    d.rectangle((160, 284, 178, 372), fill=GOLD)  # legs
    d.rectangle((334, 284, 352, 372), fill=GOLD)
    return im

DRAWN = {
    'game_first_win': lambda: card('★', 120),
    'game_wins_10': lambda: card('10', 84),
    'game_shutout': under_table,
}

# Changes to the first set (scorekeeper achievements).
OLD = {
    'loyal_partner': ([('♥', G), (' ', G), ('♥', G)], 150),
}


# ---------------------------------------------------------- tournaments --

def trophy(d, cx, top, w, color=GOLD):
    """A cup: bowl, handles, stem and base; [w] is the bowl width."""
    h = w * 0.9
    d.pieslice((cx - w / 2, top - h * 0.55, cx + w / 2, top + h * 0.9), 0, 180, fill=color)
    d.rectangle((cx - w / 2, top - 2, cx + w / 2, top + h * 0.18), fill=color)
    lw = max(4, int(w * 0.09))
    for sx in (-1, 1):
        x0 = cx + sx * w / 2
        x1 = x0 - sx * w * 0.14
        x2 = x0 + sx * w * 0.2
        box = (min(x1, x2), top + h * 0.0, max(x1, x2), top + h * 0.42)
        d.arc(box, 270 if sx > 0 else 90, 90 if sx > 0 else 270, fill=color, width=lw)
    d.rectangle((cx - w * 0.07, top + h * 0.85, cx + w * 0.07, top + h * 1.15), fill=color)
    d.rounded_rectangle((cx - w * 0.32, top + h * 1.12, cx + w * 0.32, top + h * 1.28), radius=4, fill=color)

def t_champion():
    im, d = base()
    trophy(d, 256, 170, 170)
    return im

def t_tri():
    im, d = base()
    trophy(d, 256, 160, 120)
    trophy(d, 160, 230, 80)
    trophy(d, 352, 230, 80)
    return im

def bracket(d, x0, x1, ys, color=GOLD, width=10):
    """Lines joining pairs of [ys] (left) into one line (right)."""
    xm = (x0 + x1) / 2
    for a, b in zip(ys[::2], ys[1::2]):
        d.line((x0, a, xm, a, xm, b, x0, b), fill=color, width=width, joint='curve')
        d.line((xm, (a + b) / 2, x1, (a + b) / 2), fill=color, width=width)
    return [(a + b) / 2 for a, b in zip(ys[::2], ys[1::2])]

def t_knockout():
    im, d = base()
    ys = bracket(d, 120, 210, [170, 220, 292, 342])
    ys = bracket(d, 210, 290, ys)
    trophy(d, 345, 222, 70)
    return im

def t_clean():
    """Straight to the title: a bracket with one bold straight path."""
    im, d = base()
    ys = bracket(d, 120, 210, [170, 220, 292, 342], color=(150, 125, 60), width=8)
    bracket(d, 210, 290, ys, color=(150, 125, 60), width=8)
    d.line((120, 256, 300, 256), fill=GOLD, width=22)
    d.polygon([(300, 222), (300, 290), (350, 256)], fill=GOLD)
    trophy(d, 380, 226, 50)
    return im

def t_first():
    """Debut: a pennant on a pole."""
    im, d = base()
    d.rectangle((176, 140, 192, 380), fill=GOLD)
    d.polygon([(192, 148), (350, 196), (192, 244)], fill=GOLD)
    d.ellipse((168, 126, 200, 158), fill=GOLD)
    return im

def t_comeback():
    """Back from the losers' bracket: an arrow down, then up to the cup."""
    im, d = base()
    d.line((112, 190, 200, 320, 280, 220), fill=GOLD, width=22, joint='curve')
    d.polygon([(262, 196), (306, 190), (296, 236)], fill=GOLD)
    trophy(d, 352, 180, 80)
    return im

def t_unbeaten():
    """Unbeaten: a shield with a check mark."""
    im, d = base()
    d.polygon([(256, 124), (360, 162), (350, 290), (256, 384), (162, 290), (152, 162)], fill=GOLD)
    d.line((204, 256, 244, 300, 314, 210), fill=(18, 82, 55), width=26, joint='curve')
    return im

def t_bo5():
    """Against variance: a die showing five."""
    im, d = base()
    d.rounded_rectangle((156, 156, 356, 356), radius=30, fill=GOLD)
    dark = (18, 82, 55)
    for x, y in [(206, 206), (306, 206), (256, 256), (206, 306), (306, 306)]:
        d.ellipse((x - 20, y - 20, x + 20, y + 20), fill=dark)
    return im

def t_round_robin():
    """Round robin: a league table."""
    im, d = base()
    d.rounded_rectangle((150, 150, 362, 362), radius=14, outline=GOLD, width=12)
    for y in (203, 256, 309):
        d.line((156, y, 356, y), fill=GOLD, width=8)
    d.line((300, 156, 300, 356), fill=GOLD, width=8)
    d.rectangle((150, 150, 362, 203), fill=GOLD)
    return im

def person(d, cx, cy, r, color=GOLD):
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=color)
    d.pieslice((cx - r * 1.8, cy + r * 1.2, cx + r * 1.8, cy + r * 4.6), 180, 360, fill=color)

def t_random_partner():
    """A partner drawn by the app: two people and a question mark."""
    im, d = base()
    person(d, 186, 200, 36)
    person(d, 326, 200, 36)
    f = ImageFont.truetype(FONT, 110)
    d.text((256, 196), '?', font=f, fill=RED, anchor='mm')
    return im

TOURNAMENT = {
    'tour_first': t_first,
    'tour_champion': t_champion,
    'tour_champion_3': t_tri,
    'tour_comeback': t_comeback,
    'tour_unbeaten': t_unbeaten,
    'tour_bo5_final': t_bo5,
    'tour_knockout': t_knockout,
    'tour_clean': t_clean,
    'tour_round_robin': t_round_robin,
    'tour_random_partner': t_random_partner,
}


# -------------------------------------------------------------- Treinar --

def star(d, cx, cy, r, color=GOLD):
    pts = []
    for i in range(10):
        a = -math.pi / 2 + i * math.pi / 5
        rr = r if i % 2 == 0 else r * 0.42
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    d.polygon(pts, fill=color)

def graduated(stars):
    """Passed a Treinar exam: a mortarboard, with 1-3 stars for the level."""
    im, d = base()
    cx, top = 256, 150
    # The board (a flat diamond), the cap under it and the tassel.
    d.polygon([(cx, top), (cx + 150, top + 60), (cx, top + 120), (cx - 150, top + 60)], fill=GOLD)
    d.polygon([(cx - 92, top + 84), (cx + 92, top + 84), (cx + 92, top + 150), (cx, top + 176), (cx - 92, top + 150)], fill=GOLD)
    d.line((cx - 150, top + 60, cx - 150, top + 140), fill=GOLD, width=10)
    d.ellipse((cx - 166, top + 134, cx - 134, top + 166), fill=GOLD)
    d.line((cx, top + 60, cx - 150, top + 60), fill=(18, 82, 55), width=6)
    for i in range(stars):
        x = cx + (i - (stars - 1) / 2) * 70
        star(d, x, 372, 30)
    return im

def cartilha():
    """Mastered the cartilha: the open primer of truco, with a crown."""
    im, d = base()
    dark = (18, 82, 55)
    cx, top, bottom = 256, 232, 372
    # Two pages, slightly raised at the outer corners.
    d.polygon([(cx, top + 14), (cx - 150, top - 6), (cx - 150, bottom - 16), (cx, bottom)], fill=GOLD)
    d.polygon([(cx, top + 14), (cx + 150, top - 6), (cx + 150, bottom - 16), (cx, bottom)], fill=GOLD)
    d.line((cx, top + 14, cx, bottom), fill=dark, width=6)
    # Lines of text on each page.
    for i in range(4):
        y = top + 30 + i * 24
        d.line((cx - 128, y - 14 + i * 0, cx - 22, y + 2), fill=dark, width=6)
        d.line((cx + 22, y + 2, cx + 128, y - 14), fill=dark, width=6)
    # The crown above the book.
    cy = 196
    d.polygon([(cx - 70, cy), (cx - 70, cy - 54), (cx - 35, cy - 22), (cx, cy - 70),
               (cx + 35, cy - 22), (cx + 70, cy - 54), (cx + 70, cy)], fill=GOLD)
    for x, y in [(cx - 70, cy - 60), (cx, cy - 76), (cx + 70, cy - 60)]:
        d.ellipse((x - 10, y - 10, x + 10, y + 10), fill=GOLD)
    return im

COURSE = {
    'course_all': cartilha,
    'course_basic': lambda: graduated(1),
    'course_intermediate': lambda: graduated(2),
    'course_advanced': lambda: graduated(3),
}

if __name__ == '__main__':
    if len(sys.argv) > 2 and sys.argv[2] == 'treinar':
        for name, draw in COURSE.items():
            draw().save(f'{sys.argv[1]}/{name}.png')
        sys.exit()
    out = sys.argv[1]
    if len(sys.argv) > 2 and sys.argv[2] == 'torneios':
        for name, draw in TOURNAMENT.items():
            draw().save(f'{out}/{name}.png')
        sys.exit()
    for name, (parts, size) in ICONS.items():
        text(parts, size).save(f'{out}/{name}.png')
    for name, (parts, size) in OLD.items():
        text(parts, size).save(f'{out}/{name}.png')
    for name, draw in DRAWN.items():
        draw().save(f'{out}/{name}.png')
