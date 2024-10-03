// Copyright 2018 Prescryptive Health, Inc.

import {
  GuestExperienceFeatures,
  getFirstValueByFeatureSwitch,
  rxGroupTypeFeatureMap,
} from './guest-experience-features';

describe('GuestExperienceFeatures', () => {
  it('exports guest-experience features', () => {
    expect(Object.keys(GuestExperienceFeatures).length).toEqual(12);
    expect(GuestExperienceFeatures.usecountrycode).toBe(false);
    expect(GuestExperienceFeatures.usegrouptypecash).toBe(false);
    expect(GuestExperienceFeatures.usegrouptypecovid).toBe(false);
    expect(GuestExperienceFeatures.usegrouptypesie).toBe(false);
    expect(GuestExperienceFeatures.usepharmacy).toBe(false);
    expect(GuestExperienceFeatures.usetestpharmacy).toBe(false);
    expect(GuestExperienceFeatures.usevaccine).toBe(false);
    expect(GuestExperienceFeatures.usetestcabinet).toBe(false);
    expect(GuestExperienceFeatures.usesieprice).toBe(false);
    expect(GuestExperienceFeatures.usecashprice).toBe(false);
    expect(GuestExperienceFeatures.useinsurance).toBe(false);
    expect(GuestExperienceFeatures.usehome).toBe(false);
  });
});

describe('getFirstValueByFeatureSwitch', () => {
  it('returns RxGroupType.cash for feature cash: ?f=usegrouptypecash:1', () => {
    const features = {
      usegrouptypecash: true,
      usegrouptypecovid: false,
      usegrouptypesie: false,
    } as { [key: string]: boolean };

    const rxGroupType = getFirstValueByFeatureSwitch(
      features,
      rxGroupTypeFeatureMap
    );
    expect(rxGroupType).toEqual('CASH');
  });

  it('returns SIE for feature sie: ?f=usegrouptypesie:1', () => {
    const features = {
      usegrouptypecash: false,
      usegrouptypecovid: false,
      usegrouptypesie: true,
    } as { [key: string]: boolean };

    const rxGroupType = getFirstValueByFeatureSwitch(
      features,
      rxGroupTypeFeatureMap
    );
    expect(rxGroupType).toEqual('SIE');
  });

  it('returns RxGroupType.covid for feature covid: ?f=usegrouptypecovid:1', () => {
    const features = {
      usegrouptypecash: false,
      usegrouptypecovid: true,
      usegrouptypesie: false,
    } as { [key: string]: boolean };

    const rxGroupType = getFirstValueByFeatureSwitch(
      features,
      rxGroupTypeFeatureMap
    );
    expect(rxGroupType).toEqual('COVID19');
  });

  it('prefers RxGroupType.cash to sie or covid : ?f=usegrouptypecash:1,usegrouptypecovid:1,usegrouptypesie:1', () => {
    const features = {
      usegrouptypecash: true,
      usegrouptypecovid: true,
      usegrouptypesie: true,
    } as { [key: string]: boolean };

    const rxGroupType = getFirstValueByFeatureSwitch(
      features,
      rxGroupTypeFeatureMap
    );
    expect(rxGroupType).toEqual('CASH');
  });

  it('ignores features that are not related to RxGroupType', () => {
    const features = {
      usegrouptypecash: true,
      usegrouptypecovid: false,
      usegrouptypesie: false,
    } as { [key: string]: boolean };

    const rxGroupType = getFirstValueByFeatureSwitch(
      features,
      rxGroupTypeFeatureMap
    );
    expect(rxGroupType).toEqual('CASH');
  });
});
