// Copyright 2020 Prescryptive Health, Inc.

import { Dispatch } from 'react';
import { RootState } from '../../root-reducer';
import {
  handlePostLoginApiErrorsAction,
  IDispatchPostLoginApiErrorActionsType,
} from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { createBookingDispatch } from './create-booking.dispatch';
import {
  IMemberAddress,
  IDependentInformation,
} from '../../../../../models/api-request-body/create-booking.request-body';
import { ErrorNotFound } from '../../../../../errors/error-not-found';
import {
  ICreateBookingErrorAction,
  createBookingErrorAction,
} from '../actions/create-booking-error.action';
import moment from 'moment-timezone';
import { IAvailableSlotsRequestBody } from '../../../../../models/api-request-body/available-slots.request-body';
import { getAvailabilityDispatch } from './get-availability.dispatch';
import { IUpdateSettingsAction } from '../../settings/settings-reducer.actions';
import { ISetCalendarStatusAction } from '../actions/set-calendar-status.action';
import { IAvailableSlot } from '../../../../../models/api-response/available-slots-response';
import { ErrorConstants } from '../../../../../theming/constants';
import { ICreateBookingResponseAction } from '../actions/create-booking-response.action';
import {
  createBookingNewDependentErrorAction,
  ICreateBookingNewDependentErrorAction,
} from '../actions/create-booking-new-dependent-error.action';
import { ErrorBadRequest } from '../../../../../errors/error-bad-request';
import { acceptConsentDispatch } from '../../provider-locations/dispatch/accept-consent.dispatch';
import { IQuestionAnswer } from '../../../../../models/question-answer';
import { AppointmentsStackNavigationProp } from '../../../navigation/stack-navigators/appointments/appointments.stack-navigator';
import { IAppointmentConfirmationRouteProps } from '../../../appointment-confirmation.screen/appointment-confirmation.screen';

export type ICreateBookingAndNavigateActionType =
  | ICreateBookingResponseAction
  | ICreateBookingErrorAction
  | ICreateBookingNewDependentErrorAction
  | ISetCalendarStatusAction
  | IUpdateSettingsAction
  | IDispatchPostLoginApiErrorActionsType;

export const createBookingAndNavigateDispatch = async (
  questions: IQuestionAnswer[],
  insuranceQuestions: IQuestionAnswer[],
  selectedSlot: IAvailableSlot,
  dispatch: Dispatch<ICreateBookingAndNavigateActionType>,
  getState: () => RootState,
  navigation: AppointmentsStackNavigationProp,
  memberAddress?: IMemberAddress,
  dependentInfo?: IDependentInformation
) => {
  try {
    await acceptConsentDispatch(dispatch, getState);
    const appointmentInfo = await createBookingDispatch(
      questions,
      insuranceQuestions,
      selectedSlot,
      dispatch,
      getState,
      memberAddress,
      dependentInfo
    );
    if (appointmentInfo?.appointmentId) {
      const appointmentConfirmationScreenRouteProps: IAppointmentConfirmationRouteProps =
        {
          appointmentId: appointmentInfo?.appointmentId,
          showBackButton: false,
          appointmentStatus: undefined,
          appointmentLink: appointmentInfo?.appointmentLink,
        };
      navigation.navigate(
        'AppointmentConfirmation',
        appointmentConfirmationScreenRouteProps
      );
      return;
    }
    throw new ErrorNotFound('Unable to find appointment');
  } catch (error) {
    if (error instanceof ErrorNotFound) {
      const { appointment } = getState();
      const {
        selectedLocation,
        currentMonth,
        maxDate,
        minDate,
        selectedService,
      } = appointment;

      if (selectedLocation) {
        const timezone = selectedLocation.timezone;
        const startMonthMoment = moment
          .tz(currentMonth, timezone)
          .startOf('month');
        const endMonthMoment = startMonthMoment.clone().endOf('month');
        const maxDateMoment = moment.tz(maxDate, timezone);
        const minDateMoment = moment.tz(minDate, timezone);
        const availableSlotRequestBody: IAvailableSlotsRequestBody = {
          locationId: selectedLocation.id,
          serviceType: selectedService.serviceType,
          start: startMonthMoment.isBefore(minDateMoment)
            ? minDateMoment.format()
            : startMonthMoment.format(),
          end: endMonthMoment.isBefore(maxDateMoment)
            ? endMonthMoment.format()
            : maxDateMoment.format(),
        };
        try {
          await getAvailabilityDispatch(
            dispatch,
            getState,
            availableSlotRequestBody
          );

          const state = getState();
          const { selectedDate, availableSlots } = state.appointment;
          const slotsForSelectedDate = availableSlots.filter(
            (x) => x.day === selectedDate
          );
          await dispatch(
            createBookingErrorAction(
              ErrorConstants.errorSlotNotAvailable,
              slotsForSelectedDate
            )
          );
        } catch {
          await handlePostLoginApiErrorsAction(
            error as Error,
            dispatch,
            navigation
          );
          return false;
        }
      }
      return false;
    }
    if (error instanceof ErrorBadRequest) {
      await dispatch(createBookingNewDependentErrorAction(error.message));
      return false;
    }
    await handlePostLoginApiErrorsAction(
      error as Error,
      dispatch,
      navigation
    );
    return false;
  }
};
