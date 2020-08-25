import { Animated } from './Animated'
import { Point } from '../math/Point'

export type Options =
  | {
      path: 'euclidean'
    }
  | {
      path: 'poincare'
      height: number
      rho: number
    }
export class AnimatedPoint extends Animated<Point, Options> {
  constructor (initial: Point) {
    super(initial, (from: Point, to: Point, options: Options) => {
      if (options.path === 'euclidean') {
        const delta = Point.dif(to, from)
        return x => from.plus(delta.times(x))
      } else if (options.path === 'poincare') {
        return to.poincareInterpolateFrom(from, options.height, options.rho)
      } else throw Error('internal error 81562834')
    })
  }
}
