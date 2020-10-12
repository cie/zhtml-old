import rangeExpr from './rangeExpr'

function norm (tr) {
  // change back matrix to scale, because for matrix, Chrome does a
  // more agressive downsampling after a certain scale level
  return tr.replace(
    /matrix\(([^,]+), 0, 0, \1, ([^,]+), ([^,]+)\)/,
    'translate($2px, $3px)scale($1)'
  )
}

export default function zoom (newP, options = { duration: 300 }) {
  console.log(this)
  const slots = [...new Set([...this.children].map(f => f.slot))]
  const exprs = slots.map(rangeExpr)
  const beforeOrAfter = slots.filter((s, i) => exprs[i](this.oldP.k) || exprs[i](newP.k))
  const old = Object.entries(this.containers).map(([name, container]) => {
    const { transform, opacity } = getComputedStyle(container)
    return {
      transform: norm(transform),
      opacity
    }
  })
  Object.entries(this.containers).forEach(([name, container], i) => {
    const { transform, opacity } = getComputedStyle(container)
    container.animate(
      [
        {
          ...old[i],
          easing: 'cubic-bezier(.37,.67,.58,1)'
        },
        {
          transform: norm(transform),
          opacity
        }
      ],
      { ...options }
    )
  })
  this.oldP = newP

  const children = this.children
  for (let i = 0; i < children.length; ++i) {
    if (children[i].__z_zoom) children[i].__z_zoom(newP)
  }
  return beforeOrAfter
}
