// Copyright 2020 Prescryptive Health, Inc.

import { handlePostLoginApiErrorsAction } from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { createBookingDispatch } from './create-booking.dispatch';
import { createBookingAndNavigateDispatch } from './create-booking-and-navigate.dispatch';
import { IMemberAddress } from '../../../../../models/api-request-body/create-booking.request-body';
import { IAvailableSlot } from '../../../../../models/api-response/available-slots-response';
import { ErrorNotFound } from '../../../../../errors/error-not-found';
import { getAvailabilityDispatch } from './get-availability.dispatch';
import { createBookingErrorAction } from '../actions/create-booking-error.action';
import { acceptConsentDispatch } from '../../provider-locations/dispatch/accept-consent.dispatch';
import { IQuestionAnswer } from '../../../../../models/question-answer';
import { appointmentsStackNavigationMock } from '../../../navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';
import { insuranceQuestionsMock } from '../../../appointment-screen/__mocks__/insurance-question-answer.mock';
import { ErrorBadRequest } from '../../../../../errors/error-bad-request';
import { createBookingNewDependentErrorAction } from '../actions/create-booking-new-dependent-error.action';
jest.mock('./create-booking.dispatch');
const createBookingDispatchMock = createBookingDispatch as jest.Mock;

jest.mock('../../provider-locations/dispatch/accept-consent.dispatch');
const acceptConsentDispatchMock = acceptConsentDispatch as jest.Mock;

jest.mock('../../navigation/dispatch/navigate-post-login-error.dispatch');
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

jest.mock('../../navigation/navigation-reducer.actions');

jest.mock('./get-availability.dispatch');
const getAvailabilityDispatchMock = getAvailabilityDispatch as jest.Mock;

jest.mock('../actions/create-booking-error.action');
const createBookingErrorActionMock = createBookingErrorAction as jest.Mock;

jest.mock('../actions/create-booking-new-dependent-error.action');
const createBookingNewDependentErrorActionMock =
  createBookingNewDependentErrorAction as jest.Mock;

const authTokenMock = 'auth_token';
const deviceTokenMock = 'device_token';
const defaultStateMock = {
  config: {
    apis: {},
  },
  settings: {
    deviceToken: deviceTokenMock,
    token: authTokenMock,
  },
  appointment: {
    selectedLocation: {
      timezone: 'America/Los_Angeles',
      id: '1',
      serviceInfo: [{ serviceType: 'service-type' }],
    },
    selectedService: { serviceType: 'service-type' },
    currentMonth: '2020-07-01',
    selectedDate: '2020-07-15',
    minDate: '2020-06-24T00:00:00-08:00',
    maxDate: '2020-09-12T09:48:00-08:00',
    availableSlots: [],
  },
};
const getStateMock = jest.fn();
const questions: IQuestionAnswer[] = [
  {
    questionId: '1',
    questionText: 'question-1',
    answer: 'answer1',
  },
  {
    questionId: '2',
    questionText: 'question-2',
    answer: 'answer2',
  },
];

const selectedSlot: IAvailableSlot = {
  start: '2020-07-03T08:00:00',
  day: '2020-07-03',
  slotName: '8:15 am',
};

const address: IMemberAddress = {
  address1: 'address1',
  state: 'sate',
  city: 'city',
  zip: 'zip',
  county: 'county',
};

