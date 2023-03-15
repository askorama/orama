/*
 * -----------------------------------------------------------------------------
 * GENERATED FILE - DO NOT EDIT!
 * This file has been compiled using the Snowball stemmer generator.
 * Don't edit this file directly.
 * -----------------------------------------------------------------------------
 */

const g = !0
const p = !1

function C () {
  this.p = function (k) {
    this.j = k
    this.cursor = 0
    this.a = this.j.length
    this.f = 0
    this.c = this.cursor
    this.d = this.a
  }
  this.z = function () {
    return this.j
  }
  this.w = function (k) {
    this.j = k.j
    this.cursor = k.cursor
    this.a = k.a
    this.f = k.f
    this.c = k.c
    this.d = k.d
  }
  this.i = function (k, l, h) {
    if (this.cursor >= this.a) return p
    let c = this.j.charCodeAt(this.cursor)
    if (c > h || c < l) return p
    c -= l
    if ((k[c >>> 3] & (1 << (c & 7))) == 0) return p
    this.cursor++
    return g
  }
  this.n = function (k, l, h) {
    if (this.cursor <= this.f) return p
    let c = this.j.charCodeAt(this.cursor - 1)
    if (c > h || c < l) return p
    c -= l
    if ((k[c >>> 3] & (1 << (c & 7))) == 0) return p
    this.cursor--
    return g
  }
  this.k = function (k, l, h) {
    if (this.cursor >= this.a) return p
    let c = this.j.charCodeAt(this.cursor)
    if (c > h || c < l) return this.cursor++, g
    c -= l
    return (k[c >>> 3] & (1 << (c & 7))) == 0 ? (this.cursor++, g) : p
  }
  this.q = function (k, l, h) {
    if (this.cursor <= this.f) return p
    let c = this.j.charCodeAt(this.cursor - 1)
    if (c > h || c < l) return this.cursor--, g
    c -= l
    return (k[c >>> 3] & (1 << (c & 7))) == 0 ? (this.cursor--, g) : p
  }
  this.m = function (k) {
    if (this.a - this.cursor < k.length || this.j.slice(this.cursor, this.cursor + k.length) != k) return p
    this.cursor += k.length
    return g
  }
  this.g = function (k) {
    if (this.cursor - this.f < k.length || this.j.slice(this.cursor - k.length, this.cursor) != k) return p
    this.cursor -= k.length
    return g
  }
  this.o = function (k) {
    for (var l = 0, h = k.length, c = this.cursor, a = this.a, d = 0, n = 0, v = p; ;) {
      const b = l + ((h - l) >>> 1)
      let f = 0
      let q = d < n ? d : n
      var t = k[b]
      var s
      for (s = q; s < t[0].length; s++) {
        if (c + q == a) {
          f = -1
          break
        }
        f = this.j.charCodeAt(c + q) - t[0].charCodeAt(s)
        if (f != 0) break
        q++
      }
      f < 0 ? ((h = b), (n = q)) : ((l = b), (d = q))
      if (h - l <= 1) {
        if (l > 0) break
        if (h == l) break
        if (v) break
        v = g
      }
    }
    for (;;) {
      t = k[l]
      if (d >= t[0].length) {
        this.cursor = c + t[0].length
        if (t.length < 4) return t[2]
        l = t[3](this)
        this.cursor = c + t[0].length
        if (l) return t[2]
      }
      l = t[1]
      if (l < 0) return 0
    }
  }
  this.h = function (k) {
    for (var l = 0, h = k.length, c = this.cursor, a = this.f, d = 0, n = 0, v = p; ;) {
      const b = l + ((h - l) >> 1)
      let f = 0
      let q = d < n ? d : n
      var t = k[b]
      var s
      for (s = t[0].length - 1 - q; s >= 0; s--) {
        if (c - q == a) {
          f = -1
          break
        }
        f = this.j.charCodeAt(c - 1 - q) - t[0].charCodeAt(s)
        if (f != 0) break
        q++
      }
      f < 0 ? ((h = b), (n = q)) : ((l = b), (d = q))
      if (h - l <= 1) {
        if (l > 0) break
        if (h == l) break
        if (v) break
        v = g
      }
    }
    for (;;) {
      t = k[l]
      if (d >= t[0].length) {
        this.cursor = c - t[0].length
        if (t.length < 4) return t[2]
        l = t[3](this)
        this.cursor = c - t[0].length
        if (l) return t[2]
      }
      l = t[1]
      if (l < 0) return 0
    }
  }
  this.s = function (k, l, h) {
    const c = h.length - (l - k)
    this.j = this.j.slice(0, k) + h + this.j.slice(l)
    this.a += c
    this.cursor >= l ? (this.cursor += c) : this.cursor > k && (this.cursor = k)
    return c
  }
  this.t = function () {
    return this.c < 0 || this.c > this.d || this.d > this.a || this.a > this.j.length ? p : g
  }
  this.b = function (k) {
    let l = p
    this.t() && (this.s(this.c, this.d, k), (l = g))
    return l
  }
  this.e = function () {
    return this.b('')
  }
  this.r = function (k, l, h) {
    l = this.s(k, l, h)
    k <= this.c && (this.c += l)
    k <= this.d && (this.d += l)
  }
  this.u = function () {
    let k = ''
    this.t() && (k = this.j.slice(this.c, this.d))
    return k
  }
  this.v = function () {
    return this.j.slice(0, this.a)
  }
}

