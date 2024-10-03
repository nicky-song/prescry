// Copyright 2020 Prescryptive Health, Inc.

import moment from 'moment';
import { RootState } from '../store/root-reducer';
import {
  IAppointmentConfirmationRouteProps,
  IAppointmentConfirmationScreenDispatchProps,
  IAppointmentConfirmationScreenProps,
} from './appointment-confirmation.screen';
import { getAppointmentDetailsDataLoadingAsyncAction } from '../store/appointment/async-actions/get-appointment-details-data-loading.async-action';
import { IAppointmentState } from '../store/appointment/appointment.reducer';
import { appointmentConfirmationScreenContent } from './appointment-confirmation.screen.content';
import { IAppointmentItem } from '../../../models/api-response/appointment.response';
import { cancelAppointmentDataLoadingAsyncAction } from '../store/appointment/async-actions/cancel-appointment-data-loading.async-action';
import {
  actions,
  mapStateToProps,
} from './appointment-confirmation.screen.connected';
import { IServiceInfo } from '../../../models/api-response/provider-location-details-response';
import { ILocation } from '../../../models/api-response/provider-location-details-response';
import { INavigationScreenProps } from '../navigation/navigation-screen-props';
import { AppointmentConfirmationRouteProp } from '../navigation/stack-navigators/appointments/appointments.stack-navigator';

const requestedDescription =
  appointmentConfirmationScreenContent.appointmentRequestedDescription;
const requestedTitle =
  appointmentConfirmationScreenContent.appointmentRequestedTitle;
const confirmationAdditionalInfo = 'additional-info';

const selectedServiceMock: IServiceInfo = {
  confirmationAdditionalInfo,
  maxLeadDays: '',
  minLeadDays: '',
  questions: [],
  screenDescription: '',
  screenTitle: '',
  serviceName: '',
  serviceType: '',
};

const providerName = '';
const address1 = 'address1';
const address2 = 'address2';
const city = 'city';
const state = 'state';
const zip = 'zip';
const selectedLocationMock: ILocation = {
  providerName,
  address1,
  address2,
  city,
  state,
  zip,
  id: '',
  locationName: '',
  serviceInfo: [],
  timezone: '',
};

const appointmentDetailsMock: IAppointmentItem = {
  serviceName: '',
  customerName: 'name',
  customerDateOfBirth: '01/01/2000',
  status: 'Accepted',
  orderNumber: '12345',
  locationName: '',
  address1,
  address2,
  city,
  state,
  zip,
  additionalInfo: confirmationAdditionalInfo,
  date: 'January 1, 2000',
  time: 'time',
  providerTaxId: 'dummy Tax Id',
  paymentStatus: 'no_payment_required',
  procedureCode: 'procedure-code',
  serviceDescription: 'service-description',
  bookingStatus: 'Confirmed',
  startInUtc: new Date('2120-12-15T13:00:00+0000'),
  serviceType: '',
  appointmentLink: 'appointmentLink',
};
const appointmentDetailsCancelMock: IAppointmentItem = {
  serviceName: '',
  customerName: 'name',
  customerDateOfBirth: '01/01/2000',
  status: 'cancel',
  orderNumber: '12345',
  locationName: '',
  address1,
  address2,
  city,
  state,
  zip,
  additionalInfo: undefined,
  date: 'January 1, 2000',
  time: 'time',
  providerTaxId: 'dummy Tax Id',
  paymentStatus: 'no_payment_required',
  procedureCode: 'procedure-code',
  serviceDescription: 'service-description',
  bookingStatus: 'Cancelled',
  startInUtc: new Date('2120-12-15T13:00:00+0000'),
  serviceType: '',
  appointmentLink: 'appointmentLink',
};
const appointmentConfirmationMock: IAppointmentItem = {
  serviceName: '',
  customerName: 'name',
  customerDateOfBirth: '01/01/2000',
  status: 'Accepted',
  orderNumber: '12345',
  locationName: '',
  address1,
  address2,
  city,
  state,
  zip,
  additionalInfo: confirmationAdditionalInfo,
  date: 'December 31, 1999',
  time: 'time1',
  providerTaxId: 'dummy Tax Id',
  paymentStatus: 'unpaid',
  procedureCode: 'procedure-code',
  serviceDescription: 'service-description',
  bookingStatus: 'Requested',
  startInUtc: new Date('2120-12-15T13:00:00+0000'),
  serviceType: '',
  appointmentLink: 'appointmentLink',
};

