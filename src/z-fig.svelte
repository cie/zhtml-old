<script>
  import { get_current_component, tick } from 'svelte/internal'
  const host = get_current_component()
  let containers = {}

  function norm(tr) {
    return tr.replace(
      /matrix\(([^,]+), 0, 0, \1, ([^,]+), ([^,]+)\)/,
      'translate($2px, $3px)scale($1)'
    )
  }

  host.__z_animateZoom = async function (newP, options = { duration: 300 }) {
    const old = Object.entries(containers).map(([name, container]) => {
      const { transform, opacity } = getComputedStyle(container)
      /*console.log(
        'b4',
        name,
        container.offsetWidth,
        container.style.transform,
        { transform, opacity }
      )*/
      return {
        transform: norm(transform),
        opacity
      }
    })
    Object.entries(containers).forEach(([name, container], i) => {
      host.__z_setZoomShallow(newP)
      const { transform, opacity } = getComputedStyle(container)
      const downwards = newP.k < oldP.k
      //if (downwards) console.log('d')
      // host.__z_setZoomShallow(oldP)
      /*console.log(
        'afta',
        name,
        container.offsetWidth,
        container.style.transform,
        old[i]
      )*/
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
      //if (oldP.k > newP.k) {
      //host.__z_setZoomShallow(newP)
      //}
    })
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
    containers['->1.2x'].style.opacity = p.k < 1.2 ? 1 : 0
    containers['->1.2x'].style.transform = `translate(${p.x}px,${p.y}px)scale(${
      p.k * 0.125
    })`
    containers['1.2x->'].style.opacity = p.k > 1.2 ? 1 : 0
    containers['1.2x->'].style.transform = `translate(${p.x}px,${p.y}px)scale(${
      p.k * 0.125
    })`
  }
</script>

<svelte:options tag="z-fig" />

<div
  bind:this={containers['->1.2x']}
  style="transform-origin: 0 0; width: calc(var(--z-width) * 8); position: absolute; top: 0; left: 0;">
  <div
    style="width: 12.5%; transform-origin: 0 0; position: absolute; top: 0; left: 0; transform: scale(8);">
    <slot name="->1.2x" />
  </div>
</div>
<div
  bind:this={containers['1.2x->']}
  style="transform-origin: 0 0; width: calc(var(--z-width) * 8); position: absolute; top: 0; left: 0;">
  <div
    style="width: 12.5%; transform-origin: 0 0; position: absolute; top: 0; left: 0; transform: scale(8);">
    <slot name="1.2x->" />
  </div>
</div>

<style>
  :host {
    display: block;
  }
</style>
