<script>
  import { ORIGIN } from './math/Point'
  import { onMount, tick } from 'svelte'
  import { AnimatedPoint } from './animation/AnimatedPoint'
  export let view = new AnimatedPoint(ORIGIN)
</script>

<svelte:options tag="z-canvas" />

<div
  style="transform-origin: 0 0; transform: translate({$view.x}px,{$view.y}px)scale({$view.scale});
  --z-zoom: {$view.scale}; --z-parent-zoom: {$view.scale}; --z-zoom-0_2: {$view.scale ** 0.2};
  --z-zoom-0_7: {$view.scale ** 0.7}; --z-delay: calc(-1s * var(--z-zoom) / 100)
  ">
  <slot />
</div>

<style>
  :host {
    display: block;
  }
</style>