const appointmentCompletedMock: IAppointmentItem = {
  serviceName: '',
  customerName: 'name',
  customerDateOfBirth: '01/01/2000',
  status: 'Accepted',
  orderNumber: '12345',
  locationName: '',
  address1,
  address2,
  city,
  state,
  zip,
  additionalInfo: confirmationAdditionalInfo,
  date: 'December 31, 1999',
  time: 'time1',
  providerTaxId: 'dummy Tax Id',
  paymentStatus: 'no_payment_required',
  procedureCode: 'procedure-code',
  serviceDescription: 'service-description',
  bookingStatus: 'Completed',
  startInUtc: new Date('2020-12-15T13:00:00+0000'),
  serviceType: '',
  appointmentLink: 'appointmentLink',
};

const appointmentCanceledDetailsMock: IAppointmentItem = {
  serviceName: '',
  customerName: 'name',
  customerDateOfBirth: '01/01/2000',
  status: 'Canceled',
  orderNumber: '12345',
  locationName: '',
  address1,
  address2,
  city,
  state,
  zip,
  additionalInfo: confirmationAdditionalInfo,
  date: 'January 1, 2000',
  time: 'time',
  providerTaxId: 'dummy Tax Id',
  paymentStatus: 'unpaid',
  procedureCode: 'procedure-code',
  serviceDescription: 'service-description',
  bookingStatus: 'Cancelled',
  startInUtc: new Date('2120-12-15T13:00:00+0000'),
  serviceType: '',
  appointmentLink: 'appointmentLink',
};

const loggedInMemberState = {
  dateOfBirth: '01/01/2000',
  rxGroupType: 'CASH',
};

let savedDateNow: () => number;

