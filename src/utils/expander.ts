import * as r from 'convert-radix64'
import { ShortcodeOptions } from './shortener'

export function expandFromShortcode(shortCode: string): ShortcodeOptions {
  if (shortCode.length > 9) {
    throw new Error()
  }
  const codeInt = r.from64(shortCode)
  return {
    codeActual: shortCode,
    codeStr: shortCode,
    codeInt,
  }
}
