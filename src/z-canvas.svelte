<script>
  import { get_current_component, onMount, tick } from 'svelte/internal'
  import { normalizeTransform } from './zoom'
  const host = get_current_component()
  let viewport, view
  onMount(() => {
    setTimeout(() => {
      viewport = host.closest('z-viewport')
      view = viewport.__z_view
    })
  })

  let container
  let p = { x: 0, y: 0, k: 1 }
  $: if (container && view) {
    if (p !== $view.p) {
      const { transform: oldTransform } = getComputedStyle(container)
      p = $view.p
      tick().then(() => {
        container.animate(
          [
            {
              transform: normalizeTransform(oldTransform),
              easing: 'cubic-bezier(.37,.67,.58,1)'
            },
            { transform: t(p) }
          ],
          $view.options
        )
      })
    }
  }

  function t(p) {
    return `translateZ(0)translate(${p.x}px,${p.y}px)scale(${p.k})`
  }
</script>

<svelte:options tag="z-canvas" />

<div bind:this={container} style="transform-origin: 0 0; transform: {t(p)}">
  <slot />
</div>

<style>
  :host {
    display: block;
  }
</style>
