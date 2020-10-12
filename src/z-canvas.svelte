<script>
  import { get_current_component, tick } from 'svelte/internal'
  import { add, dif, ldist, lerp, neg, pdist, perp, sub } from './math/points'
  const host = get_current_component()
  let viewport, view
  setTimeout(() => {
    viewport = host.closest('z-viewport')
    view = viewport.__z_view
  })

  let container
  let p = { x: 0, y: 0, k: 1 }
  $: if (container && view) {
    if (p !== $view.p) {
      const oldP = p
      p = $view.p
      const { path = 'linear', ...options } = $view.options
      tick().then(() => {
        if (path === 'linear') {
          if (!options.easing) options.easing = 'cubic-bezier(.37,.67,.58,1)'
          if (!options.duration) options.duration = pdist(oldP, p) * 60
          container.animate(
            [{ transform: t(oldP) }, { transform: t(p) }],
            options
          )
        } else {
          if (!options.easing) options.easing = 'cubic-bezier(.28,0,.55,.99)'
          if (!options.duration) options.duration = pdist(oldP, p) * 144
          let center = {
            x: viewport.offsetWidth / 2,
            y: viewport.offsetHeight / 2,
            k: 1
          }
          const i1 = perp(add(neg(oldP), center), add(neg(p), center))
          console.log(options.duration / i1.S)
          //options.duration = i1.S * 1000
          const int = t => neg(add(i1(t), neg(center)))
          const n = 10
          container.animate(
            [...Array(n + 1)].map((_, i) => ({ transform: t(int(i / n)) })),
            options
          )
        }
      })
    }
  }

  function t(p) {
    return `translate(${p.x}px,${p.y}px)scale(${p.k})`
  }
</script>

<svelte:options tag="z-canvas" />

<div bind:this={container} style="transform: {t(p)}">
  <slot />
</div>

<style>
  :host {
    display: block;
    transform-origin: 0 0;
  }
  div {
    transform-origin: 0 0;
  }
</style>
