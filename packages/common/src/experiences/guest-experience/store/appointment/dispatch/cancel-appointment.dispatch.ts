// Copyright 2020 Prescryptive Health, Inc.

import { ICancelBookingRequestBody } from '../../../../../models/api-request-body/cancel-booking.request-body';
import { CancelAppointmentRetryCount } from '../../../../../theming/constants';
import { cancelBooking } from '../../../api/api-v1.cancel-booking';
import { getAppointmentDetails } from '../../../api/api-v1.get-appointment-details';
import { handlePostLoginApiErrorsAction } from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { RootState } from '../../root-reducer';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { Dispatch } from 'react';
import { getAppointmentDetailsResponseAction } from '../actions/get-appointment-details-response.action';
import { IGetAppointmentDetailsActionType } from '../async-actions/get-appointment-details.async-action';
import { ICancelBookingActionType } from './cancel-booking.dispatch';
import { AppointmentsStackNavigationProp } from '../../../navigation/stack-navigators/appointments/appointments.stack-navigator';

export type ICancelBookingAndNavigateDispatchType =
  | IGetAppointmentDetailsActionType
  | ICancelBookingActionType;

export const cancelAppointmentAndDispatch = async (
  dispatch: Dispatch<ICancelBookingAndNavigateDispatchType>,
  getState: () => RootState,
  navigation: AppointmentsStackNavigationProp,
  orderNumber: string
): Promise<boolean | undefined> => {
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

    let appointmentDetails;
    let count = CancelAppointmentRetryCount;
    while (
      !appointmentDetails ||
      (appointmentDetails &&
        appointmentDetails.data.appointment?.bookingStatus !== 'Cancelled' &&
        count > 0)
    ) {
      await new Promise((r) => {
        setTimeout(r, settings.dataRefreshIntervalMilliseconds);
      });
      appointmentDetails = await getAppointmentDetails(
        api,
        orderNumber,
        settings.token,
        undefined,
        settings.deviceToken
      );
      count -= 1;
    }

    if (appointmentDetails?.data.appointment?.bookingStatus === 'Cancelled') {
      dispatch(
        getAppointmentDetailsResponseAction(
          appointmentDetails?.data?.appointment,
          true
        )
      );
    } else {
      dispatch(
        getAppointmentDetailsResponseAction(
          appointmentDetails?.data?.appointment,
          false
        )
      );
    }
  } catch (error) {
    await handlePostLoginApiErrorsAction(
      error as Error,
      dispatch,
      navigation
    );
    return false;
  }
  return undefined;
};
