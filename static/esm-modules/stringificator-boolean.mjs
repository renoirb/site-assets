/*!
 * https://renoirb.com/esm-modules/stringificator-boolean.mjs v1.0.0
 *
 * Maintainer: Renoir Boulanger <contribs@renoirboulanger.com>
 *
 * MIT
 *
 * © 2003-2023 Renoir Boulanger
 */

/**
 * UI Framework less utility to convert a boolean value for emoji.
 *
 * Time spent:
 *   20230208: 2h
 */

const FORMATS = ['thumb', 'checkmark', 'word']

const isFormatVariant = (value) => {
  if (typeof value === 'string') {
    const pick = String(value).toLowerCase()
    return [...FORMATS].includes(pick)
  }
  return false
}

const assertFormatVariant = (value) => {
  if (!isFormatVariant(value)) {
    const message = `Invalid Boolean Value Format Variant ${value}`
    throw new Error(message)
  }
}

const formatVariantPick = (formattedAs, fallback = 'checkmark') => {
  const formatName = String(formattedAs).toLowerCase()
  return isFormatVariant(formatName) ? formatName : fallback
}

const format = (value, formattedAs) => {
  assertFormatVariant(formattedAs)
  let normalizedValue = String(value).toLowerCase()
  const pick = value ? 1 : 0
  const formatName = formatVariantPick(formattedAs)
  const possibilities = [0, 0]
  /**
   * Using Unicode Code Point to either illustrate true or false
   * Search for other icons, see https://unicode-table.com/en/1F6AB/
   */
  switch (formatName) {
    case 'thumb':
      // 0 = Thumb Down
      // 1 = Thumb Up
      possibilities[0] = 128078
      possibilities[1] = 128077
      // @ts-ignore
      normalizedValue = String.fromCodePoint(possibilities[pick])
      break
    case 'checkmark':
      // 0 = X Mark, alternate; 10060, 9940
      // 1 = Heavy Check mark
      possibilities[0] = 128683
      possibilities[1] = 10004
      // @ts-ignore
      normalizedValue = String.fromCodePoint(possibilities[pick])
      break
    case 'word':
      possibilities[0] = 'no'
      possibilities[1] = 'yes'
      // @ts-ignore
      normalizedValue = String(possibilities[pick])
      break
    default:
      // Defaults to a string.
      // Bool true will be return as a string, with first letter capitalized; e.g. True
      normalizedValue =
        normalizedValue.charAt(0).toUpperCase() + normalizedValue.slice(1)
      break
  }
  return normalizedValue
}

const deserialize = (stringified) => {
  let out = false
  try {
    if (/^(true|false)$/i.test(stringified)) {
      const parsed = JSON.parse(String(stringified).toLowerCase())
      if (typeof parsed === 'boolean') {
        out = parsed
      }
    }
  } catch {
    out = false
  }
  return out
}

export const boolean = {
  FORMATS: Object.freeze([...FORMATS]),
  deserialize,
  format,
  assertFormatVariant,
  isFormatVariant,
}
