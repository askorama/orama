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
    let c
    if (!(l.cursor < b)) {
      const d = l.f
      l.f = b
      l.d = l.cursor
      c = l.h(a)
      if (c != 0) {
        switch (((l.c = l.cursor), c)) {
          case 1:
            if (!l.e()) return
            break
          case 2:
            if (!l.b('l\u00f6s')) return
            break
          case 3:
            if (!l.b('full')) return
        }
      }
      l.f = d
    }
  }
  var l = new C()
  const h = [
    ['a', -1, 1],
    ['arna', 0, 1],
    ['erna', 0, 1],
    ['heterna', 2, 1],
    ['orna', 0, 1],
    ['ad', -1, 1],
    ['e', -1, 1],
    ['ade', 6, 1],
    ['ande', 6, 1],
    ['arne', 6, 1],
    ['are', 6, 1],
    ['aste', 6, 1],
    ['en', -1, 1],
    ['anden', 12, 1],
    ['aren', 12, 1],
    ['heten', 12, 1],
    ['ern', -1, 1],
    ['ar', -1, 1],
    ['er', -1, 1],
    ['heter', 18, 1],
    ['or', -1, 1],
    ['s', -1, 2],
    ['as', 21, 1],
    ['arnas', 22, 1],
    ['ernas', 22, 1],
    ['ornas', 22, 1],
    ['es', 21, 1],
    ['ades', 26, 1],
    ['andes', 26, 1],
    ['ens', 21, 1],
    ['arens', 29, 1],
    ['hetens', 29, 1],
    ['erns', 21, 1],
    ['at', -1, 1],
    ['andet', -1, 1],
    ['het', -1, 1],
    ['ast', -1, 1]
  ]
  const c = [
    ['dd', -1, -1],
    ['gd', -1, -1],
    ['nn', -1, -1],
    ['dt', -1, -1],
    ['gt', -1, -1],
    ['kt', -1, -1],
    ['tt', -1, -1]
  ]
  var a = [
    ['ig', -1, 1],
    ['lig', 0, 1],
    ['els', -1, 1],
    ['fullt', -1, 3],
    ['l\u00f6st', -1, 2]
  ]
  const d = [17, 65, 16, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 0, 32]
  const n = [119, 127, 149]
  let v = 0
  var b = 0
  this.l = function () {
    let a = l.cursor
    a: {
      b = l.a
      var q = l.cursor
      var t = l.cursor + 3
      if (!(t > l.a)) {
        l.cursor = t
        v = l.cursor
        l.cursor = q
        b: for (;;) {
          q = l.cursor
          if (l.i(d, 97, 246)) {
            l.cursor = q
            break b
          }
          l.cursor = q
          if (l.cursor >= l.a) break a
          l.cursor++
        }
        b: for (;;) {
          if (l.k(d, 97, 246)) break b
          if (l.cursor >= l.a) break a
          l.cursor++
        }
        b = l.cursor
        b < v && (b = v)
      }
    }
    l.cursor = a
    l.f = l.cursor
    l.cursor = l.a
    a = l.a - l.cursor
    if (!(l.cursor < b)) {
      if (((t = l.f), (l.f = b), (l.d = l.cursor), (q = l.h(h)), q == 0)) l.f = t
      else {
        switch (((l.c = l.cursor), (l.f = t), q)) {
          case 1:
            if (!l.e()) break
            break
          case 2:
            !l.n(n, 98, 121) || l.e()
        }
      }
    }
    l.cursor = l.a - a
    a = l.a - l.cursor
    l.cursor < b ||
      ((q = l.f),
      (l.f = b),
      (t = l.a - l.cursor),
      l.h(c) == 0
        ? (l.f = q)
        : ((l.cursor = l.a - t),
          (l.d = l.cursor),
          l.cursor <= l.f ? (l.f = q) : (l.cursor--, (l.c = l.cursor), l.e() && (l.f = q))))
    l.cursor = l.a - a
    a = l.a - l.cursor
    k()
    l.cursor = l.a - a
    l.cursor = l.f
    return g
  }
  this.stemWord = function (a) {
    l.p(a)
    this.l()
    return l.j
  }
}

const stemmerInstance = new stem()

export function stemmer (word) {
  return stemmerInstance.stemWord(word)
}
