// Copyright 2021 Prescryptive Health, Inc.

import { ErrorWaitlist } from '../../../../../errors/error-waitlist';
import { ICreateWaitlistRequestBody } from '../../../../../models/api-request-body/create-waitlist.request-body';
import { joinWaitlist } from '../../../api/api-v1.join-waitlist';
import {
  handlePostLoginApiErrorsAction,
  IDispatchPostLoginApiErrorActionsType,
} from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { RootState } from '../../root-reducer';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { IUpdateSettingsAction } from '../../settings/settings-reducer.actions';
import { Dispatch } from 'react';
import {
  IJoinWaitlistErrorAction,
  joinWaitlistErrorAction,
} from '../actions/join-waitlist-error.action';
import { AppointmentsStackNavigationProp } from '../../../navigation/stack-navigators/appointments/appointments.stack-navigator';

export type JoinWaitlistDispatchType =
  | IUpdateSettingsAction
  | IJoinWaitlistErrorAction
  | IDispatchPostLoginApiErrorActionsType;

export const joinWaitlistDispatch = async (
  dispatch: Dispatch<JoinWaitlistDispatchType>,
  navigation: AppointmentsStackNavigationProp,
  getState: () => RootState,
  joinWaitlistRequestBody: ICreateWaitlistRequestBody
) => {
  const state = getState();
  const api = state.config.apis.guestExperienceApi;
  const settings = state.settings;
  try {
    const response = await joinWaitlist(
      api,
      joinWaitlistRequestBody,
      settings.deviceToken,
      settings.token
    );
    if (response.status === 'success') {
      await tokenUpdateDispatch(dispatch, response.refreshToken);

      navigation.navigate('WaitlistConfirmation', {
        serviceType: response.data.serviceType,
        phoneNumber: response.data.phoneNumber,
        patientFirstName: response.data.firstName,
        patientLastName: response.data.lastName,
        serviceName: response.data.serviceName,
      });
      return;
    }
  } catch (error) {
    if (error instanceof ErrorWaitlist) {
      dispatch(joinWaitlistErrorAction(error.message));
      return;
    }

    await handlePostLoginApiErrorsAction(
      error as Error,
      dispatch,
      navigation
    );
  }
};
