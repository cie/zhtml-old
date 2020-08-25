import { Point } from './Point'

export type RealBbox = {
  x: number
  y: number
  width: number
  height: number
}
export type Bbox = null | RealBbox

export function addMargin (b: Bbox, m: number): Bbox {
  if (!b) return null
  return {
    x: b.x - m,
    y: b.y - m,
    width: b.width + m * 2,
    height: b.height + m * 2
  }
}

export function union (b1: Bbox, b2: Bbox): Bbox {
  if (!b1) return b2
  if (!b2) return b1
  const x = Math.min(b1.x, b2.x)
  const y = Math.min(b1.y, b2.y)
  return {
    x,
    y,
    width: Math.max(b1.x + b1.width, b2.x + b2.width) - x,
    height: Math.max(b1.y + b1.height, b2.y + b2.height) - y
  }
}

export function applyPoint (p: Point, bbox: Bbox): Bbox {
  if (!bbox) return null
  var p1 = new Point(bbox.x, bbox.y, 1)
  var p2 = new Point(bbox.x + bbox.width, bbox.y + bbox.height, 1)
  const q1 = p.plus(p1)
  const q2 = p.plus(p2)
  return {
    x: q1.x,
    y: q1.y,
    width: q2.x - q1.x,
    height: q2.y - q1.y
  }
}

export function cornersOf (b: RealBbox): Point[] {
  return [
    new Point(b.x, b.y, 1),
    new Point(b.x + b.width, b.y, 1),
    new Point(b.x + b.width, b.y + b.height, 1),
    new Point(b.x, b.y + b.height, 1)
  ]
}

export function centerOf (b: RealBbox): Point {
  return new Point(b.x + b.width / 2, b.y + b.height / 2, 1)
}
