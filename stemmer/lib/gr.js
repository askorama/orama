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
    for (var b; ;) {
      const c = a.a - a.cursor
      a: if (((a.d = a.cursor), (b = a.h(d)), b != 0)) {
        a.c = a.cursor
        switch (b) {
          case 1:
            if (!a.b('\u03b1')) return
            break
          case 2:
            if (!a.b('\u03b2')) return
            break
          case 3:
            if (!a.b('\u03b3')) return
            break
          case 4:
            if (!a.b('\u03b4')) return
            break
          case 5:
            if (!a.b('\u03b5')) return
            break
          case 6:
            if (!a.b('\u03b6')) return
            break
          case 7:
            if (!a.b('\u03b7')) return
            break
          case 8:
            if (!a.b('\u03b8')) return
            break
          case 9:
            if (!a.b('\u03b9')) return
            break
          case 10:
            if (!a.b('\u03ba')) return
            break
          case 11:
            if (!a.b('\u03bb')) return
            break
          case 12:
            if (!a.b('\u03bc')) return
            break
          case 13:
            if (!a.b('\u03bd')) return
            break
          case 14:
            if (!a.b('\u03be')) return
            break
          case 15:
            if (!a.b('\u03bf')) return
            break
          case 16:
            if (!a.b('\u03c0')) return
            break
          case 17:
            if (!a.b('\u03c1')) return
            break
          case 18:
            if (!a.b('\u03c3')) return
            break
          case 19:
            if (!a.b('\u03c4')) return
            break
          case 20:
            if (!a.b('\u03c5')) return
            break
          case 21:
            if (!a.b('\u03c6')) return
            break
          case 22:
            if (!a.b('\u03c7')) return
            break
          case 23:
            if (!a.b('\u03c8')) return
            break
          case 24:
            if (!a.b('\u03c9')) return
            break
          case 25:
            if (a.cursor <= a.f) break a
            a.cursor--
        }
        continue
      }
      a.cursor = a.a - c
      break
    }
  }
  function l () {
    let b
    a.d = a.cursor
    b = a.h(n)
    if (b != 0) {
      a.c = a.cursor
      switch (b) {
        case 1:
          if (!a.b('\u03c6\u03b1')) return
          break
        case 2:
          if (!a.b('\u03c3\u03ba\u03b1')) return
          break
        case 3:
          if (!a.b('\u03bf\u03bb\u03bf')) return
          break
        case 4:
          if (!a.b('\u03c3\u03bf')) return
          break
        case 5:
          if (!a.b('\u03c4\u03b1\u03c4\u03bf')) return
          break
        case 6:
          if (!a.b('\u03ba\u03c1\u03b5')) return
          break
        case 7:
          if (!a.b('\u03c0\u03b5\u03c1')) return
          break
        case 8:
          if (!a.b('\u03c4\u03b5\u03c1')) return
          break
        case 9:
          if (!a.b('\u03c6\u03c9')) return
          break
        case 10:
          if (!a.b('\u03ba\u03b1\u03b8\u03b5\u03c3\u03c4')) return
          break
        case 11:
          if (!a.b('\u03b3\u03b5\u03b3\u03bf\u03bd')) return
      }
      B = p
    }
  }
  function h () {
    let b = a.a - a.cursor
    a.d = a.cursor
    if (a.h(ca) != 0) {
      a.c = a.cursor
      if (!a.e()) return
      B = p
      a.d = a.cursor
      a.c = a.cursor
      if (a.h(ba) != 0 && !(a.cursor > a.f) && !a.b('\u03b1\u03b3\u03b1\u03bd')) return
    }
    a.cursor = a.a - b
    a.d = a.cursor
    if (a.g('\u03b1\u03bd\u03b5') && ((a.c = a.cursor), a.e())) {
      B = p
      a: {
        b = a.a - a.cursor
        a.d = a.cursor
        a.c = a.cursor
        if (a.n(ha, 945, 969)) {
          if (!a.b('\u03b1\u03bd')) return
          break a
        }
        a.cursor = a.a - b
        a.d = a.cursor
      }
      a.c = a.cursor
      a.h(F) == 0 || a.cursor > a.f || a.b('\u03b1\u03bd')
    }
  }
  function c () {
    let b = a.a - a.cursor
    a.d = a.cursor
    if (a.h(W) != 0) {
      a.c = a.cursor
      if (!a.e()) return
      B = p
    }
    a.cursor = a.a - b
    a.d = a.cursor
    if (a.g('\u03b5\u03c4\u03b5') && ((a.c = a.cursor), a.e())) {
      B = p
      a: {
        b = a.a - a.cursor
        a.d = a.cursor
        a.c = a.cursor
        if (a.n(ha, 945, 969)) {
          if (!a.b('\u03b5\u03c4')) return
          break a
        }
        a.cursor = a.a - b
        a.d = a.cursor
        a.c = a.cursor
        if (a.h(da) != 0) {
          if (!a.b('\u03b5\u03c4')) return
          break a
        }
        a.cursor = a.a - b
        a.d = a.cursor
      }
      a.c = a.cursor
      a.h(ea) == 0 || a.cursor > a.f || a.b('\u03b5\u03c4')
    }
  }
  var a = new C()
  var d = [
    ['', -1, 25],
    ['\u0386', 0, 1],
    ['\u0388', 0, 5],
    ['\u0389', 0, 7],
    ['\u038a', 0, 9],
    ['\u038c', 0, 15],
    ['\u038e', 0, 20],
    ['\u038f', 0, 24],
    ['\u0390', 0, 7],
    ['\u0391', 0, 1],
    ['\u0392', 0, 2],
    ['\u0393', 0, 3],
    ['\u0394', 0, 4],
    ['\u0395', 0, 5],
    ['\u0396', 0, 6],
    ['\u0397', 0, 7],
    ['\u0398', 0, 8],
    ['\u0399', 0, 9],
    ['\u039a', 0, 10],
    ['\u039b', 0, 11],
    ['\u039c', 0, 12],
    ['\u039d', 0, 13],
    ['\u039e', 0, 14],
    ['\u039f', 0, 15],
    ['\u03a0', 0, 16],
    ['\u03a1', 0, 17],
    ['\u03a3', 0, 18],
    ['\u03a4', 0, 19],
    ['\u03a5', 0, 20],
    ['\u03a6', 0, 21],
    ['\u03a7', 0, 22],
    ['\u03a8', 0, 23],
    ['\u03a9', 0, 24],
    ['\u03aa', 0, 9],
    ['\u03ab', 0, 20],
    ['\u03ac', 0, 1],
    ['\u03ad', 0, 5],
    ['\u03ae', 0, 7],
    ['\u03af', 0, 9],
    ['\u03b0', 0, 20],
    ['\u03c2', 0, 18],
    ['\u03ca', 0, 7],
    ['\u03cb', 0, 20],
    ['\u03cc', 0, 15],
    ['\u03cd', 0, 20],
    ['\u03ce', 0, 24]
  ]
  var n = [
    ['\u03c3\u03ba\u03b1\u03b3\u03b9\u03b1', -1, 2],
    ['\u03c6\u03b1\u03b3\u03b9\u03b1', -1, 1],
    ['\u03bf\u03bb\u03bf\u03b3\u03b9\u03b1', -1, 3],
    ['\u03c3\u03bf\u03b3\u03b9\u03b1', -1, 4],
    ['\u03c4\u03b1\u03c4\u03bf\u03b3\u03b9\u03b1', -1, 5],
    ['\u03ba\u03c1\u03b5\u03b1\u03c4\u03b1', -1, 6],
    ['\u03c0\u03b5\u03c1\u03b1\u03c4\u03b1', -1, 7],
    ['\u03c4\u03b5\u03c1\u03b1\u03c4\u03b1', -1, 8],
    ['\u03b3\u03b5\u03b3\u03bf\u03bd\u03bf\u03c4\u03b1', -1, 11],
    ['\u03ba\u03b1\u03b8\u03b5\u03c3\u03c4\u03c9\u03c4\u03b1', -1, 10],
    ['\u03c6\u03c9\u03c4\u03b1', -1, 9],
    ['\u03c0\u03b5\u03c1\u03b1\u03c4\u03b7', -1, 7],
    ['\u03c3\u03ba\u03b1\u03b3\u03b9\u03c9\u03bd', -1, 2],
    ['\u03c6\u03b1\u03b3\u03b9\u03c9\u03bd', -1, 1],
    ['\u03bf\u03bb\u03bf\u03b3\u03b9\u03c9\u03bd', -1, 3],
    ['\u03c3\u03bf\u03b3\u03b9\u03c9\u03bd', -1, 4],
    ['\u03c4\u03b1\u03c4\u03bf\u03b3\u03b9\u03c9\u03bd', -1, 5],
    ['\u03ba\u03c1\u03b5\u03b1\u03c4\u03c9\u03bd', -1, 6],
    ['\u03c0\u03b5\u03c1\u03b1\u03c4\u03c9\u03bd', -1, 7],
    ['\u03c4\u03b5\u03c1\u03b1\u03c4\u03c9\u03bd', -1, 8],
    ['\u03b3\u03b5\u03b3\u03bf\u03bd\u03bf\u03c4\u03c9\u03bd', -1, 11],
    ['\u03ba\u03b1\u03b8\u03b5\u03c3\u03c4\u03c9\u03c4\u03c9\u03bd', -1, 10],
    ['\u03c6\u03c9\u03c4\u03c9\u03bd', -1, 9],
    ['\u03ba\u03c1\u03b5\u03b1\u03c3', -1, 6],
    ['\u03c0\u03b5\u03c1\u03b1\u03c3', -1, 7],
    ['\u03c4\u03b5\u03c1\u03b1\u03c3', -1, 8],
    ['\u03b3\u03b5\u03b3\u03bf\u03bd\u03bf\u03c3', -1, 11],
    ['\u03ba\u03c1\u03b5\u03b1\u03c4\u03bf\u03c3', -1, 6],
    ['\u03c0\u03b5\u03c1\u03b1\u03c4\u03bf\u03c3', -1, 7],
    ['\u03c4\u03b5\u03c1\u03b1\u03c4\u03bf\u03c3', -1, 8],
    ['\u03b3\u03b5\u03b3\u03bf\u03bd\u03bf\u03c4\u03bf\u03c3', -1, 11],
    ['\u03ba\u03b1\u03b8\u03b5\u03c3\u03c4\u03c9\u03c4\u03bf\u03c3', -1, 10],
    ['\u03c6\u03c9\u03c4\u03bf\u03c3', -1, 9],
    ['\u03ba\u03b1\u03b8\u03b5\u03c3\u03c4\u03c9\u03c3', -1, 10],
    ['\u03c6\u03c9\u03c3', -1, 9],
    ['\u03c3\u03ba\u03b1\u03b3\u03b9\u03bf\u03c5', -1, 2],
    ['\u03c6\u03b1\u03b3\u03b9\u03bf\u03c5', -1, 1],
    ['\u03bf\u03bb\u03bf\u03b3\u03b9\u03bf\u03c5', -1, 3],
    ['\u03c3\u03bf\u03b3\u03b9\u03bf\u03c5', -1, 4],
    ['\u03c4\u03b1\u03c4\u03bf\u03b3\u03b9\u03bf\u03c5', -1, 5]
  ]
  const v = [
    ['\u03c0\u03b1', -1, 1],
    ['\u03be\u03b1\u03bd\u03b1\u03c0\u03b1', 0, 1],
    ['\u03b5\u03c0\u03b1', 0, 1],
    ['\u03c0\u03b5\u03c1\u03b9\u03c0\u03b1', 0, 1],
    ['\u03b1\u03bd\u03b1\u03bc\u03c0\u03b1', 0, 1],
    ['\u03b5\u03bc\u03c0\u03b1', 0, 1],
    ['\u03b2', -1, 2],
    ['\u03b4\u03b1\u03bd\u03b5', -1, 1],
    ['\u03b2\u03b1\u03b8\u03c5\u03c1\u03b9', -1, 2],
    ['\u03b2\u03b1\u03c1\u03ba', -1, 2],
    ['\u03bc\u03b1\u03c1\u03ba', -1, 2],
    ['\u03bb', -1, 2],
    ['\u03bc', -1, 2],
    ['\u03ba\u03bf\u03c1\u03bd', -1, 2],
    ['\u03b1\u03b8\u03c1\u03bf', -1, 1],
    ['\u03c3\u03c5\u03bd\u03b1\u03b8\u03c1\u03bf', 14, 1],
    ['\u03c0', -1, 2],
    ['\u03b9\u03bc\u03c0', 16, 2],
    ['\u03c1', -1, 2],
    ['\u03bc\u03b1\u03c1', 18, 2],
    ['\u03b1\u03bc\u03c0\u03b1\u03c1', 18, 2],
    ['\u03b3\u03ba\u03c1', 18, 2],
    ['\u03b2\u03bf\u03bb\u03b2\u03bf\u03c1', 18, 2],
    ['\u03b3\u03bb\u03c5\u03ba\u03bf\u03c1', 18, 2],
    ['\u03c0\u03b9\u03c0\u03b5\u03c1\u03bf\u03c1', 18, 2],
    ['\u03c0\u03c1', 18, 2],
    ['\u03bc\u03c0\u03c1', 25, 2],
    ['\u03b1\u03c1\u03c1', 18, 2],
    ['\u03b3\u03bb\u03c5\u03ba\u03c5\u03c1', 18, 2],
    ['\u03c0\u03bf\u03bb\u03c5\u03c1', 18, 2],
    ['\u03bb\u03bf\u03c5', -1, 2]
  ]
  const b = [
    ['\u03b9\u03b6\u03b1', -1, 1],
    ['\u03b9\u03b6\u03b5', -1, 1],
    ['\u03b9\u03b6\u03b1\u03bc\u03b5', -1, 1],
    ['\u03b9\u03b6\u03bf\u03c5\u03bc\u03b5', -1, 1],
    ['\u03b9\u03b6\u03b1\u03bd\u03b5', -1, 1],
    ['\u03b9\u03b6\u03bf\u03c5\u03bd\u03b5', -1, 1],
    ['\u03b9\u03b6\u03b1\u03c4\u03b5', -1, 1],
    ['\u03b9\u03b6\u03b5\u03c4\u03b5', -1, 1],
    ['\u03b9\u03b6\u03b5\u03b9', -1, 1],
    ['\u03b9\u03b6\u03b1\u03bd', -1, 1],
    ['\u03b9\u03b6\u03bf\u03c5\u03bd', -1, 1],
    ['\u03b9\u03b6\u03b5\u03c3', -1, 1],
    ['\u03b9\u03b6\u03b5\u03b9\u03c3', -1, 1],
    ['\u03b9\u03b6\u03c9', -1, 1]
  ]
  const f = [
    ['\u03b2\u03b9', -1, 1],
    ['\u03bb\u03b9', -1, 1],
    ['\u03b1\u03bb', -1, 1],
    ['\u03b5\u03bd', -1, 1],
    ['\u03c3', -1, 1],
    ['\u03c7', -1, 1],
    ['\u03c5\u03c8', -1, 1],
    ['\u03b6\u03c9', -1, 1]
  ]
  const q = [
    ['\u03c9\u03b8\u03b7\u03ba\u03b1', -1, 1],
    ['\u03c9\u03b8\u03b7\u03ba\u03b5', -1, 1],
    ['\u03c9\u03b8\u03b7\u03ba\u03b1\u03bc\u03b5', -1, 1],
    ['\u03c9\u03b8\u03b7\u03ba\u03b1\u03bd\u03b5', -1, 1],
    ['\u03c9\u03b8\u03b7\u03ba\u03b1\u03c4\u03b5', -1, 1],
    ['\u03c9\u03b8\u03b7\u03ba\u03b1\u03bd', -1, 1],
    ['\u03c9\u03b8\u03b7\u03ba\u03b5\u03c3', -1, 1]
  ]
  const t = [
    ['\u03be\u03b1\u03bd\u03b1\u03c0\u03b1', -1, 1],
    ['\u03b5\u03c0\u03b1', -1, 1],
    ['\u03c0\u03b5\u03c1\u03b9\u03c0\u03b1', -1, 1],
    ['\u03b1\u03bd\u03b1\u03bc\u03c0\u03b1', -1, 1],
    ['\u03b5\u03bc\u03c0\u03b1', -1, 1],
    ['\u03c7\u03b1\u03c1\u03c4\u03bf\u03c0\u03b1', -1, 1],
    ['\u03b5\u03be\u03b1\u03c1\u03c7\u03b1', -1, 1],
    ['\u03b3\u03b5', -1, 2],
    ['\u03b3\u03ba\u03b5', -1, 2],
    ['\u03ba\u03bb\u03b5', -1, 1],
    ['\u03b5\u03ba\u03bb\u03b5', 9, 1],
    ['\u03b1\u03c0\u03b5\u03ba\u03bb\u03b5', 10, 1],
    ['\u03b1\u03c0\u03bf\u03ba\u03bb\u03b5', 9, 1],
    ['\u03b5\u03c3\u03c9\u03ba\u03bb\u03b5', 9, 1],
    ['\u03b4\u03b1\u03bd\u03b5', -1, 1],
    ['\u03c0\u03b5', -1, 1],
    ['\u03b5\u03c0\u03b5', 15, 1],
    ['\u03bc\u03b5\u03c4\u03b5\u03c0\u03b5', 16, 1],
    ['\u03b5\u03c3\u03b5', -1, 1],
    ['\u03b3\u03ba', -1, 2],
    ['\u03bc', -1, 2],
    ['\u03c0\u03bf\u03c5\u03ba\u03b1\u03bc', 20, 2],
    ['\u03ba\u03bf\u03bc', 20, 2],
    ['\u03b1\u03bd', -1, 2],
    ['\u03bf\u03bb\u03bf', -1, 2],
    ['\u03b1\u03b8\u03c1\u03bf', -1, 1],
    ['\u03c3\u03c5\u03bd\u03b1\u03b8\u03c1\u03bf', 25, 1],
    ['\u03c0', -1, 2],
    ['\u03bb\u03b1\u03c1', -1, 2],
    ['\u03b4\u03b7\u03bc\u03bf\u03ba\u03c1\u03b1\u03c4', -1, 2],
    ['\u03b1\u03c6', -1, 2],
    ['\u03b3\u03b9\u03b3\u03b1\u03bd\u03c4\u03bf\u03b1\u03c6', 30, 2]
  ]
  const s = [
    ['\u03b9\u03c3\u03b1', -1, 1],
    ['\u03b9\u03c3\u03b1\u03bc\u03b5', -1, 1],
    ['\u03b9\u03c3\u03b1\u03bd\u03b5', -1, 1],
    ['\u03b9\u03c3\u03b5', -1, 1],
    ['\u03b9\u03c3\u03b1\u03c4\u03b5', -1, 1],
    ['\u03b9\u03c3\u03b1\u03bd', -1, 1],
    ['\u03b9\u03c3\u03b5\u03c3', -1, 1]
  ]
  const r = [
    ['\u03be\u03b1\u03bd\u03b1\u03c0\u03b1', -1, 1],
    ['\u03b5\u03c0\u03b1', -1, 1],
    ['\u03c0\u03b5\u03c1\u03b9\u03c0\u03b1', -1, 1],
    ['\u03b1\u03bd\u03b1\u03bc\u03c0\u03b1', -1, 1],
    ['\u03b5\u03bc\u03c0\u03b1', -1, 1],
    ['\u03c7\u03b1\u03c1\u03c4\u03bf\u03c0\u03b1', -1, 1],
    ['\u03b5\u03be\u03b1\u03c1\u03c7\u03b1', -1, 1],
    ['\u03ba\u03bb\u03b5', -1, 1],
    ['\u03b5\u03ba\u03bb\u03b5', 7, 1],
    ['\u03b1\u03c0\u03b5\u03ba\u03bb\u03b5', 8, 1],
    ['\u03b1\u03c0\u03bf\u03ba\u03bb\u03b5', 7, 1],
    ['\u03b5\u03c3\u03c9\u03ba\u03bb\u03b5', 7, 1],
    ['\u03b4\u03b1\u03bd\u03b5', -1, 1],
    ['\u03c0\u03b5', -1, 1],
    ['\u03b5\u03c0\u03b5', 13, 1],
    ['\u03bc\u03b5\u03c4\u03b5\u03c0\u03b5', 14, 1],
    ['\u03b5\u03c3\u03b5', -1, 1],
    ['\u03b1\u03b8\u03c1\u03bf', -1, 1],
    ['\u03c3\u03c5\u03bd\u03b1\u03b8\u03c1\u03bf', 17, 1]
  ]
  const m = [
    ['\u03b9\u03c3\u03bf\u03c5\u03bc\u03b5', -1, 1],
    ['\u03b9\u03c3\u03bf\u03c5\u03bd\u03b5', -1, 1],
    ['\u03b9\u03c3\u03b5\u03c4\u03b5', -1, 1],
    ['\u03b9\u03c3\u03b5\u03b9', -1, 1],
    ['\u03b9\u03c3\u03bf\u03c5\u03bd', -1, 1],
    ['\u03b9\u03c3\u03b5\u03b9\u03c3', -1, 1],
    ['\u03b9\u03c3\u03c9', -1, 1]
  ]
  const w = [
    ['\u03b1\u03c4\u03b1', -1, 2],
    ['\u03c6\u03b1', -1, 2],
    ['\u03b7\u03c6\u03b1', 1, 2],
    ['\u03bc\u03b5\u03b3', -1, 2],
    ['\u03bb\u03c5\u03b3', -1, 2],
    ['\u03b7\u03b4', -1, 2],
    ['\u03ba\u03bb\u03b5', -1, 1],
    ['\u03b5\u03c3\u03c9\u03ba\u03bb\u03b5', 6, 1],
    ['\u03c0\u03bb\u03b5', -1, 1],
    ['\u03b4\u03b1\u03bd\u03b5', -1, 1],
    ['\u03c3\u03b5', -1, 1],
    ['\u03b1\u03c3\u03b5', 10, 1],
    ['\u03ba\u03b1\u03b8', -1, 2],
    ['\u03b5\u03c7\u03b8', -1, 2],
    ['\u03ba\u03b1\u03ba', -1, 2],
    ['\u03bc\u03b1\u03ba', -1, 2],
    ['\u03c3\u03ba', -1, 2],
    ['\u03c6\u03b9\u03bb', -1, 2],
    ['\u03ba\u03c5\u03bb', -1, 2],
    ['\u03bc', -1, 2],
    ['\u03b3\u03b5\u03bc', 19, 2],
    ['\u03b1\u03c7\u03bd', -1, 2],
    ['\u03c3\u03c5\u03bd\u03b1\u03b8\u03c1\u03bf', -1, 1],
    ['\u03c0', -1, 2],
    ['\u03b1\u03c0', 23, 2],
    ['\u03b5\u03bc\u03c0', 23, 2],
    ['\u03b5\u03c5\u03c0', 23, 2],
    ['\u03b1\u03c1', -1, 2],
    ['\u03b1\u03bf\u03c1', -1, 2],
    ['\u03b3\u03c5\u03c1', -1, 2],
    ['\u03c7\u03c1', -1, 2],
    ['\u03c7\u03c9\u03c1', -1, 2],
    ['\u03ba\u03c4', -1, 2],
    ['\u03b1\u03ba\u03c4', 32, 2],
    ['\u03c7\u03c4', -1, 2],
    ['\u03b1\u03c7\u03c4', 34, 2],
    ['\u03c4\u03b1\u03c7', -1, 2],
    ['\u03c3\u03c7', -1, 2],
    ['\u03b1\u03c3\u03c7', 37, 2],
    ['\u03c5\u03c8', -1, 2]
  ]
  const u = [
    ['\u03b9\u03c3\u03c4\u03b1', -1, 1],
    ['\u03b9\u03c3\u03c4\u03b5', -1, 1],
    ['\u03b9\u03c3\u03c4\u03b7', -1, 1],
    ['\u03b9\u03c3\u03c4\u03bf\u03b9', -1, 1],
    ['\u03b9\u03c3\u03c4\u03c9\u03bd', -1, 1],
    ['\u03b9\u03c3\u03c4\u03bf', -1, 1],
    ['\u03b9\u03c3\u03c4\u03b5\u03c3', -1, 1],
    ['\u03b9\u03c3\u03c4\u03b7\u03c3', -1, 1],
    ['\u03b9\u03c3\u03c4\u03bf\u03c3', -1, 1],
    ['\u03b9\u03c3\u03c4\u03bf\u03c5\u03c3', -1, 1],
    ['\u03b9\u03c3\u03c4\u03bf\u03c5', -1, 1]
  ]
  const y = [
    ['\u03b5\u03b3\u03ba\u03bb\u03b5', -1, 1],
    ['\u03b1\u03c0\u03bf\u03ba\u03bb\u03b5', -1, 1],
    ['\u03b4\u03b1\u03bd\u03b5', -1, 2],
    ['\u03b1\u03bd\u03c4\u03b9\u03b4\u03b1\u03bd\u03b5', 2, 2],
    ['\u03c3\u03b5', -1, 1],
    ['\u03bc\u03b5\u03c4\u03b1\u03c3\u03b5', 4, 1],
    ['\u03bc\u03b9\u03ba\u03c1\u03bf\u03c3\u03b5', 4, 1]
  ]
  const z = [
    ['\u03b1\u03c4\u03bf\u03bc\u03b9\u03ba', -1, 2],
    ['\u03b5\u03b8\u03bd\u03b9\u03ba', -1, 4],
    ['\u03c4\u03bf\u03c0\u03b9\u03ba', -1, 7],
    ['\u03b5\u03ba\u03bb\u03b5\u03ba\u03c4\u03b9\u03ba', -1, 5],
    ['\u03c3\u03ba\u03b5\u03c0\u03c4\u03b9\u03ba', -1, 6],
    ['\u03b3\u03bd\u03c9\u03c3\u03c4\u03b9\u03ba', -1, 3],
    ['\u03b1\u03b3\u03bd\u03c9\u03c3\u03c4\u03b9\u03ba', 5, 1],
    ['\u03b1\u03bb\u03b5\u03be\u03b1\u03bd\u03b4\u03c1\u03b9\u03bd', -1, 8],
    ['\u03b8\u03b5\u03b1\u03c4\u03c1\u03b9\u03bd', -1, 10],
    ['\u03b2\u03c5\u03b6\u03b1\u03bd\u03c4\u03b9\u03bd', -1, 9]
  ]
  const e = [
    ['\u03b9\u03c3\u03bc\u03bf\u03b9', -1, 1],
    ['\u03b9\u03c3\u03bc\u03c9\u03bd', -1, 1],
    ['\u03b9\u03c3\u03bc\u03bf', -1, 1],
    ['\u03b9\u03c3\u03bc\u03bf\u03c3', -1, 1],
    ['\u03b9\u03c3\u03bc\u03bf\u03c5\u03c3', -1, 1],
    ['\u03b9\u03c3\u03bc\u03bf\u03c5', -1, 1]
  ]
  const A = [
    ['\u03c3', -1, 1],
    ['\u03c7', -1, 1]
  ]
  const H = [
    ['\u03bf\u03c5\u03b4\u03b1\u03ba\u03b9\u03b1', -1, 1],
    ['\u03b1\u03c1\u03b1\u03ba\u03b9\u03b1', -1, 1],
    ['\u03bf\u03c5\u03b4\u03b1\u03ba\u03b9', -1, 1],
    ['\u03b1\u03c1\u03b1\u03ba\u03b9', -1, 1]
  ]
  const G = [
    ['\u03b2', -1, 2],
    ['\u03b2\u03b1\u03bc\u03b2', 0, 1],
    ['\u03c3\u03bb\u03bf\u03b2', 0, 1],
    ['\u03c4\u03c3\u03b5\u03c7\u03bf\u03c3\u03bb\u03bf\u03b2', 2, 1],
    ['\u03ba\u03b1\u03c1\u03b4', -1, 2],
    ['\u03b6', -1, 2],
    ['\u03c4\u03b6', 5, 1],
    ['\u03ba', -1, 1],
    ['\u03ba\u03b1\u03c0\u03b1\u03ba', 7, 1],
    ['\u03c3\u03bf\u03ba', 7, 1],
    ['\u03c3\u03ba', 7, 1],
    ['\u03b2\u03b1\u03bb', -1, 2],
    ['\u03bc\u03b1\u03bb', -1, 1],
    ['\u03b3\u03bb', -1, 2],
    ['\u03c4\u03c1\u03b9\u03c0\u03bf\u03bb', -1, 2],
    ['\u03c0\u03bb', -1, 1],
    ['\u03bb\u03bf\u03c5\u03bb', -1, 1],
    ['\u03c6\u03c5\u03bb', -1, 1],
    ['\u03ba\u03b1\u03b9\u03bc', -1, 1],
    ['\u03ba\u03bb\u03b9\u03bc', -1, 1],
    ['\u03c6\u03b1\u03c1\u03bc', -1, 1],
    ['\u03b3\u03b9\u03b1\u03bd', -1, 2],
    ['\u03c3\u03c0\u03b1\u03bd', -1, 1],
    ['\u03b7\u03b3\u03bf\u03c5\u03bc\u03b5\u03bd', -1, 2],
    ['\u03ba\u03bf\u03bd', -1, 1],
    ['\u03bc\u03b1\u03ba\u03c1\u03c5\u03bd', -1, 2],
    ['\u03c0', -1, 2],
    ['\u03ba\u03b1\u03c4\u03c1\u03b1\u03c0', 26, 1],
    ['\u03c1', -1, 1],
    ['\u03b2\u03c1', 28, 1],
    ['\u03bb\u03b1\u03b2\u03c1', 29, 1],
    ['\u03b1\u03bc\u03b2\u03c1', 29, 1],
    ['\u03bc\u03b5\u03c1', 28, 1],
    ['\u03c0\u03b1\u03c4\u03b5\u03c1', 28, 2],
    ['\u03b1\u03bd\u03b8\u03c1', 28, 1],
    ['\u03ba\u03bf\u03c1', 28, 1],
    ['\u03c3', -1, 1],
    ['\u03bd\u03b1\u03b3\u03ba\u03b1\u03c3', 36, 1],
    ['\u03c4\u03bf\u03c3', 36, 2],
    ['\u03bc\u03bf\u03c5\u03c3\u03c4', -1, 1],
    ['\u03c1\u03c5', -1, 1],
    ['\u03c6', -1, 1],
    ['\u03c3\u03c6', 41, 1],
    ['\u03b1\u03bb\u03b9\u03c3\u03c6', 42, 1],
    ['\u03bd\u03c5\u03c6', 41, 2],
    ['\u03c7', -1, 1]
  ]
  const E = [
    ['\u03b1\u03ba\u03b9\u03b1', -1, 1],
    ['\u03b1\u03c1\u03b1\u03ba\u03b9\u03b1', 0, 1],
    ['\u03b9\u03c4\u03c3\u03b1', -1, 1],
    ['\u03b1\u03ba\u03b9', -1, 1],
    ['\u03b1\u03c1\u03b1\u03ba\u03b9', 3, 1],
    ['\u03b9\u03c4\u03c3\u03c9\u03bd', -1, 1],
    ['\u03b9\u03c4\u03c3\u03b1\u03c3', -1, 1],
    ['\u03b9\u03c4\u03c3\u03b5\u03c3', -1, 1]
  ]
  const x = [
    ['\u03c8\u03b1\u03bb', -1, 1],
    ['\u03b1\u03b9\u03c6\u03bd', -1, 1],
    ['\u03bf\u03bb\u03bf', -1, 1],
    ['\u03b9\u03c1', -1, 1]
  ]
  const O = [
    ['\u03b5', -1, 1],
    ['\u03c0\u03b1\u03b9\u03c7\u03bd', -1, 1]
  ]
  const N = [
    ['\u03b9\u03b4\u03b9\u03b1', -1, 1],
    ['\u03b9\u03b4\u03b9\u03c9\u03bd', -1, 1],
    ['\u03b9\u03b4\u03b9\u03bf', -1, 1]
  ]
  const M = [
    ['\u03b9\u03b2', -1, 1],
    ['\u03b4', -1, 1],
    ['\u03c6\u03c1\u03b1\u03b3\u03ba', -1, 1],
    ['\u03bb\u03c5\u03ba', -1, 1],
    ['\u03bf\u03b2\u03b5\u03bb', -1, 1],
    ['\u03bc\u03b7\u03bd', -1, 1],
    ['\u03c1', -1, 1]
  ]
  const P = [
    ['\u03b9\u03c3\u03ba\u03b5', -1, 1],
    ['\u03b9\u03c3\u03ba\u03bf', -1, 1],
    ['\u03b9\u03c3\u03ba\u03bf\u03c3', -1, 1],
    ['\u03b9\u03c3\u03ba\u03bf\u03c5', -1, 1]
  ]
  const Q = [
    ['\u03b1\u03b4\u03c9\u03bd', -1, 1],
    ['\u03b1\u03b4\u03b5\u03c3', -1, 1]
  ]
  const T = [
    ['\u03b3\u03b9\u03b1\u03b3\u03b9', -1, -1],
    ['\u03b8\u03b5\u03b9', -1, -1],
    ['\u03bf\u03ba', -1, -1],
    ['\u03bc\u03b1\u03bc', -1, -1],
    ['\u03bc\u03b1\u03bd', -1, -1],
    ['\u03bc\u03c0\u03b1\u03bc\u03c0', -1, -1],
    ['\u03c0\u03b5\u03b8\u03b5\u03c1', -1, -1],
    ['\u03c0\u03b1\u03c4\u03b5\u03c1', -1, -1],
    ['\u03ba\u03c5\u03c1', -1, -1],
    ['\u03bd\u03c4\u03b1\u03bd\u03c4', -1, -1]
  ]
  const U = [
    ['\u03b5\u03b4\u03c9\u03bd', -1, 1],
    ['\u03b5\u03b4\u03b5\u03c3', -1, 1]
  ]
  const R = [
    ['\u03bc\u03b9\u03bb', -1, 1],
    ['\u03b4\u03b1\u03c0', -1, 1],
    ['\u03b3\u03b7\u03c0', -1, 1],
    ['\u03b9\u03c0', -1, 1],
    ['\u03b5\u03bc\u03c0', -1, 1],
    ['\u03bf\u03c0', -1, 1],
    ['\u03ba\u03c1\u03b1\u03c3\u03c0', -1, 1],
    ['\u03c5\u03c0', -1, 1]
  ]
  const S = [
    ['\u03bf\u03c5\u03b4\u03c9\u03bd', -1, 1],
    ['\u03bf\u03c5\u03b4\u03b5\u03c3', -1, 1]
  ]
  const V = [
    ['\u03c4\u03c1\u03b1\u03b3', -1, 1],
    ['\u03c6\u03b5', -1, 1],
    ['\u03ba\u03b1\u03bb\u03b9\u03b1\u03ba', -1, 1],
    ['\u03b1\u03c1\u03ba', -1, 1],
    ['\u03c3\u03ba', -1, 1],
    ['\u03c0\u03b5\u03c4\u03b1\u03bb', -1, 1],
    ['\u03b2\u03b5\u03bb', -1, 1],
    ['\u03bb\u03bf\u03c5\u03bb', -1, 1],
    ['\u03c6\u03bb', -1, 1],
    ['\u03c7\u03bd', -1, 1],
    ['\u03c0\u03bb\u03b5\u03be', -1, 1],
    ['\u03c3\u03c0', -1, 1],
    ['\u03c6\u03c1', -1, 1],
    ['\u03c3', -1, 1],
    ['\u03bb\u03b9\u03c7', -1, 1]
  ]
  const I = [
    ['\u03b5\u03c9\u03bd', -1, 1],
    ['\u03b5\u03c9\u03c3', -1, 1]
  ]
  const D = [
    ['\u03b4', -1, 1],
    ['\u03b9\u03b4', 0, 1],
    ['\u03b8', -1, 1],
    ['\u03b3\u03b1\u03bb', -1, 1],
    ['\u03b5\u03bb', -1, 1],
    ['\u03bd', -1, 1],
    ['\u03c0', -1, 1],
    ['\u03c0\u03b1\u03c1', -1, 1]
  ]
  const L = [
    ['\u03b9\u03b1', -1, 1],
    ['\u03b9\u03c9\u03bd', -1, 1],
    ['\u03b9\u03bf\u03c5', -1, 1]
  ]
  const J = [
    ['\u03b9\u03ba\u03b1', -1, 1],
    ['\u03b9\u03ba\u03c9\u03bd', -1, 1],
    ['\u03b9\u03ba\u03bf', -1, 1],
    ['\u03b9\u03ba\u03bf\u03c5', -1, 1]
  ]
  const K = [
    ['\u03b1\u03b4', -1, 1],
    ['\u03c3\u03c5\u03bd\u03b1\u03b4', 0, 1],
    ['\u03ba\u03b1\u03c4\u03b1\u03b4', 0, 1],
    ['\u03b1\u03bd\u03c4\u03b9\u03b4', -1, 1],
    ['\u03b5\u03bd\u03b4', -1, 1],
    ['\u03c6\u03c5\u03bb\u03bf\u03b4', -1, 1],
    ['\u03c5\u03c0\u03bf\u03b4', -1, 1],
    ['\u03c0\u03c1\u03c9\u03c4\u03bf\u03b4', -1, 1],
    ['\u03b5\u03be\u03c9\u03b4', -1, 1],
    ['\u03b7\u03b8', -1, 1],
    ['\u03b1\u03bd\u03b7\u03b8', 9, 1],
    ['\u03be\u03b9\u03ba', -1, 1],
    ['\u03b1\u03bb', -1, 1],
    ['\u03b1\u03bc\u03bc\u03bf\u03c7\u03b1\u03bb', 12, 1],
    ['\u03c3\u03c5\u03bd\u03bf\u03bc\u03b7\u03bb', -1, 1],
    ['\u03bc\u03c0\u03bf\u03bb', -1, 1],
    ['\u03bc\u03bf\u03c5\u03bb', -1, 1],
    ['\u03c4\u03c3\u03b1\u03bc', -1, 1],
    ['\u03b2\u03c1\u03c9\u03bc', -1, 1],
    ['\u03b1\u03bc\u03b1\u03bd', -1, 1],
    ['\u03bc\u03c0\u03b1\u03bd', -1, 1],
    ['\u03ba\u03b1\u03bb\u03bb\u03b9\u03bd', -1, 1],
    ['\u03c0\u03bf\u03c3\u03c4\u03b5\u03bb\u03bd', -1, 1],
    ['\u03c6\u03b9\u03bb\u03bf\u03bd', -1, 1],
    ['\u03ba\u03b1\u03bb\u03c0', -1, 1],
    ['\u03b3\u03b5\u03c1', -1, 1],
    ['\u03c7\u03b1\u03c3', -1, 1],
    ['\u03bc\u03c0\u03bf\u03c3', -1, 1],
    ['\u03c0\u03bb\u03b9\u03b1\u03c4\u03c3', -1, 1],
    ['\u03c0\u03b5\u03c4\u03c3', -1, 1],
    ['\u03c0\u03b9\u03c4\u03c3', -1, 1],
    ['\u03c6\u03c5\u03c3', -1, 1],
    ['\u03bc\u03c0\u03b1\u03b3\u03b9\u03b1\u03c4', -1, 1],
    ['\u03bd\u03b9\u03c4', -1, 1],
    ['\u03c0\u03b9\u03ba\u03b1\u03bd\u03c4', -1, 1],
    ['\u03c3\u03b5\u03c1\u03c4', -1, 1]
  ]
  const $ = [
    ['\u03b1\u03b3\u03b1\u03bc\u03b5', -1, 1],
    ['\u03b7\u03ba\u03b1\u03bc\u03b5', -1, 1],
    ['\u03b7\u03b8\u03b7\u03ba\u03b1\u03bc\u03b5', 1, 1],
    ['\u03b7\u03c3\u03b1\u03bc\u03b5', -1, 1],
    ['\u03bf\u03c5\u03c3\u03b1\u03bc\u03b5', -1, 1]
  ]
  const aa = [
    ['\u03b2\u03bf\u03c5\u03b2', -1, 1],
    ['\u03be\u03b5\u03b8', -1, 1],
    ['\u03c0\u03b5\u03b8', -1, 1],
    ['\u03b1\u03c0\u03bf\u03b8', -1, 1],
    ['\u03b1\u03c0\u03bf\u03ba', -1, 1],
    ['\u03bf\u03c5\u03bb', -1, 1],
    ['\u03b1\u03bd\u03b1\u03c0', -1, 1],
    ['\u03c0\u03b9\u03ba\u03c1', -1, 1],
    ['\u03c0\u03bf\u03c4', -1, 1],
    ['\u03b1\u03c0\u03bf\u03c3\u03c4', -1, 1],
    ['\u03c7', -1, 1],
    ['\u03c3\u03b9\u03c7', 10, 1]
  ]
  var ba = [
    ['\u03c4\u03c1', -1, 1],
    ['\u03c4\u03c3', -1, 1]
  ]
  var ca = [
    ['\u03b1\u03b3\u03b1\u03bd\u03b5', -1, 1],
    ['\u03b7\u03ba\u03b1\u03bd\u03b5', -1, 1],
    ['\u03b7\u03b8\u03b7\u03ba\u03b1\u03bd\u03b5', 1, 1],
    ['\u03b7\u03c3\u03b1\u03bd\u03b5', -1, 1],
    ['\u03bf\u03c5\u03c3\u03b1\u03bd\u03b5', -1, 1],
    ['\u03bf\u03bd\u03c4\u03b1\u03bd\u03b5', -1, 1],
    ['\u03b9\u03bf\u03bd\u03c4\u03b1\u03bd\u03b5', 5, 1],
    ['\u03bf\u03c5\u03bd\u03c4\u03b1\u03bd\u03b5', -1, 1],
    ['\u03b9\u03bf\u03c5\u03bd\u03c4\u03b1\u03bd\u03b5', 7, 1],
    ['\u03bf\u03c4\u03b1\u03bd\u03b5', -1, 1],
    ['\u03b9\u03bf\u03c4\u03b1\u03bd\u03b5', 9, 1]
  ]
  var F = [
    ['\u03c4\u03b1\u03b2', -1, 1],
    ['\u03bd\u03c4\u03b1\u03b2', 0, 1],
    ['\u03c8\u03b7\u03bb\u03bf\u03c4\u03b1\u03b2', 0, 1],
    ['\u03bb\u03b9\u03b2', -1, 1],
    ['\u03ba\u03bb\u03b9\u03b2', 3, 1],
    ['\u03be\u03b7\u03c1\u03bf\u03ba\u03bb\u03b9\u03b2', 4, 1],
    ['\u03b3', -1, 1],
    ['\u03b1\u03b3', 6, 1],
    ['\u03c4\u03c1\u03b1\u03b3', 7, 1],
    ['\u03c4\u03c3\u03b1\u03b3', 7, 1],
    ['\u03b1\u03b8\u03b9\u03b3\u03b3', 6, 1],
    ['\u03c4\u03c3\u03b9\u03b3\u03b3', 6, 1],
    ['\u03b1\u03c4\u03c3\u03b9\u03b3\u03b3', 11, 1],
    ['\u03c3\u03c4\u03b5\u03b3', 6, 1],
    ['\u03b1\u03c0\u03b7\u03b3', 6, 1],
    ['\u03c3\u03b9\u03b3', 6, 1],
    ['\u03b1\u03bd\u03bf\u03c1\u03b3', 6, 1],
    ['\u03b5\u03bd\u03bf\u03c1\u03b3', 6, 1],
    ['\u03ba\u03b1\u03bb\u03c0\u03bf\u03c5\u03b6', -1, 1],
    ['\u03b8', -1, 1],
    ['\u03bc\u03c9\u03b1\u03bc\u03b5\u03b8', 19, 1],
    ['\u03c0\u03b9\u03b8', 19, 1],
    ['\u03b1\u03c0\u03b9\u03b8', 21, 1],
    ['\u03b4\u03b5\u03ba', -1, 1],
    ['\u03c0\u03b5\u03bb\u03b5\u03ba', -1, 1],
    ['\u03b9\u03ba', -1, 1],
    ['\u03b1\u03bd\u03b9\u03ba', 25, 1],
    ['\u03b2\u03bf\u03c5\u03bb\u03ba', -1, 1],
    ['\u03b2\u03b1\u03c3\u03ba', -1, 1],
    ['\u03b2\u03c1\u03b1\u03c7\u03c5\u03ba', -1, 1],
    ['\u03b3\u03b1\u03bb', -1, 1],
    ['\u03ba\u03b1\u03c4\u03b1\u03b3\u03b1\u03bb', 30, 1],
    ['\u03bf\u03bb\u03bf\u03b3\u03b1\u03bb', 30, 1],
    ['\u03b2\u03b1\u03b8\u03c5\u03b3\u03b1\u03bb', 30, 1],
    ['\u03bc\u03b5\u03bb', -1, 1],
    ['\u03ba\u03b1\u03c3\u03c4\u03b5\u03bb', -1, 1],
    ['\u03c0\u03bf\u03c1\u03c4\u03bf\u03bb', -1, 1],
    ['\u03c0\u03bb', -1, 1],
    ['\u03b4\u03b9\u03c0\u03bb', 37, 1],
    ['\u03bb\u03b1\u03bf\u03c0\u03bb', 37, 1],
    ['\u03c8\u03c5\u03c7\u03bf\u03c0\u03bb', 37, 1],
    ['\u03bf\u03c5\u03bb', -1, 1],
    ['\u03bc', -1, 1],
    ['\u03bf\u03bb\u03b9\u03b3\u03bf\u03b4\u03b1\u03bc', 42, 1],
    ['\u03bc\u03bf\u03c5\u03c3\u03bf\u03c5\u03bb\u03bc', 42, 1],
    ['\u03b4\u03c1\u03b1\u03b4\u03bf\u03c5\u03bc', 42, 1],
    ['\u03b2\u03c1\u03b1\u03c7\u03bc', 42, 1],
    ['\u03bd', -1, 1],
    ['\u03b1\u03bc\u03b5\u03c1\u03b9\u03ba\u03b1\u03bd', 47, 1],
    ['\u03c0', -1, 1],
    ['\u03b1\u03b4\u03b1\u03c0', 49, 1],
    ['\u03c7\u03b1\u03bc\u03b7\u03bb\u03bf\u03b4\u03b1\u03c0', 49, 1],
    ['\u03c0\u03bf\u03bb\u03c5\u03b4\u03b1\u03c0', 49, 1],
    ['\u03ba\u03bf\u03c0', 49, 1],
    ['\u03c5\u03c0\u03bf\u03ba\u03bf\u03c0', 53, 1],
    ['\u03c4\u03c3\u03bf\u03c0', 49, 1],
    ['\u03c3\u03c0', 49, 1],
    ['\u03b5\u03c1', -1, 1],
    ['\u03b3\u03b5\u03c1', 57, 1],
    ['\u03b2\u03b5\u03c4\u03b5\u03c1', 57, 1],
    ['\u03bb\u03bf\u03c5\u03b8\u03b7\u03c1', -1, 1],
    ['\u03ba\u03bf\u03c1\u03bc\u03bf\u03c1', -1, 1],
    ['\u03c0\u03b5\u03c1\u03b9\u03c4\u03c1', -1, 1],
    ['\u03bf\u03c5\u03c1', -1, 1],
    ['\u03c3', -1, 1],
    ['\u03b2\u03b1\u03c3', 64, 1],
    ['\u03c0\u03bf\u03bb\u03b9\u03c3', 64, 1],
    ['\u03c3\u03b1\u03c1\u03b1\u03ba\u03b1\u03c4\u03c3', 64, 1],
    ['\u03b8\u03c5\u03c3', 64, 1],
    ['\u03b4\u03b9\u03b1\u03c4', -1, 1],
    ['\u03c0\u03bb\u03b1\u03c4', -1, 1],
    ['\u03c4\u03c3\u03b1\u03c1\u03bb\u03b1\u03c4', -1, 1],
    ['\u03c4\u03b5\u03c4', -1, 1],
    ['\u03c0\u03bf\u03c5\u03c1\u03b9\u03c4', -1, 1],
    ['\u03c3\u03bf\u03c5\u03bb\u03c4', -1, 1],
    ['\u03bc\u03b1\u03b9\u03bd\u03c4', -1, 1],
    ['\u03b6\u03c9\u03bd\u03c4', -1, 1],
    ['\u03ba\u03b1\u03c3\u03c4', -1, 1],
    ['\u03c6', -1, 1],
    ['\u03b4\u03b9\u03b1\u03c6', 78, 1],
    ['\u03c3\u03c4\u03b5\u03c6', 78, 1],
    ['\u03c6\u03c9\u03c4\u03bf\u03c3\u03c4\u03b5\u03c6', 80, 1],
    ['\u03c0\u03b5\u03c1\u03b7\u03c6', 78, 1],
    ['\u03c5\u03c0\u03b5\u03c1\u03b7\u03c6', 82, 1],
    ['\u03ba\u03bf\u03b9\u03bb\u03b1\u03c1\u03c6', 78, 1],
    ['\u03c0\u03b5\u03bd\u03c4\u03b1\u03c1\u03c6', 78, 1],
    ['\u03bf\u03c1\u03c6', 78, 1],
    ['\u03c7', -1, 1],
    ['\u03b1\u03bc\u03b7\u03c7', 87, 1],
    ['\u03b2\u03b9\u03bf\u03bc\u03b7\u03c7', 87, 1],
    ['\u03bc\u03b5\u03b3\u03bb\u03bf\u03b2\u03b9\u03bf\u03bc\u03b7\u03c7', 89, 1],
    ['\u03ba\u03b1\u03c0\u03bd\u03bf\u03b2\u03b9\u03bf\u03bc\u03b7\u03c7', 89, 1],
    ['\u03bc\u03b9\u03ba\u03c1\u03bf\u03b2\u03b9\u03bf\u03bc\u03b7\u03c7', 89, 1],
    ['\u03c0\u03bf\u03bb\u03c5\u03bc\u03b7\u03c7', 87, 1],
    ['\u03bb\u03b9\u03c7', 87, 1]
  ]
  var W = [['\u03b7\u03c3\u03b5\u03c4\u03b5', -1, 1]]
  var da = [
    ['\u03b5\u03bd\u03b4', -1, 1],
    ['\u03c3\u03c5\u03bd\u03b4', -1, 1],
    ['\u03bf\u03b4', -1, 1],
    ['\u03b4\u03b9\u03b1\u03b8', -1, 1],
    ['\u03ba\u03b1\u03b8', -1, 1],
    ['\u03c1\u03b1\u03b8', -1, 1],
    ['\u03c4\u03b1\u03b8', -1, 1],
    ['\u03c4\u03b9\u03b8', -1, 1],
    ['\u03b5\u03ba\u03b8', -1, 1],
    ['\u03b5\u03bd\u03b8', -1, 1],
    ['\u03c3\u03c5\u03bd\u03b8', -1, 1],
    ['\u03c1\u03bf\u03b8', -1, 1],
    ['\u03c5\u03c0\u03b5\u03c1\u03b8', -1, 1],
    ['\u03c3\u03b8', -1, 1],
    ['\u03b5\u03c5\u03b8', -1, 1],
    ['\u03b1\u03c1\u03ba', -1, 1],
    ['\u03c9\u03c6\u03b5\u03bb', -1, 1],
    ['\u03b2\u03bf\u03bb', -1, 1],
    ['\u03b1\u03b9\u03bd', -1, 1],
    ['\u03c0\u03bf\u03bd', -1, 1],
    ['\u03c1\u03bf\u03bd', -1, 1],
    ['\u03c3\u03c5\u03bd', -1, 1],
    ['\u03b2\u03b1\u03c1', -1, 1],
    ['\u03b2\u03c1', -1, 1],
    ['\u03b1\u03b9\u03c1', -1, 1],
    ['\u03c6\u03bf\u03c1', -1, 1],
    ['\u03b5\u03c5\u03c1', -1, 1],
    ['\u03c0\u03c5\u03c1', -1, 1],
    ['\u03c7\u03c9\u03c1', -1, 1],
    ['\u03bd\u03b5\u03c4', -1, 1],
    ['\u03c3\u03c7', -1, 1]
  ]
  var ea = [
    ['\u03c0\u03b1\u03b3', -1, 1],
    ['\u03b4', -1, 1],
    ['\u03b1\u03b4', 1, 1],
    ['\u03b8', -1, 1],
    ['\u03b1\u03b8', 3, 1],
    ['\u03c4\u03bf\u03ba', -1, 1],
    ['\u03c3\u03ba', -1, 1],
    ['\u03c0\u03b1\u03c1\u03b1\u03ba\u03b1\u03bb', -1, 1],
    ['\u03c3\u03ba\u03b5\u03bb', -1, 1],
    ['\u03b1\u03c0\u03bb', -1, 1],
    ['\u03b5\u03bc', -1, 1],
    ['\u03b1\u03bd', -1, 1],
    ['\u03b2\u03b5\u03bd', -1, 1],
    ['\u03b2\u03b1\u03c1\u03bf\u03bd', -1, 1],
    ['\u03ba\u03bf\u03c0', -1, 1],
    ['\u03c3\u03b5\u03c1\u03c0', -1, 1],
    ['\u03b1\u03b2\u03b1\u03c1', -1, 1],
    ['\u03b5\u03bd\u03b1\u03c1', -1, 1],
    ['\u03b1\u03b2\u03c1', -1, 1],
    ['\u03bc\u03c0\u03bf\u03c1', -1, 1],
    ['\u03b8\u03b1\u03c1\u03c1', -1, 1],
    ['\u03bd\u03c4\u03c1', -1, 1],
    ['\u03c5', -1, 1],
    ['\u03bd\u03b9\u03c6', -1, 1],
    ['\u03c3\u03c5\u03c1\u03c6', -1, 1]
  ]
  const fa = [
    ['\u03bf\u03bd\u03c4\u03b1\u03c3', -1, 1],
    ['\u03c9\u03bd\u03c4\u03b1\u03c3', -1, 1]
  ]
  const ga = [
    ['\u03bf\u03bc\u03b1\u03c3\u03c4\u03b5', -1, 1],
    ['\u03b9\u03bf\u03bc\u03b1\u03c3\u03c4\u03b5', 0, 1]
  ]
  const Y = [
    ['\u03c0', -1, 1],
    ['\u03b1\u03c0', 0, 1],
    ['\u03b1\u03ba\u03b1\u03c4\u03b1\u03c0', 1, 1],
    ['\u03c3\u03c5\u03bc\u03c0', 0, 1],
    ['\u03b1\u03c3\u03c5\u03bc\u03c0', 3, 1],
    ['\u03b1\u03bc\u03b5\u03c4\u03b1\u03bc\u03c6', -1, 1]
  ]
  const Z = [
    ['\u03b6', -1, 1],
    ['\u03b1\u03bb', -1, 1],
    ['\u03c0\u03b1\u03c1\u03b1\u03ba\u03b1\u03bb', 1, 1],
    ['\u03b5\u03ba\u03c4\u03b5\u03bb', -1, 1],
    ['\u03bc', -1, 1],
    ['\u03be', -1, 1],
    ['\u03c0\u03c1\u03bf', -1, 1],
    ['\u03b1\u03c1', -1, 1],
    ['\u03bd\u03b9\u03c3', -1, 1]
  ]
  const X = [
    ['\u03b7\u03b8\u03b7\u03ba\u03b1', -1, 1],
    ['\u03b7\u03b8\u03b7\u03ba\u03b5', -1, 1],
    ['\u03b7\u03b8\u03b7\u03ba\u03b5\u03c3', -1, 1]
  ]
  const ja = [
    ['\u03c0\u03b9\u03b8', -1, 1],
    ['\u03bf\u03b8', -1, 1],
    ['\u03bd\u03b1\u03c1\u03b8', -1, 1],
    ['\u03c3\u03ba\u03bf\u03c5\u03bb', -1, 1],
    ['\u03c3\u03ba\u03c9\u03bb', -1, 1],
    ['\u03c3\u03c6', -1, 1]
  ]
  const ka = [
    ['\u03b8', -1, 1],
    ['\u03b4\u03b9\u03b1\u03b8', 0, 1],
    ['\u03c0\u03b1\u03c1\u03b1\u03ba\u03b1\u03c4\u03b1\u03b8', 0, 1],
    ['\u03c3\u03c5\u03bd\u03b8', 0, 1],
    ['\u03c0\u03c1\u03bf\u03c3\u03b8', 0, 1]
  ]
  const la = [
    ['\u03b7\u03ba\u03b1', -1, 1],
    ['\u03b7\u03ba\u03b5', -1, 1],
    ['\u03b7\u03ba\u03b5\u03c3', -1, 1]
  ]
  const ma = [
    ['\u03c6\u03b1\u03b3', -1, 1],
    ['\u03bb\u03b7\u03b3', -1, 1],
    ['\u03c6\u03c1\u03c5\u03b4', -1, 1],
    ['\u03bc\u03b1\u03bd\u03c4\u03b9\u03bb', -1, 1],
    ['\u03bc\u03b1\u03bb\u03bb', -1, 1],
    ['\u03bf\u03bc', -1, 1],
    ['\u03b2\u03bb\u03b5\u03c0', -1, 1],
    ['\u03c0\u03bf\u03b4\u03b1\u03c1', -1, 1],
    ['\u03ba\u03c5\u03bc\u03b1\u03c4', -1, 1],
    ['\u03c0\u03c1\u03c9\u03c4', -1, 1],
    ['\u03bb\u03b1\u03c7', -1, 1],
    ['\u03c0\u03b1\u03bd\u03c4\u03b1\u03c7', -1, 1]
  ]
  const na = [
    ['\u03c4\u03c3\u03b1', -1, 1],
    ['\u03c7\u03b1\u03b4', -1, 1],
    ['\u03bc\u03b5\u03b4', -1, 1],
    ['\u03bb\u03b1\u03bc\u03c0\u03b9\u03b4', -1, 1],
    ['\u03b4\u03b5', -1, 1],
    ['\u03c0\u03bb\u03b5', -1, 1],
    ['\u03bc\u03b5\u03c3\u03b1\u03b6', -1, 1],
    ['\u03b4\u03b5\u03c3\u03c0\u03bf\u03b6', -1, 1],
    ['\u03b1\u03b9\u03b8', -1, 1],
    ['\u03c6\u03b1\u03c1\u03bc\u03b1\u03ba', -1, 1],
    ['\u03b1\u03b3\u03ba', -1, 1],
    ['\u03b1\u03bd\u03b7\u03ba', -1, 1],
    ['\u03bb', -1, 1],
    ['\u03bc', -1, 1],
    ['\u03b1\u03bc', 13, 1],
    ['\u03b2\u03c1\u03bf\u03bc', 13, 1],
    ['\u03c5\u03c0\u03bf\u03c4\u03b5\u03b9\u03bd', -1, 1],
    ['\u03b5\u03ba\u03bb\u03b9\u03c0', -1, 1],
    ['\u03c1', -1, 1],
    ['\u03b5\u03bd\u03b4\u03b9\u03b1\u03c6\u03b5\u03c1', 18, 1],
    ['\u03b1\u03bd\u03b1\u03c1\u03c1', 18, 1],
    ['\u03c0\u03b1\u03c4', -1, 1],
    ['\u03ba\u03b1\u03b8\u03b1\u03c1\u03b5\u03c5', -1, 1],
    ['\u03b4\u03b5\u03c5\u03c4\u03b5\u03c1\u03b5\u03c5', -1, 1],
    ['\u03bb\u03b5\u03c7', -1, 1]
  ]
  const oa = [
    ['\u03bf\u03c5\u03c3\u03b1', -1, 1],
    ['\u03bf\u03c5\u03c3\u03b5', -1, 1],
    ['\u03bf\u03c5\u03c3\u03b5\u03c3', -1, 1]
  ]
  const pa = [
    ['\u03c0\u03b5\u03bb', -1, 1],
    ['\u03bb\u03bb', -1, 1],
    ['\u03c3\u03bc\u03b7\u03bd', -1, 1],
    ['\u03c1\u03c0', -1, 1],
    ['\u03c0\u03c1', -1, 1],
    ['\u03c6\u03c1', -1, 1],
    ['\u03c7\u03bf\u03c1\u03c4', -1, 1],
    ['\u03bf\u03c6', -1, 1],
    ['\u03c8\u03bf\u03c6', 7, -1],
    ['\u03c3\u03c6', -1, 1],
    ['\u03bb\u03bf\u03c7', -1, 1],
    ['\u03bd\u03b1\u03c5\u03bb\u03bf\u03c7', 10, -1]
  ]
  const qa = [
    ['\u03b1\u03bc\u03b1\u03bb\u03bb\u03b9', -1, 1],
    ['\u03bb', -1, 1],
    ['\u03b1\u03bc\u03b1\u03bb', 1, 1],
    ['\u03bc', -1, 1],
    ['\u03bf\u03c5\u03bb\u03b1\u03bc', 3, 1],
    ['\u03b5\u03bd', -1, 1],
    ['\u03b4\u03b5\u03c1\u03b2\u03b5\u03bd', 5, 1],
    ['\u03c0', -1, 1],
    ['\u03b1\u03b5\u03b9\u03c0', 7, 1],
    ['\u03b1\u03c1\u03c4\u03b9\u03c0', 7, 1],
    ['\u03c3\u03c5\u03bc\u03c0', 7, 1],
    ['\u03bd\u03b5\u03bf\u03c0', 7, 1],
    ['\u03ba\u03c1\u03bf\u03ba\u03b1\u03bb\u03bf\u03c0', 7, 1],
    ['\u03bf\u03bb\u03bf\u03c0', 7, 1],
    ['\u03c0\u03c1\u03bf\u03c3\u03c9\u03c0\u03bf\u03c0', 7, 1],
    ['\u03c3\u03b9\u03b4\u03b7\u03c1\u03bf\u03c0', 7, 1],
    ['\u03b4\u03c1\u03bf\u03c3\u03bf\u03c0', 7, 1],
    ['\u03b1\u03c3\u03c0', 7, 1],
    ['\u03b1\u03bd\u03c5\u03c0', 7, 1],
    ['\u03c1', -1, 1],
    ['\u03b1\u03c3\u03c0\u03b1\u03c1', 19, 1],
    ['\u03c7\u03b1\u03c1', 19, 1],
    ['\u03b1\u03c7\u03b1\u03c1', 21, 1],
    ['\u03b1\u03c0\u03b5\u03c1', 19, 1],
    ['\u03c4\u03c1', 19, 1],
    ['\u03bf\u03c5\u03c1', 19, 1],
    ['\u03c4', -1, 1],
    ['\u03b4\u03b9\u03b1\u03c4', 26, 1],
    ['\u03b5\u03c0\u03b9\u03c4', 26, 1],
    ['\u03c3\u03c5\u03bd\u03c4', 26, 1],
    ['\u03bf\u03bc\u03bf\u03c4', 26, 1],
    ['\u03bd\u03bf\u03bc\u03bf\u03c4', 30, 1],
    ['\u03b1\u03c0\u03bf\u03c4', 26, 1],
    ['\u03c5\u03c0\u03bf\u03c4', 26, 1],
    ['\u03b1\u03b2\u03b1\u03c3\u03c4', 26, 1],
    ['\u03b1\u03b9\u03bc\u03bf\u03c3\u03c4', 26, 1],
    ['\u03c0\u03c1\u03bf\u03c3\u03c4', 26, 1],
    ['\u03b1\u03bd\u03c5\u03c3\u03c4', 26, 1],
    ['\u03bd\u03b1\u03c5', -1, 1],
    ['\u03b1\u03c6', -1, 1],
    ['\u03be\u03b5\u03c6', -1, 1],
    ['\u03b1\u03b4\u03b7\u03c6', -1, 1],
    ['\u03c0\u03b1\u03bc\u03c6', -1, 1],
    ['\u03c0\u03bf\u03bb\u03c5\u03c6', -1, 1]
  ]
  const ra = [
    ['\u03b1\u03b3\u03b1', -1, 1],
    ['\u03b1\u03b3\u03b5', -1, 1],
    ['\u03b1\u03b3\u03b5\u03c3', -1, 1]
  ]
  const sa = [
    ['\u03b7\u03c3\u03b1', -1, 1],
    ['\u03b7\u03c3\u03b5', -1, 1],
    ['\u03b7\u03c3\u03bf\u03c5', -1, 1]
  ]
  const ta = [
    ['\u03bd', -1, 1],
    ['\u03b4\u03c9\u03b4\u03b5\u03ba\u03b1\u03bd', 0, 1],
    ['\u03b5\u03c0\u03c4\u03b1\u03bd', 0, 1],
    ['\u03bc\u03b5\u03b3\u03b1\u03bb\u03bf\u03bd', 0, 1],
    ['\u03b5\u03c1\u03b7\u03bc\u03bf\u03bd', 0, 1],
    ['\u03c7\u03b5\u03c1\u03c3\u03bf\u03bd', 0, 1]
  ]
  const ua = [['\u03b7\u03c3\u03c4\u03b5', -1, 1]]
  const va = [
    ['\u03c3\u03b2', -1, 1],
    ['\u03b1\u03c3\u03b2', 0, 1],
    ['\u03b1\u03c0\u03bb', -1, 1],
    ['\u03b1\u03b5\u03b9\u03bc\u03bd', -1, 1],
    ['\u03c7\u03c1', -1, 1],
    ['\u03b1\u03c7\u03c1', 4, 1],
    ['\u03ba\u03bf\u03b9\u03bd\u03bf\u03c7\u03c1', 4, 1],
    ['\u03b4\u03c5\u03c3\u03c7\u03c1', 4, 1],
    ['\u03b5\u03c5\u03c7\u03c1', 4, 1],
    ['\u03c0\u03b1\u03bb\u03b9\u03bc\u03c8', -1, 1]
  ]
  const wa = [
    ['\u03bf\u03c5\u03bd\u03b5', -1, 1],
    ['\u03b7\u03b8\u03bf\u03c5\u03bd\u03b5', 0, 1],
    ['\u03b7\u03c3\u03bf\u03c5\u03bd\u03b5', 0, 1]
  ]
  const xa = [
    ['\u03c3\u03c0\u03b9', -1, 1],
    ['\u03bd', -1, 1],
    ['\u03b5\u03be\u03c9\u03bd', 1, 1],
    ['\u03c1', -1, 1],
    ['\u03c3\u03c4\u03c1\u03b1\u03b2\u03bf\u03bc\u03bf\u03c5\u03c4\u03c3', -1, 1],
    ['\u03ba\u03b1\u03ba\u03bf\u03bc\u03bf\u03c5\u03c4\u03c3', -1, 1]
  ]
  const ya = [
    ['\u03bf\u03c5\u03bc\u03b5', -1, 1],
    ['\u03b7\u03b8\u03bf\u03c5\u03bc\u03b5', 0, 1],
    ['\u03b7\u03c3\u03bf\u03c5\u03bc\u03b5', 0, 1]
  ]
  const za = [
    ['\u03b1\u03b6', -1, 1],
    ['\u03c9\u03c1\u03b9\u03bf\u03c0\u03bb', -1, 1],
    ['\u03b1\u03c3\u03bf\u03c5\u03c3', -1, 1],
    ['\u03c0\u03b1\u03c1\u03b1\u03c3\u03bf\u03c5\u03c3', 2, 1],
    ['\u03b1\u03bb\u03bb\u03bf\u03c3\u03bf\u03c5\u03c3', -1, 1],
    ['\u03c6', -1, 1],
    ['\u03c7', -1, 1]
  ]
  const Aa = [
    ['\u03bc\u03b1\u03c4\u03b1', -1, 1],
    ['\u03bc\u03b1\u03c4\u03c9\u03bd', -1, 1],
    ['\u03bc\u03b1\u03c4\u03bf\u03c3', -1, 1]
  ]
  const Ba = [
    ['\u03b1', -1, 1],
    ['\u03b9\u03bf\u03c5\u03bc\u03b1', 0, 1],
    ['\u03bf\u03bc\u03bf\u03c5\u03bd\u03b1', 0, 1],
    ['\u03b9\u03bf\u03bc\u03bf\u03c5\u03bd\u03b1', 2, 1],
    ['\u03bf\u03c3\u03bf\u03c5\u03bd\u03b1', 0, 1],
    ['\u03b9\u03bf\u03c3\u03bf\u03c5\u03bd\u03b1', 4, 1],
    ['\u03b5', -1, 1],
    ['\u03b1\u03b3\u03b1\u03c4\u03b5', 6, 1],
    ['\u03b7\u03ba\u03b1\u03c4\u03b5', 6, 1],
    ['\u03b7\u03b8\u03b7\u03ba\u03b1\u03c4\u03b5', 8, 1],
    ['\u03b7\u03c3\u03b1\u03c4\u03b5', 6, 1],
    ['\u03bf\u03c5\u03c3\u03b1\u03c4\u03b5', 6, 1],
    ['\u03b5\u03b9\u03c4\u03b5', 6, 1],
    ['\u03b7\u03b8\u03b5\u03b9\u03c4\u03b5', 12, 1],
    ['\u03b9\u03b5\u03bc\u03b1\u03c3\u03c4\u03b5', 6, 1],
    ['\u03bf\u03c5\u03bc\u03b1\u03c3\u03c4\u03b5', 6, 1],
    ['\u03b9\u03bf\u03c5\u03bc\u03b1\u03c3\u03c4\u03b5', 15, 1],
    ['\u03b9\u03b5\u03c3\u03b1\u03c3\u03c4\u03b5', 6, 1],
    ['\u03bf\u03c3\u03b1\u03c3\u03c4\u03b5', 6, 1],
    ['\u03b9\u03bf\u03c3\u03b1\u03c3\u03c4\u03b5', 18, 1],
    ['\u03b7', -1, 1],
    ['\u03b9', -1, 1],
    ['\u03b1\u03bc\u03b1\u03b9', 21, 1],
    ['\u03b9\u03b5\u03bc\u03b1\u03b9', 21, 1],
    ['\u03bf\u03bc\u03b1\u03b9', 21, 1],
    ['\u03bf\u03c5\u03bc\u03b1\u03b9', 21, 1],
    ['\u03b1\u03c3\u03b1\u03b9', 21, 1],
    ['\u03b5\u03c3\u03b1\u03b9', 21, 1],
    ['\u03b9\u03b5\u03c3\u03b1\u03b9', 27, 1],
    ['\u03b1\u03c4\u03b1\u03b9', 21, 1],
    ['\u03b5\u03c4\u03b1\u03b9', 21, 1],
    ['\u03b9\u03b5\u03c4\u03b1\u03b9', 30, 1],
    ['\u03bf\u03bd\u03c4\u03b1\u03b9', 21, 1],
    ['\u03bf\u03c5\u03bd\u03c4\u03b1\u03b9', 21, 1],
    ['\u03b9\u03bf\u03c5\u03bd\u03c4\u03b1\u03b9', 33, 1],
    ['\u03b5\u03b9', 21, 1],
    ['\u03b1\u03b5\u03b9', 35, 1],
    ['\u03b7\u03b8\u03b5\u03b9', 35, 1],
    ['\u03b7\u03c3\u03b5\u03b9', 35, 1],
    ['\u03bf\u03b9', 21, 1],
    ['\u03b1\u03bd', -1, 1],
    ['\u03b1\u03b3\u03b1\u03bd', 40, 1],
    ['\u03b7\u03ba\u03b1\u03bd', 40, 1],
    ['\u03b7\u03b8\u03b7\u03ba\u03b1\u03bd', 42, 1],
    ['\u03b7\u03c3\u03b1\u03bd', 40, 1],
    ['\u03bf\u03c5\u03c3\u03b1\u03bd', 40, 1],
    ['\u03bf\u03bd\u03c4\u03bf\u03c5\u03c3\u03b1\u03bd', 45, 1],
    ['\u03b9\u03bf\u03bd\u03c4\u03bf\u03c5\u03c3\u03b1\u03bd', 46, 1],
    ['\u03bf\u03bd\u03c4\u03b1\u03bd', 40, 1],
    ['\u03b9\u03bf\u03bd\u03c4\u03b1\u03bd', 48, 1],
    ['\u03bf\u03c5\u03bd\u03c4\u03b1\u03bd', 40, 1],
    ['\u03b9\u03bf\u03c5\u03bd\u03c4\u03b1\u03bd', 50, 1],
    ['\u03bf\u03c4\u03b1\u03bd', 40, 1],
    ['\u03b9\u03bf\u03c4\u03b1\u03bd', 52, 1],
    ['\u03bf\u03bc\u03b1\u03c3\u03c4\u03b1\u03bd', 40, 1],
    ['\u03b9\u03bf\u03bc\u03b1\u03c3\u03c4\u03b1\u03bd', 54, 1],
    ['\u03bf\u03c3\u03b1\u03c3\u03c4\u03b1\u03bd', 40, 1],
    ['\u03b9\u03bf\u03c3\u03b1\u03c3\u03c4\u03b1\u03bd', 56, 1],
    ['\u03bf\u03c5\u03bd', -1, 1],
    ['\u03b7\u03b8\u03bf\u03c5\u03bd', 58, 1],
    ['\u03bf\u03bc\u03bf\u03c5\u03bd', 58, 1],
    ['\u03b9\u03bf\u03bc\u03bf\u03c5\u03bd', 60, 1],
    ['\u03b7\u03c3\u03bf\u03c5\u03bd', 58, 1],
    ['\u03bf\u03c3\u03bf\u03c5\u03bd', 58, 1],
    ['\u03b9\u03bf\u03c3\u03bf\u03c5\u03bd', 63, 1],
    ['\u03c9\u03bd', -1, 1],
    ['\u03b7\u03b4\u03c9\u03bd', 65, 1],
    ['\u03bf', -1, 1],
    ['\u03b1\u03c3', -1, 1],
    ['\u03b5\u03c3', -1, 1],
    ['\u03b7\u03b4\u03b5\u03c3', 69, 1],
    ['\u03b7\u03c3\u03b5\u03c3', 69, 1],
    ['\u03b7\u03c3', -1, 1],
    ['\u03b5\u03b9\u03c3', -1, 1],
    ['\u03b7\u03b8\u03b5\u03b9\u03c3', 73, 1],
    ['\u03bf\u03c3', -1, 1],
    ['\u03c5\u03c3', -1, 1],
    ['\u03bf\u03c5\u03c3', 76, 1],
    ['\u03c5', -1, 1],
    ['\u03bf\u03c5', 78, 1],
    ['\u03c9', -1, 1],
    ['\u03b1\u03c9', 80, 1],
    ['\u03b7\u03b8\u03c9', 80, 1],
    ['\u03b7\u03c3\u03c9', 80, 1]
  ]
  const Ca = [
    ['\u03bf\u03c4\u03b5\u03c1', -1, 1],
    ['\u03b5\u03c3\u03c4\u03b5\u03c1', -1, 1],
    ['\u03c5\u03c4\u03b5\u03c1', -1, 1],
    ['\u03c9\u03c4\u03b5\u03c1', -1, 1],
    ['\u03bf\u03c4\u03b1\u03c4', -1, 1],
    ['\u03b5\u03c3\u03c4\u03b1\u03c4', -1, 1],
    ['\u03c5\u03c4\u03b1\u03c4', -1, 1],
    ['\u03c9\u03c4\u03b1\u03c4', -1, 1]
  ]
  const ia = [81, 65, 16, 1]
  var ha = [81, 65, 0, 1]
  var B = p
  this.l = function () {
    a.f = a.cursor
    a.cursor = a.a
    var d = a.a - a.cursor
    k()
    a.cursor = a.a - d
    if (!(a.j.length >= 3)) return p
    B = g
    d = a.a - a.cursor
    l()
    a.cursor = a.a - d
    // eslint-disable-next-line no-redeclare
    var d = a.a - a.cursor
    let n
    a.d = a.cursor
    if (
      a.h(b) != 0 &&
      ((a.c = a.cursor),
      a.e() && ((B = p), (a.d = a.cursor), (a.c = a.cursor), (n = a.h(v)), !(n == 0 || a.cursor > a.f)))
    ) {
      switch (n) {
        case 1:
          if (!a.b('\u03b9')) break
          break
        case 2:
          a.b('\u03b9\u03b6')
      }
    }
    a.cursor = a.a - d
    d = a.a - a.cursor
    a.d = a.cursor
    a.h(q) != 0 &&
      ((a.c = a.cursor),
      a.e() && ((B = p), (a.d = a.cursor), (a.c = a.cursor), a.h(f) == 0 || a.cursor > a.f || a.b('\u03c9\u03bd')))
    a.cursor = a.a - d
    d = a.a - a.cursor
    a: if (((a.d = a.cursor), a.h(s) != 0 && ((a.c = a.cursor), a.e()))) {
      B = p
      b: {
        n = a.a - a.cursor
        if (a.g('\u03b9\u03c3\u03b1') && !(a.cursor > a.f)) {
          if (!a.b('\u03b9\u03c3')) break a
          break b
        }
        a.cursor = a.a - n
        a.d = a.cursor
        a.c = a.cursor
        n = a.h(t)
        if (!(n == 0 || a.cursor > a.f)) {
          switch (n) {
            case 1:
              if (!a.b('\u03b9')) break
              break
            case 2:
              a.b('\u03b9\u03c3')
          }
        }
      }
    }
    a.cursor = a.a - d
    d = a.a - a.cursor
    a.d = a.cursor
    a.h(m) != 0 &&
      ((a.c = a.cursor),
      a.e() && ((B = p), (a.d = a.cursor), (a.c = a.cursor), a.h(r) == 0 || a.cursor > a.f || a.b('\u03b9')))
    a.cursor = a.a - d
    d = a.a - a.cursor
    a.d = a.cursor
    if (
      a.h(u) != 0 &&
      ((a.c = a.cursor),
      a.e() && ((B = p), (a.d = a.cursor), (a.c = a.cursor), (n = a.h(w)), !(n == 0 || a.cursor > a.f)))
    ) {
      switch (n) {
        case 1:
          if (!a.b('\u03b9')) break
          break
        case 2:
          a.b('\u03b9\u03c3\u03c4')
      }
    }
    a.cursor = a.a - d
    d = a.a - a.cursor
    a: if (((a.d = a.cursor), a.h(e) != 0 && ((a.c = a.cursor), a.e()))) {
      B = p
      b: {
        var F = a.a - a.cursor
        a.d = a.cursor
        a.c = a.cursor
        n = a.h(y)
        if (n != 0 && !(a.cursor > a.f)) {
          switch (n) {
            case 1:
              if (!a.b('\u03b9\u03c3\u03bc')) break a
              break
            case 2:
              if (!a.b('\u03b9')) break a
          }
          break b
        }
        a.cursor = a.a - F
        a.d = a.cursor
        n = a.h(z)
        if (n != 0) {
          switch (((a.c = a.cursor), n)) {
            case 1:
              if (!a.b('\u03b1\u03b3\u03bd\u03c9\u03c3\u03c4')) break
              break
            case 2:
              if (!a.b('\u03b1\u03c4\u03bf\u03bc')) break
              break
            case 3:
              if (!a.b('\u03b3\u03bd\u03c9\u03c3\u03c4')) break
              break
            case 4:
              if (!a.b('\u03b5\u03b8\u03bd')) break
              break
            case 5:
              if (!a.b('\u03b5\u03ba\u03bb\u03b5\u03ba\u03c4')) break
              break
            case 6:
              if (!a.b('\u03c3\u03ba\u03b5\u03c0\u03c4')) break
              break
            case 7:
              if (!a.b('\u03c4\u03bf\u03c0')) break
              break
            case 8:
              if (!a.b('\u03b1\u03bb\u03b5\u03be\u03b1\u03bd\u03b4\u03c1')) break
              break
            case 9:
              if (!a.b('\u03b2\u03c5\u03b6\u03b1\u03bd\u03c4')) break
              break
            case 10:
              a.b('\u03b8\u03b5\u03b1\u03c4\u03c1')
          }
        }
      }
    }
    a.cursor = a.a - d
    d = a.a - a.cursor
    a.d = a.cursor
    a.h(H) != 0 &&
      ((a.c = a.cursor),
      a.e() &&
        ((B = p),
        (a.d = a.cursor),
        (a.c = a.cursor),
        a.h(A) == 0 || a.cursor > a.f || a.b('\u03b1\u03c1\u03b1\u03ba')))
    a.cursor = a.a - d
    d = a.a - a.cursor
    a: if (((a.d = a.cursor), a.h(E) != 0 && ((a.c = a.cursor), a.e()))) {
      B = p
      b: {
        F = a.a - a.cursor
        a.d = a.cursor
        a.c = a.cursor
        n = a.h(G)
        if (n != 0 && !(a.cursor > a.f)) {
          switch (n) {
            case 1:
              if (!a.b('\u03b1\u03ba')) break a
              break
            case 2:
              if (!a.b('\u03b9\u03c4\u03c3')) break a
          }
          break b
        }
        a.cursor = a.a - F
        a.d = a.cursor
        a.c = a.cursor
        !a.g('\u03ba\u03bf\u03c1') || a.b('\u03b9\u03c4\u03c3')
      }
    }
    a.cursor = a.a - d
    d = a.a - a.cursor
    a: if (((a.d = a.cursor), a.h(N) != 0 && ((a.c = a.cursor), a.e()))) {
      B = p
      b: {
        n = a.a - a.cursor
        a.d = a.cursor
        a.c = a.cursor
        if (a.h(x) != 0 && !(a.cursor > a.f)) {
          if (!a.b('\u03b9\u03b4')) break a
          break b
        }
        a.cursor = a.a - n
        a.d = a.cursor
        a.c = a.cursor
        a.h(O) == 0 || a.b('\u03b9\u03b4')
      }
    }
    a.cursor = a.a - d
    d = a.a - a.cursor
    a.d = a.cursor
    a.h(P) != 0 &&
      ((a.c = a.cursor),
      a.e() &&
        ((B = p), (a.d = a.cursor), (a.c = a.cursor), a.h(M) == 0 || a.cursor > a.f || a.b('\u03b9\u03c3\u03ba')))
    a.cursor = a.a - d
    d = a.a - a.cursor
    a: if (((a.d = a.cursor), a.h(Q) != 0 && ((a.c = a.cursor), a.e()))) {
      n = a.a - a.cursor
      if (a.h(T) != 0) break a
      a.cursor = a.a - n
      n = a.cursor
      a.r(a.cursor, a.cursor, '\u03b1\u03b4')
      a.cursor = n
    }
    a.cursor = a.a - d
    d = a.a - a.cursor
    a.d = a.cursor
    a.h(U) != 0 &&
      ((a.c = a.cursor), a.e() && ((a.d = a.cursor), (a.c = a.cursor), a.h(R) == 0 || a.b('\u03b5\u03b4')))
    a.cursor = a.a - d
    d = a.a - a.cursor
    a.d = a.cursor
    a.h(S) != 0 &&
      ((a.c = a.cursor), a.e() && ((a.d = a.cursor), (a.c = a.cursor), a.h(V) == 0 || a.b('\u03bf\u03c5\u03b4')))
    a.cursor = a.a - d
    d = a.a - a.cursor
    a.d = a.cursor
    a.h(I) != 0 &&
      ((a.c = a.cursor),
      a.e() && ((B = p), (a.d = a.cursor), (a.c = a.cursor), a.h(D) == 0 || a.cursor > a.f || a.b('\u03b5')))
    a.cursor = a.a - d
    d = a.a - a.cursor
    a.d = a.cursor
    a.h(L) != 0 &&
      ((a.c = a.cursor), a.e() && ((B = p), (a.d = a.cursor), (a.c = a.cursor), !a.n(ia, 945, 969) || a.b('\u03b9')))
    a.cursor = a.a - d
    d = a.a - a.cursor
    a: if (((a.d = a.cursor), a.h(J) != 0 && ((a.c = a.cursor), a.e()))) {
      B = p
      b: {
        n = a.a - a.cursor
        a.d = a.cursor
        a.c = a.cursor
        if (a.n(ia, 945, 969)) {
          if (!a.b('\u03b9\u03ba')) break a
          break b
        }
        a.cursor = a.a - n
        a.d = a.cursor
      }
      a.c = a.cursor
      a.h(K) == 0 || a.cursor > a.f || a.b('\u03b9\u03ba')
    }
    a.cursor = a.a - d
    d = a.a - a.cursor
    a: {
      n = a.a - a.cursor
      if (a.g('\u03b1\u03b3\u03b1\u03bc\u03b5') && !(a.cursor > a.f) && !a.b('\u03b1\u03b3\u03b1\u03bc')) break a
      a.cursor = a.a - n
      n = a.a - a.cursor
      a.d = a.cursor
      if (a.h($) != 0) {
        a.c = a.cursor
        if (!a.e()) break a
        B = p
      }
      a.cursor = a.a - n
      a.d = a.cursor
      a.g('\u03b1\u03bc\u03b5') &&
        ((a.c = a.cursor),
        a.e() && ((B = p), (a.d = a.cursor), (a.c = a.cursor), a.h(aa) == 0 || a.cursor > a.f || a.b('\u03b1\u03bc')))
    }
    a.cursor = a.a - d
    d = a.a - a.cursor
    h()
    a.cursor = a.a - d
    d = a.a - a.cursor
    c()
    a.cursor = a.a - d
    d = a.a - a.cursor
    a: if (((a.d = a.cursor), a.h(fa) != 0 && ((a.c = a.cursor), a.e()))) {
      B = p
      b: {
        n = a.a - a.cursor
        a.d = a.cursor
        a.c = a.cursor
        if (a.g('\u03b1\u03c1\u03c7') && !(a.cursor > a.f)) {
          if (!a.b('\u03bf\u03bd\u03c4')) break a
          break b
        }
        a.cursor = a.a - n
        a.d = a.cursor
        a.c = a.cursor
        !a.g('\u03ba\u03c1\u03b5') || a.b('\u03c9\u03bd\u03c4')
      }
    }
    a.cursor = a.a - d
    d = a.a - a.cursor
    a.d = a.cursor
    a.h(ga) != 0 &&
      ((a.c = a.cursor),
      a.e() &&
        ((B = p),
        (a.d = a.cursor),
        (a.c = a.cursor),
        !a.g('\u03bf\u03bd') || a.cursor > a.f || a.b('\u03bf\u03bc\u03b1\u03c3\u03c4')))
    a.cursor = a.a - d
    d = a.a - a.cursor
    a: {
      n = a.a - a.cursor
      a.d = a.cursor
      if (a.g('\u03b9\u03b5\u03c3\u03c4\u03b5')) {
        a.c = a.cursor
        if (!a.e()) break a
        B = p
        a.d = a.cursor
        a.c = a.cursor
        if (a.h(Y) != 0 && !(a.cursor > a.f) && !a.b('\u03b9\u03b5\u03c3\u03c4')) break a
      }
      a.cursor = a.a - n
      a.d = a.cursor
      a.g('\u03b5\u03c3\u03c4\u03b5') &&
        ((a.c = a.cursor),
        a.e() &&
          ((B = p),
          (a.d = a.cursor),
          (a.c = a.cursor),
          a.h(Z) == 0 || a.cursor > a.f || a.b('\u03b9\u03b5\u03c3\u03c4')))
    }
    a.cursor = a.a - d
    d = a.a - a.cursor
    a: {
      n = a.a - a.cursor
      a.d = a.cursor
      if (a.h(X) != 0) {
        a.c = a.cursor
        if (!a.e()) break a
        B = p
      }
      a.cursor = a.a - n
      a.d = a.cursor
      if (a.h(la) != 0 && ((a.c = a.cursor), a.e())) {
        B = p
        b: {
          n = a.a - a.cursor
          a.d = a.cursor
          a.c = a.cursor
          if (a.h(ja) != 0) {
            if (!a.b('\u03b7\u03ba')) break a
            break b
          }
          a.cursor = a.a - n
          a.d = a.cursor
          a.c = a.cursor
          a.h(ka) == 0 || a.cursor > a.f || a.b('\u03b7\u03ba')
        }
      }
    }
    a.cursor = a.a - d
    d = a.a - a.cursor
    a: if (((a.d = a.cursor), a.h(oa) != 0 && ((a.c = a.cursor), a.e()))) {
      B = p
      b: {
        n = a.a - a.cursor
        a.d = a.cursor
        a.c = a.cursor
        if (a.h(ma) != 0) {
          if (!a.b('\u03bf\u03c5\u03c3')) break a
          break b
        }
        a.cursor = a.a - n
        a.d = a.cursor
        a.c = a.cursor
        a.h(na) == 0 || a.cursor > a.f || a.b('\u03bf\u03c5\u03c3')
      }
    }
    a.cursor = a.a - d
    d = a.a - a.cursor
    a.d = a.cursor
    a.h(sa) != 0 &&
      ((a.c = a.cursor),
      a.e() && ((B = p), (a.d = a.cursor), (a.c = a.cursor), a.h(ta) == 0 || a.cursor > a.f || a.b('\u03b7\u03c3')))
    a.cursor = a.a - d
    d = a.a - a.cursor
    a: if (((a.d = a.cursor), a.h(ra) != 0 && ((a.c = a.cursor), a.e()))) {
      B = p
      b: {
        n = a.a - a.cursor
        a.d = a.cursor
        a.c = a.cursor
        if (a.g('\u03ba\u03bf\u03bb\u03bb')) {
          if (!a.b('\u03b1\u03b3')) break a
          break b
        }
        a.cursor = a.a - n
        c: {
          F = a.a - a.cursor
          a.d = a.cursor
          a.c = a.cursor
          n = a.h(pa)
          if (n != 0) {
            switch (n) {
              case 1:
                if (!a.b('\u03b1\u03b3')) break a
            }
            break c
          }
          a.cursor = a.a - F
          a.d = a.cursor
          a.c = a.cursor
          a.h(qa) == 0 || a.cursor > a.f || a.b('\u03b1\u03b3')
        }
      }
    }
    a.cursor = a.a - d
    d = a.a - a.cursor
    a.d = a.cursor
    a.h(ua) != 0 &&
      ((a.c = a.cursor),
      a.e() &&
        ((B = p), (a.d = a.cursor), (a.c = a.cursor), a.h(va) == 0 || a.cursor > a.f || a.b('\u03b7\u03c3\u03c4')))
    a.cursor = a.a - d
    d = a.a - a.cursor
    a.d = a.cursor
    a.h(wa) != 0 &&
      ((a.c = a.cursor),
      a.e() &&
        ((B = p), (a.d = a.cursor), (a.c = a.cursor), a.h(xa) == 0 || a.cursor > a.f || a.b('\u03bf\u03c5\u03bd')))
    a.cursor = a.a - d
    d = a.a - a.cursor
    a.d = a.cursor
    a.h(ya) != 0 &&
      ((a.c = a.cursor),
      a.e() &&
        ((B = p), (a.d = a.cursor), (a.c = a.cursor), a.h(za) == 0 || a.cursor > a.f || a.b('\u03bf\u03c5\u03bc')))
    a.cursor = a.a - d
    d = a.a - a.cursor
    a: {
      n = a.a - a.cursor
      a.d = a.cursor
      if (a.h(Aa) != 0 && ((a.c = a.cursor), !a.b('\u03bc\u03b1'))) break a
      a.cursor = a.a - n
      B && ((a.d = a.cursor), a.h(Ba) != 0 && ((a.c = a.cursor), a.e()))
    }
    a.cursor = a.a - d
    d = a.a - a.cursor
    a.d = a.cursor
    a.h(Ca) != 0 && ((a.c = a.cursor), a.e())
    a.cursor = a.a - d
    a.cursor = a.f
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
