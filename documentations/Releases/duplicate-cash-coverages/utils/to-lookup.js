// Copyright 2023 Prescryptive Health, Inc.

export const toLookup = (array, getKey, getValue = null) => {
  return array.reduce((lookup, item) => {
    lookup[getKey(item)] = getValue ? getValue(item) : item;
    return lookup;
  }, {});
};

export const toArrayLookup = (array, getKey, getValue = null) => {
  return array.reduce((lookup, item) => {
    lookup[getKey(item)] = [
      ...(lookup[getKey(item)] ?? []),
      getValue ? getValue(item) : item,
    ];
    return lookup;
  }, {});
};
