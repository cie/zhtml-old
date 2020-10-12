<script>
  import { get_current_component, onMount } from 'svelte/internal'
  import { writable } from 'svelte/store'
  const host = get_current_component()
  host.__z_view = writable({
    p: { x: 0, y: 0, k: 1 },
    options: { duration: 0 }
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
