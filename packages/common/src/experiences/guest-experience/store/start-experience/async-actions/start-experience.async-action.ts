// Copyright 2018 Prescryptive Health, Inc.

import { Dispatch } from 'react';
import type { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import type { IGetFeedActionType } from '../../feed/async-actions/get-feed.async-action';
import type { IDispatchMemberLoginActionsType } from '../../member-login/member-login-reducer.actions';
import type { IDispatchInitialScreenActionsType } from '../../root-navigation.actions';
import { RootState } from '../../root-reducer';
import type { ISetAuthExperienceAction } from '../../secure-pin/secure-pin-reducer.actions';
import { startExperienceDispatch } from '../dispatch/start-experience.dispatch';

export const startExperienceAsyncAction = (
  navigation: RootStackNavigationProp,
  isUnauthExperience?: boolean
) => {
  return async (
    dispatch: Dispatch<
      | IDispatchInitialScreenActionsType
      | IDispatchMemberLoginActionsType
      | IGetFeedActionType
      | ISetAuthExperienceAction
    >,
    getState: () => RootState
  ): Promise<void> => {
    await startExperienceDispatch(
      dispatch,
      getState,
      navigation,
      isUnauthExperience
    );
  };
};
