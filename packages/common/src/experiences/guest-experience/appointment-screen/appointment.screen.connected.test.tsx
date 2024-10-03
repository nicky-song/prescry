// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import {
  AppointmentScreenConnected,
  actions,
  mapStateToProps,
} from './appointment.screen.connected';
import {
  IAppointmentScreenActionProps,
  IAppointmentScreenProps,
} from './appointment.screen';
import { createBookingAndNavigateDataLoadingAsyncAction } from '../store/appointment/async-actions/create-booking-and-navigate-data-loading.async-action';
import { setSelectedDateAsyncAction } from '../store/appointment/async-actions/set-selected-date.async-action';
import { setCurrentMonthDataLoadingAsyncAction } from '../store/appointment/async-actions/set-current-month-data-loading.async-action';
import { IAppointmentState } from '../store/appointment/appointment.reducer';
import { RootState } from '../store/root-reducer';
import { IAppointmentItem } from '../../../models/api-response/appointment.response';
import { IMemberAddress } from '../../../models/api-request-body/create-booking.request-body';
import { resetNewDependentErrorAction } from '../store/appointment/actions/reset-new-dependent-error.action';
import { ServiceTypes } from '../../../models/provider-location';
import { ILocation } from '../../../models/api-response/provider-location-details-response';
import { getFirstRxGroupTypeByFeatureSwitch } from '../guest-experience-features';
import {
  IDependentProfile,
  IPrimaryProfile,
  IProfile,
} from '../../../models/member-profile/member-profile-info';
import { getProfilesByGroup } from '../../../utils/profile.helper';
import { ISelectedSlot } from '../store/appointment/actions/change-slot.action';
import { changeSlotDataLoadingAsyncAction } from '../store/appointment/async-actions/change-slot-data-loading.async-action';
import { GuestExperienceConfig } from '../guest-experience-config';
import { IMemberProfileState } from '../store/member-profile/member-profile-reducer';

jest.mock('../guest-experience-features');
const getFirstRxGroupTypeByFeatureSwitchMock =
  getFirstRxGroupTypeByFeatureSwitch as jest.Mock;

jest.mock('../../../utils/profile.helper');
const getProfilesByGroupMock = getProfilesByGroup as jest.Mock;

jest.mock(
  '../store/appointment/async-actions/create-booking-and-navigate-data-loading.async-action'
);

jest.mock('../store/appointment/async-actions/set-selected-date.async-action');
jest.mock(
  '../store/appointment/async-actions/set-current-month-data-loading.async-action'
);
jest.mock('../store/appointment/actions/reset-new-dependent-error.action');
jest.mock(
  '../store/appointment/async-actions/change-slot-data-loading.async-action'
);

jest.mock('./appointment.screen', () => ({
  AppointmentScreen: () => <div />,
}));

const mockServiceType = {
  type: ServiceTypes.abbottAntigen,
  serviceNameMyRx: undefined,
};

