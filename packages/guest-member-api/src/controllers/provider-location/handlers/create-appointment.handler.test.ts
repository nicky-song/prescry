// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response, Application } from 'express';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '@phx/common/src/errors/error-codes';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { createAppointmentHandler } from './create-appointment.handler';
import {
  IService,
  IServiceQuestion,
  ServiceTypes,
} from '@phx/common/src/models/provider-location';
import { ICheckoutSessionInfo } from '@phx/common/src/models/api-response/create-booking-response';
import { createAppointmentEndpointHelper } from '../helpers/create-appointment-endpoint.helper';
import { allRequiredQuestionsAnswered } from '../helpers/all-required-questions-answered.helper';

import {
  ICreateBookingRequestBody,
  IDependentInformation,
  IMemberAddress,
} from '@phx/common/src/models/api-request-body/create-booking.request-body';
import { IQuestionAnswer } from '@phx/common/src/models/question-answer';
import { buildPersonDetails } from '../helpers/build-person-details';
import { getNext } from '../../../utils/redis/redis-order-number.helper';
import { setUpLogger } from '../../../utils/server-helper';
import { buildDependentPersonDetails } from '../helpers/build-dependent-person-details';
import { IPerson } from '@phx/common/src/models/person';
import { StringFormatter } from '@phx/common/src/utils/formatters/string.formatter';
import * as PersonQueryHelper from '../../../utils/person/get-logged-in-person.helper';
import * as CreateCheckoutHelper from '../handlers/create-booking-checkout-session-info';
import * as FetchRequestHeader from '../../../utils/request-helper';
import { getProviderLocationByIdAndServiceType } from '../helpers/get-provider-location-by-id-and-service-type.helper';
import {
  providerLocationResponseWithServiceTypeFilterMock,
  providerLocationResponseWithVaccineServiceFilterMock,
} from '../../../mock-data/provider-location.mock';
import { configurationMock } from '../../../mock-data/configuration.mock';
import {
  KnownFailureResponse,
  SuccessResponse,
} from '../../../utils/response-helper';
import { createAcceptanceTextMessage } from '../helpers/create-appointment-event.helper';
import { getSessionIdFromRequest } from '../../../utils/health-record-event/get-sessionid-from-request';
import { encodeAscii } from '@phx/common/src/utils/base-64-helper';
import { getNewDate } from '@phx/common/src/utils/date-time/get-new-date';
import { isDepdendentValid } from '../helpers/is-dependent-valid';

jest.mock('../helpers/create-appointment-endpoint.helper');
jest.mock('../helpers/all-required-questions-answered.helper');
jest.mock('../../../utils/redis/redis-order-number.helper');
jest.mock('../../../utils/custom-event-helper', () => ({
  logRedisEventInAppInsight: jest.fn(),
}));
jest.mock('../../../utils/person/get-logged-in-person.helper');

jest.mock('../../../utils/response-helper');
jest.mock('../helpers/get-provider-location-by-id-and-service-type.helper');
jest.mock('../helpers/create-appointment-event.helper');
jest.mock('../helpers/build-dependent-person-details');
jest.mock('../helpers/build-person-details');
jest.mock('../../../utils/health-record-event/get-sessionid-from-request');
jest.mock('@phx/common/src/utils/base-64-helper');

jest.mock('@phx/common/src/utils/date-time/get-new-date');
const getNewDateMock = getNewDate as jest.Mock;

jest.mock('../helpers/is-dependent-valid');
const isDepdendentValidMock = isDepdendentValid as jest.Mock;

const encodeAsciiMock = encodeAscii as jest.Mock;

const createAcceptanceTextMessageMock =
  createAcceptanceTextMessage as jest.Mock;

const getNextMock = getNext as jest.Mock;
const getProviderLocationByIdAndServiceTypeMock =
  getProviderLocationByIdAndServiceType as jest.Mock;

const getSessionIdFromRequestMock = getSessionIdFromRequest as jest.Mock;
const server = {
  use: jest.fn(),
} as unknown as Application;

const appointmentLinkMock = 'appointmentLinkMock';

const cashPersonInfo = {
  phoneNumber: '1234567890',
  firstName: 'first',
  lastName: 'last',
  effectiveDate: '2000-01-01',
  identifier: '',
  rxSubGroup: 'CASH01',
  rxGroup: '200P32F',
  primaryMemberRxId: 'primaryMemberRxId',
  primaryMemberFamilyId: 'memberFamilyId',
  rxGroupType: 'CASH',
  rxBin: '610749',
  carrierPCN: 'X01',
  isPhoneNumberVerified: true,
  isPrimary: true,
  email: '',
  primaryMemberPersonCode: 'memberPersonCode',
  address1: 'personaddr1',
  address2: 'personaddr2',
  county: 'fakecounty',
  state: 'WA',
  zip: '1111',
  city: 'fakecity',
  isTestMembership: false,
  dateOfBirth: '2000-02-02',
} as IPerson;

const validAddress = {
  address1: 'personaddr1',
  address2: 'personaddr2',
  county: 'fakecounty',
  state: 'wa',
  zip: '11111',
  city: 'fakecity',
} as IMemberAddress;

const InValidAddress = {
  address1: 'personaddr1',
};

setUpLogger(server, configurationMock);

const KnownFailureResponseMock = KnownFailureResponse as jest.Mock;
const successResponseMock = SuccessResponse as jest.Mock;
const createAppointmentEndpointHelperMock =
  createAppointmentEndpointHelper as jest.Mock;

const allRequiredQuestionsAnsweredMock =
  allRequiredQuestionsAnswered as jest.Mock;
const buildPersonDetailsMock = buildPersonDetails as jest.Mock;

const buildDependentPersonDetailsMock =
  buildDependentPersonDetails as jest.Mock;

