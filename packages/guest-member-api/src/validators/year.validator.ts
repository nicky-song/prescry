// Copyright 2022 Prescryptive Health, Inc.

export const isValidYear = (year: string): boolean => {
  const regex = /^\d{4}$/;

  return regex.test(year);
};
