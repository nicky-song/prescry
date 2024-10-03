// Copyright 2022 Prescryptive Health, Inc.

import { IGuestExperienceConfig } from '@phx/common/src/experiences/guest-experience/guest-experience-config';
import {
  FeatureFlag,
  GuestExperienceFeatures,
  IFeaturesState,
} from '@phx/common/src/experiences/guest-experience/guest-experience-features';
import {
  applyQuerySwitches,
  applyLdSwitches,
} from '@phx/common/src/utils/features.helper';
import { LDFlagSet } from 'launchdarkly-js-sdk-common';

export function initializeFeatureSwitches(
  config: IGuestExperienceConfig,
  ldFlags: LDFlagSet | undefined
) {
  applyLdSwitches(GuestExperienceFeatures, ldFlags);
  applyQuerySwitches(GuestExperienceFeatures, location.search);

  // Until the API directly accesses LD, this is needed to pass feature
  // switches to it.
  config.apis.guestExperienceApi.switches = buildApiFeatureSwitchQueryString(
    GuestExperienceFeatures
  );
}

const buildApiFeatureSwitchQueryString = (features: IFeaturesState): string => {
  const apiSwitches = [];
  for (const prop in features) {
    const value = features[prop as FeatureFlag];
    if (value) {
      if (typeof value === 'boolean') {
        apiSwitches.push(`${prop}:1`);
      } else {
        apiSwitches.push(`${prop}:${value}`);
      }
    }
  }

  return apiSwitches.length ? '?f=' + apiSwitches.join() : '';
};
