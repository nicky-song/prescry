// Copyright 2020 Prescryptive Health, Inc.

import {
  defaultAppointmentState,
  IAppointmentState,
  IAppointmentActionTypes,
  appointmentReducer,
} from './appointment.reducer';
import { IServiceInfo } from '../../../../models/api-response/provider-location-details-response';
import { setSelectedLocationAction } from './actions/set-selected-location.action';
import { setCalendarMonthAction } from './actions/set-calendar-month.action';
import { setCalendarDateAction } from './actions/set-calendar-date.action';
import { setCalendarStatusAction } from './actions/set-calendar-status.action';
import { createBookingErrorAction } from './actions/create-booking-error.action';
import { resetAppointmentStateAction } from './actions/reset-appointment-state.action';
import { IAppointmentItem } from '../../../../models/api-response/appointment.response';
import { getAppointmentDetailsResponseAction } from './actions/get-appointment-details-response.action';
import { createBookingResponseAction } from './actions/create-booking-response.action';
import { ILocation } from '../../../../models/api-response/provider-location-details-response';
import { setInviteCodeAction } from './actions/set-invite-code.action';
import {
  ISelectedSlot,
  setChangeSlotAction,
} from './actions/change-slot.action';
import { changeSlotErrorAction } from './actions/change-slot-error.action';