const getAllRecordsForLoggedInPersonSpy = jest.spyOn(
  PersonQueryHelper,
  'getAllRecordsForLoggedInPerson'
) as jest.Mock;

const createBookingPaymentCheckoutSessionIfNecessary = jest.spyOn(
  CreateCheckoutHelper,
  'createBookingPaymentCheckoutSessionIfNecessary'
);

const fetchRequestHeader = jest.spyOn(FetchRequestHeader, 'fetchRequestHeader');
const databaseMock = {} as IDatabase;
const responseMock = {} as Response;

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  jest.clearAllMocks();
  createBookingPaymentCheckoutSessionIfNecessary.mockReset();
  buildPersonDetailsMock.mockResolvedValue(cashPersonInfo);
  getNextMock.mockReset().mockResolvedValue('5');
  getAllRecordsForLoggedInPersonSpy.mockReset();
  getProviderLocationByIdAndServiceTypeMock.mockReset();
  getProviderLocationByIdAndServiceTypeMock.mockReturnValue(
    providerLocationResponseWithServiceTypeFilterMock
  );
  createAcceptanceTextMessageMock.mockReturnValueOnce('some-text');
  getSessionIdFromRequestMock.mockReturnValue('operation-id');
  getNewDateMock.mockReturnValue(new Date());
});

