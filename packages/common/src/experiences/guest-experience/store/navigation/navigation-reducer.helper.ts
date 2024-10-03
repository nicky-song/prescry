// Copyright 2018 Prescryptive Health, Inc.

import {
  FeatureFlag,
  IFeaturesState,
  LegacyFeatureSwitch,
} from '../../guest-experience-features';
import { handleNavigateToHome } from './handle-navigate-to-home';

export interface IBackActionSetting {
  allowHardwareBack: boolean;
  allowSwipeBack: boolean;
}

const INCLUDE_FLAGS: LegacyFeatureSwitch[] = [
  'usecountrycode',
  'usegrouptypecovid',
  'usegrouptypesie',
  'usegrouptypecash',
  'usepharmacy',
  'usetestpharmacy',
  'usevaccine',
  'usesieprice',
  'usecashprice',
  'useinsurance',
  'usehome',
  'usetestcabinet',
];

export const resetURLAfterNavigation = (features: IFeaturesState) => {
  const featureFlags: string[] = [];

  Object.keys(features)
    .filter(
      (key) =>
        features[key as FeatureFlag] === true &&
        INCLUDE_FLAGS.includes(key as LegacyFeatureSwitch)
    )
    .forEach((key) => {
      featureFlags.push(`${key}:1`);
    });

  const featureUrl = featureFlags.join(',');

  handleNavigateToHome(
    featureFlags.length > 0 ? `?f=${featureUrl}` : undefined
  );
};