describe('AppointmentConfirmationScreenConnected', () => {
  beforeEach(() => {
    savedDateNow = Date.now;
    Date.now = jest.fn().mockReturnValue(new Date('2021-06-20T13:00:00+0000'));
  });
  afterEach(() => {
    Date.now = savedDateNow;
  });

  it('maps state', () => {
    const appointmentState: Partial<IAppointmentState> = {
      selectedService: selectedServiceMock,
      selectedLocation: selectedLocationMock,
      appointmentDetails: appointmentDetailsMock,
    };

    const mappedProperties = mapStateToProps({
      appointment: appointmentState,
      memberListInfo: {
        loggedInMember: loggedInMemberState,
      },
      features: {},
      config: {
        cancelAppointmentWindowHours: '6',
        supportEmail: 'test@test.com',
      },
    } as RootState);

    const expectedProperties: IAppointmentConfirmationScreenProps = {
      appointmentDate: 'Saturday, January 1, 2000',
      appointmentTime: 'time',
      confirmationDetails:
        appointmentState.appointmentDetails?.confirmationDescription ?? '',
      confirmationDetailsIntro: '',
      confirmationDetailsEnding: '',
      confirmationTitle: appointmentConfirmationScreenContent.confirmationTitle,
      location: {
        name: providerName,
        addressLine1: address1,
        addressLine2: address2,
        city,
        state,
        zip,
      },
      appointmentInfoAvailable: true,
      appointment: appointmentDetailsMock,
      patientName: 'name',
      bookingStatus: 'Confirmed',
      isPastAppointment: false,
      isCancellableAppointment: true,
      paymentStatus: 'no_payment_required',
      cancelSuccess: undefined,
      cancelWindowHours: '6',
      supportEmail: 'test@test.com',
    };

    expect(mappedProperties).toEqual(expectedProperties);
  });

  it('maps dispatch actions', () => {
    const expectedActions: IAppointmentConfirmationScreenDispatchProps = {
      getAppointment: getAppointmentDetailsDataLoadingAsyncAction,
      cancelAppointment: cancelAppointmentDataLoadingAsyncAction,
    };

    expect(actions).toEqual(expectedActions);
  });

  it('maps state and use appointmentDetails if both appointmentDetails and appointmentConfirmationDetails available', () => {
    const appointmentState: Partial<IAppointmentState> = {
      selectedService: selectedServiceMock,
      selectedLocation: selectedLocationMock,
      appointmentDetails: appointmentDetailsMock,
      appointmentConfirmation: appointmentConfirmationMock,
    };

    const mappedProperties = mapStateToProps({
      appointment: appointmentState,
      memberListInfo: {
        loggedInMember: loggedInMemberState,
      },
      features: {},
      config: {
        cancelAppointmentWindowHours: '6',
        supportEmail: 'test@test.com',
      },
    } as RootState);

    const expectedProperties: IAppointmentConfirmationScreenProps = {
      appointmentDate: 'Saturday, January 1, 2000',
      appointmentTime: 'time',
      confirmationDetails:
        appointmentState.appointmentDetails?.confirmationDescription ?? '',
      confirmationDetailsIntro: '',
      confirmationDetailsEnding: '',
      confirmationTitle: appointmentConfirmationScreenContent.confirmationTitle,
      location: {
        name: providerName,
        addressLine1: address1,
        addressLine2: address2,
        city,
        state,
        zip,
      },
      appointmentInfoAvailable: true,
      appointment: appointmentDetailsMock,
      patientName: 'name',
      bookingStatus: 'Confirmed',
      isPastAppointment: false,
      isCancellableAppointment: true,
      paymentStatus: 'no_payment_required',
      cancelSuccess: undefined,
      cancelWindowHours: '6',
      supportEmail: 'test@test.com',
    };

    expect(mappedProperties).toEqual(expectedProperties);
  });

  it('maps state and use appointmentDetails if bookingStatus is Completed', () => {
    const appointmentState: Partial<IAppointmentState> = {
      selectedService: selectedServiceMock,
      selectedLocation: selectedLocationMock,
      appointmentDetails: appointmentDetailsMock,
      appointmentConfirmation: appointmentCompletedMock,
    };

    const mappedProperties = mapStateToProps({
      appointment: appointmentState,
      memberListInfo: {
        loggedInMember: loggedInMemberState,
      },
      features: {},
      config: {
        cancelAppointmentWindowHours: '6',
        supportEmail: 'test@test.com',
      },
    } as RootState);

    const expectedProperties: IAppointmentConfirmationScreenProps = {
      appointmentDate: 'Saturday, January 1, 2000',
      appointmentTime: 'time',
      confirmationDetails:
        appointmentState.appointmentDetails?.confirmationDescription ?? '',
      confirmationDetailsIntro: '',
      confirmationDetailsEnding: '',
      confirmationTitle: appointmentConfirmationScreenContent.confirmationTitle,
      location: {
        name: providerName,
        addressLine1: address1,
        addressLine2: address2,
        city,
        state,
        zip,
      },
      appointmentInfoAvailable: true,
      appointment: appointmentDetailsMock,
      patientName: 'name',
      bookingStatus: 'Confirmed',
      isPastAppointment: false,
      isCancellableAppointment: true,
      paymentStatus: 'no_payment_required',
      cancelSuccess: undefined,
      cancelWindowHours: '6',
      supportEmail: 'test@test.com',
    };

    expect(mappedProperties).toEqual(expectedProperties);
  });

  it('maps state and use appointmentConfirmationDetails if appointmentDetails not available', () => {
    const appointmentState: Partial<IAppointmentState> = {
      selectedService: selectedServiceMock,
      selectedLocation: selectedLocationMock,
      appointmentConfirmation: appointmentConfirmationMock,
    };

    const mappedProperties = mapStateToProps({
      appointment: appointmentState,
      memberListInfo: {
        loggedInMember: loggedInMemberState,
      },
      features: {},
      config: {
        cancelAppointmentWindowHours: '6',
        supportEmail: 'test@test.com',
      },
    } as RootState);

    const expectedProperties: IAppointmentConfirmationScreenProps = {
      appointmentDate: 'Friday, December 31, 1999',
      appointmentTime: 'time1',
      confirmationDetails: requestedDescription,
      confirmationDetailsIntro: '',
      confirmationDetailsEnding: '',
      confirmationTitle: requestedTitle,
      location: {
        name: providerName,
        addressLine1: address1,
        addressLine2: address2,
        city,
        state,
        zip,
      },
      appointmentInfoAvailable: true,
      appointment: appointmentConfirmationMock,
      patientName: '',
      bookingStatus: 'Requested',
      isPastAppointment: false,
      isCancellableAppointment: false,
      paymentStatus: undefined,
      cancelSuccess: undefined,
      cancelWindowHours: '6',
      supportEmail: 'test@test.com',
    };

    expect(mappedProperties).toEqual(expectedProperties);
  });

  it('maps state and set appointmentavailable false if neither appointmentDetails nor appointmentConfirmationDetails available', () => {
    const appointmentState: Partial<IAppointmentState> = {
      selectedService: selectedServiceMock,
      selectedLocation: selectedLocationMock,
    };

    const mappedProperties = mapStateToProps({
      appointment: appointmentState,
      memberListInfo: {
        loggedInMember: loggedInMemberState,
      },
      features: {},
      config: {
        cancelAppointmentWindowHours: '6',
        supportEmail: 'test@test.com',
      },
    } as RootState);

    const expectedProperties: IAppointmentConfirmationScreenProps = {
      appointmentDate: '',
      appointmentTime: '',
      confirmationDetails: requestedDescription,
      confirmationDetailsIntro: '',
      confirmationDetailsEnding: '',
      confirmationTitle: requestedTitle,
      location: {
        name: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zip: '',
      },
      appointmentInfoAvailable: false,
      appointment: {} as IAppointmentItem,
      patientName: '',
      bookingStatus: '',
      isPastAppointment: false,
      isCancellableAppointment: false,
      paymentStatus: undefined,
      cancelSuccess: undefined,
      cancelWindowHours: '6',
      supportEmail: 'test@test.com',
    };

    expect(mappedProperties).toEqual(expectedProperties);
  });

  it('maps state and use appointmentDetails with expected properties when appointment is canceled', () => {
    const appointmentState: Partial<IAppointmentState> = {
      selectedService: selectedServiceMock,
      selectedLocation: selectedLocationMock,
      appointmentDetails: appointmentDetailsCancelMock,
      appointmentConfirmation: appointmentCanceledDetailsMock,
    };

    const mappedProperties = mapStateToProps({
      appointment: appointmentState,
      memberListInfo: {
        loggedInMember: loggedInMemberState,
      },
      features: {},
      config: {
        cancelAppointmentWindowHours: '6',
        supportEmail: 'test@test.com',
      },
    } as RootState);

    const expectedProperties: IAppointmentConfirmationScreenProps = {
      appointmentDate: 'Saturday, January 1, 2000',
      appointmentTime: 'time',
      confirmationDetails:
        appointmentConfirmationScreenContent.appointmentCancelledDescription,
      confirmationDetailsIntro: '',
      confirmationDetailsEnding: '',
      confirmationTitle:
        appointmentConfirmationScreenContent.appointmentCancelledTitle,
      isCancellableAppointment: false,
      location: {
        name: providerName,
        addressLine1: address1,
        addressLine2: address2,
        city,
        state,
        zip,
      },
      appointmentInfoAvailable: true,
      appointment: appointmentDetailsCancelMock,
      patientName: 'name',
      bookingStatus: 'Cancelled',
      isPastAppointment: false,
      paymentStatus: 'no_payment_required',
      cancelSuccess: undefined,
      cancelWindowHours: '6',
      supportEmail: 'test@test.com',
    };

    expect(mappedProperties).toEqual(expectedProperties);
  });

  it('maps state checks for cancellable appointment with window hours with appointment in 1 month', () => {
    const appointmentTime = moment.utc().toDate();
    const appointmentDateChange = new Date(
      appointmentTime.setMonth(appointmentTime.getMonth() + 1)
    );

    const appointmentState: Partial<IAppointmentState> = {
      selectedService: selectedServiceMock,
      selectedLocation: selectedLocationMock,
      appointmentDetails: {
        ...appointmentDetailsMock,
        startInUtc: appointmentDateChange,
      },
    };

    const mappedProperties = mapStateToProps({
      appointment: appointmentState,
      memberListInfo: {
        loggedInMember: loggedInMemberState,
      },
      features: {},
      config: {
        cancelAppointmentWindowHours: '6',
        supportEmail: 'test@test.com',
      },
    } as RootState);

    const expectedProperties: IAppointmentConfirmationScreenProps = {
      appointmentDate: 'Saturday, January 1, 2000',
      appointmentTime: 'time',
      confirmationDetails:
        appointmentState.appointmentDetails?.confirmationDescription ?? '',
      confirmationDetailsIntro: '',
      confirmationDetailsEnding: '',
      confirmationTitle: appointmentConfirmationScreenContent.confirmationTitle,
      location: {
        name: providerName,
        addressLine1: address1,
        addressLine2: address2,
        city,
        state,
        zip,
      },
      appointmentInfoAvailable: true,
      appointment: {
        ...appointmentDetailsMock,
        startInUtc: appointmentDateChange,
      },
      patientName: 'name',
      bookingStatus: 'Confirmed',
      isPastAppointment: false,
      isCancellableAppointment: true,
      paymentStatus: 'no_payment_required',
      cancelSuccess: undefined,
      cancelWindowHours: '6',
      supportEmail: 'test@test.com',
    };

    expect(mappedProperties).toEqual(expectedProperties);
  });

  it('maps state and checks for cancellable appointment within window hours with appointment in 1 hour', () => {
    const appointmentTime = moment.utc().toDate();
    const appointmentDateChange = new Date(
      appointmentTime.setHours(appointmentTime.getHours() + 1)
    );

    const appointmentState: Partial<IAppointmentState> = {
      selectedService: selectedServiceMock,
      selectedLocation: selectedLocationMock,
      appointmentDetails: {
        ...appointmentDetailsMock,
        startInUtc: appointmentDateChange,
      },
    };

    const mappedProperties = mapStateToProps({
      appointment: appointmentState,
      memberListInfo: {
        loggedInMember: loggedInMemberState,
      },
      features: {},
      config: {
        cancelAppointmentWindowHours: '6',
        supportEmail: 'test@test.com',
      },
    } as RootState);

    const expectedProperties: IAppointmentConfirmationScreenProps = {
      appointmentDate: 'Saturday, January 1, 2000',
      appointmentTime: 'time',
      confirmationDetails:
        appointmentState.appointmentDetails?.confirmationDescription ?? '',
      confirmationDetailsIntro: '',
      confirmationDetailsEnding: '',
      confirmationTitle: appointmentConfirmationScreenContent.confirmationTitle,
      location: {
        name: providerName,
        addressLine1: address1,
        addressLine2: address2,
        city,
        state,
        zip,
      },
      appointmentInfoAvailable: true,
      appointment: {
        ...appointmentDetailsMock,
        startInUtc: appointmentDateChange,
      },
      patientName: 'name',
      bookingStatus: 'Confirmed',
      isPastAppointment: false,
      isCancellableAppointment: false,
      paymentStatus: 'no_payment_required',
      cancelSuccess: undefined,
      cancelWindowHours: '6',
      supportEmail: 'test@test.com',
    };

    expect(mappedProperties).toEqual(expectedProperties);
  });

  it('maps state and checks for cancellable appointment a couple seconds ahead of window hours', () => {
    const appointmentTime = moment.utc().toDate();
    const appointmentSecondsChange = new Date(
      appointmentTime.setSeconds(appointmentTime.getSeconds() + 5)
    );
    const appointmentDateChange = new Date(
      appointmentSecondsChange.setHours(appointmentSecondsChange.getHours() + 6)
    );

    const appointmentState: Partial<IAppointmentState> = {
      selectedService: selectedServiceMock,
      selectedLocation: selectedLocationMock,
      appointmentDetails: {
        ...appointmentDetailsMock,
        startInUtc: appointmentDateChange,
      },
    };

    const mappedProperties = mapStateToProps({
      appointment: appointmentState,
      memberListInfo: {
        loggedInMember: loggedInMemberState,
      },
      features: {},
      config: {
        cancelAppointmentWindowHours: '6',
        supportEmail: 'test@test.com',
      },
    } as RootState);

    const expectedProperties: IAppointmentConfirmationScreenProps = {
      appointmentDate: 'Saturday, January 1, 2000',
      appointmentTime: 'time',
      confirmationDetails:
        appointmentState.appointmentDetails?.confirmationDescription ?? '',
      confirmationDetailsIntro: '',
      confirmationDetailsEnding: '',
      confirmationTitle: appointmentConfirmationScreenContent.confirmationTitle,
      location: {
        name: providerName,
        addressLine1: address1,
        addressLine2: address2,
        city,
        state,
        zip,
      },
      appointmentInfoAvailable: true,
      appointment: {
        ...appointmentDetailsMock,
        startInUtc: appointmentDateChange,
      },
      patientName: 'name',
      bookingStatus: 'Confirmed',
      isPastAppointment: false,
      isCancellableAppointment: true,
      paymentStatus: 'no_payment_required',
      cancelSuccess: undefined,
      cancelWindowHours: '6',
      supportEmail: 'test@test.com',
    };

    expect(mappedProperties).toEqual(expectedProperties);
  });

  it('maps state and props for when servicetype is C19vaccine', () => {
    const appointmentTime = moment.utc().toDate();
    const appointmentSecondsChange = new Date(
      appointmentTime.setSeconds(appointmentTime.getSeconds() + 5)
    );
    const appointmentDateChange = new Date(
      appointmentSecondsChange.setHours(appointmentSecondsChange.getHours() + 6)
    );

    const appointmentState: Partial<IAppointmentState> = {
      selectedService: selectedServiceMock,
      selectedLocation: selectedLocationMock,
      appointmentDetails: {
        ...appointmentDetailsMock,
        startInUtc: appointmentDateChange,
        serviceType: 'C19Vaccine',
        confirmationDescription: 'confirmation-description',
      } as IAppointmentItem,
    };

    const mappedProperties = mapStateToProps({
      appointment: appointmentState,
      memberListInfo: {
        loggedInMember: loggedInMemberState,
      },
      features: {},
      config: {
        cancelAppointmentWindowHours: '6',
        supportEmail: 'test@test.com',
      },
    } as RootState);

    const expectedProperties: IAppointmentConfirmationScreenProps = {
      appointmentDate: 'Saturday, January 1, 2000',
      appointmentTime: 'time',
      confirmationDetails: 'confirmation-description',
      confirmationDetailsIntro: '',
      confirmationDetailsEnding: '',
      confirmationTitle: appointmentConfirmationScreenContent.confirmationTitle,
      location: {
        name: providerName,
        addressLine1: address1,
        addressLine2: address2,
        city,
        state,
        zip,
      },
      appointmentInfoAvailable: true,
      appointment: {
        ...appointmentDetailsMock,
        startInUtc: appointmentDateChange,
        serviceType: 'C19Vaccine',
        confirmationDescription: 'confirmation-description',
      },
      patientName: 'name',
      bookingStatus: 'Confirmed',
      isPastAppointment: false,
      isCancellableAppointment: true,
      paymentStatus: 'no_payment_required',
      cancelSuccess: undefined,
      cancelWindowHours: '6',
      supportEmail: 'test@test.com',
    };

    expect(mappedProperties).toEqual(expectedProperties);
  });

  it('maps state and use route params for appointment status if passed', () => {
    const appointmentTime = moment.utc().toDate();
    const appointmentSecondsChange = new Date(
      appointmentTime.setSeconds(appointmentTime.getSeconds() + 5)
    );
    const appointmentDateChange = new Date(
      appointmentSecondsChange.setHours(appointmentSecondsChange.getHours() + 6)
    );

    const appointmentState: Partial<IAppointmentState> = {
      selectedService: selectedServiceMock,
      selectedLocation: selectedLocationMock,
      appointmentDetails: {
        ...appointmentDetailsMock,
        startInUtc: appointmentDateChange,
      },
    };
    const routeProps: IAppointmentConfirmationRouteProps = {
      showBackButton: false,
      appointmentId: '123456',
      appointmentStatus: 'cancel',
    };
    const mappedProperties = mapStateToProps(
      {
        appointment: appointmentState,
        memberListInfo: {
          loggedInMember: loggedInMemberState,
        },
        features: {},
        config: {
          cancelAppointmentWindowHours: '6',
          supportEmail: 'test@test.com',
        },
      } as RootState,
      {
        route: { params: routeProps },
      } as INavigationScreenProps<AppointmentConfirmationRouteProp>
    );

    const expectedProperties: Partial<IAppointmentConfirmationScreenProps> &
      Partial<INavigationScreenProps<AppointmentConfirmationRouteProp>> = {
      appointmentDate: 'Saturday, January 1, 2000',
      appointmentTime: 'time',
      confirmationDetails:
        'Your appointment with {location-name} on **{appointment-date} at {appointment-time}** has been **canceled**.',
      confirmationTitle: 'Appointment canceled',
      confirmationDetailsIntro: '',
      confirmationDetailsEnding: '',
      location: {
        name: providerName,
        addressLine1: address1,
        addressLine2: address2,
        city,
        state,
        zip,
      },
      appointmentInfoAvailable: true,
      appointment: {
        ...appointmentDetailsMock,
        startInUtc: appointmentDateChange,
      },
      patientName: 'name',
      bookingStatus: 'cancel',
      isPastAppointment: false,
      isCancellableAppointment: true,
      paymentStatus: 'no_payment_required',
      cancelSuccess: undefined,
      cancelWindowHours: '6',
      supportEmail: 'test@test.com',
      route: {
        params: {
          appointmentId: '123456',
          appointmentStatus: 'cancel',
          showBackButton: false,
        },
      } as AppointmentConfirmationRouteProp,
    };

    expect(mappedProperties).toEqual(expectedProperties);
  });
});
