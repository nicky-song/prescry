// Copyright 2021 Prescryptive Health, Inc.

import { defaultLanguage } from '../../../../models/language';
import {
  defaultPharmacyFilterPreferences,
  defaultSessionState,
  ISessionState,
} from './session.state';

describe('SessionState', () => {
  it('has expected default state', () => {
    const expectedDefault: ISessionState = {
      drugFormMap: new Map(),
      uiCMSContentMap: new Map(),
      currentLanguage: defaultLanguage,
      isUserAuthenticated: false,
      pharmacyFilterPreferences: defaultPharmacyFilterPreferences,
      isGettingUserLocation: false,
    };
    expect(defaultSessionState).toEqual(expectedDefault);
  });
});
