// Copyright 2022 Prescryptive Health, Inc.

import { IMembershipState } from '../../experiences/guest-experience/state/membership/membership.state';
import { Language } from '../../models/language';
import { getContentLanguage } from './get-content-language.helper';
import { getCurrentLanguage } from './get-current-device-language.helper';
import { getQueryLanguage } from './get-query-language.helper';

export const getCurrentUserLanguage = (
  membershipState?: IMembershipState
): Language => {
  const queryLanguage = getQueryLanguage(location.search);
  const membershipLanguage =
    membershipState?.account.languageCode &&
    getContentLanguage(membershipState.account.languageCode);

  return queryLanguage
    ? queryLanguage
    : membershipLanguage
    ? membershipLanguage
    : getCurrentLanguage();
};
