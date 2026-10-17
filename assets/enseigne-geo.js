/* Générateur de lettres lumineuses pour l'enseigne de Lili.
   Dépend de : ClipperLib (clipper-lib), earcut, et d'une police opentype.js.
   Coordonnées en millimètres, axe Y vers le haut. */
(function (root) {
  "use strict";
  const SC = 1000; // Clipper travaille en entiers : 1 mm = 1000 unités

  function C() { return root.ClipperLib; }

  /* ---------- Contours de police ---------- */
  function flattenPath(cmds, tol) {
    const polys = []; let cur = null, x = 0, y = 0;
    const push = (px, py) => { cur.push([px, py]); x = px; y = py; };
    for (const c of cmds) {
      if (c.type === "M") { if (cur && cur.length > 2) polys.push(cur); cur = []; push(c.x, -c.y); }
      else if (c.type === "L") push(c.x, -c.y);
      else if (c.type === "Q") {
        const x0 = x, y0 = y, x1 = c.x1, y1 = -c.y1, x2 = c.x, y2 = -c.y;
        const n = Math.max(4, Math.ceil(Math.hypot(x2 - x0, y2 - y0) / tol));
        for (let i = 1; i <= n; i++) { const t = i / n, u = 1 - t; push(u*u*x0 + 2*u*t*x1 + t*t*x2, u*u*y0 + 2*u*t*y1 + t*t*y2); }
      } else if (c.type === "C") {
        const x0 = x, y0 = y, x1 = c.x1, y1 = -c.y1, x2 = c.x2, y2 = -c.y2, x3 = c.x, y3 = -c.y;
        const n = Math.max(6, Math.ceil((Math.hypot(x1-x0,y1-y0)+Math.hypot(x2-x1,y2-y1)+Math.hypot(x3-x2,y3-y2)) / tol));
        for (let i = 1; i <= n; i++) { const t = i / n, u = 1 - t;
          push(u*u*u*x0 + 3*u*u*t*x1 + 3*u*t*t*x2 + t*t*t*x3, u*u*u*y0 + 3*u*u*t*y1 + 3*u*t*t*y2 + t*t*t*y3); }
      } else if (c.type === "Z") { if (cur && cur.length > 2) polys.push(cur); cur = null; }
    }
    if (cur && cur.length > 2) polys.push(cur);
    return polys;
  }
  const toInt = poly => poly.map(p => ({ X: Math.round(p[0] * SC), Y: Math.round(p[1] * SC) }));
  const toMm = path => cleanPoly(path.map(p => [p.X / SC, p.Y / SC]));
  // retire les points en double et alignés (sinon earcut laisse des trous)
  function cleanPoly(poly) {
    let pts = poly.slice(), changed = true;
    while (changed && pts.length > 3) {
      changed = false;
      for (let i = 0; i < pts.length && pts.length > 3; i++) {
        const a = pts[(i - 1 + pts.length) % pts.length], b = pts[i], c = pts[(i + 1) % pts.length];
        const cr = (b[0]-a[0])*(c[1]-a[1]) - (b[1]-a[1])*(c[0]-a[0]);
        if (Math.hypot(b[0]-a[0], b[1]-a[1]) < 0.02 || Math.abs(cr) < 0.002) { pts.splice(i, 1); i--; changed = true; }
      }
    }
    return pts;
  }

  function unionTree(paths, fill) {
    const L = C(), c = new L.Clipper(), tree = new L.PolyTree();
    c.AddPaths(paths, L.PolyType.ptSubject, true);
    c.Execute(L.ClipType.ctUnion, tree, fill, fill);
    return L.JS.PolyTreeToExPolygons(tree); // [{outer, holes}]
  }
  function offsetEx(ex, deltaMm) {
    const L = C(), co = new L.ClipperOffset(2, 0.15 * SC), out = new L.Paths();
    co.AddPaths([ex.outer, ...ex.holes], L.JoinType.jtRound, L.EndType.etClosedPolygon);
    co.Execute(out, deltaMm * SC);
    if (!out.length) return [];
    return unionTree(out, L.PolyFillType.pftNonZero).map(e => ({ outer: L.JS.Lighten(e.outer, 0.02 * SC) , holes: e.holes.map(h => L.JS.Lighten(h, 0.02 * SC)) }))
      .filter(e => e.outer.length > 2).map(e => ({ outer: e.outer, holes: e.holes.filter(h => h.length > 2) }));
  }
  function inEx(ex, x, y) {
    const L = C(), pt = { X: Math.round(x * SC), Y: Math.round(y * SC) };
    if (L.Clipper.PointInPolygon(pt, ex.outer) === 0) return false;
    for (const h of ex.holes) if (L.Clipper.PointInPolygon(pt, h) !== 0) return false;
    return true;
  }
  const area = poly => { let a = 0; for (let i = 0, n = poly.length; i < n; i++) { const p = poly[i], q = poly[(i+1)%n]; a += p[0]*q[1] - q[0]*p[1]; } return a / 2; };
  const orient = (poly, ccw) => (area(poly) > 0) === ccw ? poly : poly.slice().reverse();

  /* ---------- Maillage ---------- */
  function Mesh() { this.t = []; }
  Mesh.prototype.tri = function (a, b, c) { this.t.push(a[0],a[1],a[2], b[0],b[1],b[2], c[0],c[1],c[2]); };
  // Mur vertical d'un contour. "out" : la matière est à gauche du sens de parcours.
  Mesh.prototype.sides = function (poly, z0, z1) {
    for (let i = 0, n = poly.length; i < n; i++) {
      const p = poly[i], q = poly[(i+1)%n];
      const a0 = [p[0],p[1],z0], b0 = [q[0],q[1],z0], a1 = [p[0],p[1],z1], b1 = [q[0],q[1],z1];
      this.tri(a0, b0, b1); this.tri(a0, b1, a1);
    }
  };
  // Face horizontale : outer + trous, normale vers le haut (up) ou le bas.
  Mesh.prototype.cap = function (outer, holes, z, up) {
    const flat = [], hi = [];
    const add = poly => { for (const p of poly) flat.push(p[0], p[1]); };
    add(outer); for (const h of holes) { hi.push(flat.length / 2); add(h); }
    const idx = root.earcut(flat, hi.length ? hi : null, 2);
    for (let i = 0; i < idx.length; i += 3) {
      const A = idx[i], B = idx[i+1], Cc = idx[i+2];
      const ax = flat[2*A], ay = flat[2*A+1], bx = flat[2*B], by = flat[2*B+1], cx = flat[2*Cc], cy = flat[2*Cc+1];
      const s = (bx-ax)*(cy-ay) - (by-ay)*(cx-ax);
      const a = [ax,ay,z], b = [bx,by,z], c = [cx,cy,z];
      if ((s > 0) === up) this.tri(a, b, c); else this.tri(a, c, b);
    }
  };
  Mesh.prototype.volume = function () {
    let v = 0; const t = this.t;
    for (let i = 0; i < t.length; i += 9)
      v += (t[i]*(t[i+4]*t[i+8]-t[i+5]*t[i+7]) - t[i+1]*(t[i+3]*t[i+8]-t[i+5]*t[i+6]) + t[i+2]*(t[i+3]*t[i+7]-t[i+4]*t[i+6])) / 6;
    return v; // mm³
  };
  Mesh.prototype.translated = function (dx, dy) {
    const m = new Mesh(); m.t = this.t.slice();
    for (let i = 0; i < m.t.length; i += 3) { m.t[i] += dx; m.t[i+1] += dy; }
    return m;
  };
  Mesh.prototype.toSTL = function (name) {
    const n = this.t.length / 9, buf = new ArrayBuffer(84 + n * 50), dv = new DataView(buf);
    const head = ("Atelier de Lili - " + name).slice(0, 79);
    for (let i = 0; i < head.length; i++) dv.setUint8(i, head.charCodeAt(i) & 0x7f);
    dv.setUint32(80, n, true);
    let o = 84; const t = this.t;
    for (let i = 0; i < t.length; i += 9) {
      const ux = t[i+3]-t[i], uy = t[i+4]-t[i+1], uz = t[i+5]-t[i+2], vx = t[i+6]-t[i], vy = t[i+7]-t[i+1], vz = t[i+8]-t[i+2];
      let nx = uy*vz-uz*vy, ny = uz*vx-ux*vz, nz = ux*vy-uy*vx; const l = Math.hypot(nx,ny,nz) || 1;
      dv.setFloat32(o, nx/l, true); dv.setFloat32(o+4, ny/l, true); dv.setFloat32(o+8, nz/l, true); o += 12;
      for (let k = 0; k < 9; k++) { dv.setFloat32(o, t[i+k], true); o += 4; }
      dv.setUint16(o, 0, true); o += 2;
    }
    return buf;
  };

  function circle(cx, cy, r, ccw) {
    const n = 28, p = [];
    for (let i = 0; i < n; i++) { const a = (ccw ? 1 : -1) * i / n * Math.PI * 2; p.push([cx + r*Math.cos(a), cy + r*Math.sin(a)]); }
    return p;
  }

  /* ---------- Une pièce (île) d'une lettre ---------- */
  function buildIsland(exO, o) {
    const L = C();
    const Oout = orient(toMm(exO.outer), true), Oholes = exO.holes.map(h => orient(toMm(h), false));
    const Iex = offsetEx(exO, -o.wall);
    const T = o.plate + o.depth;

    // Trou pour les fils : le plus bas possible, loin des murs
    let hole = null;
    const Kex = offsetEx(exO, -(o.wall + o.holeR + 2));
    if (Kex.length) {
      let best = null;
      for (const k of Kex) for (const p of k.outer) { const x = p.X / SC, y = p.Y / SC; if (!best || y < best[1] - 0.5 || (Math.abs(y - best[1]) <= 0.5 && Math.abs(x - o.cx) < Math.abs(best[0] - o.cx))) best = [x, y]; }
      hole = { x: best[0], y: best[1] };
    }
    // Pixels : grille hexagonale dans la zone utile
    const Jex = offsetEx(exO, -(o.wall + 7));
    let pix = [];
    if (hole && Jex.length) {
      const b = bbox(Oout), s = o.spacing, dy = s * Math.sqrt(3) / 2;
      let row = 0;
      for (let y = b.y0 + s * 0.35; y <= b.y1; y += dy, row++)
        for (let x = b.x0 + (row % 2 ? s / 2 : 0) + s * 0.2; x <= b.x1; x += s)
          if (Jex.some(e => inEx(e, x, y)) && Math.hypot(x - hole.x, y - hole.y) > 15) pix.push([x, y]);
      if (!pix.length) {
        // petite lettre : un pixel au point le plus « profond »
        let cand = null;
        for (let d = o.wall + 7; d < 60; d += 1.5) { const e = offsetEx(exO, -d); if (!e.length) break; cand = e; }
        if (cand) for (const e of cand) for (const p of e.outer) { const x = p.X / SC, y = p.Y / SC; if (Math.hypot(x - hole.x, y - hole.y) > 13) { pix.push([x, y]); break; } if (pix.length) break; }
      }
    }
    // pixels dans la même cavité que le trou
    if (hole && Iex.length > 1) { const home = Iex.find(e => inEx(e, hole.x, hole.y)); if (home) pix = pix.filter(p => inEx(home, p[0], p[1])); }
    if (!pix.length) hole = null;
    // ordre de pose : on part du trou, puis plus proche voisin
    const ordered = []; let cur = hole ? [hole.x, hole.y] : null; const left = pix.slice();
    while (left.length) { let bi = 0, bd = 1e9; left.forEach((p, i) => { const d = Math.hypot(p[0]-cur[0], p[1]-cur[1]); if (d < bd) { bd = d; bi = i; } }); cur = left.splice(bi, 1)[0]; ordered.push(cur); }

    const H = hole ? circle(hole.x, hole.y, o.holeR, false) : null;
    const Iparts = Iex.map(e => ({ outer: orient(toMm(e.outer), true), holes: e.holes.map(h => orient(toMm(h), false)) }));
    const holeIn = Iparts.findIndex(e => hole && e && inEx({ outer: toInt(e.outer), holes: e.holes.map(toInt) }, hole.x, hole.y));

    // --- Corps : fond + murs ---
    const body = new Mesh();
    body.cap(Oout, H ? [...Oholes, H] : Oholes, 0, false);
    body.sides(Oout, 0, T); Oholes.forEach(h => body.sides(h, 0, T));
    if (H) body.sides(H, 0, o.plate);
    Iparts.forEach((e, i) => {
      body.cap(e.outer, i === holeIn ? [...e.holes, H] : e.holes, o.plate, true);
      body.sides(e.outer.slice().reverse(), o.plate, T);
      e.holes.forEach(h => body.sides(h.slice().reverse(), o.plate, T));
    });
    // dessus des murs = O moins I
    const ptIn = (pt, poly) => L.Clipper.PointInPolygon({ X: Math.round(pt[0]*SC), Y: Math.round(pt[1]*SC) }, toInt(poly)) !== 0;
    const IholesAll = Iparts.flatMap(e => e.holes);
    const freeOholes = Oholes.filter(oh => !IholesAll.some(ih => ptIn(oh[0], ih)));
    body.cap(Oout, [...Iparts.map(e => e.outer), ...freeOholes], T, true);
    IholesAll.forEach(ih => body.cap(ih, Oholes.filter(oh => ptIn(oh[0], ih)), T, true));

    // --- Façade ---
    const lid = new Mesh();
    lid.cap(Oout, Oholes, 0, false); lid.cap(Oout, Oholes, o.lid, true);
    lid.sides(Oout, 0, o.lid); Oholes.forEach(h => lid.sides(h, 0, o.lid));

    return { body, lid, hole, pixels: ordered, outline: [Oout, ...Oholes], inner: Iparts, bbox: bbox(Oout) };
  }
  function bbox(poly) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const p of poly) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); } return { x0, y0, x1, y1 }; }

  /* ---------- L'enseigne complète ---------- */
  function build(font, opts) {
    const L = C();
    const o = Object.assign({ height: 140, depth: 25, wall: 2, plate: 2, lid: 1.2, gap: 6, holeR: 6 }, opts);
    o.spacing = Math.max(24, Math.min(42, o.height * 0.24));
    const capH = (font.tables.os2 && font.tables.os2.sCapHeight) || font.unitsPerEm * 0.7;
    const size = o.height * font.unitsPerEm / capH;
    const letters = []; let penX = 0;
    for (const ch of Array.from(o.text)) {
      const glyph = font.charToGlyph(ch);
      const adv = (glyph.advanceWidth || 0) * size / font.unitsPerEm;
      if (/\s/.test(ch) || !glyph || glyph.index === 0) { penX += Math.max(adv, o.height * 0.3); continue; }
      const polys = flattenPath(glyph.getPath(0, 0, size).commands, 1.2);
      if (!polys.length) { penX += adv; continue; }
      const exs = unionTree(polys.map(toInt), L.PolyFillType.pftNonZero).filter(e => Math.abs(area(toMm(e.outer))) > 30);
      let gb = { x0: 1e9, x1: -1e9 };
      exs.forEach(e => { const b = bbox(toMm(e.outer)); gb.x0 = Math.min(gb.x0, b.x0); gb.x1 = Math.max(gb.x1, b.x1); });
      const shift = penX - gb.x0;
      const cx = (gb.x0 + gb.x1) / 2;
      const islands = exs.sort((a, b) => bbox(toMm(a.outer)).x0 - bbox(toMm(b.outer)).x0).map(e => buildIsland(e, Object.assign({}, o, { cx })));
      letters.push({ ch, shift, islands, width: gb.x1 - gb.x0 });
      penX += (gb.x1 - gb.x0) + o.gap;
    }
    // numérotation des pixels, de gauche à droite
    let n = 0;
    for (const l of letters) { l.start = n; for (const is of l.islands) n += is.pixels.length; l.count = n - l.start; }
    let vBody = 0, vLid = 0, maxW = 0, maxH = 0, yMin = 1e9, yMax = -1e9;
    for (const l of letters) for (const is of l.islands) {
      vBody += is.body.volume(); vLid += is.lid.volume();
      maxW = Math.max(maxW, is.bbox.x1 - is.bbox.x0); maxH = Math.max(maxH, is.bbox.y1 - is.bbox.y0);
      yMin = Math.min(yMin, is.bbox.y0); yMax = Math.max(yMax, is.bbox.y1);
    }
    return { letters, opts: o, pixels: n, totalWidth: Math.max(0, penX - o.gap), yMin, yMax,
             volBody: vBody, volLid: vLid, maxPartW: maxW, maxPartH: maxH };
  }

  /* Pièces à imprimer, posées à l'origine */
  function parts(sign) {
    const out = []; let k = 0;
    sign.letters.forEach((l, li) => l.islands.forEach((is, ii) => {
      k++; const dx = -is.bbox.x0, dy = -is.bbox.y0;
      const tag = String(li + 1).padStart(2, "0") + "_" + safe(l.ch) + (l.islands.length > 1 ? "_morceau" + (ii + 1) : "");
      out.push({ name: tag + "_corps.stl", mesh: is.body.translated(dx, dy) });
      out.push({ name: tag + "_facade.stl", mesh: is.lid.translated(dx, dy) });
    }));
    return out;
  }
  function safe(ch) { const m = { "é":"e","è":"e","ê":"e","ë":"e","à":"a","â":"a","ä":"a","î":"i","ï":"i","ô":"o","ö":"o","ù":"u","û":"u","ü":"u","ç":"c","É":"E","È":"E","Ê":"E","À":"A","Ç":"C","Ô":"O","Î":"I","Ï":"I","Ë":"E","Û":"U","Ü":"U","Ö":"O","Ä":"A","Â":"A" }; const c = m[ch] || ch; return /[A-Za-z0-9]/.test(c) ? c : "x"; }

  root.EnseigneGeo = { build, parts };
})(typeof window !== "undefined" ? window : globalThis);
