// Copyright 2022 Prescryptive Health, Inc.

/**
 * Converts a string | number to a number. If the value is undefined or null
 * @param item item to convert
 * @returns a number
 */
export const convertToNumber = (item?: string | number | null) => {
  if (typeof item === 'string') {
    return parseFloat(item);
  }
  return item ?? 0;
};
