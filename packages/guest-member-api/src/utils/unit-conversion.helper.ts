// Copyright 2020 Prescryptive Health, Inc.

const unitConversionDictionary = {
  miles_meters: 1609.34,
};

export type LengthUnit = 'miles' | 'meters';

export function convertUnits(
  inputDistance: number,
  startUnit: LengthUnit,
  endUnit: LengthUnit
): number {
  switch (startUnit + '_' + endUnit) {
    case 'miles_meters':
      return inputDistance * unitConversionDictionary.miles_meters;
    case 'meters_miles':
      return inputDistance / unitConversionDictionary.miles_meters;
    default:
      return inputDistance;
  }
}
