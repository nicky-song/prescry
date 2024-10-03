// Copyright 2018 Prescryptive Health, Inc.

import { dispatchResetStackToPhoneLoginScreen } from '../navigation/navigation-reducer.actions';
import {
  IUpdateSettingsAction,
  resetSettingsAction,
} from '../settings/settings-reducer.actions';
import { Dispatch } from 'react';
import { SupportErrorBackNavigationType } from './support-error.reducer';
import { RootStackNavigationProp } from '../../navigation/stack-navigators/root/root.stack-navigator';

export enum MissingAccountActionKeys {
  SET_MISSING_ACCOUNT_ERROR_MESSAGE = 'SET_MISSING_ACCOUNT_ERROR_MESSAGE',
}

export interface ISetMissingAccountErrorMessageAction {
  type: MissingAccountActionKeys.SET_MISSING_ACCOUNT_ERROR_MESSAGE;
  payload: {
    errorMessage?: string;
    errorBackNavigationType?: SupportErrorBackNavigationType;
  };
}

export type MissingAccountActionTypes = ISetMissingAccountErrorMessageAction;

export const setMissingAccountErrorMessageAction = (
  errorMessage?: string,
  errorBackNavigationType: SupportErrorBackNavigationType = 'NavigateBackOneAndTryAgain'
): ISetMissingAccountErrorMessageAction => {
  return {
    payload: {
      errorBackNavigationType,
      errorMessage,
    },
    type: MissingAccountActionKeys.SET_MISSING_ACCOUNT_ERROR_MESSAGE,
  };
};

export const navigateToPhoneLoginScreenAndResetSettings = (
  navigation: RootStackNavigationProp
) => {
  return async (action: Dispatch<IUpdateSettingsAction>) => {
    await resetSettingsAction()(action);
    dispatchResetStackToPhoneLoginScreen(navigation);
  };
};
