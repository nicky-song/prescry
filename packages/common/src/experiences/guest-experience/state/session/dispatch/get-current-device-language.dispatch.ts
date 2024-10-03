// Copyright 2022 Prescryptive Health, Inc.

import { getCurrentUserLanguage } from '../../../../../utils/translation/get-current-user-language.helper';
import { IMembershipState } from '../../membership/membership.state';
import { setCurrentLanguageAction } from '../actions/set-current-language.action';
import { SessionDispatch } from './session.dispatch';

export const getCurrentDeviceLanguageDispatch = (
  dispatch: SessionDispatch,
  membershipState?: IMembershipState
): void => {
  const language = getCurrentUserLanguage(membershipState);
  dispatch(setCurrentLanguageAction(language));
};
