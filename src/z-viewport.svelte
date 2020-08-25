<script>
  import { Point, ORIGIN } from './math/Point'
  import { AnimatedPoint } from './animation/AnimatedPoint'
  import { easeOutQuad } from 'penner'
  export let view = new AnimatedPoint(ORIGIN)

  function tap() {
    view.animate(new Point(80, 40, 8.2), {
      duration: 1500,
      easing: easeOutQuad,
      options: { path: 'euclidean' }
    })
  }
</script>

<svelte:options tag="z-viewport" />
<x-backdrop on:click={tap} />
<slot />

<style>
  x-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  :host {
    display: block;
    width: 400px;
    height: 300px;
    align-items: stretch;
    justify-items: stretch;
    overflow: hidden;
    contain: content;
  }
</style>
