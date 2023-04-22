function deepClone(obj, hash = new WeakMap()) {
  if (obj === null) return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)
  if (typeof obj !== 'object') return obj
  if (hash.get(obj)) return hash.get(obj)
  let cloneObject = new obj.contructor()
  hash.set(obj, cloneObject)
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObject[key] = deepClone(obj[key], hash)
    }
  }

  return cloneObject
}
