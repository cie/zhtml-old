const UNIT = { x: 1, '%': 0.01 }
export default function rangeExpr(expr) {
  if (!expr) return ( )=> true
  const m = expr.match(/^(?:(\d+(?:\.\d+))([x%])(<?))?-(?:(>?)(\d+(?:\.\d+))([x%]))?$/)
  if (!m) {
    console.error(`Invalid zoom range expression: ${expr}`)
    return () => false
  }
  const [, minFigure, minUnit, minOpen, maxOpen, maxFigure, maxUnit] = m
  const min = minFigure === undefined ? 0 : +minFigure * UNIT[minUnit]
  const max = maxFigure === undefined ? Infinity : +maxFigure * UNIT[maxUnit]
  return n => (min < n || (min === n && !minOpen)) && (n < max || (n === max && !maxOpen))
}