// Copyright 2021 Prescryptive Health, Inc.

export interface ISearchBoxContent {
  placeholder: string;
  searchresults: string;
  errorNearbyPharmacyNotFound: string;
}

export const searchBoxContent: ISearchBoxContent = {
  placeholder: 'Enter zip code',
  searchresults: 'Search results',
  errorNearbyPharmacyNotFound: 'No pharmacies found',
};
