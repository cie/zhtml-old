<script>
  import { get_current_component, tick } from 'svelte/internal'
  const t = fix(fade)
  const host = get_current_component()
  let viewport, view
  setTimeout(() => {
    viewport = host.closest('z-viewport')
    view = viewport.__z_view
  })

  import rangeExpr from './rangeExpr'
  import { fade } from 'svelte/transition'
  import fix from './transfix.js'

  let slots = []
  let z
  $: if (view) {
    const oldZ = z
    z = $view.p.k
    if (z !== oldZ) {
      const allSlots = [...new Set([...host.children].map(c => c.slot))]
      slots = [...allSlots.filter(name => rangeExpr(name)(z)), undefined]
    }
  }
</script>

<svelte:options tag="z-fig" />

{#each slots as name (name)}
  <div
    class="container"
    style="transform-origin: 0 0; width: calc(var(--z-width) * 8); position: absolute; top: 0; left: 0; transform: translateZ(0)scale(0.125)"
    transition:t={{ duration: 400, delay: 100 }}>
    <div
      style="width: 12.5%; transform-origin: 0 0; position: absolute; top: 0; left: 0; transform: scale(8);">
      {@html name ? `<slot name="${name}" />` : `<slot/>`}
    </div>
  </div>
{/each}

<style>
  :host {
    display: block;
  }
</style>
