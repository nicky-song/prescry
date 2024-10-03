// Copyright 2020 Prescryptive Health, Inc.

import { createBookingDispatch } from './create-booking.dispatch';
import { createBooking } from '../../../api/api-v1.create-booking';
import {
  ICreateBookingRequestBody,
  IMemberAddress,
} from '../../../../../models/api-request-body/create-booking.request-body';
import { IAvailableSlot } from '../../../../../models/api-response/available-slots-response';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { createBookingResponseAction } from '../actions/create-booking-response.action';
import { IAppointmentItem } from '../../../../../models/api-response/appointment.response';
import { getAppointmentDetails } from '../../../api/api-v1.get-appointment-details';
import { GuestExperiencePayments } from '../../../guest-experience-payments';
import { ErrorNotFound } from '../../../../../errors/error-not-found';
import { cancelBooking } from '../../../api/api-v1.cancel-booking';
import { IQuestionAnswer } from '../../../../../models/question-answer';
import { insuranceQuestionsMock } from '../../../appointment-screen/__mocks__/insurance-question-answer.mock';
import { IInsuranceInformation } from '../../../../../models/insurance-card';

jest.mock('../../../api/api-v1.create-booking', () => ({
  createBooking: jest.fn().mockResolvedValue({ data: {} }),
}));
const createBookingMock = createBooking as jest.Mock;

jest.mock('../../settings/dispatch/token-update.dispatch');
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;

jest.mock('../../../api/api-v1.get-appointment-details');
const getAppointmentDetailsMock = getAppointmentDetails as jest.Mock;

jest.mock('../../../api/api-v1.cancel-booking');
const cancelBookingMock = cancelBooking as jest.Mock;

jest.mock('../../../guest-experience-payments');
const redirectToCheckoutMock =
  GuestExperiencePayments.redirectToCheckout as jest.Mock;

const authTokenMock = 'auth_token';
const deviceTokenMock = 'device_token';

