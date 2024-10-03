// Copyright 2022 Prescryptive Health, Inc.

/**
 * Arguments for transformer function
 */
type TransformerArguments<From, To, AdditionalValues extends keyof To = never> =
  [AdditionalValues] extends [never]
    ? From
    : {
        fromModel: From;
        additional: { [Key in AdditionalValues]: To[Key] };
      };
/**
 * Function signature for a transformer function
 * @template From Type/model to transform from
 * @template To Type/model to transform to
 * @template AdditionalValues fields on the To type/model to map that are not present on the From type/model
 */
export type Transformer<From, To, AdditionalValues extends keyof To = never> = (
  from: TransformerArguments<From, To, AdditionalValues>
) => From extends unknown[] ? To[] : To;

/**
 * Utility type to generate property names from a model
 * @template Model String union model to use
 * @template Suffix Suffix for generated property keys 
 * @template PropertyType Type for the generated property
 * @example 
 * type NewProperties = PropertyBuilder<'OptionOne' | 'OptionTwo', 'Sync' | 'Async', string>
 * // generates
 * type NewProperties = {
    OptionOneSync: string;
    OptionOneAsync: string;
    OptionTwoSync: string;
    OptionTwoAsync: string;
}
 */
export type PropertyBuilder<
  Model extends string,
  Suffix extends string,
  PropertyType extends number | string | boolean
> = {
  [Key in Model as `${Key}${Suffix}`]: PropertyType;
};
