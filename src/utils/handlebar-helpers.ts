export function ifeq(arg1, arg2, options) {
  if (arg1 === arg2) {
    // @ts-ignore
    return options.fn(this)
  } else {
    // @ts-ignore
    return options.inverse(this)
  }
}

export function ifcontains(arr, predicate, options) {
  arr = arr.split(',')
  for (const check of arr) {
    if (check === predicate) {
      // @ts-ignore
      return options.fn(this)
    }
  }
  // @ts-ignore
  return options.inverse(this)
}

export function inc(value, options) {
  return parseInt(value, 10) + 1
}

export function dec(value, options) {
  return parseInt(value, 10) - 1
}
