<script>
  import { get_current_component, onMount, tick } from 'svelte/internal'
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
    const oldP = p
    p = $view.p
    container.animate(
      [
        { transform: t(oldP), easing: 'cubic-bezier(.37,.67,.58,1)' },
        { transform: t(p) }
      ],
      $view.options
    )
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