describe('createAppointmentHandler failure cases', () => {
  test.each([undefined, ''])(
    'should fail if bookingId empty or undefined. BookingId is %s',
    async (bookingId) => {
      const requestMock = {
        body: {
          locationId: 'location',
          bookingId,
        },
      } as Request;
      await createAppointmentHandler(
        requestMock,
        responseMock,
        databaseMock,
        configurationMock
      );

      expect(KnownFailureResponse).toHaveBeenNthCalledWith(
        1,
        responseMock,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.MISSING_BOOKINGID
      );
      expect(getProviderLocationByIdAndServiceTypeMock).not.toBeCalled();
    }
  );

  it('should fail if provider is not found', async () => {
    const requestMock = {
      body: {
        locationId: 'location',
        bookingId: 'bookingId',
        ServiceType: 'service-type',
      },
    } as Request;

    const apiError = {
      message:
        'ProviderLocation with requested identifier location is not found.',
      errorCode: 404,
    };
    getProviderLocationByIdAndServiceTypeMock.mockResolvedValue(apiError);

    await createAppointmentHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock
    );

    expect(getProviderLocationByIdAndServiceTypeMock).toHaveBeenCalledWith(
      configurationMock,
      requestMock.body.locationId,
      requestMock.body.serviceType
    );
    expect(KnownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      HttpStatusCodes.NOT_FOUND,
      apiError.message
    );
  });
  it('should fail if invalid serviceType was provided', async () => {
    const providerLocationMock = {
      ...providerLocationResponseWithServiceTypeFilterMock,
      service: undefined,
    };

    const requestMock = {
      body: {
        locationId: 'location',
        serviceType: 'service_type',
        bookingId: 'bookingId',
      },
    } as Request;

    getProviderLocationByIdAndServiceTypeMock.mockReturnValueOnce(
      providerLocationMock
    );
    await createAppointmentHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock
    );

    expect(getProviderLocationByIdAndServiceTypeMock).toHaveBeenCalledWith(
      configurationMock,
      requestMock.body.locationId,
      requestMock.body.serviceType
    );
    expect(KnownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      HttpStatusCodes.NOT_FOUND,
      StringFormatter.format(
        ErrorConstants.SERVICE_TYPE_NOT_FOUND,
        new Map<string, string>([
          ['locationId', requestMock.body.locationId],
          ['serviceType', requestMock.body.serviceType],
        ])
      )
    );
  });

  it('should fail if invalid serviceType for location was provided', async () => {
    const providerLocationWithNoServicesMock = {
      location: {
        identifier: 'id-1',
        providerInfo: {
          providerName: 'provider-name',
        },
        locationName: 'test-location',
        address1: 'mock-address1',
        address2: 'mock-address2',
        city: 'mock-city',
        state: 'mock-state',
        zip: 'mock-zip',
        phoneNumber: 'mock-phone',
        timezone: 'America/Los_Angeles',
        enabled: true,
        providerTaxId: 'provider-tax-id',
        serviceList: [],
        latitude: 40.694214,
        longitude: -73.96529,
        isTest: false,
      },
      message: 'success',
    };

    getProviderLocationByIdAndServiceTypeMock.mockReturnValueOnce(
      providerLocationWithNoServicesMock
    );

    const requestMock = {
      body: {
        locationId: 'location',
        serviceType: 'service_type',
        bookingId: 'bookingId',
      },
    } as Request;

    await createAppointmentHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock
    );

    expect(KnownFailureResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      HttpStatusCodes.NOT_FOUND,
      StringFormatter.format(
        ErrorConstants.SERVICE_TYPE_NOT_FOUND,
        new Map<string, string>([
          ['locationId', requestMock.body.locationId],
          ['serviceType', requestMock.body.serviceType],
        ])
      )
    );
  });

  it('should fail if answers are not valid', async () => {
    const answers = [] as IQuestionAnswer[];
    const questions = [] as IServiceQuestion[];
    const service = { serviceType: 'service_type', questions } as IService;

    allRequiredQuestionsAnsweredMock.mockReturnValue(false);

    const requestMock = {
      body: {
        locationId: 'locationId',
        serviceType: 'COVID-19 Antigen Testing',
        questions: answers,
        bookingId: 'bookingId',
      } as ICreateBookingRequestBody,
    } as Request;

    await createAppointmentHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock
    );

    expect(allRequiredQuestionsAnswered).toHaveBeenNthCalledWith(
      1,
      service.questions,
      answers
    );
    expect(KnownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.INVALID_ANSWERS
    );
  });

  it('should fail if request does not have person info and memberAddress is not provided in request', async () => {
    const answers = [] as IQuestionAnswer[];
    const questions = [] as IServiceQuestion[];
    const service = {
      duration: 15,
      questions,
      serviceType: 'COVID-19 Antigen Testing',
      serviceName: 'fake-name',
    } as IService;

    allRequiredQuestionsAnsweredMock.mockReturnValue(true);

    const requestMock = {
      body: {
        serviceType: service.serviceType,
        questions: answers,
        locationId: 'location_id',
        start: 'starttime',
        bookingId: 'bookingId',
      } as ICreateBookingRequestBody,
    } as Request;

    await createAppointmentHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock
    );

    expect(KnownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.MISSING_ADDRESS
    );
    expect(createAppointmentEndpointHelperMock).not.toBeCalled();
  });

  it('should fail if request does not have person info and memberAddress is not valid in request', async () => {
    const answers = [] as IQuestionAnswer[];
    const questions = [] as IServiceQuestion[];
    const service = {
      duration: 15,
      questions,
      serviceType: 'COVID-19 Antigen Testing',
      serviceName: 'service_name',
    } as IService;

    const requestMock = {
      body: {
        serviceType: service.serviceType,
        questions: answers,
        locationId: 'location_id',
        start: 'starttime',
        memberAddress: InValidAddress,
        bookingId: 'bookingId',
      } as ICreateBookingRequestBody,
    } as Request;

    allRequiredQuestionsAnsweredMock.mockReturnValue(true);

    await createAppointmentHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock
    );

    expect(KnownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.MISSING_ADDRESS
    );
    expect(createAppointmentEndpointHelperMock).not.toBeCalled();
  });

  it('should fail if appointment is for service other than vaccine and age requirements are not met', async () => {
    const response = {
      locals: {
        personInfo: { rxGroupType: 'CASH' },
        account: { dateOfBirth: '2007-02-02' },
      },
    } as unknown as Response;
    const answers = [] as IQuestionAnswer[];
    const questions = [] as IServiceQuestion[];
    const service = {
      duration: 15,
      questions,
      serviceName: 'service_name',
      serviceType: ServiceTypes.antigen,
    } as IService;
    const body = {
      serviceType: service.serviceType,
      questions: answers,
      locationId: 'location_id',
      start: 'starttime',
      memberAddress: validAddress,
      bookingId: 'bookingId',
    } as ICreateBookingRequestBody;
    const request = {
      body,
    } as Request;

    allRequiredQuestionsAnsweredMock.mockReturnValue(true);

    await createAppointmentHandler(
      request,
      response,
      databaseMock,
      configurationMock
    );

    expect(KnownFailureResponseMock).toHaveBeenCalledWith(
      response,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.SCHEDULER_AGE_REQUIREMENT_NOT_MET
    );
    expect(createAppointmentEndpointHelperMock).not.toBeCalled();
  });
  it('should fail if appointment is for vaccine and age requirements are not met', async () => {
    const response = {
      locals: {
        personInfo: { rxGroupType: 'CASH' },
        account: { dateOfBirth: '2007-02-02' },
      },
    } as unknown as Response;
    const answers = [] as IQuestionAnswer[];
    const questions = [] as IServiceQuestion[];
    const service = {
      duration: 15,
      questions,
      serviceName: 'service_name',
      serviceType: ServiceTypes.c19VaccineDose1,
    } as IService;
    const body = {
      serviceType: service.serviceType,
      questions: answers,
      locationId: 'location_id',
      start: 'starttime',
      memberAddress: validAddress,
      bookingId: 'bookingId',
    } as ICreateBookingRequestBody;
    const request = {
      body,
    } as Request;

    getProviderLocationByIdAndServiceTypeMock.mockReturnValueOnce(
      providerLocationResponseWithVaccineServiceFilterMock
    );

    allRequiredQuestionsAnsweredMock.mockReturnValue(true);
    await createAppointmentHandler(
      request,
      response,
      databaseMock,
      configurationMock
    );

    expect(KnownFailureResponseMock).toHaveBeenCalledWith(
      response,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.SCHEDULER_AGE_REQUIREMENT_NOT_MET
    );
    expect(createAppointmentEndpointHelperMock).not.toBeCalled();
  });
  it('should fail if create booking returns an errorCode', async () => {
    const switches = '?f=test:1,test2:2';
    const response = {
      locals: {
        personList: [cashPersonInfo],
        account: { dateOfBirth: '2000-02-02' },
        accountIdentifier: 'accountIdentifier',
      },
    } as unknown as Response;
    const answers = [] as IQuestionAnswer[];
    const questions = [] as IServiceQuestion[];
    const service = {
      duration: 15,
      questions,
      serviceName: 'service_name',
      serviceType: ServiceTypes.antigen,
    } as IService;
    const body = {
      serviceType: service.serviceType,
      questions: answers,
      locationId: 'location_id',
      start: '2021-06-14',
      memberAddress: validAddress,
      bookingId: 'bookingId',
    } as ICreateBookingRequestBody;
    const request = {
      body,
    } as Request;

    allRequiredQuestionsAnsweredMock.mockReturnValue(true);
    const invalidResponse = {
      errorCode: 999,
      message: 'failed',
    };

    createAppointmentEndpointHelperMock.mockResolvedValue(invalidResponse);
    getAllRecordsForLoggedInPersonSpy.mockReturnValueOnce([cashPersonInfo]);
    const payment = {} as ICheckoutSessionInfo;
    createBookingPaymentCheckoutSessionIfNecessary.mockResolvedValue(payment);
    fetchRequestHeader.mockReturnValue(switches);
    await createAppointmentHandler(
      request,
      response,
      databaseMock,
      configurationMock
    );

    expect(KnownFailureResponseMock).toHaveBeenCalledWith(
      response,
      invalidResponse.errorCode,
      invalidResponse.message
    );

    expect(createAppointmentEndpointHelperMock).toHaveBeenNthCalledWith(
      1,
      configurationMock.pharmacyPortalApiUrl,
      {
        memberFamilyId: 'memberFamilyId',
        memberPersonCode: 'memberPersonCode',
        accountIdentifier: 'accountIdentifier',
        orderNumber: '5',
        tags: ['primaryMemberRxId'],
        customerName: 'first last',
        customerPhone: '1234567890',
        bookingId: request.body.bookingId,
        memberRxId: 'primaryMemberRxId',
        questions: [],
        serviceType: service.serviceType,
        isTestAppointment: false,
        isDependentAppointment: false,
        sessionId: 'operation-id',
        productPriceId: payment?.productPriceId ?? '',
        unitAmount: 0,
        isTestPayment: false,
        stripeSessionId: '',
        stripeClientReferenceId: '',
        providerLocationId:
          providerLocationResponseWithServiceTypeFilterMock.location
            ?.identifier,
        acceptMessageText: expect.any(String),
      },
      configurationMock.pharmacyPortalApiTenantId,
      configurationMock.pharmacyPortalApiClientId,
      configurationMock.pharmacyPortalApiClientSecret,
      configurationMock.pharmacyPortalApiScope
    );
  });
});

