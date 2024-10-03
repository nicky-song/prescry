// Copyright 2018 Prescryptive Health, Inc.

import {
  dispatchErrorIfDeviceRestricted,
  dispatchLoginIfNoDeviceToken,
  IDispatchInitialScreenActionsType,
} from '../../root-navigation.actions';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import { IDispatchMemberLoginActionsType } from '../../member-login/member-login-reducer.actions';
import { verifySessionDispatch } from './verify-session.dispatch';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { removeSearchParamsFromUrl } from '../../../../../utils/remove-search-params-from-url.helper';
import { startSsoExperienceAction } from '../async-actions/sso-experience.actions';

/**
 * @param  {Dispatch<IDispatchInitialScreenActionsType|IDispatchMemberLoginActionsType>} dispatch
 * @param  {()=>RootState} getState
 * @param  {RootStackNavigationProp} navigation
 * @returns Promise<boolean> Resolves to false when the user is successfully signed in. Resolves to true when more action is required to sign the user in.
 */
export const authenticationExperienceDispatch = async (
  dispatch: Dispatch<
    IDispatchInitialScreenActionsType | IDispatchMemberLoginActionsType
  >,
  getState: () => RootState,
  navigation: RootStackNavigationProp
): Promise<boolean> => {
  const redirectedForRestrictedDevice = dispatchErrorIfDeviceRestricted(
    getState,
    navigation
  );

  if (redirectedForRestrictedDevice) {
    return true;
  }
  const { features } = getState();
  const searchParams = new URLSearchParams(location.search);
  const jwt_token = searchParams.get('sso_token');
  if (jwt_token) {
    removeSearchParamsFromUrl(['sso_token']);
    if (features.usesso) {
      startSsoExperienceAction({
        jwtToken: jwt_token,
        navigation,
        getState,
        dispatch,
      });
      return true;
    }
  } else {
    const redirectedForDeviceLogin = await dispatchLoginIfNoDeviceToken(
      dispatch,
      getState,
      navigation
    );

    if (redirectedForDeviceLogin) {
      return true;
    }
  }

  const redirectedForAccountLogin = await verifySessionDispatch(
    dispatch,
    getState,
    navigation
  );

  return redirectedForAccountLogin;
};