function stem () {
  function k () {
    return !(y <= a.cursor) ? p : g
  }
  function l () {
    return !(w <= a.cursor) ? p : g
  }
  function h () {
    let c
    a.d = a.cursor
    c = a.h(q)
    if (c == 0) return p
    a.c = a.cursor
    switch (c) {
      case 1:
        if (!l() || !a.e()) return p
        break
      case 2:
        if (!l() || !a.b('log')) return p
        break
      case 3:
        if (!l() || !a.b('u')) return p
        break
      case 4:
        if (!l() || !a.b('ente')) return p
        break
      case 5:
        if (!(u <= a.cursor) || !a.e()) return p
        var d = a.a - a.cursor
        a: if (((a.d = a.cursor), (c = a.h(v)), c == 0)) a.cursor = a.a - d
        else if (((a.c = a.cursor), l())) {
          if (!a.e()) return p
          switch (c) {
            case 1:
              a.d = a.cursor
              if (!a.g('at')) {
                a.cursor = a.a - d
                break a
              }
              a.c = a.cursor
              if (!l()) {
                a.cursor = a.a - d
                break a
              }
              if (!a.e()) return p
          }
        } else a.cursor = a.a - d
        break
      case 6:
        if (!l() || !a.e()) return p
        c = a.a - a.cursor
        a.d = a.cursor
        if (a.h(b) == 0) a.cursor = a.a - c
        else if (((a.c = a.cursor), l())) {
          if (!a.e()) return p
        } else a.cursor = a.a - c
        break
      case 7:
        if (!l() || !a.e()) return p
        c = a.a - a.cursor
        a.d = a.cursor
        if (a.h(f) == 0) a.cursor = a.a - c
        else if (((a.c = a.cursor), l())) {
          if (!a.e()) return p
        } else a.cursor = a.a - c
        break
      case 8:
        if (!l() || !a.e()) return p
        c = a.a - a.cursor
        a.d = a.cursor
        if (a.g('at')) {
          if (((a.c = a.cursor), l())) {
            if (!a.e()) return p
          } else a.cursor = a.a - c
        } else a.cursor = a.a - c
        break
      case 9:
        if (!k() || !a.g('e') || !a.b('ir')) return p
    }
    return g
  }
  function c () {
    if (a.cursor < y) return p
    const b = a.f
    a.f = y
    a.d = a.cursor
    if (a.h(t) == 0) return (a.f = b), p
    a.c = a.cursor
    if (!a.e()) return p
    a.f = b
    return g
  }
  var a = new C()
  const d = [
    ['', -1, 3],
    ['\u00e3', 0, 1],
    ['\u00f5', 0, 2]
  ]
  const n = [
    ['', -1, 3],
    ['a~', 0, 1],
    ['o~', 0, 2]
  ]
  var v = [
    ['ic', -1, -1],
    ['ad', -1, -1],
    ['os', -1, -1],
    ['iv', -1, 1]
  ]
  var b = [
    ['ante', -1, 1],
    ['avel', -1, 1],
    ['\u00edvel', -1, 1]
  ]
  var f = [
    ['ic', -1, 1],
    ['abil', -1, 1],
    ['iv', -1, 1]
  ]
  var q = [
    ['ica', -1, 1],
    ['\u00e2ncia', -1, 1],
    ['\u00eancia', -1, 4],
    ['logia', -1, 2],
    ['ira', -1, 9],
    ['adora', -1, 1],
    ['osa', -1, 1],
    ['ista', -1, 1],
    ['iva', -1, 8],
    ['eza', -1, 1],
    ['idade', -1, 7],
    ['ante', -1, 1],
    ['mente', -1, 6],
    ['amente', 12, 5],
    ['\u00e1vel', -1, 1],
    ['\u00edvel', -1, 1],
    ['ico', -1, 1],
    ['ismo', -1, 1],
    ['oso', -1, 1],
    ['amento', -1, 1],
    ['imento', -1, 1],
    ['ivo', -1, 8],
    ['a\u00e7a~o', -1, 1],
    ['u\u00e7a~o', -1, 3],
    ['ador', -1, 1],
    ['icas', -1, 1],
    ['\u00eancias', -1, 4],
    ['logias', -1, 2],
    ['iras', -1, 9],
    ['adoras', -1, 1],
    ['osas', -1, 1],
    ['istas', -1, 1],
    ['ivas', -1, 8],
    ['ezas', -1, 1],
    ['idades', -1, 7],
    ['adores', -1, 1],
    ['antes', -1, 1],
    ['a\u00e7o~es', -1, 1],
    ['u\u00e7o~es', -1, 3],
    ['icos', -1, 1],
    ['ismos', -1, 1],
    ['osos', -1, 1],
    ['amentos', -1, 1],
    ['imentos', -1, 1],
    ['ivos', -1, 8]
  ]
  var t = [
    ['ada', -1, 1],
    ['ida', -1, 1],
    ['ia', -1, 1],
    ['aria', 2, 1],
    ['eria', 2, 1],
    ['iria', 2, 1],
    ['ara', -1, 1],
    ['era', -1, 1],
    ['ira', -1, 1],
    ['ava', -1, 1],
    ['asse', -1, 1],
    ['esse', -1, 1],
    ['isse', -1, 1],
    ['aste', -1, 1],
    ['este', -1, 1],
    ['iste', -1, 1],
    ['ei', -1, 1],
    ['arei', 16, 1],
    ['erei', 16, 1],
    ['irei', 16, 1],
    ['am', -1, 1],
    ['iam', 20, 1],
    ['ariam', 21, 1],
    ['eriam', 21, 1],
    ['iriam', 21, 1],
    ['aram', 20, 1],
    ['eram', 20, 1],
    ['iram', 20, 1],
    ['avam', 20, 1],
    ['em', -1, 1],
    ['arem', 29, 1],
    ['erem', 29, 1],
    ['irem', 29, 1],
    ['assem', 29, 1],
    ['essem', 29, 1],
    ['issem', 29, 1],
    ['ado', -1, 1],
    ['ido', -1, 1],
    ['ando', -1, 1],
    ['endo', -1, 1],
    ['indo', -1, 1],
    ['ara~o', -1, 1],
    ['era~o', -1, 1],
    ['ira~o', -1, 1],
    ['ar', -1, 1],
    ['er', -1, 1],
    ['ir', -1, 1],
    ['as', -1, 1],
    ['adas', 47, 1],
    ['idas', 47, 1],
    ['ias', 47, 1],
    ['arias', 50, 1],
    ['erias', 50, 1],
    ['irias', 50, 1],
    ['aras', 47, 1],
    ['eras', 47, 1],
    ['iras', 47, 1],
    ['avas', 47, 1],
    ['es', -1, 1],
    ['ardes', 58, 1],
    ['erdes', 58, 1],
    ['irdes', 58, 1],
    ['ares', 58, 1],
    ['eres', 58, 1],
    ['ires', 58, 1],
    ['asses', 58, 1],
    ['esses', 58, 1],
    ['isses', 58, 1],
    ['astes', 58, 1],
    ['estes', 58, 1],
    ['istes', 58, 1],
    ['is', -1, 1],
    ['ais', 71, 1],
    ['eis', 71, 1],
    ['areis', 73, 1],
    ['ereis', 73, 1],
    ['ireis', 73, 1],
    ['\u00e1reis', 73, 1],
    ['\u00e9reis', 73, 1],
    ['\u00edreis', 73, 1],
    ['\u00e1sseis', 73, 1],
    ['\u00e9sseis', 73, 1],
    ['\u00edsseis', 73, 1],
    ['\u00e1veis', 73, 1],
    ['\u00edeis', 73, 1],
    ['ar\u00edeis', 84, 1],
    ['er\u00edeis', 84, 1],
    ['ir\u00edeis', 84, 1],
    ['ados', -1, 1],
    ['idos', -1, 1],
    ['amos', -1, 1],
    ['\u00e1ramos', 90, 1],
    ['\u00e9ramos', 90, 1],
    ['\u00edramos', 90, 1],
    ['\u00e1vamos', 90, 1],
    ['\u00edamos', 90, 1],
    ['ar\u00edamos', 95, 1],
    ['er\u00edamos', 95, 1],
    ['ir\u00edamos', 95, 1],
    ['emos', -1, 1],
    ['aremos', 99, 1],
    ['eremos', 99, 1],
    ['iremos', 99, 1],
    ['\u00e1ssemos', 99, 1],
    ['\u00eassemos', 99, 1],
    ['\u00edssemos', 99, 1],
    ['imos', -1, 1],
    ['armos', -1, 1],
    ['ermos', -1, 1],
    ['irmos', -1, 1],
    ['\u00e1mos', -1, 1],
    ['ar\u00e1s', -1, 1],
    ['er\u00e1s', -1, 1],
    ['ir\u00e1s', -1, 1],
    ['eu', -1, 1],
    ['iu', -1, 1],
    ['ou', -1, 1],
    ['ar\u00e1', -1, 1],
    ['er\u00e1', -1, 1],
    ['ir\u00e1', -1, 1]
  ]
  const s = [
    ['a', -1, 1],
    ['i', -1, 1],
    ['o', -1, 1],
    ['os', -1, 1],
    ['\u00e1', -1, 1],
    ['\u00ed', -1, 1],
    ['\u00f3', -1, 1]
  ]
  const r = [
    ['e', -1, 1],
    ['\u00e7', -1, 2],
    ['\u00e9', -1, 1],
    ['\u00ea', -1, 1]
  ]
  const m = [17, 65, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 19, 12, 2]
  var w = 0
  var u = 0
  var y = 0
  this.l = function () {
    let b = a.cursor
    a: for (var e; ;) {
      var f = a.cursor
      b: if (((a.c = a.cursor), (e = a.o(d)), e != 0)) {
        a.d = a.cursor
        switch (e) {
          case 1:
            if (!a.b('a~')) break a
            break
          case 2:
            if (!a.b('o~')) break a
            break
          case 3:
            if (a.cursor >= a.a) break b
            a.cursor++
        }
        continue
      }
      a.cursor = f
      break
    }
    a.cursor = b
    w = u = y = a.a
    b = a.cursor
    a: {
      b: {
        e = a.cursor
        c: if (a.i(m, 97, 250)) {
          d: {
            f = a.cursor
            e: if (a.k(m, 97, 250)) {
              f: for (;;) {
                if (a.i(m, 97, 250)) break f
                if (a.cursor >= a.a) break e
                a.cursor++
              }
              break d
            }
            a.cursor = f
            if (!a.i(m, 97, 250)) break c
            e: for (;;) {
              if (a.k(m, 97, 250)) break e
              if (a.cursor >= a.a) break c
              a.cursor++
            }
          }
          break b
        }
        a.cursor = e
        if (!a.k(m, 97, 250)) break a
        c: {
          e = a.cursor
          d: if (a.k(m, 97, 250)) {
            e: for (;;) {
              if (a.i(m, 97, 250)) break e
              if (a.cursor >= a.a) break d
              a.cursor++
            }
            break c
          }
          a.cursor = e
          if (!a.i(m, 97, 250)) break a
          if (a.cursor >= a.a) break a
          a.cursor++
        }
      }
      y = a.cursor
    }
    a.cursor = b
    b = a.cursor
    a: {
      b: for (;;) {
        if (a.i(m, 97, 250)) break b
        if (a.cursor >= a.a) break a
        a.cursor++
      }
      b: for (;;) {
        if (a.k(m, 97, 250)) break b
        if (a.cursor >= a.a) break a
        a.cursor++
      }
      u = a.cursor
      b: for (;;) {
        if (a.i(m, 97, 250)) break b
        if (a.cursor >= a.a) break a
        a.cursor++
      }
      b: for (;;) {
        if (a.k(m, 97, 250)) break b
        if (a.cursor >= a.a) break a
        a.cursor++
      }
      w = a.cursor
    }
    a.cursor = b
    a.f = a.cursor
    a.cursor = a.a
    b = a.a - a.cursor
    b: {
      e = a.a - a.cursor
      c: {
        f = a.a - a.cursor
        d: {
          const l = a.a - a.cursor
          if (h()) break d
          a.cursor = a.a - l
          if (!c()) break c
        }
        a.cursor = a.a - f
        e = a.a - a.cursor
        a.d = a.cursor
        if (a.g('i') && ((a.c = a.cursor), (f = a.a - a.cursor), a.g('c') && ((a.cursor = a.a - f), k() && !a.e()))) { return p }
        a.cursor = a.a - e
        break b
      }
      a.cursor = a.a - e
      a.d = a.cursor
      a.h(s) != 0 && ((a.c = a.cursor), !k() || a.e())
    }
    a.cursor = a.a - b
    b = a.a - a.cursor
    a.d = a.cursor
    e = a.h(r)
    if (e != 0) {
      switch (((a.c = a.cursor), e)) {
        case 1:
          if (!k() || !a.e()) break
          a.d = a.cursor
          a: {
            e = a.a - a.cursor
            if (a.g('u') && ((a.c = a.cursor), (f = a.a - a.cursor), a.g('g'))) {
              a.cursor = a.a - f
              break a
            }
            a.cursor = a.a - e
            if (!a.g('i')) break
            a.c = a.cursor
            e = a.a - a.cursor
            if (!a.g('c')) break
            a.cursor = a.a - e
          }
          if (!k() || !a.e()) break
          break
        case 2:
          a.b('c')
      }
    }
    a.cursor = a.a - b
    a.cursor = a.f
    b = a.cursor
    a: for (;;) {
      f = a.cursor
      b: if (((a.c = a.cursor), (e = a.o(n)), e != 0)) {
        a.d = a.cursor
        switch (e) {
          case 1:
            if (!a.b('\u00e3')) break a
            break
          case 2:
            if (!a.b('\u00f5')) break a
            break
          case 3:
            if (a.cursor >= a.a) break b
            a.cursor++
        }
        continue
      }
      a.cursor = f
      break
    }
    a.cursor = b
    return g
  }
  this.stemWord = function (b) {
    a.p(b)
    this.l()
    return a.j
  }
}

const stemmerInstance = new stem()

export function stemmer (word) {
  return stemmerInstance.stemWord(word)
}
