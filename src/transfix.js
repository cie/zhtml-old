// https://github.com/sveltejs/svelte/issues/4735#issuecomment-703129877
export default function fix(transtion) {
  return function(node, params){
    Object.defineProperty(node, 'ownerDocument', { get: function() { return {head: node.parentNode}; } });
    return transtion(node, params)
  }
}