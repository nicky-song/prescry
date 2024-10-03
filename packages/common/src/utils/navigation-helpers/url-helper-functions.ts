// Copyright 2021 Prescryptive Health, Inc.

import { goToUrl } from '../link.helper';

export const goToTermsAndConditionsUrl = async () =>
  await goToUrl('https://prescryptive.com/terms-of-use/');

export const goToPrivacyPolicyUrl = async () =>
  await goToUrl('https://prescryptive.com/privacy-policy/');
