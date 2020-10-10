<script>
  import { get_current_component } from 'svelte/internal'
  const host = get_current_component()
  let container

  function norm(tr) {
    // change back matrix to scale, because for matrix, Chrome does a
    // more agressive downsampling after a certain scale level
    return tr.replace(
      /matrix\(([^,]+), 0, 0, \1, ([^,]+), ([^,]+)\)/,
      'translate($2px, $3px)scale($1)'
    )
  }

  host.__z_animateZoom = async function (newP, options = { duration: 300 }) {
    const old = Object.entries({ container }).map(([name, container]) => {
      const { transform, opacity } = getComputedStyle(container)
      return {
        transform: norm(transform),
        opacity
      }
    })
    host.__z_setZoomShallow(newP)
    const { transform, opacity } = getComputedStyle(container)
    const downwards = newP.k < oldP.k
    container.animate(
      [
        {
          ...old[0],
          easing: 'cubic-bezier(.37,.67,.58,1)'
        },
        {
          transform: norm(transform),
          opacity
        }
      ],
      { ...options }
    )
    oldP = newP

    const children = host.children
    for (let i = 0; i < children.length; ++i) {
      if (children[i].__z_animateZoom) children[i].__z_animateZoom(newP)
    }
  }
  let oldP = { x: 0, y: 0, k: 1 }
  host.__z_setZoom = function (newP) {
    host.__z_setZoomShallow(newP)

    const children = host.children
    for (let i = 0; i < children.length; ++i) {
      if (children[i].__z_setZoom) children[i].__z_setZoom(newP)
    }
  }
  host.__z_setZoomShallow = function (p) {
    container.style.transform = `translateZ(0)translate(${p.x}px,${
      p.y
    }px)scale(${p.k * 1})`
  }
</script>

<svelte:options tag="z-canvas" />

<div bind:this={container} style="transform-origin: 0 0; ">
  <slot />
</div>

<style>
  :host {
    display: block;
  }
</style>
