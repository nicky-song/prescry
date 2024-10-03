// Copyright 2021 Prescryptive Health, Inc.

import {
  IDispatchPostLoginApiErrorActionsType,
  handlePostLoginApiErrorsAction,
} from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { Dispatch } from 'react';
import { RootState } from '../../root-reducer';
import { ISetSelectedLocationAction } from '../../appointment/actions/set-selected-location.action';
import { IResetAppointmentStateAction } from '../../appointment/actions/reset-appointment-state.action';
import { ISetCalendarStatusAction } from '../../appointment/actions/set-calendar-status.action';
import { processInviteCodeDispatch } from './process-invite-code.dispatch';
import { IUpdateSettingsAction } from '../../settings/settings-reducer.actions';
import { IGetProviderLocationsResponseAction } from '../../provider-locations/actions/get-provider-locations-response.action';
import { ErrorInviteCode } from '../../../../../errors/error-invite-code';
import { ISetServiceTypeAction } from '../../service-type/actions/set-service-type.action';
import { ICreateBookingResponseAction } from '../../appointment/actions/create-booking-response.action';
import { ISetInviteCodeAction } from '../../appointment/actions/set-invite-code.action';
import { ISetServiceDetailsAction } from '../../service-type/actions/set-service-details.action';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { navigateHomeScreenNoApiRefreshDispatch } from '../../navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';
import { popToTop } from '../../../navigation/navigation.helper';

export type IProcessInviteCodeActionType =
  | ICreateBookingResponseAction
  | ISetSelectedLocationAction
  | ISetCalendarStatusAction
  | IDispatchPostLoginApiErrorActionsType
  | IGetProviderLocationsResponseAction
  | IResetAppointmentStateAction
  | ISetServiceTypeAction
  | IUpdateSettingsAction
  | ISetInviteCodeAction
  | ISetServiceDetailsAction;

export const processInviteCodeAndNavigateDispatch = async (
  dispatch: Dispatch<IProcessInviteCodeActionType>,
  getState: () => RootState,
  navigation: RootStackNavigationProp,
  inviteCode: string
) => {
  try {
    await processInviteCodeDispatch(dispatch, getState, inviteCode);
    popToTop(navigation);
    navigation.navigate('AppointmentsStack', {
      screen: 'Appointment',
      params: { showBackButton: false, showBackToHome: false },
    });
    return;
  } catch (error) {
    if (error instanceof ErrorInviteCode) {
      navigateHomeScreenNoApiRefreshDispatch(getState, navigation, {
        modalContent: {
          showModal: true,
          modalTopContent: error.message,
        },
      });
      return true;
    }

    await handlePostLoginApiErrorsAction(
      error as Error,
      dispatch,
      navigation
    );
    return false;
  }
};
