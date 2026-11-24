"""Découpe une planche dont les personnages se chevauchent en colonnes (ex. un volant au-dessus d'un autre) :
sépare par taches (composantes connexes) au lieu de colonnes.
python3 cut_blobs.py <source.jpg> <green|magenta|blue> <nombre> <taille max> <sorties… (de gauche à droite)>"""
import sys, numpy as np
from PIL import Image
from scipy import ndimage
from cut import cutout, trim, fit

src, key, n, box, *outs = sys.argv[1:]
n = int(n); im = cutout(src, key); a = np.array(im)
# ombres au sol vert foncé : on les retire aussi (vert nettement dominant)
if key == 'green':
    r, g, b = [a[...,i].astype(int) for i in range(3)]
    a[(g > r + 70) & (g > b + 70), 3] = 0
mask = a[...,3] > 128
lab, k = ndimage.label(ndimage.binary_dilation(mask, iterations=6))
sizes = ndimage.sum(mask, lab, range(1, k+1))
keep = np.argsort(sizes)[::-1][:n] + 1
cx = [ndimage.center_of_mass(mask, lab, i)[1] for i in keep]
keep = [keep[i] for i in np.argsort(cx)]
for lb, o in zip(keep, outs):
    b = a.copy(); b[lab != lb, 3] = 0
    p = fit(trim(Image.fromarray(b, 'RGBA')), int(box)); p.save(o, 'WEBP', quality=88, method=6); print(o, p.size)
