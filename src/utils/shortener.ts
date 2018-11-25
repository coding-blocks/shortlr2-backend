import * as r from 'convert-radix64'
import { GroupAttributes } from '../db'

export interface ShortcodeOptions {
  codeInt: number
  codeStr: string
  codeActual: string
}
function genRandomCode() {
  const randCode =
    // 2 digit number with 6 zeros
    ((Math.random() * 100) << 0) * 1000000 +
    // current milliseconds (cutting off last 2 digits), 6-digit
    (((new Date().getTime() / 100) << 0) % 1000000)
  return randCode
}

export function genRandomShortcode(): ShortcodeOptions {
  const codeInt = genRandomCode()
  const codeStr = r.to64(codeInt)

  return {
    codeActual: codeStr,
    codeStr,
    codeInt,
  }
}

export function optsFromShortcode(requiredCode: string): ShortcodeOptions {
  if (requiredCode.length > 9) {
    throw new Error('Shortcodes larger than 9 characters not supported')
  }
  return {
    codeStr: requiredCode,
    codeActual: requiredCode,
    codeInt: r.from64(requiredCode),
  }
}

export function optsFromGroupedShortcode(
  group: GroupAttributes,
  code: string,
): ShortcodeOptions {
  let tempCode = group.id + code
  while (tempCode.length < 9) {
    tempCode += '0'
  }
  if (tempCode.length > 9) {
    throw new Error('Code length larger than supported size of 9')
  }
  return {
    codeStr: tempCode,
    codeActual: group.prefix + '/' + code,
    codeInt: r.from64(tempCode),
  }
}
