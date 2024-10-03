// Copyright 2018 Prescryptive Health, Inc.

import { IFeaturesState } from '../../guest-experience-features';
import { featuresStateReducer } from './features-state.reducer';

describe('featuresStateReducer', () => {
  it('should return features initial state', () => {
    const initialState = {
      usecountrycode: true,
      usegrouptypecovid: true,
      usegrouptypesie: true,
    } as IFeaturesState;
    const resultStateFeatures = featuresStateReducer(initialState);
    expect(resultStateFeatures).toEqual(initialState);
  });
});
