// Copyright 2020 Prescryptive Health, Inc.

import { RootState } from '../../root-reducer';
import { ICancelBookingRequestBody } from '../../../../../models/api-request-body/cancel-booking.request-body';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { cancelBooking } from '../../../api/api-v1.cancel-booking';
import { IUpdateSettingsAction } from '../../settings/settings-reducer.actions';
import {
  handlePostLoginApiErrorsAction,
  IDispatchPostLoginApiErrorActionsType,
} from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { Dispatch } from 'react';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

export type ICancelBookingActionType =
  | IUpdateSettingsAction
  | IDispatchPostLoginApiErrorActionsType;

export const cancelBookingDispatch = async (
  dispatch: Dispatch<ICancelBookingActionType>,
  getState: () => RootState,
  navigation: RootStackNavigationProp,
  orderNumber: string
): Promise<string | undefined> => {
  const state = getState();
  const { config, settings } = state;
  const api = config.apis.guestExperienceApi;

  const cancelBookingRequestBody: ICancelBookingRequestBody = {
    orderNumber,
  };

  try {
    const response = await cancelBooking(
      api,
      cancelBookingRequestBody,
      settings.token,
      settings.deviceToken
    );

    await tokenUpdateDispatch(dispatch, response.refreshToken);
  } catch (error) {
    await handlePostLoginApiErrorsAction(
      error as Error,
      dispatch,
      navigation
    );
    return 'false';
  }
  return undefined;
};
