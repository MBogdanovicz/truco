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
    'game_wins_10': ([('10', G)], 200),
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

def card_star():
    """A playing card with a star: the first win in the card game."""
    im, d = base()
    d.rounded_rectangle((176, 136, 336, 376), radius=18, outline=GOLD, width=12)
    f = ImageFont.truetype(FONT, 120)
    d.text((256, 258), '★', font=f, fill=GOLD, anchor='mm')
    return im

DRAWN = {'game_first_win': card_star}

if __name__ == '__main__':
    out = sys.argv[1]
    for name, (parts, size) in ICONS.items():
        text(parts, size).save(f'{out}/{name}.png')
    for name, draw in DRAWN.items():
        draw().save(f'{out}/{name}.png')
