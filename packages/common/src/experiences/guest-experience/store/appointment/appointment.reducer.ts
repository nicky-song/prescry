// Copyright 2020 Prescryptive Health, Inc.

import { Reducer } from 'redux';
import { ISetSelectedLocationAction } from './actions/set-selected-location.action';
import { IServiceInfo } from '../../../../models/api-response/provider-location-details-response';
import { IAvailableSlot } from '../../../../models/api-response/available-slots-response';
import { ISetCalendarStatusAction } from './actions/set-calendar-status.action';
import { ICreateBookingErrorAction } from './actions/create-booking-error.action';
import { ISetCalendarDateAction } from './actions/set-calendar-date.action';
import { ISetCalendarMonthAction } from './actions/set-calendar-month.action';
import { IResetAppointmentStateAction } from './actions/reset-appointment-state.action';
import {
  MinimumScheduleDays,
  MaximumScheduleDays,
} from '../../../../theming/constants';
import { IMarkedDate } from '../../../../components/member/appointment-calendar/appointment-calendar';
import { IAppointmentItem } from '../../../../models/api-response/appointment.response';
import { IGetAppointmentDetailsResponseAction } from './actions/get-appointment-details-response.action';
import { ICreateBookingResponseAction } from './actions/create-booking-response.action';
import { ICreateBookingNewDependentErrorAction } from './actions/create-booking-new-dependent-error.action';
import { IResetNewDependentErrorAction } from './actions/reset-new-dependent-error.action';
import { ILocation } from '../../../../models/api-response/provider-location-details-response';
import { ISetInviteCodeAction } from './actions/set-invite-code.action';
import { IChangeSlotAction, ISelectedSlot } from './actions/change-slot.action';
import { IChangeSlotActionErrorAction } from './actions/change-slot-error.action';

export interface IAppointmentState {
  readonly selectedLocation: ILocation;
  readonly selectedService: IServiceInfo;
  readonly availableSlots: IAvailableSlot[];
  readonly markedDates: IMarkedDate;
  readonly appointmentConfirmation?: IAppointmentItem;
  readonly appointmentDetails?: IAppointmentItem;
  readonly appointmentCanceledSuccess?: boolean;
  readonly minDate: string;
  readonly maxDate: string;
  readonly selectedDate?: string;
  readonly visibleMonth?: string;
  readonly slotsForSelectedDate: IAvailableSlot[];
  readonly currentMonth?: string;
  readonly error?: string;
  readonly dependentError?: string;
  readonly inviteCode?: string;
  readonly bookingId: string;
  readonly currentSlot: ISelectedSlot;
  readonly oldSlot: ISelectedSlot;
}

export const defaultAppointmentState: IAppointmentState = {
  selectedLocation: {} as ILocation,
  selectedService: {} as IServiceInfo,
  minDate: new Date(
    new Date().getTime() + 86400000 * MinimumScheduleDays
  ).toISOString(),
  maxDate: new Date(
    new Date().getTime() + 86400000 * MaximumScheduleDays
  ).toISOString(),
  availableSlots: [],
  markedDates: {},
  slotsForSelectedDate: [],
  inviteCode: undefined,
  bookingId: '',
  currentSlot: {} as ISelectedSlot,
  oldSlot: {} as ISelectedSlot,
};

export type IAppointmentActionTypes =
  | ISetSelectedLocationAction
  | ISetCalendarStatusAction
  | ISetCalendarDateAction
  | ISetCalendarMonthAction
  | IResetAppointmentStateAction
  | ICreateBookingErrorAction
  | ICreateBookingNewDependentErrorAction
  | IGetAppointmentDetailsResponseAction
  | ICreateBookingResponseAction
  | IResetNewDependentErrorAction
  | ISetInviteCodeAction
  | IChangeSlotAction
  | IChangeSlotActionErrorAction;

export const appointmentReducer: Reducer<
  IAppointmentState,
  IAppointmentActionTypes
> = (
  state: IAppointmentState = defaultAppointmentState,
  action: IAppointmentActionTypes
) => {
  switch (action.type) {
    case 'APPOINTMENT_SET_SELECTED_LOCATION': {
      const { selectedLocation, selectedService, minDate, maxDate } =
        action.payload;
      return {
        ...state,
        selectedLocation,
        selectedService,
        minDate,
        maxDate,
        currentMonth: minDate,
        error: undefined,
      };
    }
    case 'APPOINTMENT_SET_CALENDAR_STATUS':
      return {
        ...state,
        availableSlots: [...action.payload.slots],
        markedDates: action.payload.markedDates,
        error: undefined,
      };
    case 'APPOINTMENT_SET_CALENDAR_DATE':
      return {
        ...state,
        selectedDate: action.payload.selectedDate,
        slotsForSelectedDate: [...action.payload.slotsForSelectedDate],
        error: undefined,
      };
    case 'APPOINTMENT_SET_CALENDAR_MONTH':
      return {
        ...state,
        currentMonth: action.payload,
        error: undefined,
        selectedDate: undefined,
        slotsForSelectedDate: [],
      };
    case 'CREATE_BOOKING_ERROR':
      return {
        ...state,
        error: action.payload.error,
        slotsForSelectedDate: [...action.payload.updatedSlots],
      };
    case 'CREATE_BOOKING_NEW_DEPENDENT_ERROR':
      return {
        ...state,
        dependentError: action.payload.error,
      };
    case 'CREATE_BOOKING_RESPONSE':
      return {
        ...state,
        appointmentConfirmation: action.payload,
        error: undefined,
        appointmentDetails: undefined,
      };
    case 'APPOINTMENT_RESET_STATE':
      return {
        ...defaultAppointmentState,
      };
    case 'APPOINTMENT_DETAILS_RESPONSE':
      return {
        ...state,
        appointmentDetails: action.payload.appointment,
        appointmentCanceledSuccess: action.payload.isCancelSuccessful,
        appointmentConfirmation: undefined,
      };

    case 'APPOINTMENT_RESET_NEW_DEPENDENT_ERROR':
      return {
        ...state,
        dependentError: undefined,
      };

    case 'APPOINTMENT_SET_INVITE_CODE':
      return {
        ...state,
        inviteCode: action.payload,
      };

    case 'APPOINTMENT_CHANGE_SLOT':
      return {
        ...state,
        oldSlot: { ...state.currentSlot },
        currentSlot: action.payload,
        error: undefined,
      };

    case 'APPOINTMENT_CHANGE_SLOT_ERROR':
      return {
        ...state,
        error: action.payload,
        oldSlot: {} as ISelectedSlot,
        currentSlot: {} as ISelectedSlot,
      };
  }

  return state;
};
