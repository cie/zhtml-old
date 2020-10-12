import rangeExpr from "./rangeExpr"

  function norm(tr) {
    // change back matrix to scale, because for matrix, Chrome does a
    // more agressive downsampling after a certain scale level
    return tr.replace(
      /matrix\(([^,]+), 0, 0, \1, ([^,]+), ([^,]+)\)/,
      'translate($2px, $3px)scale($1)'
    )
  }

export function animateZoom (newP, options = { duration: 300 }) {
    console.log([...this.children].map(f => f.slot))
    console.log([...this.children].map(f => rangeExpr(f.slot)(newP.k)))
    const old = Object.entries(this.containers).map(([name, container]) => {
      const { transform, opacity } = getComputedStyle(container)
      return {
        transform: norm(transform),
        opacity
      }
    })
    Object.entries(this.containers).forEach(([name, container], i) => {
      this.__z_setZoomShallow(newP)
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

    const children = this.children
    for (let i = 0; i < children.length; ++i) {
      if (children[i].__z_animateZoom) children[i].__z_animateZoom(newP)
    }
  }