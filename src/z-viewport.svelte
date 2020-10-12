<script>
  import { get_current_component, onMount } from 'svelte/internal'
  import { writable } from 'svelte/store'
  import { add, neg } from './math/points'
  const host = get_current_component()
  let view = (host.__z_view = writable({
    p: { x: 0, y: 0, k: 1 },
    options: { duration: 0 }
  }))
  host.addEventListener('wheel', event => {
    const r = host.getBoundingClientRect()
    const mouse = { x: event.clientX - r.left, y: event.clientY - r.top, k: 1 }
    const wheel = { x: 0, y: 0, k: Math.pow(Math.SQRT2, -event.deltaY / 100) }
    $view = {
      p: neg(add(add(add(neg($view.p), mouse), neg(wheel)), neg(mouse))),
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
