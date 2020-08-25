import { Animated } from './Animated';
import { Point } from '../math/Point';
export class AnimatedPoint extends Animated {
    constructor(initial) {
        super(initial, (from, to, options) => {
            if (options.path === 'euclidean') {
                const delta = Point.dif(to, from);
                return x => from.plus(delta.times(x));
            }
            else if (options.path === 'poincare') {
                return to.poincareInterpolateFrom(from, options.height, options.rho);
            }
            else
                throw Error('internal error 81562834');
        });
    }
}