describe('appointmentReducer', () => {
  const defaultBookingIdStateValue = '';
  const defaultState: IAppointmentState = {
    selectedLocation: {} as ILocation,
    selectedService: {} as IServiceInfo,
    minDate: '2020-07-20',
    maxDate: '2020-08-20',
    availableSlots: [],
    markedDates: {},
    slotsForSelectedDate: [],
    bookingId: defaultBookingIdStateValue,
    currentSlot: { bookingId: 'slot-2' } as ISelectedSlot,
    oldSlot: { bookingId: 'slot-1' } as ISelectedSlot,
  };
  it('returns default state when state is not defined', () => {
    const action = ({
      payload: undefined,
      type: '',
    } as unknown) as IAppointmentActionTypes;

    expect(appointmentReducer(undefined, action)).toEqual(
      defaultAppointmentState
    );
  });

  it('updates state for setSelectedLocationAction', () => {
    const service: IServiceInfo = {
      serviceName: 'test-service',
      serviceType: 'COVID-19 Antigen Testing',
      screenDescription: 'Test Desc',
      screenTitle: 'Test Title',
      questions: [],
      minLeadDays: 'P6D',
      maxLeadDays: 'P30D',
    };
    const providerLocation: ILocation = {
      id: '1',
      providerName: 'Bartell Drugs',
      locationName: 'Bartell Drugs',
      address1: '7370 170th Ave NE',
      city: 'Redmond',
      state: 'WA',
      zip: '98052',
      phoneNumber: '(425) 977-5489',
      serviceInfo: [service],
      timezone: 'PDT',
    };

    const action = setSelectedLocationAction({
      selectedLocation: providerLocation,
      maxDate: '2020-08-25',
      minDate: '2020-07-25',
      selectedService: service,
    });
    const expectedState: IAppointmentState = {
      selectedService: service,
      minDate: '2020-07-25',
      maxDate: '2020-08-25',
      currentMonth: '2020-07-25',
      selectedLocation: providerLocation,
      availableSlots: [],
      markedDates: {},
      slotsForSelectedDate: [],
      bookingId: defaultBookingIdStateValue,
      currentSlot: { bookingId: 'slot-2' } as ISelectedSlot,
      oldSlot: { bookingId: 'slot-1' } as ISelectedSlot,
    };

    const updatedState = appointmentReducer(defaultState, action);
    expect(updatedState).toEqual(expectedState);
  });
  it('updates state with selected months time slots and unavailable days', () => {
    const mockPayload = {
      slots: [
        {
          start: '2020-06-22T08:00:00',
          day: '2020-06-22T08:15:00',
          slotName: '8:15 am',
        },
      ],
      markedDates: {
        '2020-06-22T08:00:00': { disabled: true, disableTouchEvent: true },
      },
    };

    const action = setCalendarStatusAction(mockPayload);
    const expectedState: IAppointmentState = {
      selectedLocation: {} as ILocation,
      selectedService: {} as IServiceInfo,
      minDate: '2020-07-20',
      maxDate: '2020-08-20',
      availableSlots: mockPayload.slots,
      slotsForSelectedDate: [],
      markedDates: mockPayload.markedDates,
      bookingId: defaultBookingIdStateValue,
      currentSlot: { bookingId: 'slot-2' } as ISelectedSlot,
      oldSlot: { bookingId: 'slot-1' } as ISelectedSlot,
    };
    const updatedState = appointmentReducer(defaultState, action);
    expect(updatedState).toEqual(expectedState);
  });
  it('updates state with current month ', () => {
    const currentMonth = '01-01-2000';
    const action = setCalendarMonthAction(currentMonth);
    const expectedState: IAppointmentState = {
      selectedLocation: {} as ILocation,
      selectedService: {} as IServiceInfo,
      minDate: '2020-07-20',
      maxDate: '2020-08-20',
      availableSlots: [],
      slotsForSelectedDate: [],
      markedDates: {},
      currentMonth,
      bookingId: defaultBookingIdStateValue,
      currentSlot: { bookingId: 'slot-2' } as ISelectedSlot,
      oldSlot: { bookingId: 'slot-1' } as ISelectedSlot,
    };
    const updatedState = appointmentReducer(defaultState, action);
    expect(updatedState).toEqual(expectedState);
  });
  it('updates state with selected Date ', () => {
    const selectedDate = '01-01-2000';
    const slotsForSelectedDate = [
      {
        start: '2020-06-22T08:00:00',
        day: '2020-06-22T08:15:00',
        slotName: '8:15 am',
      },
    ];

    const action = setCalendarDateAction(selectedDate, slotsForSelectedDate);
    const expectedState: IAppointmentState = {
      selectedLocation: {} as ILocation,
      selectedService: {} as IServiceInfo,
      minDate: '2020-07-20',
      maxDate: '2020-08-20',
      availableSlots: [],
      markedDates: {},
      selectedDate,
      slotsForSelectedDate,
      bookingId: defaultBookingIdStateValue,
      currentSlot: { bookingId: 'slot-2' } as ISelectedSlot,
      oldSlot: { bookingId: 'slot-1' } as ISelectedSlot,
    };
    const updatedState = appointmentReducer(defaultState, action);
    expect(updatedState).toEqual(expectedState);
  });

  it('updates state with create booking error', () => {
    const slots = [
      {
        start: '2020-06-22T08:00:00',
        day: '2020-06-22',
        slotName: '8:00 am',
      },
      {
        start: '2020-06-22T08:15:00',
        day: '2020-06-22',
        slotName: '8:15 am',
      },
    ];

    const action = createBookingErrorAction('error', slots);
    const expectedState: IAppointmentState = {
      error: 'error',
      selectedLocation: {} as ILocation,
      selectedService: {} as IServiceInfo,
      minDate: '2020-07-20',
      maxDate: '2020-08-20',
      availableSlots: [],
      markedDates: {},
      slotsForSelectedDate: slots,
      bookingId: defaultBookingIdStateValue,
      currentSlot: { bookingId: 'slot-2' } as ISelectedSlot,
      oldSlot: { bookingId: 'slot-1' } as ISelectedSlot,
    };
    const updatedState = appointmentReducer(defaultState, action);
    expect(updatedState).toEqual(expectedState);
  });
  it('updates state with defaultState on reset action', () => {
    const action = resetAppointmentStateAction();
    const currentState: IAppointmentState = {
      error: 'error',
      selectedLocation: {} as ILocation,
      selectedService: {} as IServiceInfo,
      minDate: '2020-07-20',
      maxDate: '2020-08-20',
      availableSlots: [
        {
          start: '2020-06-22T08:00:00',
          day: '2020-06-22',
          slotName: '8:00 am',
        },
        {
          start: '2020-06-22T08:15:00',
          day: '2020-06-22',
          slotName: '8:15 am',
        },
      ],
      markedDates: {},
      slotsForSelectedDate: [],
      bookingId: defaultBookingIdStateValue,
      currentSlot: { bookingId: 'slot-2' } as ISelectedSlot,
      oldSlot: { bookingId: 'slot-1' } as ISelectedSlot,
    };
    const updatedState = appointmentReducer(currentState, action);
    expect(updatedState).toEqual(defaultAppointmentState);
  });

  it('updates state with appointment details response', () => {
    const mockResponse = {
      additionalInfo: 'Patient must wear mask or face covering',
      address1: '7807 219th ST SW',
      city: 'Yakima',
      locationName: 'Rx Pharmacy',
      orderNumber: '1419',
      serviceName: 'COVID-19 Antigen Testing',
      state: 'WA',
      status: 'Accepted',
      zip: '98056',
      date: 'date',
      time: 'time',
      providerTaxId: 'dummy Tax Id',
      paymentStatus: 'no_payment_required',
    } as IAppointmentItem;

    const action = getAppointmentDetailsResponseAction(mockResponse);
    const expectedState: IAppointmentState = {
      selectedLocation: {} as ILocation,
      selectedService: {} as IServiceInfo,
      minDate: '2020-07-20',
      maxDate: '2020-08-20',
      availableSlots: [],
      markedDates: {},
      slotsForSelectedDate: [],
      appointmentDetails: mockResponse,
      appointmentConfirmation: undefined,
      bookingId: defaultBookingIdStateValue,
      currentSlot: { bookingId: 'slot-2' } as ISelectedSlot,
      oldSlot: { bookingId: 'slot-1' } as ISelectedSlot,
    };
    const updatedState = appointmentReducer(defaultState, action);
    expect(updatedState).toEqual(expectedState);
  });

  it('updates state with create booking response', () => {
    const mockResponse = {
      additionalInfo: 'Patient must wear mask or face covering',
      address1: '7807 219th ST SW',
      city: 'Yakima',
      locationName: 'Rx Pharmacy',
      orderNumber: '1419',
      serviceName: 'COVID-19 Antigen Testing',
      state: 'WA',
      status: 'Accepted',
      zip: '98056',
      date: 'date',
      time: 'time',
    } as IAppointmentItem;
    const action = createBookingResponseAction(mockResponse);
    const expectedState: IAppointmentState = {
      selectedLocation: {} as ILocation,
      selectedService: {} as IServiceInfo,
      minDate: '2020-07-20',
      maxDate: '2020-08-20',
      availableSlots: [],
      markedDates: {},
      appointmentConfirmation: mockResponse,
      slotsForSelectedDate: [],
      appointmentDetails: undefined,
      error: undefined,
      bookingId: defaultBookingIdStateValue,
      currentSlot: { bookingId: 'slot-2' } as ISelectedSlot,
      oldSlot: { bookingId: 'slot-1' } as ISelectedSlot,
    };
    const updatedState = appointmentReducer(defaultState, action);
    expect(updatedState).toEqual(expectedState);
  });

  it('updates state with invite code change ', () => {
    const inviteCode = 'test-invite-code';
    const action = setInviteCodeAction(inviteCode);
    const expectedState: IAppointmentState = {
      selectedLocation: {} as ILocation,
      selectedService: {} as IServiceInfo,
      minDate: '2020-07-20',
      maxDate: '2020-08-20',
      availableSlots: [],
      markedDates: {},
      slotsForSelectedDate: [],
      inviteCode,
      bookingId: defaultBookingIdStateValue,
      currentSlot: { bookingId: 'slot-2' } as ISelectedSlot,
      oldSlot: { bookingId: 'slot-1' } as ISelectedSlot,
    };
    const updatedState = appointmentReducer(defaultState, action);
    expect(updatedState).toEqual(expectedState);
  });

  it('updates state with current slot', () => {
    const currentSlot = { bookingId: 'slot-new-currrent' } as ISelectedSlot;

    const action = setChangeSlotAction(currentSlot);

    const initialState: IAppointmentState = { ...defaultState, error: 'error' };

    const expectedState: IAppointmentState = {
      selectedLocation: {} as ILocation,
      selectedService: {} as IServiceInfo,
      minDate: '2020-07-20',
      maxDate: '2020-08-20',
      availableSlots: [],
      markedDates: {},
      slotsForSelectedDate: [],
      bookingId: defaultBookingIdStateValue,
      currentSlot: { bookingId: 'slot-new-currrent' } as ISelectedSlot,
      oldSlot: { bookingId: 'slot-2' } as ISelectedSlot,
      error: undefined,
    };
    const updatedState = appointmentReducer(initialState, action);

    expect(updatedState).toEqual(expectedState);
  });

  it('updates state with changeSlotError', () => {
    const action = changeSlotErrorAction('test-mock-error-1');
    const expectedState: IAppointmentState = {
      selectedLocation: {} as ILocation,
      selectedService: {} as IServiceInfo,
      minDate: '2020-07-20',
      maxDate: '2020-08-20',
      availableSlots: [],
      markedDates: {},
      slotsForSelectedDate: [],
      bookingId: defaultBookingIdStateValue,
      currentSlot: {} as ISelectedSlot,
      oldSlot: {} as ISelectedSlot,
      error: 'test-mock-error-1',
    };
    const updatedState = appointmentReducer(defaultState, action);
    expect(updatedState).toEqual(expectedState);
  });
});
