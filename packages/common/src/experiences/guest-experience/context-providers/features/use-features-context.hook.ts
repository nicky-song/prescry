// Copyright 2022 Prescryptive Health, Inc.

import { useContext } from 'react';
import { IFeaturesContext, FeaturesContext } from './features.context';

/**
 * @deprecated The method should not be used nor features added to this context as we are working on deprecating the legacy
 * feature management system
 * please reach out to a sysadmin to use launchdarkly instead
 * note: use the `useFlags()` hook to access LD flags
 * if you have questions, please create a post on the myPrescryptive Teams channel.
 */
export const useFeaturesContext = (): IFeaturesContext =>
  useContext(FeaturesContext);
