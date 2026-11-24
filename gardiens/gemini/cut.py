"""Détourage chroma (vert, magenta, bleu) + découpage d'une planche en N personnages."""
import sys, numpy as np
from PIL import Image
from scipy import ndimage

def alpha_of(a, key):
    r,g,b = a[...,0].astype(float), a[...,1].astype(float), a[...,2].astype(float)
    if key=='green':   k = g - np.maximum(r,b)
    elif key=='magenta': k = np.minimum(r,b) - g
    else:              k = b - np.maximum(r,g)
    al = np.clip((150 - k) / (150 - 55), 0, 1)
    return al, k

def despill(a, al, key, k):
    a = a.astype(float)
    m = (k > 0)
    if key=='green':
        lim = np.maximum(a[...,0], a[...,2]); a[...,1] = np.where(m, np.minimum(a[...,1], lim), a[...,1])
    elif key=='magenta':
        lim = a[...,1] + 0; mx = np.maximum(a[...,0],a[...,2])
        # ramène le rouge et le bleu vers le vert sur les bords roses parasites
        for c in (0,2): a[...,c] = np.where(m & (al<1), np.minimum(a[...,c], np.maximum(lim, 0.5*(a[...,c]+lim))), a[...,c])
    else:
        lim = np.maximum(a[...,0], a[...,1]); a[...,2] = np.where(m & (al<1), np.minimum(a[...,2], lim+20), a[...,2])
    return a

def cutout(path, key):
    a = np.array(Image.open(path).convert('RGB'))
    al, k = alpha_of(a, key)
    rgb = despill(a, al, key, k)
    # retire les petites taches isolées
    lab, n = ndimage.label(al > 0.5)
    if n:
        sizes = ndimage.sum(np.ones_like(al), lab, range(1, n+1))
        small = np.isin(lab, np.where(sizes < 40)[0] + 1)
        al[small] = 0
    out = np.dstack([np.clip(rgb,0,255), al*255]).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')

def split(im, n):
    a = np.array(im)[...,3] > 20
    col = a.sum(0)
    xs = np.where(col > 0)[0]; x0, x1 = xs[0], xs[-1]
    empty = col[x0:x1+1] == 0
    runs=[]; i=0
    while i < len(empty):
        if empty[i]:
            j=i
            while j < len(empty) and empty[j]: j+=1
            runs.append((j-i, x0+i, x0+j)); i=j
        else: i+=1
    runs = sorted(sorted(runs, reverse=True)[:n-1], key=lambda r: r[1])
    cuts = [x0] + [(s+e)//2 for _,s,e in runs] + [x1+1]
    return [im.crop((cuts[i], 0, cuts[i+1], im.height)) for i in range(n)]

def trim(im, pad=6):
    bb = im.getchannel('A').point(lambda v: 255 if v > 12 else 0).getbbox()
    im = im.crop(bb)
    out = Image.new('RGBA', (im.width+2*pad, im.height+2*pad), (0,0,0,0)); out.paste(im, (pad,pad)); return out

def fit(im, box):
    im = im.copy(); im.thumbnail((box, box), Image.LANCZOS); return im

if __name__ == '__main__':
    src, key, n, box, *outs = sys.argv[1:]
    im = cutout(src, key)
    parts = split(im, int(n)) if int(n) > 1 else [im]
    for p, o in zip(parts, outs):
        p = fit(trim(p), int(box)); p.save(o, 'WEBP', quality=88, method=6); print(o, p.size)