describe('createAppointmentHandler success', () => {
  const switches = '?f=test:1,test2:2';
  fetchRequestHeader.mockReturnValue(switches);

  const answers = [] as IQuestionAnswer[];
  const questions = [] as IServiceQuestion[];

  it('should call create appointment endpoint helper to create appointment', async () => {
    encodeAsciiMock.mockReturnValue(appointmentLinkMock);
    const response = {
      locals: {
        personList: [cashPersonInfo],
        account: { dateOfBirth: '2000-02-02' },
        accountIdentifier: 'accountIdentifier',
      },
    } as unknown as Response;

    const service = {
      duration: 15,
      questions,
      serviceType: ServiceTypes.antigen,
      serviceName: 'service_name',
    } as IService;
    const body = {
      experienceBaseUrl: 'https://myrx.io',
      locationId: 'location_id',
      questions: answers,
      serviceType: service.serviceType,
      start: '2020-06-23T13:00:00',
      memberAddress: validAddress,
      bookingId: 'bookingId',
    } as ICreateBookingRequestBody;
    const request = {
      body,
    } as Request;

    allRequiredQuestionsAnsweredMock.mockReturnValue(true);
    createAppointmentEndpointHelperMock.mockResolvedValue({
      errorCode: undefined,
      message: '',
    });

    await createAppointmentHandler(
      request,
      response,
      databaseMock,
      configurationMock
    );
    expect(buildPersonDetailsMock).toBeCalledWith(request, response);
    expect(successResponseMock).toHaveBeenNthCalledWith(
      1,
      response,
      SuccessConstants.SUCCESS_OK,
      {
        appointment: {
          address1: 'mock-address1',
          address2: 'mock-address2',
          bookingStatus: 'Requested',
          city: 'mock-city',
          customerDateOfBirth: '2000-02-02',
          customerName: 'first last',
          date: 'June 23',
          locationName: 'provider-name',
          orderNumber: '5',
          paymentStatus: 'no_payment_required',
          procedureCode: '87811',
          providerTaxId: 'provider-tax-id',
          serviceDescription: 'service-desc',
          serviceName: 'fake-name',
          serviceType: ServiceTypes.antigen,
          startInUtc: expect.anything(),
          state: 'mock-state',
          status: 'None',
          time: '1:00 pm',
          zip: 'mock-zip',
          additionalInfo: undefined,
          confirmationDescription: 'confirm-desc',
          cancellationPolicy: 'cancellation policy text',
          appointmentLink: appointmentLinkMock,
        },
      }
    );
    expect(buildDependentPersonDetails).not.toHaveBeenCalled();
  });

  it('should create vaccine appointment for user if it is self appointment and user is 18 or more', async () => {
    const response = {
      locals: {
        personList: [cashPersonInfo],
        accountIdentifier: 'accountIdentifier',
        account: { dateOfBirth: '2000-02-02' },
      },
    } as unknown as Response;
    const service = {
      duration: 15,
      questions,
      serviceName: 'service_name',
      serviceType: ServiceTypes.c19VaccineDose1,
    } as IService;
    const body = {
      experienceBaseUrl: 'https://myrx.io',
      locationId: 'location_id',
      questions: answers,
      serviceType: service.serviceType,
      start: '2020-06-23T00:00:00',
      memberAddress: {
        address1: 'addr1',
        city: 'city',
        state: 'state',
        county: 'county',
        zip: '11111',
      },
      bookingId: 'bookingId',
    } as ICreateBookingRequestBody;
    const request = {
      body,
    } as Request;

    getProviderLocationByIdAndServiceTypeMock.mockReturnValueOnce(
      providerLocationResponseWithVaccineServiceFilterMock
    );
    allRequiredQuestionsAnsweredMock.mockReturnValue(true);
    createAppointmentEndpointHelperMock.mockResolvedValue({
      errorCode: undefined,
      message: '',
    });

    await createAppointmentHandler(
      request,
      response,
      databaseMock,
      configurationMock
    );
    expect(buildPersonDetailsMock).toBeCalledWith(request, response);
    expect(successResponseMock).toHaveBeenNthCalledWith(
      1,
      response,
      SuccessConstants.SUCCESS_OK,
      expect.anything()
    );
    expect(buildDependentPersonDetails).not.toHaveBeenCalled();
  });

  it('should send invite code for vaccination invitation appointment', async () => {
    const service = {
      duration: 15,
      questions,
      serviceName: 'service_name',
      serviceType: ServiceTypes.c19VaccineDose1,
    } as IService;

    const response = {
      locals: {
        personInfo: {
          rxGroupType: 'CASH',
        },
        account: { dateOfBirth: '2000-02-02' },
        accountIdentifier: 'accountIdentifier',
      },
    } as unknown as Response;

    createAppointmentEndpointHelperMock.mockResolvedValue({
      errorCode: undefined,
      message: '',
    });

    const body = {
      experienceBaseUrl: 'https://myrx.io',
      locationId: 'location_id',
      questions: answers,
      serviceType: service.serviceType,
      start: '2020-06-23T13:00:00',
      memberAddress: validAddress,
      bookingId: 'bookingId',
      inviteCode: 'invitecode',
    } as ICreateBookingRequestBody;
    const request = {
      body,
    } as Request;

    allRequiredQuestionsAnsweredMock.mockReturnValue(true);

    getProviderLocationByIdAndServiceTypeMock.mockResolvedValueOnce(
      providerLocationResponseWithVaccineServiceFilterMock
    );

    await createAppointmentHandler(
      request,
      response,
      databaseMock,
      configurationMock
    );

    expect(createAppointmentEndpointHelperMock).toHaveBeenNthCalledWith(
      1,
      configurationMock.pharmacyPortalApiUrl,
      expect.objectContaining({
        inviteCode: 'invitecode',
      }),
      configurationMock.pharmacyPortalApiTenantId,
      configurationMock.pharmacyPortalApiClientId,
      configurationMock.pharmacyPortalApiClientSecret,
      configurationMock.pharmacyPortalApiScope
    );
  });
});

