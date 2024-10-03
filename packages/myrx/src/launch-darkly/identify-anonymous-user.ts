// Copyright 2022 Prescryptive Health, Inc.

import { LDUser, LDClient } from 'launchdarkly-js-client-sdk';

export const identifyAnonymousUser = async (
  ldClient: LDClient | undefined
): Promise<void> => {
  const anonUser: LDUser = { anonymous: true };
  await ldClient?.identify(anonUser);
};
