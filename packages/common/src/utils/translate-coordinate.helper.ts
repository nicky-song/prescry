// Copyright 2022 Prescryptive Health, Inc.

export const translateCoordinateHelper = (coordinate?: number) => {
  if (coordinate === undefined) {
    return undefined;
  }

  return Number(coordinate.toFixed(6));
};
