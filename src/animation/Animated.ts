import { of, interval, BehaviorSubject } from 'rxjs'
import { switchMap, takeWhile, map, tap } from 'rxjs/operators'

export type Interpolator<T, OPT> = (
  from: T,
  to: T,
  options: OPT
) => (x: number) => T

const FRAME_RATE = 15

type Animation<T, OPT> =
  | {
      running: false
      value: T
    }
  | {
      running: true
      to: T
      duration: number
      easing: Easing
      options: OPT
    }

export type Easing = (t: number, b: number, c: number, d: number) => number

export class Animated<T, OPT = void> extends BehaviorSubject<T> {
  private animation$: BehaviorSubject<Animation<T, OPT>>

  constructor (initial: T, interpolate: Interpolator<T, OPT>) {
    super(initial)
    this.animation$ = new BehaviorSubject({
      running: false,
      value: initial
    } as Animation<T, OPT>)
    this.animation$
      .pipe(
        switchMap(animation => {
          if (animation.running === true) {
            const from = this.value
            const { duration, to, easing, options } = animation
            const interp = interpolate(from, to, options)
            const ease = (x: number) => easing(x, 0, 1, 1)
            const start = Date.now()
            const end = start + duration
            // based on https://github.com/staltz/rxtween/blob/master/src/index.js
            return interval(FRAME_RATE).pipe(
              takeWhile(() => Date.now() < end),
              map(() => (Date.now() - start) / duration),
              map(ease),
              map(interp),
              tap({
                complete: () => {
                  this.animation$.next({
                    running: false as false,
                    value: to
                  })
                }
              })
            )
          } else {
            const { value } = animation
            return of(value)
          }
        })
      )
      .subscribe(this)
  }

  stop () {
    this.animation$.next({
      running: false as false,
      value: this.current
    })
  }

  get target (): T {
    const animation = this.animation$.getValue()
    return animation.running == true ? animation.to : animation.value
  }

  get current (): T {
    return this.getValue()
  }

  jumpTo (value: T) {
    this.animation$.next({
      running: false as false,
      value
    })
  }

  animate (
    to: T,
    {
      duration,
      easing,
      options
    }: { duration: number; easing: Easing; options: OPT }
  ) {
    this.animation$.next({
      running: true as true,
      to,
      duration,
      easing,
      options
    })
  }
}
