// Copyright 2021 Prescryptive Health, Inc.

import { IDrugForm } from '../../../../models/drug-form';
import { IPharmacyFilterPreferences } from '../../../../models/filter-preferences';
import { defaultLanguage, Language } from '../../../../models/language';
import { ILocationCoordinates } from '../../../../models/location-coordinates';
import { IUIContentGroup } from '../../../../models/ui-content';

export interface ISessionState {
  drugFormMap: Map<string, IDrugForm>;
  uiCMSContentMap: Map<string, IUIContentGroup>;
  currentLanguage: Language;
  pharmacyFilterPreferences: IPharmacyFilterPreferences;
  isGettingUserLocation: boolean;
  isUnauthExperience?: boolean;
  isGettingStartedModalOpen?: boolean;
  isUserAuthenticated?: boolean;
  userLocation?: ILocationCoordinates;
}
export const defaultPharmacyFilterPreferences: IPharmacyFilterPreferences = {
  distance: 25,
  sortBy: 'distance',
};

export const defaultSessionState: ISessionState = {
  drugFormMap: new Map(),
  uiCMSContentMap: new Map(),
  currentLanguage: defaultLanguage,
  isUserAuthenticated: false,
  pharmacyFilterPreferences: defaultPharmacyFilterPreferences,
  isGettingUserLocation: false,
};
