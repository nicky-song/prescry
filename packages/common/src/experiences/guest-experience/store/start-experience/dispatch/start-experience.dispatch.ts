// Copyright 2018 Prescryptive Health, Inc.

import type { IDispatchInitialScreenActionsType } from '../../root-navigation.actions';
import { RootState } from '../../root-reducer';
import { authenticatedExperienceDispatch } from './authenticated-experience.dispatch';
import { authenticationExperienceDispatch } from './authentication-experience.dispatch';
import type { IDispatchMemberLoginActionsType } from '../../member-login/member-login-reducer.actions';
import type { IGetFeedActionType } from '../../feed/async-actions/get-feed.async-action';
import { Dispatch } from 'react';
import { Workflow } from '../../../../../models/workflow';
import { unauthHomeNavigateDispatch } from '../../navigation/dispatch/unauth/unauth-home-navigate.dispatch';
import {
  ISetAuthExperienceAction,
  setAuthExperienceAction,
} from '../../secure-pin/secure-pin-reducer.actions';
import type { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { removeSearchParamsFromUrl } from '../../../../../utils/remove-search-params-from-url.helper';
import { startSsoExperienceAction } from '../async-actions/sso-experience.actions';

export const startExperienceDispatch = async (
  dispatch: Dispatch<
    | IDispatchInitialScreenActionsType
    | IDispatchMemberLoginActionsType
    | IGetFeedActionType
    | ISetAuthExperienceAction
  >,
  getState: () => RootState,
  navigation: RootStackNavigationProp,
  isUnauthExperience?: boolean,
  workflow?: Workflow,
  isVerifyPinSuccess?: boolean
) => {
  dispatch(setAuthExperienceAction(!isUnauthExperience));
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
      return;
    }
  }

  if (isUnauthExperience) {
    unauthHomeNavigateDispatch(navigation);
    return;
  }
  const redirectedForLogin = await authenticationExperienceDispatch(
    dispatch,
    getState,
    navigation
  );

  if (!redirectedForLogin) {
    await authenticatedExperienceDispatch(
      dispatch,
      getState,
      navigation,
      workflow,
      isVerifyPinSuccess
    );
  }
};
