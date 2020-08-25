import './z-viewport.svelte'
import './z-canvas.svelte'
import './z-box.svelte'

function prop (name, syntax, initialValue, inherits = false) {
  CSS.registerProperty({ name, syntax, inherits, initialValue })
}
prop('--z-x', '<number>', '0')
prop('--z-y', '<number>', '0')
prop('--z-scale', '<number>', '1')
prop('--z-zoom', '<number>', '1', true)
prop('--z-parent-zoom', '<number>', '1', true)
