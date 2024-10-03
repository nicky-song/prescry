// Copyright 2020 Prescryptive Health, Inc.

import {
  handlePostLoginApiErrorsAction,
  IDispatchPostLoginApiErrorActionsType,
} from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { Dispatch } from 'react';
import { RootState } from '../../root-reducer';
import { getAvailabilityDispatch } from './get-availability.dispatch';
import { ISetCalendarStatusAction } from '../actions/set-calendar-status.action';
import { IAvailableSlotsRequestBody } from '../../../../../models/api-request-body/available-slots.request-body';
import { ISetSelectedLocationAction } from '../actions/set-selected-location.action';
import { IResetAppointmentStateAction } from '../actions/reset-appointment-state.action';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

export type IGetAvailableSlotsActionType =
  | ISetSelectedLocationAction
  | ISetCalendarStatusAction
  | IDispatchPostLoginApiErrorActionsType
  | IResetAppointmentStateAction;

export const getSlotsAndNavigateDispatch = async (
  start: string,
  end: string,
  dispatch: Dispatch<IGetAvailableSlotsActionType>,
  getState: () => RootState,
  navigation: RootStackNavigationProp,
  showBackToHome?: boolean
) => {
  const state = getState();
  const { selectedLocation, selectedService } = state.appointment;
  if (selectedLocation) {
    const availableSlotRequestBody: IAvailableSlotsRequestBody = {
      locationId: selectedLocation.id,
      serviceType: selectedService.serviceType,
      start,
      end,
    };

    try {
      await getAvailabilityDispatch(
        dispatch,
        getState,
        availableSlotRequestBody
      );
      navigation.navigate('AppointmentsStack', {
        screen: 'Appointment',
        params: { showBackButton: true, showBackToHome },
      });
    } catch (error) {
      await handlePostLoginApiErrorsAction(
        error as Error,
        dispatch,
        navigation
      );
    }
  }
};
