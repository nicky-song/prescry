// Copyright 2020 Prescryptive Health, Inc.

import {
  ISetCalendarMonthAction,
  setCalendarMonthAction,
} from '../actions/set-calendar-month.action';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import moment from 'moment-timezone';
import { IGetAvailableSlotsActionType } from '../dispatch/get-slots-and-navigate.dispatch';
import { getAvailabilityDispatch } from '../dispatch/get-availability.dispatch';
import { IAvailableSlotsRequestBody } from '../../../../../models/api-request-body/available-slots.request-body';
import {
  handlePostLoginApiErrorsAction,
  IDispatchPostLoginApiErrorActionsType,
} from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { AppointmentsStackNavigationProp } from '../../../navigation/stack-navigators/appointments/appointments.stack-navigator';

export const setCurrentMonthAsyncAction = (args: {
  navigation: AppointmentsStackNavigationProp;
  date: string;
}) => {
  return async (
    dispatch: Dispatch<
      | ISetCalendarMonthAction
      | IGetAvailableSlotsActionType
      | IDispatchPostLoginApiErrorActionsType
    >,
    getState: () => RootState
  ) => {
    try {
      const { appointment } = getState();
      const { selectedLocation, selectedService } = appointment;
      const timezone =
        (appointment.selectedLocation &&
          appointment.selectedLocation.timezone) ||
        'America/Los_Angeles';
      const startMoment = moment.tz(args.date, timezone).startOf('month');
      const start = startMoment.format();
      const endMoment = startMoment.endOf('month');
      const end = endMoment.format();
      if (selectedLocation) {
        const availableSlotRequestBody: IAvailableSlotsRequestBody = {
          locationId: selectedLocation.id,
          serviceType: selectedService.serviceType,
          start,
          end,
        };
        await getAvailabilityDispatch(
          dispatch,
          getState,
          availableSlotRequestBody
        );
      }
      dispatch(setCalendarMonthAction(start));
    } catch (error) {
      await handlePostLoginApiErrorsAction(
        error as Error,
        dispatch,
        args.navigation
      );
    }
  };
};
