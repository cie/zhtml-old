<script>
  import { get_current_component } from 'svelte/internal'
  const host = get_current_component()
  host.__z_animateZoom = function (p, options) {
    const children = host.children
    for (let i = 0; i < children.length; ++i) {
      if (children[i].__z_animateZoom) children[i].__z_animateZoom(p, options)
    }
  }
  host.__z_setZoom = function (p) {
    const children = host.children
    for (let i = 0; i < children.length; ++i) {
      if (children[i].__z_setZoom) children[i].__z_setZoom(p)
    }
  }
</script>

<svelte:options tag="z-viewport" />

<slot />

<style>
  :host {
    display: block;
    width: 400px;
    height: 300px;
    overflow: hidden;
    contain: content;
  }
</style>
