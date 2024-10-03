// Copyright 2018 Prescryptive Health, Inc.

import { handleAuthenticationErrorAction } from '../../error-handling.actions';
import { IUpdateSettingsAction } from '../../settings/settings-reducer.actions';
import { Dispatch } from 'react';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

export const phoneNumberMismatchedErrorDispatch = async (
  dispatch: Dispatch<IUpdateSettingsAction>,
  navigation: RootStackNavigationProp
) => {
  await handleAuthenticationErrorAction(dispatch, navigation);
};