const service = {
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

const appointmentState: IAppointmentState = {
  slotsForSelectedDate: [],
  selectedLocation: providerLocation,
  availableSlots: [],
  markedDates: {},
  maxDate: '2020-08-25',
  minDate: '2020-07-25',
  selectedService: {
    serviceName: 'test-service',
    serviceType: 'COVID-19 Antigen Testing',
    screenDescription: 'Test Desc',
    screenTitle: 'Test Title',
    questions: [],
    minLeadDays: 'P6D',
    maxLeadDays: 'P30D',
  },
  appointmentDetails: {} as IAppointmentItem,
  bookingId: 'test',
  currentSlot: {} as ISelectedSlot,
  oldSlot: {} as ISelectedSlot,
};
const memberProfileMock = {
  account: {
    phoneNumber: '',
    firstName: 'Ac-first',
    lastName: 'Ac-last',
    favoritedPharmacies: [],
  },
  profileList: [
    {
      rxGroupType: 'CASH',
      primary: {
        email: 'test@test.com',
        firstName: 'firstName',
        identifier: '6000b2fa965fa7b37c00a7b2',
        isLimited: false,
        isPhoneNumberVerified: true,
        isPrimary: true,
        lastName: 'lastName',
        phoneNumber: '1234567890',
        primaryMemberFamilyId: 'CA12345',
        primaryMemberPersonCode: '01',
        primaryMemberRxId: 'CA1234501',
        age: 30,
        address1: '123 E Main St',
        address2: 'Apt 100',
        city: 'Seattle',
        state: 'WA',
        county: 'King',
        zip: '11111',
      } as IPrimaryProfile,
    },
  ],
} as IMemberProfileState;

describe('AppointmentScreenConnected', () => {
  beforeEach(() => {
    getProfilesByGroupMock.mockReturnValue([]);
  });

  it('AppointmentScreen should be defined', () => {
    expect(AppointmentScreenConnected).toBeDefined();
  });

  it('maps ownprops', () => {
    const initialState: Partial<RootState> = {
      appointment: appointmentState,
      config: {
        ...GuestExperienceConfig,
        cancelAppointmentWindowHours: '6',
      },
      serviceType: mockServiceType,
      memberProfile: memberProfileMock,
    };
    const childDependents: IDependentProfile[] = [
      {
        firstName: 'mock-name',
        lastName: 'mock-lastname',
        identifier: 'id-2',
        isLimited: false,
        isPrimary: false,
        primaryMemberFamilyId: 'CA12345',
        primaryMemberPersonCode: '03',
        primaryMemberRxId: 'CA1234503',
        age: 5,
        rxGroupType: 'CASH',
        rxSubGroup: 'CASH01',
        email: '',
        phoneNumber: '',
      },
    ];
    const adultDependents: IDependentProfile[] = [
      {
        firstName: 'mock-name2',
        lastName: 'mock-lastname2',
        identifier: 'id-2',
        isLimited: false,
        isPrimary: false,
        primaryMemberFamilyId: 'CA12345',
        primaryMemberPersonCode: '04',
        primaryMemberRxId: 'CA1234504',
        age: 25,
        rxGroupType: 'CASH',
        rxSubGroup: 'CASH01',
        email: '',
        phoneNumber: '',
      },
    ];
    getFirstRxGroupTypeByFeatureSwitchMock.mockReturnValueOnce(undefined);
    getProfilesByGroupMock.mockReturnValue([
      {
        primary: {
          email: 'test@test.com',
          firstName: 'firstName',
          identifier: '6000b2fa965fa7b37c00a7b2',
          isLimited: false,
          isPhoneNumberVerified: true,
          isPrimary: true,
          lastName: 'lastName',
          phoneNumber: '1234567890',
          primaryMemberFamilyId: 'CA12345',
          primaryMemberPersonCode: '01',
          primaryMemberRxId: 'CA1234501',
          age: 30,
          address1: '123 E Main St',
          address2: 'Apt 100',
          city: 'Seattle',
          state: 'WA',
          county: 'King',
          zip: '11111',
        },
        childMembers: childDependents,
        adultMembers: adultDependents,
      } as IProfile,
    ]);

    const ownPropsMock: Partial<IAppointmentScreenProps> = {
      error: 'error',
    };
    const mappedProps: IAppointmentScreenProps = mapStateToProps(
      initialState as RootState,
      ownPropsMock
    );

    const expectedProps: IAppointmentScreenProps = {
      selectedLocation: providerLocation,
      markedDates: {},
      slotForDate: [],
      maxDay: '2020-08-25',
      minDay: '2020-07-25',
      selectedService: service,
      rxGroupType: 'CASH',
      isMember: true,
      availableSlots: [],
      memberAddress: {
        address1: '123 E Main St',
        address2: 'Apt 100',
        city: 'Seattle',
        state: 'WA',
        county: 'King',
        zip: '11111',
      } as IMemberAddress,
      cancelWindowHours: '6',
      childMembers: childDependents,
      adultMembers: adultDependents,
      currentMonth: undefined,
      dependentError: undefined,
      error: undefined,
      currentSlot: {} as ISelectedSlot,
      serviceTypeInfo: mockServiceType,
      ...ownPropsMock,
    };

    expect(mappedProps).toEqual(expectedProps);
  });

  it('maps dispatch actions', () => {
    const expectedActions: IAppointmentScreenActionProps = {
      onBookPressAsync: createBookingAndNavigateDataLoadingAsyncAction,
      onSlotChangeAsync: changeSlotDataLoadingAsyncAction,
      onDateSelectedAsync: setSelectedDateAsyncAction,
      onMonthChangeAsync: setCurrentMonthDataLoadingAsyncAction,
      resetNewDependentError: resetNewDependentErrorAction,
    };
    expect(actions).toEqual(expectedActions);
  });

  it('returns correct values when cashProfile exists', () => {
    const selectedService = {
      ...service,
      serviceType: 'c19-vaccine-dose1',
    };

    const providerLocationMock = {
      ...providerLocation,
      serviceInfo: [selectedService],
    };
    const appointment: IAppointmentState = {
      ...appointmentState,
      selectedService,
      selectedLocation: providerLocationMock,
    };

    const initialState: RootState = {
      appointment,
      features: {},
      config: {
        cancelAppointmentWindowHours: '6',
      },
      serviceType: mockServiceType,
      memberProfile: memberProfileMock,
    } as unknown as RootState;
    getProfilesByGroupMock.mockReturnValue([
      {
        primary: {
          address1: '234 W Main Ave',
          address2: 'Apt 987',
          city: 'Minneapolis',
          state: 'MN',
          county: 'Minnetonka',
          zip: '56099',
        },
        childMembers: [] as IDependentProfile[],
        adultMembers: [] as IDependentProfile[],
      } as IProfile,
    ]);

    const ownPropsMock: Partial<IAppointmentScreenProps> = {
      error: 'error',
    };
    const mappedProps: IAppointmentScreenProps = mapStateToProps(
      initialState,
      ownPropsMock
    );

    const expectedProps: IAppointmentScreenProps = {
      selectedLocation: providerLocationMock,
      markedDates: {},
      slotForDate: [],
      maxDay: '2020-08-25',
      minDay: '2020-07-25',
      selectedService,
      rxGroupType: 'CASH',
      isMember: true,
      availableSlots: [],
      memberAddress: {
        address1: '234 W Main Ave',
        address2: 'Apt 987',
        city: 'Minneapolis',
        state: 'MN',
        county: 'Minnetonka',
        zip: '56099',
      } as IMemberAddress,
      cancelWindowHours: '6',
      childMembers: [],
      adultMembers: [],
      currentMonth: undefined,
      dependentError: undefined,
      error: undefined,
      currentSlot: {} as ISelectedSlot,
      serviceTypeInfo: mockServiceType,
      ...ownPropsMock,
    };
    expect(mappedProps).toEqual(expectedProps);
  });

  it('returns correct values when cashProfile does not exist', () => {
    const selectedService = {
      ...service,
      serviceType: 'c19-vaccine-dose1',
    };

    const providerLocationMock = {
      ...providerLocation,
      serviceInfo: [selectedService],
    };
    const appointment: IAppointmentState = {
      ...appointmentState,
      selectedService,
      selectedLocation: providerLocationMock,
    };

    const initialState: RootState = {
      appointment,
      features: {},
      config: {
        cancelAppointmentWindowHours: '6',
      },
      serviceType: mockServiceType,
      memberProfile: { profileList: [] as IProfile[] },
    } as RootState;

    const ownPropsMock: Partial<IAppointmentScreenProps> = {
      error: 'error',
    };
    const mappedProps: IAppointmentScreenProps = mapStateToProps(
      initialState,
      ownPropsMock
    );

    const expectedProps: IAppointmentScreenProps = {
      selectedLocation: providerLocationMock,
      markedDates: {},
      slotForDate: [],
      maxDay: '2020-08-25',
      minDay: '2020-07-25',
      selectedService,
      rxGroupType: 'CASH',
      isMember: false,
      availableSlots: [],
      memberAddress: {
        address1: undefined,
        address2: undefined,
        city: undefined,
        state: undefined,
        county: undefined,
        zip: undefined,
      } as unknown as IMemberAddress,
      cancelWindowHours: '6',
      childMembers: [],
      adultMembers: [],
      currentMonth: undefined,
      dependentError: undefined,
      error: undefined,
      currentSlot: {} as ISelectedSlot,
      serviceTypeInfo: mockServiceType,
      ...ownPropsMock,
    };
    expect(mappedProps).toEqual(expectedProps);
  });
});
