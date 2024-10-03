// Copyright 2018 Prescryptive Health, Inc.

import {
  IUpdateSettingsAction,
  resetSettingsAction,
} from '../../../experiences/guest-experience/store/settings/settings-reducer.actions';
import {
  ISetMissingAccountErrorMessageAction,
  setMissingAccountErrorMessageAction,
} from '../../../experiences/guest-experience/store/support-error/support-error.reducer.actions';
import { guestExperienceExceptionLogger } from '../guest-experience-logger.middleware';
import { RootStackNavigationProp } from '../navigation/stack-navigators/root/root.stack-navigator';

import {
  dispatchResetStackToFatalErrorScreen,
  dispatchResetStackToPhoneLoginScreen,
} from './navigation/navigation-reducer.actions';
import { SupportErrorBackNavigationType } from './support-error/support-error.reducer';

export const handleAuthenticationErrorAction = async (
  dispatch: (action: IUpdateSettingsAction) => void,
  navigation: RootStackNavigationProp,
  isBlockchain?: boolean
) => {
  await resetSettingsAction()(dispatch);
  dispatchResetStackToPhoneLoginScreen(navigation, isBlockchain);
};

export const handleUnauthorizedAccessErrorAction = async (
  dispatch: (action: IUpdateSettingsAction) => void,
  navigation: RootStackNavigationProp,
  errorMessage: string
) => {
  await resetSettingsAction()(dispatch);
  dispatchResetStackToPhoneLoginScreen(navigation, undefined, errorMessage);
};

export const handleCommonErrorAction = (
  navigation: RootStackNavigationProp,
  errorMessage: string,
  error: Error
) => {
  dispatchResetStackToFatalErrorScreen(navigation, errorMessage);
  guestExperienceExceptionLogger(error);
};

export const handleTwilioErrorAction = (
  dispatch: (action: ISetMissingAccountErrorMessageAction) => void,
  navigation: RootStackNavigationProp,
  errorMessage: string,
  errorBackNavigationType?: SupportErrorBackNavigationType
) => {
  dispatch(
    setMissingAccountErrorMessageAction(errorMessage, errorBackNavigationType)
  );

  navigation.navigate('SupportError');
};