describe('createAppointmentHandler failure cases for dependents', () => {
  it('should fail if dependent identifier is not in allowed list of dependents', async () => {
    const response = {
      locals: {
        personInfo: {},
        dependents: [{ identifier: 'id-2' }],
        account: { dateOfBirth: '2000-02-02' },
      },
    } as unknown as Response;
    const answers = [] as IQuestionAnswer[];
    const questions = [] as IServiceQuestion[];
    const service = {
      duration: 15,
      questions,
      serviceType: ServiceTypes.antigen,
      serviceName: 'service_name',
    } as IService;
    const body = {
      experienceBaseUrl: 'https://myrx.io',
      locationId: 'location_id',
      questions: answers,
      serviceType: service.serviceType,
      start: '2020-06-23T13:00:00',
      dependentInfo: {
        identifier: 'id-1',
      },
      memberAddress: validAddress,
      bookingId: 'bookingId',
    } as ICreateBookingRequestBody;
    const request = {
      body,
    } as Request;

    const database = {} as IDatabase;

    allRequiredQuestionsAnsweredMock.mockReturnValue(true);

    await createAppointmentHandler(
      request,
      response,
      database,
      configurationMock
    );

    expect(getProviderLocationByIdAndServiceTypeMock).toHaveBeenCalledWith(
      configurationMock,
      request.body.locationId,
      request.body.serviceType
    );
    expect(KnownFailureResponseMock).toHaveBeenCalledWith(
      response,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.INVALID_DEPENDENT_IDENTIFIER
    );
    expect(getNextMock).not.toHaveBeenCalled();
  });
  it('should fail if dependent information is not valid', async () => {
    const response = {
      locals: {
        personInfo: {},
        dependents: [{ identifier: 'id-2' }],
        account: { dateOfBirth: '2000-02-02' },
      },
    } as unknown as Response;
    const answers = [] as IQuestionAnswer[];
    const questions = [] as IServiceQuestion[];
    const service = {
      duration: 15,
      questions,
      serviceType: ServiceTypes.antigen,
      serviceName: 'fake-name',
    } as IService;
    const body = {
      experienceBaseUrl: 'https://myrx.io',
      locationId: 'location_id',
      questions: answers,
      serviceType: service.serviceType,
      start: '2020-06-23T13:00:00',
      dependentInfo: {
        firstName: 'dep-name',
      },
      memberAddress: validAddress,
      bookingId: 'bookingId',
    } as ICreateBookingRequestBody;
    const request = {
      body,
    } as Request;
    const database = {} as IDatabase;

    allRequiredQuestionsAnsweredMock.mockReturnValue(true);

    await createAppointmentHandler(
      request,
      response,
      database,
      configurationMock
    );

    expect(getProviderLocationByIdAndServiceTypeMock).toHaveBeenCalledWith(
      configurationMock,
      request.body.locationId,
      request.body.serviceType
    );
    expect(KnownFailureResponseMock).toHaveBeenCalledWith(
      response,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.MISSING_DEPENDENT_INFORMATION
    );
    expect(getNextMock).not.toHaveBeenCalled();
  });
  it('should fail if serviceType is not vaccine and dependent age is not valid', async () => {
    const response = {
      locals: {
        personInfo: {},
        dependents: [{ identifier: 'id-2' }],
        account: { dateOfBirth: '2000-02-02' },
      },
    } as unknown as Response;
    const answers = [] as IQuestionAnswer[];
    const questions = [] as IServiceQuestion[];
    const service = {
      duration: 15,
      questions,
      serviceName: 'service_name',
      serviceType: ServiceTypes.antigen,
    } as IService;
    const dateMock = new Date('Sep 22 2020');
    getNewDateMock.mockReturnValue(dateMock);
    const body = {
      experienceBaseUrl: 'https://myrx.io',
      locationId: 'location_id',
      questions: answers,
      serviceType: service.serviceType,
      start: '2020-06-23T13:00:00',
      dependentInfo: {
        firstName: 'dep-name',
        lastName: 'dep-name',
        dateOfBirth: 'September-22-2019',
        addressSameAsParent: true,
      },
      memberAddress: validAddress,
      bookingId: 'bookingId',
    } as ICreateBookingRequestBody;
    const request = {
      body,
    } as Request;
    const database = {} as IDatabase;
    allRequiredQuestionsAnsweredMock.mockReturnValue(true);
    isDepdendentValidMock.mockReturnValue(false);

    await createAppointmentHandler(
      request,
      response,
      database,
      configurationMock
    );

    expect(getProviderLocationByIdAndServiceTypeMock).toHaveBeenCalledWith(
      configurationMock,
      request.body.locationId,
      request.body.serviceType
    );
    expect(KnownFailureResponseMock).toHaveBeenCalledWith(
      response,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.MISSING_DEPENDENT_INFORMATION
    );
    expect(getNextMock).not.toHaveBeenCalled();
  });
  it('should fail if serviceType is covid vaccine and dependent age is not valid', async () => {
    const response = {
      locals: {
        personInfo: {},
        dependents: [{ identifier: 'id-2' }],
        account: { dateOfBirth: '2000-02-02' },
      },
    } as unknown as Response;
    const answers = [] as IQuestionAnswer[];
    const questions = [] as IServiceQuestion[];
    const service = {
      duration: 15,
      questions,
      serviceName: 'service_name',
      serviceType: ServiceTypes.c19VaccineDose1,
    } as IService;
    const dateMock = new Date('Sep 22 2020');
    getNewDateMock.mockReturnValue(dateMock);
    const body = {
      experienceBaseUrl: 'https://myrx.io',
      locationId: 'location_id',
      questions: answers,
      serviceType: service.serviceType,
      start: '2020-06-23T13:00:00',
      dependentInfo: {
        firstName: 'dep-name',
        lastName: 'dep-name',
        dateOfBirth: 'September-22-2019',
        addressSameAsParent: true,
      },
      memberAddress: validAddress,
      bookingId: 'bookingId',
    } as ICreateBookingRequestBody;
    const request = {
      body,
    } as Request;

    const database = {} as IDatabase;
    allRequiredQuestionsAnsweredMock.mockReturnValue(true);

    getProviderLocationByIdAndServiceTypeMock.mockReturnValueOnce(
      providerLocationResponseWithVaccineServiceFilterMock
    );
    await createAppointmentHandler(
      request,
      response,
      database,
      configurationMock
    );
    expect(getProviderLocationByIdAndServiceTypeMock).toHaveBeenCalledWith(
      configurationMock,
      request.body.locationId,
      request.body.serviceType
    );
    expect(KnownFailureResponseMock).toHaveBeenCalledWith(
      response,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.MISSING_DEPENDENT_INFORMATION
    );
    expect(getNextMock).not.toHaveBeenCalled();
  });
  it('should fail if serviceType is covid vaccine and its existing dependent and not meeting 18 year criteria', async () => {
    const response = {
      locals: {
        personList: [cashPersonInfo],
        dependents: [
          {
            identifier: 'id-2',
            dateOfBirth: '2010-02-02',
            rxGroupType: 'CASH',
          },
        ],
        account: { dateOfBirth: '2000-02-02' },
        accountIdentifier: 'accountIdentifier',
      },
    } as unknown as Response;
    const answers = [] as IQuestionAnswer[];
    const questions = [] as IServiceQuestion[];
    const service = {
      duration: 15,
      questions,
      serviceName: 'service_name',
      serviceType: ServiceTypes.c19VaccineDose1,
    } as IService;
    const body = {
      experienceBaseUrl: 'https://myrx.io',
      locationId: 'location_id',
      questions: answers,
      serviceType: service.serviceType,
      start: '2020-06-23T13:00:00',
      dependentInfo: {
        identifier: 'id-2',
      },
      memberAddress: validAddress,
      bookingId: 'bookingId',
    } as ICreateBookingRequestBody;
    const request = {
      body,
    } as Request;

    const database = {} as IDatabase;
    allRequiredQuestionsAnsweredMock.mockReturnValue(true);
    getProviderLocationByIdAndServiceTypeMock.mockReturnValueOnce(
      providerLocationResponseWithVaccineServiceFilterMock
    );

    await createAppointmentHandler(
      request,
      response,
      database,
      configurationMock
    );

    expect(getProviderLocationByIdAndServiceTypeMock).toHaveBeenCalledWith(
      configurationMock,
      request.body.locationId,
      request.body.serviceType
    );
    expect(KnownFailureResponseMock).toHaveBeenCalledWith(
      response,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.AGE_REQUIREMENT_NOT_MET_VACCINE
    );
    expect(getNextMock).not.toHaveBeenCalled();
  });
});

