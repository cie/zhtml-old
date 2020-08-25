import { Point } from './Point'

export function mousePos (
  event: { clientX: number; clientY: number },
  view: Point
): Point {
  return Point.dif(new Point(event.clientX, event.clientY, 1), view)
}

export function wheelDelta (event: WheelEvent): Point {
  return new Point(0, 0, Math.pow(Math.SQRT2, -event.deltaY / 100))
}
