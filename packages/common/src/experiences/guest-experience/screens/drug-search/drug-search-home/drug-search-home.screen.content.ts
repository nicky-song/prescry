// Copyright 2021 Prescryptive Health, Inc.

export interface IDrugSearchHomeScreenContent {
  noResultsMessage: string;
  searchTextPlaceholder: string;
  searchTextAccessibilityLabel: string;
  goBackButtonLabel: string;
}

export const drugSearchHomeScreenContent: IDrugSearchHomeScreenContent = {
  noResultsMessage: "Sorry, we didn't find a matching drug",
  searchTextPlaceholder: 'Search for drugs',
  searchTextAccessibilityLabel: 'Search for drugs',
  goBackButtonLabel: 'Go back to previous screen',
};
