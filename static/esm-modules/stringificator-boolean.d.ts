export interface IValueDescriptor {
  componentName?: string
  iconName: string
  label: string
}
export interface IBaseValueStringificator<TValue> {
  prepare?(value: TValue): IValueDescriptor
  format(value: TValue): string
}
export interface IValueStringificator<TValue, TFormat = undefined>
  extends IBaseValueStringificator<TValue> {
  readonly FORMATS?: ReadonlyArray<TFormat>
  deserialize(value: string): TValue
  format(value: TValue, format?: TFormat | string): string
  isFormatVariant?(value: unknown): value is TFormat
  assertFormatVariant?(value: unknown): asserts value is TFormat
}
declare const FORMATS: readonly ['thumb', 'checkmark', 'word']
export type IBooleanValueFormatVariant = (typeof FORMATS)[number]
export declare const boolean: IValueStringificator<
  boolean,
  IBooleanValueFormatVariant
>
export {}