const defaultStateMock = {
  appointment: {
    selectedLocation: {
      id: '1',
      serviceInfo: [
        {
          serviceName: 'test-service',
          serviceType: 'COVID-19 Antigen Testing',
          screenDescription: 'Test Desc',
          screenTitle: 'Test Title',
          confirmationDescription: 'conf',
          confirmationTitle: 'conf-title',
          questions: [],
          minLeadDays: 'P6D',
          maxLeadDays: 'P30D',
        },
      ],
    },
    selectedService: {
      serviceName: 'test-service',
      serviceType: 'COVID-19 Antigen Testing',
      screenDescription: 'Test Desc',
      screenTitle: 'Test Title',
      confirmationDescription: 'conf',
      confirmationTitle: 'conf-title',
      questions: [],
      minLeadDays: 'P6D',
      maxLeadDays: 'P30D',
    },
    inviteCode: 'test-invite-code',
    currentSlot: {
      bookingId: 'current-slot-mock-id',
    },
  },
  config: {
    apis: {},
    payments: {},
  },
  settings: {
    deviceToken: deviceTokenMock,
    token: authTokenMock,
    dataRefreshIntervalMilliseconds: 5,
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
  address1: 'address',
  county: 'county',
  state: 'state',
  city: 'city',
  zip: '11111',
};

const inviteCode = 'test-invite-code';

const insuranceInformationMock: IInsuranceInformation = {
  insuranceCard: {
    dateOfBirth: '',
    firstName: '',
    groupId: '',
    lastName: '',
    memberId: '',
    policyId: '',
    payerId: '',
    payerName: '',
    isActive: true,
  },
  policyHolder: {
    policyHolder: 'self',
    policyHolderDOB: '',
    policyHolderFirstName: '',
    policyHolderLastName: '',
  },
};

const createBookingRequestBody = {
  locationId: '1',
  serviceType: 'COVID-19 Antigen Testing',
  start: selectedSlot.start,
  questions: [...questions],
  memberAddress: address,
  inviteCode,
  bookingId: 'current-slot-mock-id',
  insuranceInformation: insuranceInformationMock,
} as ICreateBookingRequestBody;

describe('createBookingDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getStateMock.mockReturnValue(defaultStateMock);
  });

  it('calls createBooking API with expected arguments', async () => {
    const guestExperienceApiMock = 'guestExperienceApiMock';

    const stateMock = {
      ...defaultStateMock,
      config: {
        ...defaultStateMock.config,
        apis: {
          ...defaultStateMock.config.apis,
          guestExperienceApi: guestExperienceApiMock,
        },
      },
    };

    const appointment = {
      serviceName: 'COVID-19 AntiBody Test',
      status: 'Accepted',
      orderNumber: '1234567',
      date: 'date',
      time: 'time',
    } as unknown as IAppointmentItem;

    const appointmentDetails = {
      data: {
        appointment,
      },
    };

    const insuranceQuestions = insuranceQuestionsMock;

    getStateMock.mockReturnValue(stateMock);

    const dispatchMock = jest.fn();
    const createBookingResponseMock = {
      data: {
        appointment: { orderNumber: '1' },
      },
      message: 'all good',
      status: 'ok',
      refreshToken: '123456',
    };
    createBookingMock.mockResolvedValueOnce(createBookingResponseMock);
    getAppointmentDetailsMock.mockResolvedValue(appointmentDetails);
    await createBookingDispatch(
      questions,
      insuranceQuestions,
      selectedSlot,
      dispatchMock,
      getStateMock,
      address
    );

    expect(createBookingMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      createBookingRequestBody,
      authTokenMock,
      deviceTokenMock
    );
  });

  it('calls createBooking API without selected location or selectedService will return undefined', async () => {
    const guestExperienceApiMock = 'guestExperienceApiMock';

    const stateMock = {
      ...defaultStateMock,
      appointment: {},
      config: {
        ...defaultStateMock.config,
        apis: {
          ...defaultStateMock.config.apis,
          guestExperienceApi: guestExperienceApiMock,
        },
      },
    };

    const insuranceQuestions = insuranceQuestionsMock;

    getStateMock.mockReturnValue(stateMock);

    const dispatchMock = jest.fn();
    const orderNumber = await createBookingDispatch(
      questions,
      insuranceQuestions,
      selectedSlot,
      dispatchMock,
      getStateMock
    );

    expect(orderNumber).toBe(undefined);
  });

  it('dispatches createBookingResponse', async () => {
    const appointment = {
      serviceName: 'COVID-19 AntiBody Test',
      status: 'Accepted',
      orderNumber: '1234567',
      date: 'date',
      time: 'time',
    } as unknown as IAppointmentItem;

    const createBookingResponseMock = {
      data: {
        appointment,
      },
      message: 'all good',
      status: 'ok',
      refreshToken: '123456',
    };

    const insuranceQuestions = insuranceQuestionsMock;

    createBookingMock.mockResolvedValue(createBookingResponseMock);

    const dispatchMock = jest.fn();
    const orderInfo = await createBookingDispatch(
      questions,
      insuranceQuestions,
      selectedSlot,
      dispatchMock,
      getStateMock
    );
    const responseAction = createBookingResponseAction(appointment);
    expect(dispatchMock).toHaveBeenCalledWith(responseAction);

    expect(orderInfo).toStrictEqual({
      appointmentId: createBookingResponseMock.data.appointment.orderNumber,
      appointmentLink: undefined,
    });
    expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      createBookingResponseMock.refreshToken
    );
  });

  it('Should retry calling Appointment API when appointmentDetails returns empty object', async () => {
    const guestExperienceApiMock = 'guestExperienceApiMock';

    const payment = {
      clientReferenceId: 'x',
      isPriceActive: true,
      paymentStatus: 'unpaid',
      productPriceId: 'x',
      publicKey: 'x',
      sessionId: 'x',
      unitAmount: 123,
      unitAmountDecimal: '123.00',
    };

    const stateMock = {
      ...defaultStateMock,
      config: {
        apis: {
          guestExperienceApi: guestExperienceApiMock,
        },
        payments: {},
      },
    };

    const emptyAppointmentDetails = {
      data: {},
      message: 'all good',
      status: 'ok',
      refreshToken: '123456',
    };

    const appointment = {
      serviceName: 'COVID-19 AntiBody Test',
      status: 'Accepted',
      orderNumber: '1234567',
      date: 'date',
      time: 'time',
      appointmentLink: 'link',
    } as unknown as IAppointmentItem;

    const appointmentDetails = {
      data: {
        appointment,
      },
    };

    const createBookingResponseMock = {
      data: { appointment, payment },
      message: 'all good',
      status: 'ok',
      refreshToken: '123456',
    };

    const insuranceQuestions = insuranceQuestionsMock;

    createBookingMock.mockResolvedValue(createBookingResponseMock);
    getAppointmentDetailsMock
      .mockResolvedValueOnce(emptyAppointmentDetails)
      .mockResolvedValue(appointmentDetails);
    getStateMock.mockReturnValue(stateMock);

    const dispatchMock = jest.fn();
    const orderInfo = await createBookingDispatch(
      questions,
      insuranceQuestions,
      selectedSlot,
      dispatchMock,
      getStateMock
    );

    const responseAction = createBookingResponseAction(appointment);
    expect(dispatchMock).toHaveBeenCalledWith(responseAction);

    expect(orderInfo).toStrictEqual({
      appointmentId: createBookingResponseMock.data.appointment.orderNumber,
      appointmentLink: appointmentDetails.data.appointment.appointmentLink,
    });
    expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      createBookingResponseMock.refreshToken
    );

    expect(getAppointmentDetailsMock).toHaveBeenNthCalledWith(
      1,
      stateMock.config.apis.guestExperienceApi,
      orderInfo?.appointmentId,
      stateMock.settings.token,
      undefined,
      stateMock.settings.deviceToken
    );
    expect(getAppointmentDetailsMock).toHaveBeenNthCalledWith(
      2,
      stateMock.config.apis.guestExperienceApi,
      orderInfo?.appointmentId,
      stateMock.settings.token,
      undefined,
      stateMock.settings.deviceToken
    );
    expect(getAppointmentDetailsMock).toHaveBeenCalledTimes(2);

    expect(redirectToCheckoutMock).toHaveBeenCalledTimes(1);
  });

  it('Should only call Appointment API once, throwing exception when appointment status is declined', async () => {
    const guestExperienceApiMock = 'guestExperienceApiMock';

    const stateMock = {
      ...defaultStateMock,
      config: {
        apis: {
          guestExperienceApi: guestExperienceApiMock,
        },
        payments: {},
      },
    };

    const appointment = {
      serviceName: 'COVID-19 AntiBody Test',
      status: 'Declined',
      orderNumber: '1234567',
      date: 'date',
      time: 'time',
    } as unknown as IAppointmentItem;

    const appointmentDetails = {
      data: {
        appointment,
      },
    };

    const createBookingResponseMock = {
      data: { appointment },
      message: 'all good',
      status: 'ok',
      refreshToken: '123456',
    };

    const insuranceQuestions = insuranceQuestionsMock;

    createBookingMock.mockResolvedValue(createBookingResponseMock);
    getAppointmentDetailsMock.mockResolvedValue(appointmentDetails);
    getStateMock.mockReturnValue(stateMock);

    const dispatchMock = jest.fn();
    const errorMock = new ErrorNotFound('Not Found');
    try {
      await createBookingDispatch(
        questions,
        insuranceQuestions,
        selectedSlot,
        dispatchMock,
        getStateMock
      );
    } catch (error) {
      expect(error).toEqual(errorMock);
    }

    const responseAction = createBookingResponseAction(appointment);
    expect(dispatchMock).toHaveBeenCalledWith(responseAction);

    expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      createBookingResponseMock.refreshToken
    );

    expect(getAppointmentDetailsMock).toHaveBeenCalledTimes(1);
    expect(redirectToCheckoutMock).not.toHaveBeenCalled();
  });

  it('Should only call cancel booking API once, before throwing exception when appointment status is declined', async () => {
    const guestExperienceApiMock = 'guestExperienceApiMock';

    const stateMock = {
      ...defaultStateMock,
      config: {
        apis: {
          guestExperienceApi: guestExperienceApiMock,
        },
        payments: {},
      },
    };

    const appointment = {
      serviceName: 'COVID-19 AntiBody Test',
      status: 'Declined',
      orderNumber: '1234567',
      date: 'date',
      time: 'time',
    } as unknown as IAppointmentItem;

    const appointmentDetails = {
      data: {
        appointment,
      },
    };

    const createBookingResponseMock = {
      data: { appointment },
      message: 'all good',
      status: 'ok',
      refreshToken: '123456',
    };

    const cancelBookingPropsMock = {
      orderNumber: '1234567',
    };

    const insuranceQuestions = insuranceQuestionsMock;

    createBookingMock.mockResolvedValue(createBookingResponseMock);
    getAppointmentDetailsMock.mockResolvedValue(appointmentDetails);
    getStateMock.mockReturnValue(stateMock);

    const dispatchMock = jest.fn();
    const errorMock = new ErrorNotFound('Not Found');
    try {
      await createBookingDispatch(
        questions,
        insuranceQuestions,
        selectedSlot,
        dispatchMock,
        getStateMock
      );
    } catch (error) {
      expect(error).toEqual(errorMock);
    }

    const responseAction = createBookingResponseAction(appointment);
    expect(dispatchMock).toHaveBeenCalledWith(responseAction);

    expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      createBookingResponseMock.refreshToken
    );

    expect(getAppointmentDetailsMock).toHaveBeenCalledTimes(1);
    expect(cancelBookingMock).toHaveBeenNthCalledWith(
      1,
      stateMock.config.apis.guestExperienceApi,
      cancelBookingPropsMock,
      stateMock.settings.token,
      stateMock.settings.deviceToken
    );
    expect(redirectToCheckoutMock).not.toHaveBeenCalled();
  });
  it('Should throw not found exception if booking status is Cancelled', async () => {
    const guestExperienceApiMock = 'guestExperienceApiMock';

    const stateMock = {
      ...defaultStateMock,
      config: {
        apis: {
          guestExperienceApi: guestExperienceApiMock,
        },
        payments: {},
      },
    };

    const appointment = {
      serviceName: 'COVID-19 AntiBody Test',
      status: 'None',
      bookingStatus: 'Cancelled',
      orderNumber: '1234567',
      date: 'date',
      time: 'time',
    } as unknown as IAppointmentItem;

    const appointmentDetails = {
      data: {
        appointment,
      },
    };

    const createBookingResponseMock = {
      data: { appointment },
      message: 'all good',
      status: 'ok',
      refreshToken: '123456',
    };

    const insuranceQuestions = insuranceQuestionsMock;

    createBookingMock.mockResolvedValue(createBookingResponseMock);
    getAppointmentDetailsMock.mockResolvedValue(appointmentDetails);
    getStateMock.mockReturnValue(stateMock);

    const dispatchMock = jest.fn();
    const errorMock = new ErrorNotFound('Not Found');
    try {
      await createBookingDispatch(
        questions,
        insuranceQuestions,
        selectedSlot,
        dispatchMock,
        getStateMock
      );
    } catch (error) {
      expect(error).toEqual(errorMock);
    }

    const responseAction = createBookingResponseAction(appointment);
    expect(dispatchMock).toHaveBeenCalledWith(responseAction);

    expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      createBookingResponseMock.refreshToken
    );

    expect(getAppointmentDetailsMock).toHaveBeenCalledTimes(1);
    expect(cancelBookingMock).not.toHaveBeenCalled();
    expect(redirectToCheckoutMock).not.toHaveBeenCalled();
  });

  it('Should not return inviteCode if it does not exist', async () => {
    const createBookingRequestNoInviteBody = {
      locationId: '1',
      serviceType: 'COVID-19 Antigen Testing',
      start: selectedSlot.start,
      questions: [...questions],
      memberAddress: address,
      insuranceInformation: insuranceInformationMock,
    } as ICreateBookingRequestBody;
    const createBookingResponseNoInviteMock = {
      data: {
        appointment: { orderNumber: '1' },
      },
      message: 'all good',
      status: 'ok',
      refreshToken: '123456',
    };
    const guestExperienceApiMock = 'guestExperienceApiMock';

    const stateMock = {
      ...defaultStateMock,
      config: {
        ...defaultStateMock.config,
        apis: {
          ...defaultStateMock.config.apis,
          guestExperienceApi: guestExperienceApiMock,
        },
      },
      appointment: {
        selectedLocation: {
          id: '1',
          serviceInfo: [
            {
              serviceName: 'test-service',
              serviceType: 'COVID-19 Antigen Testing',
              screenDescription: 'Test Desc',
              screenTitle: 'Test Title',
              confirmationDescription: 'conf',
              confirmationTitle: 'conf-title',
              questions: [],
              minLeadDays: 'P6D',
              maxLeadDays: 'P30D',
            },
          ],
        },
        selectedService: {
          serviceName: 'test-service',
          serviceType: 'COVID-19 Antigen Testing',
          screenDescription: 'Test Desc',
          screenTitle: 'Test Title',
          confirmationDescription: 'conf',
          confirmationTitle: 'conf-title',
          questions: [],
          minLeadDays: 'P6D',
          maxLeadDays: 'P30D',
        },
      },
    };

    const appointment = {
      serviceName: 'COVID-19 AntiBody Test',
      status: 'Accepted',
      orderNumber: '1234567',
      date: 'date',
      time: 'time',
    } as unknown as IAppointmentItem;

    const appointmentDetails = {
      data: {
        appointment,
      },
    };

    const insuranceQuestions = insuranceQuestionsMock;

    getStateMock.mockReturnValue(stateMock);

    const dispatchMock = jest.fn();
    createBookingMock.mockResolvedValueOnce(createBookingResponseNoInviteMock);
    getAppointmentDetailsMock.mockResolvedValue(appointmentDetails);
    await createBookingDispatch(
      questions,
      insuranceQuestions,
      selectedSlot,
      dispatchMock,
      getStateMock,
      address
    );

    expect(createBookingMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      createBookingRequestNoInviteBody,
      authTokenMock,
      deviceTokenMock
    );
  });
  it('Should return undefined inviteCode if it is undefined', async () => {
    const createBookingRequestNoInviteBody = {
      locationId: '1',
      serviceType: 'COVID-19 Antigen Testing',
      start: selectedSlot.start,
      questions: [...questions],
      memberAddress: address,
      bookingId: 'current-slot-mock-id',
      insuranceInformation: insuranceInformationMock,
    } as ICreateBookingRequestBody;
    const createBookingResponseNoInviteMock = {
      data: {
        appointment: { orderNumber: '1' },
      },
      message: 'all good',
      status: 'ok',
      refreshToken: '123456',
    };
    const guestExperienceApiMock = 'guestExperienceApiMock';

    const stateMock = {
      ...defaultStateMock,
      config: {
        ...defaultStateMock.config,
        apis: {
          ...defaultStateMock.config.apis,
          guestExperienceApi: guestExperienceApiMock,
        },
      },
      appointment: {
        ...defaultStateMock.appointment,
        inviteCode: undefined,
      },
    };

    const appointment = {
      serviceName: 'COVID-19 AntiBody Test',
      status: 'Accepted',
      orderNumber: '1234567',
      date: 'date',
      time: 'time',
    } as unknown as IAppointmentItem;

    const appointmentDetails = {
      data: {
        appointment,
      },
    };

    const insuranceQuestions = insuranceQuestionsMock;

    getStateMock.mockReturnValue(stateMock);

    const dispatchMock = jest.fn();
    createBookingMock.mockResolvedValueOnce(createBookingResponseNoInviteMock);
    getAppointmentDetailsMock.mockResolvedValue(appointmentDetails);
    await createBookingDispatch(
      questions,
      insuranceQuestions,
      selectedSlot,
      dispatchMock,
      getStateMock,
      address
    );

    expect(createBookingMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      createBookingRequestNoInviteBody,
      authTokenMock,
      deviceTokenMock
    );
  });
});
