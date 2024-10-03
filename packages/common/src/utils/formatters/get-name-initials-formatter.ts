// Copyright 2018 Prescryptive Health, Inc.

export const getNameInitials = (name: string) => {
  return name !== undefined
    ? name
        .trim()
        .split(' ')
        .map((a: string) => a[0])
        .join('')
        .toUpperCase()
    : '';
};
