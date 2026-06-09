let cache = new Map(), stdTTL = 60000

function set(key, value){
  if(!key || !value) return
  cache.set(key, value)
  setTimeout(()=>cache.delete(key), stdTTL)
}
function get(key){
  let value = cache.get(key)
  cache.delete(key)
  return value
}

export default { get, set }
