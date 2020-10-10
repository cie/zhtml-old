<script>
  import { get_current_component, tick } from 'svelte/internal'
  const host = get_current_component()
  let container, container2

  host.__z_animateZoom = async function (newP, options = { duration: 300 }) {
    const { transform: oldTransform } = getComputedStyle(container)
    host.__z_setZoomShallow(newP)
    const { transform, width } = getComputedStyle(container)
    console.log(transform, oldTransform)
    container.animate(
      [
        {
          transform: oldTransform,
          width,
          easing: 'cubic-bezier(.37,.67,.58,1)'
        },
        {
          transform,
          width
        }
      ],
      options
    )

    const children = host.children
    for (let i = 0; i < children.length; ++i) {
      if (children[i].__z_animateZoom) children[i].__z_animateZoom(newP)
    }
  }
  let p = { x: 0, y: 0, k: 1 }
  host.__z_setZoom = function (newP) {
    host.__z_setZoomShallow(newP)

    const children = host.children
    for (let i = 0; i < children.length; ++i) {
      if (children[i].__z_setZoom) children[i].__z_setZoom(newP)
    }
  }
  host.__z_setZoomShallow = function (newP) {
    p = newP
    container.style.transform = `translate(${p.x}px,${p.y}px)scale(${p.k})`
    container.style.width = `${200 * p.k}px`
  }
</script>

<svelte:options tag="z-canvas" />

<div
  bind:this={container}
  style="transform-origin: 0 0; width: 200px; position: absolute; top: 0; left: 0;">
  <slot />
</div>
<div
  bind:this={container2}
  style="transform-origin: 0 0; width: 200px; position: absolute; top: 0; left: 0;">
  <slot name="double" />
</div>

<style>
  :host {
    display: block;
  }
</style>