describe('createBookingAndNavigateDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getStateMock.mockReturnValue(defaultStateMock);
    createBookingDispatchMock.mockReturnValue({ appointmentId: '123456', appointmentLink: 'link' });
  });

  it('calls createBookingDispatch', async () => {
    const dispatchMock = jest.fn();
    const insuranceQuestions = insuranceQuestionsMock;
    await createBookingAndNavigateDispatch(
      questions,
      insuranceQuestions,
      selectedSlot,
      dispatchMock,
      getStateMock,
      appointmentsStackNavigationMock,
      address
    );

    expect(createBookingDispatchMock).toHaveBeenCalledWith(
      questions,
      insuranceQuestions,
      selectedSlot,
      dispatchMock,
      getStateMock,
      address,
      undefined
    );
    expect(appointmentsStackNavigationMock.navigate).toHaveBeenCalledWith(
      'AppointmentConfirmation',
      { appointmentId: '123456', showBackButton: false, appointmentStatus: undefined, appointmentLink: 'link' }
    );
  });

  it('calls acceptConsentDispatch', async () => {
    const dispatchMock = jest.fn();
    getStateMock.mockReturnValueOnce({
      ...defaultStateMock,
    });
    await createBookingAndNavigateDispatch(
      questions,
      insuranceQuestionsMock,
      selectedSlot,
      dispatchMock,
      getStateMock,
      appointmentsStackNavigationMock,
      address
    );

    expect(acceptConsentDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock
    );
  });

  it('dispatches error action on failure', async () => {
    const errorMock = Error('Error creating booking!');
    createBookingDispatchMock.mockImplementationOnce(() => {
      throw errorMock;
    });

    const dispatchMock = jest.fn();
    await createBookingAndNavigateDispatch(
      questions,
      insuranceQuestionsMock,
      selectedSlot,
      dispatchMock,
      getStateMock,
      appointmentsStackNavigationMock,
      address
    );

    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      dispatchMock,
      appointmentsStackNavigationMock
    );
    expect(appointmentsStackNavigationMock.navigate).not.toHaveBeenCalled();
  });
  it('dispatches error action, refresh availability when Api returns not found', async () => {
    const errorMock = new ErrorNotFound('Error creating booking!');
    createBookingDispatchMock.mockImplementationOnce(() => {
      throw errorMock;
    });

    const dispatchMock = jest.fn();
    await createBookingAndNavigateDispatch(
      questions,
      insuranceQuestionsMock,
      selectedSlot,
      dispatchMock,
      getStateMock,
      appointmentsStackNavigationMock,
      address
    );

    expect(getAvailabilityDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      {
        end: '2020-07-31T23:59:59-07:00',
        locationId: '1',
        serviceType: 'service-type',
        start: '2020-07-01T00:00:00-07:00',
      }
    );
    expect(createBookingErrorActionMock).toHaveBeenCalled();
    expect(appointmentsStackNavigationMock.navigate).not.toHaveBeenCalled();
  });

  it('Does not dispatches error action when there is error on refresh availability after create booking Api returns slot not found', async () => {
    const errorMock = new ErrorNotFound('Error creating booking!');
    const errorRefreshMock = new Error('Error refreshing availability!');
    createBookingDispatchMock.mockImplementationOnce(() => {
      throw errorMock;
    });
    getAvailabilityDispatchMock.mockImplementationOnce(() => {
      throw errorRefreshMock;
    });
    const dispatchMock = jest.fn();
    await createBookingAndNavigateDispatch(
      questions,
      insuranceQuestionsMock,
      selectedSlot,
      dispatchMock,
      getStateMock,
      appointmentsStackNavigationMock,
      address
    );

    expect(getAvailabilityDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      {
        end: '2020-07-31T23:59:59-07:00',
        locationId: '1',
        serviceType: 'service-type',
        start: '2020-07-01T00:00:00-07:00',
      }
    );
    expect(createBookingErrorActionMock).not.toHaveBeenCalled();
    expect(appointmentsStackNavigationMock.navigate).not.toHaveBeenCalled();
    expect(handlePostLoginApiErrorsActionMock).toBeCalled();
  });
  it('dispatches error action, when Api returns bad request', async () => {
    const errorMock = new ErrorBadRequest('Some Error!');
    createBookingDispatchMock.mockImplementationOnce(() => {
      throw errorMock;
    });
    createBookingNewDependentErrorActionMock.mockReturnValueOnce(true);
    const dispatchMock = jest.fn();
    await createBookingAndNavigateDispatch(
      questions,
      insuranceQuestionsMock,
      selectedSlot,
      dispatchMock,
      getStateMock,
      appointmentsStackNavigationMock,
      address
    );

    expect(dispatchMock).toHaveBeenCalledWith(true);
    expect(createBookingNewDependentErrorActionMock).toHaveBeenCalledWith(
      errorMock.message
    );
    expect(appointmentsStackNavigationMock.navigate).not.toHaveBeenCalled();
  });
  it('it uses minDate as "start" while refresh availability if minDate is later than start of the month', async () => {
    const errorMock = new ErrorNotFound('Error creating booking!');
    const stateMock = {
      config: {
        apis: {},
      },
      settings: {
        deviceToken: deviceTokenMock,
        token: authTokenMock,
      },
      appointment: {
        selectedLocation: {
          timezone: 'America/New_York',
          id: '1',
          serviceInfo: [{ serviceType: 'service-type' }],
        },
        selectedService: { serviceType: 'service-type' },
        currentMonth: '2020-07-01',
        selectedDate: '2020-07-15',
        minDate: '2020-07-24T12:00:00-04:00',
        maxDate: '2020-09-12T09:48:00-04:00',
        availableSlots: [],
      },
    };
    getStateMock.mockReturnValue({ ...stateMock });
    createBookingDispatchMock.mockImplementationOnce(() => {
      throw errorMock;
    });

    const dispatchMock = jest.fn();
    await createBookingAndNavigateDispatch(
      questions,
      insuranceQuestionsMock,
      selectedSlot,
      dispatchMock,
      getStateMock,
      appointmentsStackNavigationMock,
      address
    );
    expect(acceptConsentDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock
    );
    expect(getAvailabilityDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      {
        end: '2020-07-31T23:59:59-04:00',
        locationId: '1',
        serviceType: 'service-type',
        start: '2020-07-24T12:00:00-04:00',
      }
    );
    expect(createBookingErrorActionMock).toHaveBeenCalled();
    expect(appointmentsStackNavigationMock.navigate).not.toHaveBeenCalled();
  });
  it('it uses start of month as "start" while refresh availability if minDate is before start of the month', async () => {
    const errorMock = new ErrorNotFound('Error creating booking!');
    const stateMock = {
      config: {
        apis: {},
      },
      settings: {
        deviceToken: deviceTokenMock,
        token: authTokenMock,
      },
      appointment: {
        selectedLocation: {
          timezone: 'America/New_York',
          id: '1',
          serviceInfo: [{ serviceType: 'service-type' }],
        },
        selectedService: { serviceType: 'service-type' },
        currentMonth: '2020-07-01',
        selectedDate: '2020-07-15',
        minDate: '2020-06-24T00:00:00-04:00',
        maxDate: '2020-09-12T09:48:00-04:00',
        availableSlots: [],
      },
    };
    getStateMock.mockReturnValue({ ...stateMock });
    createBookingDispatchMock.mockImplementationOnce(() => {
      throw errorMock;
    });

    const dispatchMock = jest.fn();
    await createBookingAndNavigateDispatch(
      questions,
      insuranceQuestionsMock,
      selectedSlot,
      dispatchMock,
      getStateMock,
      appointmentsStackNavigationMock,
      address
    );
    expect(acceptConsentDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock
    );
    expect(getAvailabilityDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      {
        end: '2020-07-31T23:59:59-04:00',
        locationId: '1',
        serviceType: 'service-type',
        start: '2020-07-01T00:00:00-04:00',
      }
    );
    expect(createBookingErrorActionMock).toHaveBeenCalled();
    expect(appointmentsStackNavigationMock.navigate).not.toHaveBeenCalled();
  });
  it('it uses maxDate as "end" while refresh availability if maxDate is before end of the month', async () => {
    const errorMock = new ErrorNotFound('Error creating booking!');
    const stateMock = {
      config: {
        apis: {},
      },
      settings: {
        deviceToken: deviceTokenMock,
        token: authTokenMock,
      },
      appointment: {
        selectedLocation: {
          timezone: 'America/New_York',
          id: '1',
          serviceInfo: [{ serviceType: 'service-type' }],
        },
        selectedService: { serviceType: 'service-type' },
        currentMonth: '2020-09-01',
        selectedDate: '2020-09-15',
        minDate: '2020-07-24T12:00:00-04:00',
        maxDate: '2020-09-17T09:48:00-04:00',
        availableSlots: [],
      },
    };
    getStateMock.mockReturnValue({ ...stateMock });
    createBookingDispatchMock.mockImplementationOnce(() => {
      throw errorMock;
    });

    const dispatchMock = jest.fn();
    await createBookingAndNavigateDispatch(
      questions,
      insuranceQuestionsMock,
      selectedSlot,
      dispatchMock,
      getStateMock,
      appointmentsStackNavigationMock,
      address
    );
    expect(acceptConsentDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock
    );
    expect(getAvailabilityDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      {
        end: '2020-09-17T09:48:00-04:00',
        locationId: '1',
        serviceType: 'service-type',
        start: '2020-09-01T00:00:00-04:00',
      }
    );
    expect(createBookingErrorActionMock).toHaveBeenCalled();
    expect(appointmentsStackNavigationMock.navigate).not.toHaveBeenCalled();
  });
  it('it uses end of month as "end" while refresh availability if maxDate is after end of the month', async () => {
    const errorMock = new ErrorNotFound('Error creating booking!');
    const stateMock = {
      config: {
        apis: {},
      },
      settings: {
        deviceToken: deviceTokenMock,
        token: authTokenMock,
      },
      appointment: {
        selectedLocation: {
          timezone: 'America/New_York',
          id: '1',
          serviceInfo: [{ serviceType: 'service-type' }],
        },
        currentMonth: '2020-08-01',
        selectedService: { serviceType: 'service-type' },
        selectedDate: '2020-08-15',
        minDate: '2020-06-24T00:00:00-04:00',
        maxDate: '2020-09-12T09:48:00-04:00',
        availableSlots: [],
      },
    };
    getStateMock.mockReturnValue({ ...stateMock });
    createBookingDispatchMock.mockImplementationOnce(() => {
      throw errorMock;
    });

    const dispatchMock = jest.fn();
    await createBookingAndNavigateDispatch(
      questions,
      insuranceQuestionsMock,
      selectedSlot,
      dispatchMock,
      getStateMock,
      appointmentsStackNavigationMock,
      address
    );
    expect(acceptConsentDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock
    );
    expect(getAvailabilityDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      {
        end: '2020-08-31T23:59:59-04:00',
        locationId: '1',
        serviceType: 'service-type',
        start: '2020-08-01T00:00:00-04:00',
      }
    );
    expect(createBookingErrorActionMock).toHaveBeenCalled();
    expect(appointmentsStackNavigationMock.navigate).not.toHaveBeenCalled();
  });
});