describe('createAppointmentHandler success cases for dependents', () => {
  const questions = [] as IServiceQuestion[];
  const service = {
    duration: 15,
    questions,
    serviceType: ServiceTypes.antigen,
    serviceName: 'fake-name',
  } as IService;

  const answers = [] as IQuestionAnswer[];

  it('should return success if identifier is in allowed list of dependents', async () => {
    const existDependentInfo = {
      identifier: 'id-1',
      firstName: 'dep first-name',
      lastName: 'dep lastname',
      rxGroupType: 'CASH',
    };
    const response = {
      locals: {
        personList: [cashPersonInfo],
        dependents: [existDependentInfo],
        account: { dateOfBirth: '2000-02-02' },
        accountIdentifier: 'accountIdentifier',
      },
    } as unknown as Response;
    const body = {
      experienceBaseUrl: 'https://myrx.io',
      locationId: 'location_id',
      questions: answers,
      serviceType: service.serviceType,
      start: '2020-06-23T13:00:00',
      dependentInfo: {
        identifier: 'id-1',
      },
      memberAddress: validAddress,
      bookingId: 'bookingId',
    } as ICreateBookingRequestBody;
    const request = {
      body,
    } as Request;
    const database = {} as IDatabase;

    createAppointmentEndpointHelperMock.mockResolvedValue({
      errorCode: undefined,
      message: '',
    });
    buildDependentPersonDetailsMock.mockResolvedValueOnce(existDependentInfo);

    allRequiredQuestionsAnsweredMock.mockReturnValue(true);
    await createAppointmentHandler(
      request,
      response,
      database,
      configurationMock
    );
    expect(buildDependentPersonDetailsMock).toHaveBeenNthCalledWith(
      1,
      { identifier: 'id-1' },
      database,
      cashPersonInfo,
      100,
      existDependentInfo
    );
    expect(getNextMock).toHaveBeenCalled();
    expect(successResponseMock).toHaveBeenNthCalledWith(
      1,
      response,
      SuccessConstants.SUCCESS_OK,
      expect.anything()
    );
  });
  it('should create appointment for new dependent if dependent information provided is valid', async () => {
    const response = {
      locals: {
        personList: [cashPersonInfo],
        dependents: [{ identifier: 'id-2' }],
        account: { dateOfBirth: '2000-02-02' },
        accountIdentifier: 'accountIdentifier',
      },
    } as unknown as Response;
    const dependentInfo: IDependentInformation = {
      firstName: 'dep-name',
      lastName: 'dep-name',
      dateOfBirth: 'September-22-2017',
      addressSameAsParent: true,
    };
    const body = {
      experienceBaseUrl: 'https://myrx.io',
      locationId: 'location_id',
      questions: answers,
      serviceType: service.serviceType,
      start: '2020-06-23T13:00:00',
      dependentInfo,
      memberAddress: validAddress,
      bookingId: 'bookingId',
    } as ICreateBookingRequestBody;
    const request = {
      body,
    } as Request;
    const database = {} as IDatabase;
    createAppointmentEndpointHelperMock.mockResolvedValue({
      errorCode: undefined,
      message: '',
    });
    buildDependentPersonDetailsMock.mockResolvedValueOnce({
      identifier: 'id-1',
      firstName: 'dep first-name',
      lastName: 'dep lastname',
      rxGroupType: 'CASH',
    } as IPerson);
    allRequiredQuestionsAnsweredMock.mockReturnValue(true);
    isDepdendentValidMock.mockReturnValue(true);
    await createAppointmentHandler(
      request,
      response,
      database,
      configurationMock
    );
    expect(getNextMock).toHaveBeenCalled();
    expect(buildDependentPersonDetails).toHaveBeenCalledTimes(1);
    expect(buildDependentPersonDetails).toHaveBeenNthCalledWith(
      1,
      dependentInfo,
      database,
      cashPersonInfo,
      100,
      undefined
    );
  });
  it('should fail to create appointment for new dependent if new dependent assigned person code is more than 999', async () => {
    const response = {
      locals: {
        personList: [cashPersonInfo],
        dependents: [{ identifier: 'id-2' }],
        account: { dateOfBirth: '2000-02-02' },
        accountIdentifier: 'accountIdentifier',
      },
    } as unknown as Response;
    const dependentInfo: IDependentInformation = {
      firstName: 'dep-name',
      lastName: 'dep-name',
      dateOfBirth: 'September-22-2017',
      addressSameAsParent: true,
    };
    const body = {
      experienceBaseUrl: 'https://myrx.io',
      locationId: 'location_id',
      questions: answers,
      serviceType: service.serviceType,
      start: '2020-06-23T13:00:00',
      dependentInfo,
      memberAddress: validAddress,
      bookingId: 'bookingId',
    } as ICreateBookingRequestBody;
    const request = {
      body,
    } as Request;
    const database = {} as IDatabase;

    allRequiredQuestionsAnsweredMock.mockReturnValue(true);
    const errorMock = new Error(ErrorConstants.MAX_DEPENDENT_LIMIT_REACHED);
    buildDependentPersonDetailsMock.mockImplementation(() => {
      throw errorMock;
    });
    isDepdendentValidMock.mockReturnValue(true);

    await createAppointmentHandler(
      request,
      response,
      database,
      configurationMock
    );
    expect(getNextMock).toHaveBeenCalled();
    expect(buildDependentPersonDetails).toHaveBeenCalledTimes(1);
    expect(buildDependentPersonDetails).toHaveBeenNthCalledWith(
      1,
      dependentInfo,
      database,
      cashPersonInfo,
      100,
      undefined
    );
    expect(createAppointmentEndpointHelperMock).not.toBeCalled();
    expect(KnownFailureResponseMock).toBeCalledWith(
      response,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.MAX_DEPENDENT_LIMIT_REACHED,
      undefined,
      InternalResponseCode.MAX_DEPENDENT_LIMIT_REACHED
    );
  });
  it('should send payment information for creating booking event if service has payment and person rxgrouptype is not COVID19', async () => {
    const database = {} as IDatabase;
    const response = {
      locals: {
        personInfo: {
          rxGroupType: 'SIE',
          firstName: 'first',
          lastName: 'last',
          dateOfBirth: '01/01/2000',
          primaryMemberFamilyId: 'memberFamilyId',
          primaryMemberPersonCode: 'memberPersonCode',
          primaryMemberRxId: 'primaryMemberRxId',
          phoneNumber: '1234567890',
        },
        account: { dateOfBirth: '2000-02-02' },
        accountIdentifier: 'accountIdentifier',
      },
    } as unknown as Response;
    const body = {
      experienceBaseUrl: 'https://myrx.io',
      locationId: 'location_id',
      questions: answers,
      serviceType: service.serviceType,
      start: '2020-06-23T13:00:00',
      memberAddress: validAddress,
      bookingId: 'bookingId',
    } as ICreateBookingRequestBody;
    const request = {
      body,
    } as Request;

    allRequiredQuestionsAnsweredMock.mockReturnValue(true);
    createAppointmentEndpointHelperMock.mockResolvedValue({
      errorCode: undefined,
      message: '',
    });
    const payment = {
      clientReferenceId: 'clientReferenceId',
      isPriceActive: true,
      paymentStatus: 'unpaid',
      sessionId: 'sessionId',
      orderNumber: '5',
      productPriceId: 'productPriceId',
      unitAmount: 65,
      unitAmountDecimal: 65,
      isTestPayment: false,
    } as unknown as ICheckoutSessionInfo;
    createBookingPaymentCheckoutSessionIfNecessary.mockResolvedValue(payment);

    await createAppointmentHandler(
      request,
      response,
      database,
      configurationMock
    );
    expect(createAppointmentEndpointHelperMock).toHaveBeenNthCalledWith(
      1,
      configurationMock.pharmacyPortalApiUrl,
      {
        memberFamilyId: 'memberFamilyId',
        memberPersonCode: 'memberPersonCode',
        accountIdentifier: 'accountIdentifier',
        orderNumber: '5',
        tags: ['primaryMemberRxId'],
        customerName: 'first last',
        customerPhone: '1234567890',
        bookingId: request.body.bookingId,
        memberRxId: 'primaryMemberRxId',
        questions: [],
        serviceType: service.serviceType,
        isTestAppointment: false,
        isDependentAppointment: false,
        sessionId: 'operation-id',
        productPriceId: payment?.productPriceId,
        unitAmount: payment?.unitAmount,
        isTestPayment: payment?.isTestPayment,
        stripeSessionId: payment?.sessionId,
        stripeClientReferenceId: payment?.clientReferenceId,
        providerLocationId: 'id-1',
        acceptMessageText: 'some-text',
      },
      configurationMock.pharmacyPortalApiTenantId,
      configurationMock.pharmacyPortalApiClientId,
      configurationMock.pharmacyPortalApiClientSecret,
      configurationMock.pharmacyPortalApiScope
    );
  });
  it('should not send payment information for creating booking event if service has payment but person rxgrouptype is COVID19', async () => {
    const database = {} as IDatabase;
    const response = {
      locals: {
        personInfo: {
          rxGroupType: 'COVID19',
          firstName: 'first',
          lastName: 'last',
          dateOfBirth: '01/01/2000',
          primaryMemberFamilyId: 'memberFamilyId',
          primaryMemberPersonCode: 'memberPersonCode',
          primaryMemberRxId: 'primaryMemberRxId',
          phoneNumber: '1234567890',
        },
        account: { dateOfBirth: '2000-02-02' },
        accountIdentifier: 'accountIdentifier',
      },
    } as unknown as Response;
    const body = {
      experienceBaseUrl: 'https://myrx.io',
      locationId: 'location_id',
      questions: answers,
      serviceType: service.serviceType,
      start: '2020-06-23T13:00:00',
      memberAddress: validAddress,
      bookingId: 'bookingId',
    } as ICreateBookingRequestBody;
    const request = {
      body,
    } as Request;
    createAppointmentEndpointHelperMock.mockResolvedValue({
      errorCode: undefined,
      message: '',
    });
    allRequiredQuestionsAnsweredMock.mockReturnValue(true);

    await createAppointmentHandler(
      request,
      response,
      database,
      configurationMock
    );
    expect(createAppointmentEndpointHelperMock).toHaveBeenNthCalledWith(
      1,
      configurationMock.pharmacyPortalApiUrl,
      {
        memberFamilyId: 'memberFamilyId',
        memberPersonCode: 'memberPersonCode',
        accountIdentifier: 'accountIdentifier',
        orderNumber: '5',
        tags: ['primaryMemberRxId'],
        customerName: 'first last',
        customerPhone: '1234567890',
        bookingId: request.body.bookingId,
        memberRxId: 'primaryMemberRxId',
        questions: [],
        serviceType: service.serviceType,
        isTestAppointment: false,
        isDependentAppointment: false,
        sessionId: 'operation-id',
        providerLocationId: 'id-1',
        acceptMessageText: 'some-text',
        productPriceId: '',
        unitAmount: 0,
        stripeClientReferenceId: '',
        stripeSessionId: '',
        isTestPayment: false,
      },
      configurationMock.pharmacyPortalApiTenantId,
      configurationMock.pharmacyPortalApiClientId,
      configurationMock.pharmacyPortalApiClientSecret,
      configurationMock.pharmacyPortalApiScope
    );
  });

  it('should not send payment data for creating appointment event if service does not have payment', async () => {
    // arrange
    const database = {} as IDatabase;
    const response = {
      locals: {
        personInfo: {
          rxGroupType: 'CASH',
        },
        account: { dateOfBirth: '2000-02-02' },
        accountIdentifier: 'accountIdentifier',
      },
    } as unknown as Response;

    createAppointmentEndpointHelperMock.mockResolvedValue({
      errorCode: undefined,
      message: '',
    });

    const body = {
      experienceBaseUrl: 'https://myrx.io',
      locationId: 'location_id',
      questions: answers,
      serviceType: service.serviceType,
      start: '2020-06-23T13:00:00',
      memberAddress: validAddress,
      bookingId: 'bookingId',
    } as ICreateBookingRequestBody;
    const request = {
      body,
    } as Request;

    allRequiredQuestionsAnsweredMock.mockReturnValue(true);

    // act
    await createAppointmentHandler(
      request,
      response,
      database,
      configurationMock
    );
    // assert
    expect(createAppointmentEndpointHelperMock).toHaveBeenNthCalledWith(
      1,
      configurationMock.pharmacyPortalApiUrl,
      expect.anything(),
      configurationMock.pharmacyPortalApiTenantId,
      configurationMock.pharmacyPortalApiClientId,
      configurationMock.pharmacyPortalApiClientSecret,
      configurationMock.pharmacyPortalApiScope
    );
  });
});
