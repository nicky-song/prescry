// Copyright 2022 Prescryptive Health, Inc.

import { loadMemberDataDispatch } from '../../member-list-info/dispatch/load-member-data.dispatch';
import { handleKnownAuthenticationErrorAction } from '../../root-navigation.actions';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import { dispatchResetStackToFatalErrorScreen } from '../navigation-reducer.actions';
import { IDispatchInitialScreenActionsType } from '../../start-experience/dispatch/deep-link-if-path-name.dispatch';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { popToTop } from '../../../navigation/navigation.helper';
import { navigateAppointmentsListScreenDispatch } from './navigate-appointments-list-screen.dispatch';

export const appointmentsDeepNavigateDispatch = async (
  dispatch: Dispatch<IDispatchInitialScreenActionsType>,
  getState: () => RootState,
  navigation: RootStackNavigationProp
) => {
  try {
    const redirected = await loadMemberDataDispatch(
      dispatch,
      getState,
      navigation
    );

    if (!redirected) {
      popToTop(navigation);
      navigateAppointmentsListScreenDispatch(navigation, true);
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
