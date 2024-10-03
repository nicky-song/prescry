// Copyright 2021 Prescryptive Health, Inc.

import { loadMemberDataDispatch } from '../../member-list-info/dispatch/load-member-data.dispatch';
import { handleKnownAuthenticationErrorAction } from '../../root-navigation.actions';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import { dispatchResetStackToFatalErrorScreen } from '../navigation-reducer.actions';
import { IDispatchInitialScreenActionsType } from '../../start-experience/dispatch/deep-link-if-path-name.dispatch';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { processInviteCodeAndNavigateDispatch } from '../../invite-code/dispatch/process-invite-code-and-navigate.dispatch';

export const inviteCodeDeepNavigateDispatch = async (
  dispatch: Dispatch<IDispatchInitialScreenActionsType>,
  getState: () => RootState,
  navigation: RootStackNavigationProp,
  inviteCode: string
) => {
  try {
    const redirected = await loadMemberDataDispatch(
      dispatch,
      getState,
      navigation
    );
    if (!redirected) {
      await processInviteCodeAndNavigateDispatch(
        dispatch,
        getState,
        navigation,
        inviteCode
      );
    }
  } catch (error) {
    const redirectedToHandleError = handleKnownAuthenticationErrorAction(
      dispatch,
      navigation,
      error as Error
    );

    if (!redirectedToHandleError) {
      dispatchResetStackToFatalErrorScreen(navigation);
    }
  }
};
