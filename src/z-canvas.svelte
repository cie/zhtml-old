<script>
  import { ORIGIN } from './math/Point'
  import { onMount, tick } from 'svelte'
  let hostGetter
  let view
  onMount(async () => {
    await new Promise(resolve => setTimeout(resolve, 0))
    view = hostGetter.parentNode.host.parentNode.closest('z-viewport').view
  })
</script>

<svelte:options tag="z-canvas" />
<x-host-getter bind:this={hostGetter} />

{#if $view}
  <div
    style="transform-origin: 0 0; transform: translate({$view.x}px,{$view.y}px)scale({$view.scale});
    --z-zoom: {$view.scale}; --z-zoom-0_2: {$view.scale ** 0.2}; --z-zoom-0_7: {$view.scale ** 0.7};
    --z-delay: -{$view.scale / 100}s ">
    <slot />
  </div>
{/if}

<style>
  :host {
    display: block;
  }
</style>
