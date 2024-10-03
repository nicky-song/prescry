// Copyright 2022 Prescryptive Health, Inc.

import { SortByOption } from '../experiences/guest-experience/screens/drug-search/configure-filters/configure-filters.screen';

export interface IPharmacyFilterPreferences {
  sortBy: SortByOption;
  distance: number;
}
