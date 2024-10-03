// Copyright 2022 Prescryptive Health, Inc.

export interface IConfigureFiltersScreenContent {
  filterByLabel: string;
  sortByLabel: string;
  applyLabel: string;
  distanceRange: (rangeLimit: number, unit: string) => string;
}

export const configureFiltersScreenContent: IConfigureFiltersScreenContent = {
  filterByLabel: 'Filter by',
  sortByLabel: 'Sort by',
  applyLabel: 'Apply',
  distanceRange: (rangeLimit: number, unit: string) =>
    `Distance range (max ${rangeLimit} ${unit}.)`,
};
