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
  // tslint:disable-next-line:radix
  return parseInt(value) + 1
}

export function dec(value, options) {
  return parseInt(value) - 1
}

export function range(value, options) {
  var ret = ""
  for (let i=1; i<=value; i++){
    ret += options.fn({counter: i})
  }
  return ret
}
