// Copyright 2020 Prescryptive Health, Inc.

import { loadMemberDataDispatch } from '../../member-list-info/dispatch/load-member-data.dispatch';
import { IDispatchContactInfoActionsType } from '../../member-list-info/member-list-info-reducer.actions';
import { handleKnownAuthenticationErrorAction } from '../../root-navigation.actions';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import { IGetTestResultsActionType } from '../../test-result/async-actions/get-test-result.async-action';
import { navigateAppointmentDetailsScreenDispatch } from './navigate-appointment-details-screen-dispatch';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { dispatchResetStackToFatalErrorScreen } from '../navigation-reducer.actions';
import { popToTop } from '../../../navigation/navigation.helper';

export const appointmentDeepNavigateDispatch = async (
  dispatch: Dispatch<
    IGetTestResultsActionType | IDispatchContactInfoActionsType
  >,
  getState: () => RootState,
  navigation: RootStackNavigationProp,
  appointmentId: string
) => {
  try {
    const redirected = await loadMemberDataDispatch(
      dispatch,
      getState,
      navigation
    );
    if (!redirected) {
      popToTop(navigation);
      navigateAppointmentDetailsScreenDispatch(
        navigation,
        appointmentId,
        false
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
