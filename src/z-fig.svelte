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

  import rangeExpr from './rangeExpr'

  let slots = []
  let z
  let containers = {}
  const has = {}
  $: if (view) {
    const oldZ = z
    z = $view.p.k
    if (z !== oldZ) {
      const allSlots = [...new Set([...host.children].map(c => c.slot))]
      allSlots.forEach(name => {
        if (!has.hasOwnProperty(name)) has[name] = rangeExpr(name)
      })
      slots = [
        ...allSlots.filter(name => has[name](oldZ) || has[name](z)),
        undefined
      ]
      tick().then(() => {
        console.log(slots)
        slots.forEach(name => {
          if (!name) return
          const before = has[name](oldZ)
          const after = has[name](z)
          console.log(has, name, { before, after })
          if (before && !after) {
            containers[name].animate(
              [
                { opacity: 1, easing: 'cubic-bezier(.08,1.12,.54,.98)' },
                { opacity: 0 }
              ],
              $view.options
            )
            containers[name].style.opacity = 0
          } else if (after && !before) {
            containers[name].animate(
              [
                { opacity: 0, easing: 'cubic-bezier(.22,.56,.57,1)' },
                { opacity: 1 }
              ],
              $view.options
            )
            containers[name].style.opacity = 1
          } else if (after && before) {
            containers[name].style.opacity = 1
          }
        })
      })
    }
  }
</script>

<svelte:options tag="z-fig" />

{#each slots as name}
  <div
    bind:this={containers[name]}
    style="width: var(--z-width); position: absolute; top:0; left: 0;">
    {@html name ? `<slot name="${name}" />` : `<slot/>`}
  </div>
{/each}

<style>
  :host {
    display: block;
  }
</style>
