// Copyright 2018 Prescryptive Health, Inc.

import { LDFlagSet } from 'launchdarkly-js-sdk-common';
import {
  FeatureFlag,
  IFeaturesState,
} from '@phx/common/src/experiences/guest-experience/guest-experience-features';

export const applyQuerySwitches = <TFeatures extends string>(
  features: { [key in TFeatures]?: boolean | string },
  query: string,
  alwaysAllowedFeatureFlags: string[] = [],
  useRestrictPattern = true,
  optionalRestrictPattern = '.*'
) => {
  const restriction = new RegExp(optionalRestrictPattern, 'i');
  const flagSets = query.match(/A?\??f=([^&]+)&*/i);

  if (flagSets && flagSets.length === 2) {
    const flagSet = flagSets[1];
    const flags = flagSet.split(',').map((f) => f.split(':'));
    flags.forEach((f) => {
      if (Array.isArray(f) && f.length === 2) {
        const key = f[0] as TFeatures;
        if (
          (useRestrictPattern && restriction.test(key)) ||
          alwaysAllowedFeatureFlags?.find((feature) => feature === key)
        ) {
          const value = f[1];
          if (value === '0' || value === '1') {
            features[key] = value === '1';
          } else {
            features[key] = value;
          }
        }
      }
    });
  }
};

export const applyLdSwitches = (
  features: IFeaturesState,
  ldFlags?: LDFlagSet
) => {
  if (ldFlags) {
    Object.keys(ldFlags).forEach((ldFlagKey) => {
      features[ldFlagKey as FeatureFlag] = ldFlags[ldFlagKey];
    });
  }
};
