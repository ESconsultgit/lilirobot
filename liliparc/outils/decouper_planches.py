"""Découpe des planches d'attractions (images en pixel art sur fond uni) en sprites pour le mode pixel de Lili Parc.

Utilisation : python3 decouper_planches.py
- Renseigner PLANCHES ci-dessous : pour chaque image, une liste de rangées (ordonnées de haut en bas)
  avec les identifiants des attractions de gauche à droite (voir DEFS dans index.html).
- Les sprites sont écrits dans ../px/<id>.png (fond transparent, max 108 x 82 pixels, 64 couleurs).
- Ajouter ensuite l'identifiant dans PX_SPRITES (index.html) et incrémenter VERSION dans sw.js.
Dépendances : pip install pillow numpy scipy
"""
from pathlib import Path
from PIL import Image
import numpy as np
from scipy import ndimage

ICI = Path(__file__).resolve().parent
SORTIE = ICI.parent / 'px'
BOX = (108, 82)          # taille max d'un sprite (un terrain fait 112 x 85 pixels en mode pixel)

# image -> rangées : [ids de gauche à droite]
PLANCHES = {
    # 'planche1.jpg': [['autos','chateau','pirate','roue'], ['chaises','fantome','chute','huit']],
}

def bandes(mask, mini=8):
    on = mask.sum(1) > 5; segs = []; st = None
    for y, v in enumerate(on):
        if v and st is None: st = y
        if not v and st is not None:
            if y - st > mini: segs.append((st, y))
            st = None
    return segs

def decouper(fichier, rangees):
    a = np.asarray(Image.open(fichier).convert('RGB')).astype(int)
    bg = np.median(np.concatenate([a[:10].reshape(-1, 3), a[-10:].reshape(-1, 3)]), axis=0)
    segs = bandes(np.abs(a - bg).sum(2) > 45)
    hautes = sorted(segs, key=lambda s: s[1] - s[0], reverse=True)[:len(rangees)]   # les dessins (les légendes sont plus basses)
    for (y0, y1), ids in zip(sorted(hautes), rangees):
        band = a[y0:y1]; mask = ndimage.binary_closing(np.abs(band - bg).sum(2) > 40, iterations=3)
        xs = np.where(mask.sum(0) > 2)[0]
        gaps = sorted([(xs[i+1] - xs[i], xs[i], xs[i+1]) for i in range(len(xs) - 1)], reverse=True)[:len(ids) - 1]
        bornes = [xs[0]] + [c for g in sorted(gaps, key=lambda g: g[1]) for c in (g[1], g[2])] + [xs[-1]]
        for k, idn in enumerate(ids):
            x0, x1 = bornes[2*k], bornes[2*k+1] + 1
            sub = band[:, x0:x1]; m = ndimage.binary_opening(np.abs(sub - bg).sum(2) > 40, iterations=1)
            lab, n = ndimage.label(ndimage.binary_dilation(m, iterations=6))
            tailles = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
            m &= np.isin(lab, [i + 1 for i, t in enumerate(tailles) if t > 800])
            ys, xx = np.where(m)
            rgb = Image.fromarray(sub[ys.min():ys.max()+1, xx.min():xx.max()+1].astype(np.uint8))
            al = Image.fromarray((m[ys.min():ys.max()+1, xx.min():xx.max()+1] * 255).astype(np.uint8))
            sc = min(BOX[0] / rgb.width, BOX[1] / rgb.height); W, H = max(1, round(rgb.width * sc)), max(1, round(rgb.height * sc))
            petit = rgb.resize((W, H), Image.LANCZOS).quantize(colors=64, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGBA')
            petit.putalpha(al.resize((W, H), Image.LANCZOS).point(lambda v: 255 if v > 110 else 0))
            petit.save(SORTIE / f'{idn}.png', optimize=True); print(idn, W, 'x', H)

if __name__ == '__main__':
    SORTIE.mkdir(exist_ok=True)
    for f, r in PLANCHES.items(): decouper(ICI / f, r)
