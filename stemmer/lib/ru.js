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
    let b
    c.d = c.cursor
    b = c.h(a)
    if (b == 0) return p
    c.c = c.cursor
    switch (b) {
      case 1:
        a: {
          b = c.a - c.cursor
          if (c.g('\u0430')) break a
          c.cursor = c.a - b
          if (!c.g('\u044f')) return p
        }
        if (!c.e()) return p
        break
      case 2:
        if (!c.e()) return p
    }
    return g
  }
  function l () {
    let a, b
    c.d = c.cursor
    c.h(d) == 0 ? (b = p) : ((c.c = c.cursor), (b = !c.e() ? p : g))
    if (!b) return p
    b = c.a - c.cursor
    a: if (((c.d = c.cursor), (a = c.h(n)), a == 0)) c.cursor = c.a - b
    else {
      switch (((c.c = c.cursor), a)) {
        case 1:
          b: {
            a = c.a - c.cursor
            if (c.g('\u0430')) break b
            c.cursor = c.a - a
            if (!c.g('\u044f')) {
              c.cursor = c.a - b
              break a
            }
          }
          if (!c.e()) return p
          break
        case 2:
          if (!c.e()) return p
      }
    }
    return g
  }
  function h () {
    let a
    c.d = c.cursor
    a = c.h(b)
    if (a == 0) return p
    c.c = c.cursor
    switch (a) {
      case 1:
        a: {
          a = c.a - c.cursor
          if (c.g('\u0430')) break a
          c.cursor = c.a - a
          if (!c.g('\u044f')) return p
        }
        if (!c.e()) return p
        break
      case 2:
        if (!c.e()) return p
    }
    return g
  }
  var c = new C()
  var a = [
    ['\u0432', -1, 1],
    ['\u0438\u0432', 0, 2],
    ['\u044b\u0432', 0, 2],
    ['\u0432\u0448\u0438', -1, 1],
    ['\u0438\u0432\u0448\u0438', 3, 2],
    ['\u044b\u0432\u0448\u0438', 3, 2],
    ['\u0432\u0448\u0438\u0441\u044c', -1, 1],
    ['\u0438\u0432\u0448\u0438\u0441\u044c', 6, 2],
    ['\u044b\u0432\u0448\u0438\u0441\u044c', 6, 2]
  ]
  var d = [
    ['\u0435\u0435', -1, 1],
    ['\u0438\u0435', -1, 1],
    ['\u043e\u0435', -1, 1],
    ['\u044b\u0435', -1, 1],
    ['\u0438\u043c\u0438', -1, 1],
    ['\u044b\u043c\u0438', -1, 1],
    ['\u0435\u0439', -1, 1],
    ['\u0438\u0439', -1, 1],
    ['\u043e\u0439', -1, 1],
    ['\u044b\u0439', -1, 1],
    ['\u0435\u043c', -1, 1],
    ['\u0438\u043c', -1, 1],
    ['\u043e\u043c', -1, 1],
    ['\u044b\u043c', -1, 1],
    ['\u0435\u0433\u043e', -1, 1],
    ['\u043e\u0433\u043e', -1, 1],
    ['\u0435\u043c\u0443', -1, 1],
    ['\u043e\u043c\u0443', -1, 1],
    ['\u0438\u0445', -1, 1],
    ['\u044b\u0445', -1, 1],
    ['\u0435\u044e', -1, 1],
    ['\u043e\u044e', -1, 1],
    ['\u0443\u044e', -1, 1],
    ['\u044e\u044e', -1, 1],
    ['\u0430\u044f', -1, 1],
    ['\u044f\u044f', -1, 1]
  ]
  var n = [
    ['\u0435\u043c', -1, 1],
    ['\u043d\u043d', -1, 1],
    ['\u0432\u0448', -1, 1],
    ['\u0438\u0432\u0448', 2, 2],
    ['\u044b\u0432\u0448', 2, 2],
    ['\u0449', -1, 1],
    ['\u044e\u0449', 5, 1],
    ['\u0443\u044e\u0449', 6, 2]
  ]
  const v = [
    ['\u0441\u044c', -1, 1],
    ['\u0441\u044f', -1, 1]
  ]
  var b = [
    ['\u043b\u0430', -1, 1],
    ['\u0438\u043b\u0430', 0, 2],
    ['\u044b\u043b\u0430', 0, 2],
    ['\u043d\u0430', -1, 1],
    ['\u0435\u043d\u0430', 3, 2],
    ['\u0435\u0442\u0435', -1, 1],
    ['\u0438\u0442\u0435', -1, 2],
    ['\u0439\u0442\u0435', -1, 1],
    ['\u0435\u0439\u0442\u0435', 7, 2],
    ['\u0443\u0439\u0442\u0435', 7, 2],
    ['\u043b\u0438', -1, 1],
    ['\u0438\u043b\u0438', 10, 2],
    ['\u044b\u043b\u0438', 10, 2],
    ['\u0439', -1, 1],
    ['\u0435\u0439', 13, 2],
    ['\u0443\u0439', 13, 2],
    ['\u043b', -1, 1],
    ['\u0438\u043b', 16, 2],
    ['\u044b\u043b', 16, 2],
    ['\u0435\u043c', -1, 1],
    ['\u0438\u043c', -1, 2],
    ['\u044b\u043c', -1, 2],
    ['\u043d', -1, 1],
    ['\u0435\u043d', 22, 2],
    ['\u043b\u043e', -1, 1],
    ['\u0438\u043b\u043e', 24, 2],
    ['\u044b\u043b\u043e', 24, 2],
    ['\u043d\u043e', -1, 1],
    ['\u0435\u043d\u043e', 27, 2],
    ['\u043d\u043d\u043e', 27, 1],
    ['\u0435\u0442', -1, 1],
    ['\u0443\u0435\u0442', 30, 2],
    ['\u0438\u0442', -1, 2],
    ['\u044b\u0442', -1, 2],
    ['\u044e\u0442', -1, 1],
    ['\u0443\u044e\u0442', 34, 2],
    ['\u044f\u0442', -1, 2],
    ['\u043d\u044b', -1, 1],
    ['\u0435\u043d\u044b', 37, 2],
    ['\u0442\u044c', -1, 1],
    ['\u0438\u0442\u044c', 39, 2],
    ['\u044b\u0442\u044c', 39, 2],
    ['\u0435\u0448\u044c', -1, 1],
    ['\u0438\u0448\u044c', -1, 2],
    ['\u044e', -1, 2],
    ['\u0443\u044e', 44, 2]
  ]
  const f = [
    ['\u0430', -1, 1],
    ['\u0435\u0432', -1, 1],
    ['\u043e\u0432', -1, 1],
    ['\u0435', -1, 1],
    ['\u0438\u0435', 3, 1],
    ['\u044c\u0435', 3, 1],
    ['\u0438', -1, 1],
    ['\u0435\u0438', 6, 1],
    ['\u0438\u0438', 6, 1],
    ['\u0430\u043c\u0438', 6, 1],
    ['\u044f\u043c\u0438', 6, 1],
    ['\u0438\u044f\u043c\u0438', 10, 1],
    ['\u0439', -1, 1],
    ['\u0435\u0439', 12, 1],
    ['\u0438\u0435\u0439', 13, 1],
    ['\u0438\u0439', 12, 1],
    ['\u043e\u0439', 12, 1],
    ['\u0430\u043c', -1, 1],
    ['\u0435\u043c', -1, 1],
    ['\u0438\u0435\u043c', 18, 1],
    ['\u043e\u043c', -1, 1],
    ['\u044f\u043c', -1, 1],
    ['\u0438\u044f\u043c', 21, 1],
    ['\u043e', -1, 1],
    ['\u0443', -1, 1],
    ['\u0430\u0445', -1, 1],
    ['\u044f\u0445', -1, 1],
    ['\u0438\u044f\u0445', 26, 1],
    ['\u044b', -1, 1],
    ['\u044c', -1, 1],
    ['\u044e', -1, 1],
    ['\u0438\u044e', 30, 1],
    ['\u044c\u044e', 30, 1],
    ['\u044f', -1, 1],
    ['\u0438\u044f', 33, 1],
    ['\u044c\u044f', 33, 1]
  ]
  const q = [
    ['\u043e\u0441\u0442', -1, 1],
    ['\u043e\u0441\u0442\u044c', -1, 1]
  ]
  const t = [
    ['\u0435\u0439\u0448\u0435', -1, 1],
    ['\u043d', -1, 2],
    ['\u0435\u0439\u0448', -1, 1],
    ['\u044c', -1, 3]
  ]
  const s = [33, 65, 8, 232]
  let r = 0
  let m = 0
  this.l = function () {
    let a = c.cursor
    for (;;) {
      var b = c.cursor
      b: {
        c: for (;;) {
          var d = c.cursor
          c.c = c.cursor
          if (c.m('\u0451')) {
            c.d = c.cursor
            c.cursor = d
            break c
          }
          c.cursor = d
          if (c.cursor >= c.a) break b
          c.cursor++
        }
        if (!c.b('\u0435')) return p
        continue
      }
      c.cursor = b
      break
    }
    c.cursor = a
    r = m = c.a
    a = c.cursor
    a: {
      b: for (;;) {
        if (c.i(s, 1072, 1103)) break b
        if (c.cursor >= c.a) break a
        c.cursor++
      }
      m = c.cursor
      b: for (;;) {
        if (c.k(s, 1072, 1103)) break b
        if (c.cursor >= c.a) break a
        c.cursor++
      }
      b: for (;;) {
        if (c.i(s, 1072, 1103)) break b
        if (c.cursor >= c.a) break a
        c.cursor++
      }
      b: for (;;) {
        if (c.k(s, 1072, 1103)) break b
        if (c.cursor >= c.a) break a
        c.cursor++
      }
      r = c.cursor
    }
    c.cursor = a
    c.f = c.cursor
    c.cursor = c.a
    if (c.cursor < m) return p
    a = c.f
    c.f = m
    b = c.a - c.cursor
    b: {
      d = c.a - c.cursor
      if (k()) break b
      c.cursor = c.a - d
      d = c.a - c.cursor
      let n
      c.d = c.cursor
      c.h(v) == 0 ? (n = p) : ((c.c = c.cursor), (n = !c.e() ? p : g))
      n || (c.cursor = c.a - d)
      c: {
        d = c.a - c.cursor
        if (l()) break c
        c.cursor = c.a - d
        if (h()) break c
        c.cursor = c.a - d
        c.d = c.cursor
        c.h(f) != 0 && ((c.c = c.cursor), c.e())
      }
    }
    c.cursor = c.a - b
    b = c.a - c.cursor
    c.d = c.cursor
    if (c.g('\u0438')) {
      if (((c.c = c.cursor), !c.e())) return p
    } else c.cursor = c.a - b
    b = c.a - c.cursor
    c.d = c.cursor
    c.h(q) != 0 && ((c.c = c.cursor), !(r <= c.cursor) || c.e())
    c.cursor = c.a - b
    b = c.a - c.cursor
    c.d = c.cursor
    d = c.h(t)
    if (d != 0) {
      switch (((c.c = c.cursor), d)) {
        case 1:
          if (!c.e()) break
          c.d = c.cursor
          if (!c.g('\u043d')) break
          c.c = c.cursor
          if (!c.g('\u043d') || !c.e()) break
          break
        case 2:
          if (!c.g('\u043d') || !c.e()) break
          break
        case 3:
          c.e()
      }
    }
    c.cursor = c.a - b
    c.f = a
    c.cursor = c.f
    return g
  }
  this.stemWord = function (a) {
    c.p(a)
    this.l()
    return c.j
  }
}

const stemmerInstance = new stem()

export function stemmer (word) {
  return stemmerInstance.stemWord(word)
}
