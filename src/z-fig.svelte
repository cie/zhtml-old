<script>
  import { get_current_component, tick } from 'svelte/internal'
  import { animateZoom } from './zoom'

  const host = get_current_component()
  let containers = (host.containers = {})

  host.__z_animateZoom = animateZoom
  host.__z_setZoom = function (newP) {
    host.__z_setZoomShallow(newP)

    const children = host.children
    for (let i = 0; i < children.length; ++i) {
      if (children[i].__z_setZoom) children[i].__z_setZoom(newP)
    }
  }
  host.__z_setZoomShallow = function (p) {
    containers['->1.2x'].style.opacity = p.k < 1.2 ? 1 : 0
    containers['1.2x-'].style.opacity = p.k > 1.2 ? 1 : 0
  }

  const slots = ['->1.2x', '1.2x-', undefined]
</script>

<svelte:options tag="z-fig" />

{#each slots as name}
  <div
    bind:this={containers[name]}
    style="transform-origin: 0 0; width: calc(var(--z-width) * 8); position: absolute; top: 0; left: 0; transform: translateZ(0)scale(0.125)">
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
