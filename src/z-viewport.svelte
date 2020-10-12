<script>
  import { get_current_component, onMount } from 'svelte/internal'
  import { writable } from 'svelte/store'
  const host = get_current_component()
  let view = (host.__z_view = writable({
    p: { x: 0, y: 0, k: 1 },
    options: { duration: 0 }
  }))
  host.addEventListener('wheel', event => {
    $view = {
      p: {
        x: $view.p.x,
        y: $view.p.y,
        k: $view.p.k * Math.pow(Math.SQRT2, -event.deltaY / 100)
      },
      options: { duration: 250 }
    }
  })
</script>

<svelte:options tag="z-viewport" />

<slot />

<style>
  :host {
    display: block;
    overflow: hidden;
    contain: content;
  }
</style>
