<script>
  import { Point, ORIGIN } from './math/Point'
  import { easeOutQuad } from 'penner'
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
