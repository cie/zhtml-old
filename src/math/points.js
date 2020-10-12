const { log, hypot, pow, asinh, acosh, sinh, cosh, exp, sqrt, tanh } = Math
const sq = x => x * x
const W = 40000

export function add (a, b) {
  return {
    x: a.x + b.x * a.k,
    y: a.y + b.y * a.k,
    k: a.k * b.k
  }
}

export function mul (a, e) {
  if (a.k === 1) return { x: a.x * e, y: a.y * e, k: 1 }
  if (e === 1) return a
  const k = pow(a.k, e)
  const ratio = (1 - k) / (1 - a.k)
  return { x: a.x * ratio, y: a.y * ratio, k }
}

export function neg (a) {
  return {
    x: -a.x / a.k,
    y: -a.y / a.k,
    k: 1 / a.k
  }
}

export function sub (a, b) {
  return add(a, neg(b))
}

export function dif (a, b) {
  return add(neg(b), a)
}

export function eq (a, b) {
  return eqN(a.x, b.x) && eqN(a.y, b.y) && eqN(a.k, b.k)
}

export function proj (a, k) {
  return { x: a.x, y: a.y, k }
}

export function perp (a, b) {
  // code from d3.js interpolateZoom
  const scale = 1000,
    rho = 1.41
  const rho2 = sq(rho),
    rho4 = sq(rho2)
  const ux0 = a.x,
    uy0 = a.y,
    w0 = a.k * scale,
    ux1 = b.x,
    uy1 = b.y,
    w1 = b.k * scale
  const dx = ux1 - ux0,
    dy = uy1 - uy0,
    d2 = sq(dx) + sq(dy),
    d1 = sqrt(d2)
  const b0 = (sq(w1) - sq(w0) + rho4 * d2) / (w0 * rho2 * d1 * 2)
  const b1 = (sq(w1) - sq(w0) - rho4 * d2) / (w1 * rho2 * d1 * 2)
  const r0 = -asinh(b0)
  const r1 = -asinh(b1)
  const dr = r1 - r0
  if (isNaN(dr)) {
    const S = log(w1 / w0) / rho
    if (S === 0) {
      const fn = _ => a
      fn.S = 0
      return fn
    }
    const fn = t => ({
      x: ux0 + dx * t,
      y: uy0 + dy * t,
      k: (w0 * exp(rho * S * t)) / scale
    })
    fn.S = S
    return fn
  }
  const S = dr / rho
  const coshr0 = cosh(r0)
  const fn = t => {
    const s = S * t
    const r = rho * s + r0
    const u = (w0 / (rho2 * d1)) * (coshr0 * tanh(r) - sinh(r0))
    return {
      x: ux0 + u * dx,
      y: uy0 + u * dy,
      k: (w0 * coshr0) / cosh(r) / scale
    }
  }
  fn.S = S
  return fn
}

export function pdist (a, b) {
  return acosh(
    1 + (sq(a.x - b.x) + sq(a.y - b.y) + sq(a.k - b.k) * W) / (2 * a.k * b.k)
  )
}

export function lerp (a, b) {
  const d = dif(b, a)
  return t => add(a, mul(d, t))
}

const EPSILON = 0.000001
export function eqN (a, b) {
  return a - b < EPSILON && b - a < EPSILON
}
