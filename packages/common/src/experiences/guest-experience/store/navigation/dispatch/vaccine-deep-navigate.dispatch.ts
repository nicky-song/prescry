// Copyright 2022 Prescryptive Health, Inc.

import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { loadMemberDataDispatch } from '../../member-list-info/dispatch/load-member-data.dispatch';
import { handleKnownAuthenticationErrorAction } from '../../root-navigation.actions';
import { RootState } from '../../root-reducer';
import { dispatchResetStackToFatalErrorScreen } from '../navigation-reducer.actions';
import { popToTop } from '../../../navigation/navigation.helper';
import { navigateVaccinationRecordScreenDispatch } from './navigate-vaccination-record-screen-dispatch';
import { IDispatchInitialScreenActionsType } from '../../start-experience/dispatch/deep-link-if-path-name.dispatch';
import { Dispatch } from 'react';

export const vaccineDeepNavigateDispatch = async (
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
      navigateVaccinationRecordScreenDispatch(navigation, orderNumber, true);
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
