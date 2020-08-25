import { of, interval, BehaviorSubject } from 'rxjs';
import { switchMap, takeWhile, map, tap } from 'rxjs/operators';
const FRAME_RATE = 15;
export class Animated extends BehaviorSubject {
    constructor(initial, interpolate) {
        super(initial);
        this.animation$ = new BehaviorSubject({
            running: false,
            value: initial
        });
        this.animation$
            .pipe(switchMap(animation => {
            if (animation.running === true) {
                const from = this.value;
                const { duration, to, easing, options } = animation;
                const interp = interpolate(from, to, options);
                const ease = (x) => easing(x, 0, 1, 1);
                const start = Date.now();
                const end = start + duration;
                // based on https://github.com/staltz/rxtween/blob/master/src/index.js
                return interval(FRAME_RATE).pipe(takeWhile(() => Date.now() < end), map(() => (Date.now() - start) / duration), map(ease), map(interp), tap({
                    complete: () => {
                        this.animation$.next({
                            running: false,
                            value: to
                        });
                    }
                }));
            }
            else {
                const { value } = animation;
                return of(value);
            }
        }))
            .subscribe(this);
    }
    stop() {
        this.animation$.next({
            running: false,
            value: this.current
        });
    }
    get target() {
        const animation = this.animation$.getValue();
        return animation.running == true ? animation.to : animation.value;
    }
    get current() {
        return this.getValue();
    }
    jumpTo(value) {
        this.animation$.next({
            running: false,
            value
        });
    }
    animate(to, { duration, easing, options }) {
        this.animation$.next({
            running: true,
            to,
            duration,
            easing,
            options
        });
    }
}
