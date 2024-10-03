// Copyright 2020 Prescryptive Health, Inc.

import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { loadMemberDataDispatch } from '../../member-list-info/dispatch/load-member-data.dispatch';
import { handleKnownAuthenticationErrorAction } from '../../root-navigation.actions';
import { RootState } from '../../root-reducer';
import { dispatchResetStackToFatalErrorScreen } from '../navigation-reducer.actions';
import { popToTop } from '../../../navigation/navigation.helper';
import { navigateTestResultScreenDispatch } from './navigate-test-result-screen-dispatch';
import { IDispatchInitialScreenActionsType } from '../../start-experience/dispatch/deep-link-if-path-name.dispatch';
import { Dispatch } from 'react';

export const testResultDeepNavigateDispatch = async (
  dispatch: Dispatch<IDispatchInitialScreenActionsType>,
  getState: () => RootState,
  navigation: RootStackNavigationProp,
  orderNumber: string,
) => {
  try {
    const redirected = await loadMemberDataDispatch(
      dispatch,
      getState,
      navigation
    );
    if (!redirected) {
      popToTop(navigation);
      navigateTestResultScreenDispatch(navigation, orderNumber, true);
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
