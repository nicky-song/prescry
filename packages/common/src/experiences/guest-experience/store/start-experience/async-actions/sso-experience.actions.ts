// Copyright 2022 Prescryptive Health, Inc.

import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { RootState } from '../../root-reducer';
import { decode } from 'jsonwebtoken';
import { Dispatch } from 'react';
import type { SsoTokenPayload } from '../../../../../models/sso/sso-external-jwt';
import { loginWithSsoJwtDispatch } from '../dispatch/sso-experience.dispatch';

import { ReduxDispatch } from '../../../context-providers/redux/redux.context';

import type { IDispatchMemberLoginActionsType } from '../../member-login/member-login-reducer.actions';

export interface SsoExternalLoginActionArgs {
  jwtToken: string;
  navigation: RootStackNavigationProp;
  getState: () => RootState;
  dispatch: Dispatch<IDispatchMemberLoginActionsType>;
  group_number?: string;
}

export const startSsoExperienceAction = (args: SsoExternalLoginActionArgs) => {
  const { getState, navigation, jwtToken } = args;
  const { settings, securePin } = getState();
  const userAuthenticated = securePin?.isUserAuthenticated;
  const deviceToken =
    settings.deviceToken && settings.deviceToken.trim().length > 0;

  const tokenPayload = decode(jwtToken) as SsoTokenPayload;

  if (userAuthenticated || deviceToken) {
    loginWithSsoJwtDispatch({
      ...args,
      group_number: tokenPayload?.group_number,
    });
  } else {
    navigation.navigate('SsoTermsOfUse', {
      ssoJwt: jwtToken,
      group_number: tokenPayload?.group_number,
    });
  }
};

export const ssoExternalLoginAction = (args: SsoExternalLoginActionArgs) => {
  dataLoadingAction(asyncAction, args)(
    args.dispatch as ReduxDispatch,
    args.getState
  );
};

const asyncAction = (args: SsoExternalLoginActionArgs) => {
  return async () => {
    await loginWithSsoJwtDispatch(args);
  };
};
