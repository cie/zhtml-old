<script>
  import { get_current_component } from 'svelte/internal'
  const host = get_current_component()
  let viewport, view
  setTimeout(() => {
    viewport = host.closest('z-viewport')
    view = viewport.__z_view
  })

  export let focusable

  import rangeExpr from './rangeExpr'
  import { fade } from 'svelte/transition'
  import fix from './transfix.js'
  const t = fix(fade)

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
  $: focusView = {
    p: {
      x: -620,
      y: 190,
      k: 2
    },
    options: {}
  }
  $: focused = $view && eq($view.p, focusView.p)
  function eq(a, b) {
    return a.x === b.x && a.y === b.y && a.k === b.k
  }

  function focus() {
    if (focusable === undefined || focused) return
    $view = focusView
    if (host.id) history.pushState(undefined, '', '#' + host.id)
  }
</script>

<svelte:options tag="z-fig" />

{#each slots as name (name)}
  <div
    class:focusable={focusable !== undefined && !focused}
    on:click={focus}
    style="transform-origin: 0 0; width: 800%; position: absolute; top: 0; left: 0;
           transform: translateZ(0) scale(0.125)"
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
    transform-origin: 0 0;
    transform: translate(calc(1px * var(--z-x, 0)), calc(1px * var(--z-y, 0)));
    position: absolute;
    width: auto;
    top: 0;
    left: 0;
  }
  .focusable {
    cursor: pointer;
  }
</style>
