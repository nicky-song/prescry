// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '@phx/common/src/errors/error-codes';
import {
  ErrorConstants,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { ICreateWaitlistData } from '@phx/common/src/models/api-response/create-waitlist.response';
import { IPerson } from '@phx/common/src/models/person';
import { ServiceTypes } from '@phx/common/src/models/provider-location';
import { createWaitlistHandler } from './create-waitlist.handler';
import { getValidWaitlistForPhoneAndServiceType } from '../../../databases/mongo-database/v1/query-helper/wait-list.query-helper';
import { ICreateWaitlist } from '../../../models/pharmacy-portal/create-waitlist.response';
import { IServices } from '../../../models/services';
import {
  getLoggedInUserProfileForRxGroupType,
  getAllowedPersonsForLoggedInUser,
} from '../../../utils/person/get-dependent-person.helper';
import {
  SuccessResponse,
  errorResponseWithTwilioErrorHandling,
  KnownFailureResponse,
} from '../../../utils/response-helper';
import { createWaitlistEndpointHelper } from '../../waitlist/helpers/create-waitlist-endpoint.helper';
import { sendWaitlistConfirmationMessage } from '../../waitlist/helpers/send-waitlist-confirmation-message.helper';
import { getServiceDetailsByServiceType } from '../../../utils/external-api/get-service-details-by-service-type';
import { databaseMock } from '../../../mock-data/database.mock';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { twilioMock } from '../../../mock-data/twilio.mock';

jest.mock(
  '../../../databases/mongo-database/v1/query-helper/wait-list.query-helper'
);
jest.mock('../../../utils/response-helper');
jest.mock('../../waitlist/helpers/create-waitlist-endpoint.helper');
jest.mock('../../../utils/person/get-dependent-person.helper');
jest.mock('../../waitlist/helpers/send-waitlist-confirmation-message.helper');
jest.mock('../../../utils/external-api/get-service-details-by-service-type');

const successResponseMock = SuccessResponse as jest.Mock;
const errorResponseWithTwilioErrorHandlingMock =
  errorResponseWithTwilioErrorHandling as jest.Mock;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const getValidWaitlistForPhoneAndServiceTypeMock =
  getValidWaitlistForPhoneAndServiceType as jest.Mock;
const createWaitlistEndpointHelperMock =
  createWaitlistEndpointHelper as jest.Mock;
const getLoggedInUserProfileForRxGroupTypeMock =
  getLoggedInUserProfileForRxGroupType as jest.Mock;
const sendWaitlistConfirmationMessageMock =
  sendWaitlistConfirmationMessage as jest.Mock;
const getAllowedPersonsForLoggedInUserMock =
  getAllowedPersonsForLoggedInUser as jest.Mock;
const getServiceDetailsByServiceTypeMock =
  getServiceDetailsByServiceType as jest.Mock;

const mockServiceTypeDetailsVaccine = {
  serviceType: 'c19-vaccine-dose1',
  procedureCode: '87811',
  serviceDescription: 'COVID-19 Vaccination',
  serviceName: 'Antigen',

  serviceNameMyRx: 'COVID-19 vaccine dose 1',
  confirmationDescriptionMyRx: 'mock-conf-desc',
  aboutDependentDescriptionMyRx: 'mock-dependent-desc',
  aboutQuestionsDescriptionMyRx: 'mock-question-desc',
  cancellationPolicyMyRx: 'mock-cancel',
  minimumAge: 18,
} as IServices;

beforeEach(() => {
  jest.clearAllMocks();
  getValidWaitlistForPhoneAndServiceTypeMock.mockReturnValue([]);
  getLoggedInUserProfileForRxGroupTypeMock.mockReturnValue({});
  sendWaitlistConfirmationMessageMock.mockResolvedValue({});
  getAllowedPersonsForLoggedInUserMock.mockReturnValue([]);
  getServiceDetailsByServiceTypeMock.mockReturnValue({
    service: mockServiceTypeDetailsVaccine,
  });
});

describe('createWaitlistHandler failure cases', () => {
  it('it returns error if dependentId provided is not in user dependents', async () => {
    const request = {
      body: {
        serviceType: ServiceTypes.c19VaccineDose1,
        zipCode: '11111',
        maxMilesAway: 10,
        dependentIdentifier: 'id-1',
      },
    } as unknown as Request;
    const response = {
      locals: {
        device: { data: 'mock-phone' },
        personInfo: {},
        dependents: [{ identifier: 'id-2' }],
        account: { dateOfBirth: '2000-02-02' },
      },
    } as unknown as Response;
    const expected = {};
    knownFailureResponseMock.mockReturnValueOnce(expected);
    const actual = await createWaitlistHandler(
      request,
      response,
      databaseMock,
      configurationMock,
      twilioMock,
    );
    expect(actual).toBe(expected);

    expect(knownFailureResponseMock).toHaveBeenNthCalledWith(
      1,
      response,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.WAITLIST_INVALID_DEPENDENT
    );
    expect(getValidWaitlistForPhoneAndServiceTypeMock).not.toHaveBeenCalled();
  });

  it('it returns error if request is missing information', async () => {
    const request = {
      body: {
        serviceType: ServiceTypes.c19VaccineDose1,
        zipCode: '11111',
        maxMilesAway: 10,
        firstName: 'name',
      },
    } as unknown as Request;
    const response = {
      locals: {
        device: { data: 'mock-phone' },
        personInfo: {},
        dependents: [{ identifier: 'id-2' }],
        account: { dateOfBirth: '2000-02-02' },
      },
    } as unknown as Response;
    const expected = {};
    knownFailureResponseMock.mockReturnValueOnce(expected);
    const actual = await createWaitlistHandler(
      request,
      response,
      databaseMock,
      configurationMock,
      twilioMock,
    );
    expect(actual).toBe(expected);

    expect(knownFailureResponseMock).toHaveBeenNthCalledWith(
      1,
      response,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.WAITLIST_MISSING_INFORMATION,
      undefined,
      InternalResponseCode.WAITLIST_MISSING_INFORMATION
    );
    expect(getValidWaitlistForPhoneAndServiceTypeMock).not.toHaveBeenCalled();
  });

  it('it returns error if request has invalid date of birth', async () => {
    const request = {
      body: {
        serviceType: ServiceTypes.c19VaccineDose1,
        zipCode: '11111',
        maxMilesAway: 10,
        firstName: 'name',
        lastName: 'test',
        dateOfBirth: 'February-29-2001',
      },
    } as unknown as Request;
    const response = {
      locals: {
        device: { data: 'mock-phone' },
        personInfo: {},
        dependents: [{ identifier: 'id-2' }],
        account: { dateOfBirth: '2000-02-02' },
      },
    } as unknown as Response;
    const expected = {};
    knownFailureResponseMock.mockReturnValueOnce(expected);
    const actual = await createWaitlistHandler(
      request,
      response,
      databaseMock,
      configurationMock,
      twilioMock,
    );
    expect(actual).toBe(expected);

    expect(knownFailureResponseMock).toHaveBeenNthCalledWith(
      1,
      response,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.WAITLIST_MISSING_INFORMATION,
      undefined,
      InternalResponseCode.WAITLIST_MISSING_INFORMATION
    );
    expect(getValidWaitlistForPhoneAndServiceTypeMock).not.toHaveBeenCalled();
  });

  it('it returns error if waitlist already exists in database', async () => {
    const request = {
      body: {
        serviceType: ServiceTypes.c19VaccineDose1,
        zipCode: '11111',
        maxMilesAway: 10,
        firstName: 'name',
        lastName: 'test',
        dateOfBirth: 'January-02-2001',
      },
    } as unknown as Request;
    const response = {
      locals: {
        device: { data: 'mock-phone' },
        personInfo: {},
        dependents: [{ identifier: 'id-2' }],
        account: { dateOfBirth: '2000-02-02' },
      },
    } as unknown as Response;
    const expected = {};
    knownFailureResponseMock.mockReturnValueOnce(expected);
    const existingWaitList = [
      {
        phoneNumber: 'mock-phone',
        serviceType: ServiceTypes.c19VaccineDose1,
        zipCode: '11111',
        maxMilesAway: 10,
        firstName: 'Name',
        lastName: 'Test',
        dateOfBirth: '2001-01-02',
      },
      {
        phoneNumber: 'mock-phone',
        serviceType: ServiceTypes.c19VaccineDose1,
        zipCode: '11111',
        maxMilesAway: 10,
        firstName: 'Name2',
        lastName: 'Test3',
        dateOfBirth: '2001-01-02',
      },
    ];
    getValidWaitlistForPhoneAndServiceTypeMock.mockReturnValueOnce(
      existingWaitList
    );
    const actual = await createWaitlistHandler(
      request,
      response,
      databaseMock,
      configurationMock,
      twilioMock,
    );
    expect(actual).toBe(expected);

    expect(knownFailureResponseMock).toHaveBeenNthCalledWith(
      1,
      response,
      HttpStatusCodes.BAD_REQUEST,
      'This person is already on the COVID-19 vaccine dose 1 waitlist',
      undefined,
      InternalResponseCode.WAITLIST_ALREADY_ADDED
    );
    expect(getValidWaitlistForPhoneAndServiceTypeMock).toBeCalledWith(
      databaseMock,
      'mock-phone',
      ServiceTypes.c19VaccineDose1
    );
    expect(createWaitlistEndpointHelperMock).not.toBeCalled();
  });

  it('it returns error if user does not meet age criteria for vaccine service', async () => {
    const request = {
      body: {
        serviceType: ServiceTypes.c19VaccineDose1,
        zipCode: '11111',
        maxMilesAway: 10,
        firstName: 'name',
        lastName: 'test',
        dateOfBirth: 'January-02-2011',
      },
    } as unknown as Request;
    const response = {
      locals: {
        device: { data: 'mock-phone' },
        personInfo: {},
        dependents: [{ identifier: 'id-2' }],
        account: { dateOfBirth: '2000-02-02' },
      },
    } as unknown as Response;
    const expected = {};
    knownFailureResponseMock.mockReturnValueOnce(expected);
    const actual = await createWaitlistHandler(
      request,
      response,
      databaseMock,
      configurationMock,
      twilioMock,
    );
    expect(actual).toBe(expected);

    expect(knownFailureResponseMock).toHaveBeenNthCalledWith(
      1,
      response,
      HttpStatusCodes.BAD_REQUEST,
      'We currently do not support appointment scheduling for individuals under 18 for COVID-19 vaccine dose 1',
      undefined,
      InternalResponseCode.WAITLIST_MIN_AGE_NOT_MET
    );
    expect(getValidWaitlistForPhoneAndServiceTypeMock).toBeCalledWith(
      databaseMock,
      'mock-phone',
      ServiceTypes.c19VaccineDose1
    );
    expect(createWaitlistEndpointHelperMock).not.toBeCalled();
  });

  it('it returns error if user does not meet age criteria for test service', async () => {
    const request = {
      body: {
        serviceType: ServiceTypes.abbottAntigen,
        zipCode: '11111',
        maxMilesAway: 10,
        firstName: 'name',
        lastName: 'test',
        dateOfBirth: 'January-02-2020',
      },
    } as unknown as Request;
    const mockServiceTypeDetails = {
      serviceType: 'abbott_antigen',
      procedureCode: '87811',
      serviceDescription: 'COVID-19 Rapid Antigen Test',
      serviceName: 'Antigen',
      serviceNameMyRx: 'mock-service name',
      confirmationDescriptionMyRx: 'mock-conf-desc',
      aboutDependentDescriptionMyRx: 'mock-dependent-desc',
      aboutQuestionsDescriptionMyRx: 'mock-question-desc',
      cancellationPolicyMyRx: 'mock-cancel',
      minimumAge: 4,
    } as IServices;
    const response = {
      locals: {
        device: { data: 'mock-phone' },
        personInfo: {},
        dependents: [{ identifier: 'id-2' }],
        account: { dateOfBirth: '2000-02-02' },
      },
    } as unknown as Response;
    getServiceDetailsByServiceTypeMock.mockReturnValueOnce({
      service: mockServiceTypeDetails,
    });
    const expected = {};
    knownFailureResponseMock.mockReturnValueOnce(expected);
    const actual = await createWaitlistHandler(
      request,
      response,
      databaseMock,
      configurationMock,
      twilioMock,
    );
    expect(actual).toBe(expected);

    expect(knownFailureResponseMock).toHaveBeenNthCalledWith(
      1,
      response,
      HttpStatusCodes.BAD_REQUEST,
      'We currently do not support appointment scheduling for individuals under 4 for mock-service name',
      undefined,
      InternalResponseCode.WAITLIST_MIN_AGE_NOT_MET
    );
    expect(getValidWaitlistForPhoneAndServiceTypeMock).toBeCalledWith(
      databaseMock,
      'mock-phone',
      ServiceTypes.abbottAntigen
    );
    expect(createWaitlistEndpointHelperMock).not.toBeCalled();
  });

  it('it returns error if create waitlist endpoint returns an error', async () => {
    const request = {
      body: {
        serviceType: ServiceTypes.c19VaccineDose1,
        zipCode: '11111',
        maxMilesAway: 10,
        firstName: 'name',
        lastName: 'test',
        dateOfBirth: 'January-02-2001',
      },
    } as unknown as Request;
    const response = {
      locals: {
        device: { data: 'mock-phone' },
        personInfo: {},
        dependents: [{ identifier: 'id-2' }],
        account: { dateOfBirth: '2000-02-02' },
      },
    } as unknown as Response;
    const expected = {};
    knownFailureResponseMock.mockReturnValueOnce(expected);
    const existingWaitList = [
      {
        phoneNumber: 'mock-phone',
        serviceType: ServiceTypes.c19VaccineDose1,
        zipCode: '11111',
        maxMilesAway: 10,
        firstName: 'Name2',
        lastName: 'Test2',
        dateOfBirth: '2001-01-02',
      },
    ];
    getValidWaitlistForPhoneAndServiceTypeMock.mockReturnValueOnce(
      existingWaitList
    );
    createWaitlistEndpointHelperMock.mockReturnValueOnce({
      errorCode: 401,
      message: 'error',
    });
    const actual = await createWaitlistHandler(
      request,
      response,
      databaseMock,
      configurationMock,
      twilioMock,
    );
    expect(actual).toBe(expected);
    expect(getValidWaitlistForPhoneAndServiceTypeMock).toBeCalledWith(
      databaseMock,
      'mock-phone',
      ServiceTypes.c19VaccineDose1
    );
    expect(createWaitlistEndpointHelperMock).toBeCalledWith(configurationMock, {
      addedBy: 'mock-phone',
      serviceType: ServiceTypes.c19VaccineDose1,
      zipCode: '11111',
      maxMilesAway: 10,
      firstName: 'NAME',
      lastName: 'TEST',
      dateOfBirth: '2001-01-02',
      phoneNumber: 'mock-phone',
    });
    expect(knownFailureResponseMock).toHaveBeenNthCalledWith(
      1,
      response,
      401,
      'error'
    );
  });

  it('it returns errorResponseWithTwilioErrorHandlingMock if any exception', async () => {
    const error = { message: 'internal error' };
    getValidWaitlistForPhoneAndServiceTypeMock.mockImplementationOnce(() => {
      throw error;
    });
    const request = {
      body: {
        serviceType: ServiceTypes.c19VaccineDose1,
        zipCode: '11111',
        maxMilesAway: 10,
        firstName: 'name',
        lastName: 'test',
        dateOfBirth: 'January-02-2001',
      },
    } as unknown as Request;
    const response = {
      locals: {
        device: { data: 'mock-phone' },
        personInfo: {},
        dependents: [{ identifier: 'id-2' }],
        account: { dateOfBirth: '2000-02-02' },
      },
    } as unknown as Response;
    const expected = {};
    errorResponseWithTwilioErrorHandlingMock.mockReturnValueOnce(expected);
    const actual = await createWaitlistHandler(
      request,
      response,
      databaseMock,
      configurationMock,
      twilioMock,
    );
    expect(actual).toBe(expected);

    expect(errorResponseWithTwilioErrorHandlingMock).toHaveBeenNthCalledWith(
      1,
      response,
      'mock-phone',
      error
    );
    expect(getValidWaitlistForPhoneAndServiceTypeMock).toBeCalledWith(
      databaseMock,
      'mock-phone',
      ServiceTypes.c19VaccineDose1
    );
    expect(createWaitlistEndpointHelperMock).not.toBeCalled();
  });
});

describe('createWaitlistHandler success cases', () => {
  it('it adds waitlist successfully for myself using information from person', async () => {
    const request = {
      body: {
        serviceType: ServiceTypes.c19VaccineDose1,
        zipCode: '11111',
        maxMilesAway: 10,
        firstName: 'name',
        lastName: 'test',
        dateOfBirth: 'January-02-2001',
        myself: true,
        dependentIdentifier: 'id-2',
      },
    } as unknown as Request;
    const response = {
      locals: {
        device: { data: 'mock-phone' },
        personInfo: {},
        dependents: [{ identifier: 'id-2' }],
        account: { dateOfBirth: '2000-03-01' },
      },
    } as unknown as Response;
    const expected = {};
    getLoggedInUserProfileForRxGroupTypeMock.mockReturnValue({
      firstName: 'mock-first',
      lastName: 'mock-last',
      dateOfBirth: '2000-03-01',
    } as IPerson);
    successResponseMock.mockReturnValueOnce(expected);
    const addedWaitlist: ICreateWaitlist = {
      serviceType: ServiceTypes.c19VaccineDose1,
      identifier: 'identifier',
      zipCode: '11111',
      maxMilesAway: 10,
      firstName: 'mock-first',
      lastName: 'mock-last',
      dateOfBirth: '2000-03-01',
      phoneNumber: 'mock-phone',
    };
    const waitListData: ICreateWaitlistData = {
      serviceType: ServiceTypes.c19VaccineDose1,
      identifier: 'identifier',
      zipCode: '11111',
      maxMilesAway: 10,
      firstName: 'mock-first',
      lastName: 'mock-last',
      dateOfBirth: '2000-03-01',
      phoneNumber: 'mock-phone',
      serviceName: 'COVID-19 vaccine dose 1',
    };
    createWaitlistEndpointHelperMock.mockReturnValueOnce({
      waitlist: addedWaitlist,
      message: 'success',
    });
    const actual = await createWaitlistHandler(
      request,
      response,
      databaseMock,
      configurationMock,
      twilioMock,
    );
    expect(actual).toBe(expected);
    expect(getServiceDetailsByServiceTypeMock).toBeCalledWith(
      configurationMock,
      ServiceTypes.c19VaccineDose1
    );
    expect(getValidWaitlistForPhoneAndServiceTypeMock).toBeCalledWith(
      databaseMock,
      'mock-phone',
      ServiceTypes.c19VaccineDose1
    );
    expect(createWaitlistEndpointHelperMock).toBeCalledWith(configurationMock, {
      addedBy: 'mock-phone',
      serviceType: ServiceTypes.c19VaccineDose1,
      zipCode: '11111',
      maxMilesAway: 10,
      firstName: 'mock-first',
      lastName: 'mock-last',
      dateOfBirth: '2000-03-01',
      phoneNumber: 'mock-phone',
    });
    expect(successResponseMock).toHaveBeenNthCalledWith(
      1,
      response,
      SuccessConstants.SUCCESS_OK,
      waitListData
    );
  });

  it('it adds waitlist successfully for myself using information from account if person does not exist', async () => {
    const request = {
      body: {
        serviceType: ServiceTypes.c19VaccineDose1,
        zipCode: '11111',
        maxMilesAway: 10,
        firstName: 'name',
        lastName: 'test',
        dateOfBirth: 'January-02-2001',
        myself: true,
        dependentIdentifier: 'id-2',
      },
    } as unknown as Request;
    const response = {
      locals: {
        device: { data: 'mock-phone' },
        dependents: [{ identifier: 'id-2' }],
        account: {
          firstName: 'mock-first-account',
          lastName: 'mock-last-account',
          dateOfBirth:
            'Mon Dec 31 2001 16:00:00 GMT-0800 (Pacific Standard Time)',
        },
      },
    } as unknown as Response;
    const expected = {};
    getLoggedInUserProfileForRxGroupTypeMock.mockReturnValue(undefined);
    successResponseMock.mockReturnValueOnce(expected);
    const addedWaitlist: ICreateWaitlist = {
      serviceType: ServiceTypes.c19VaccineDose1,
      identifier: 'identifier',
      zipCode: '11111',
      maxMilesAway: 10,
      firstName: 'mock-first-account',
      lastName: 'mock-last-account',
      dateOfBirth: '2002-01-01',
      phoneNumber: 'mock-phone',
    };
    const addedWaitlistData: ICreateWaitlistData = {
      serviceType: ServiceTypes.c19VaccineDose1,
      identifier: 'identifier',
      zipCode: '11111',
      maxMilesAway: 10,
      firstName: 'mock-first-account',
      lastName: 'mock-last-account',
      dateOfBirth: '2002-01-01',
      phoneNumber: 'mock-phone',
      serviceName: 'COVID-19 vaccine dose 1',
    };
    createWaitlistEndpointHelperMock.mockReturnValueOnce({
      waitlist: addedWaitlist,
      message: 'success',
    });
    const actual = await createWaitlistHandler(
      request,
      response,
      databaseMock,
      configurationMock,
      twilioMock,
    );
    expect(actual).toBe(expected);
    expect(getValidWaitlistForPhoneAndServiceTypeMock).toBeCalledWith(
      databaseMock,
      'mock-phone',
      ServiceTypes.c19VaccineDose1
    );
    expect(createWaitlistEndpointHelperMock).toBeCalledWith(configurationMock, {
      addedBy: 'mock-phone',
      serviceType: ServiceTypes.c19VaccineDose1,
      zipCode: '11111',
      maxMilesAway: 10,
      firstName: 'mock-first-account',
      lastName: 'mock-last-account',
      dateOfBirth: '2002-01-01',
      phoneNumber: 'mock-phone',
    });
    expect(successResponseMock).toHaveBeenNthCalledWith(
      1,
      response,
      SuccessConstants.SUCCESS_OK,
      addedWaitlistData
    );
  });

  it('it adds waitlist successfully for dependent', async () => {
    const request = {
      body: {
        serviceType: ServiceTypes.c19VaccineDose1,
        zipCode: '11111',
        maxMilesAway: 10,
        firstName: 'name',
        lastName: 'test',
        dateOfBirth: 'January-02-2001',
        dependentIdentifier: 'id-2',
      },
    } as unknown as Request;
    const response = {
      locals: {
        personInfo: {},
        device: { data: 'mock-phone' },
        dependents: [
          {
            identifier: 'id-2',
            firstName: 'mock-first-dep',
            lastName: 'mock-last-dep',
            dateOfBirth: '2002-01-01',
          },
        ],
        account: {
          firstName: 'mock-first-account',
          lastName: 'mock-last-account',
        },
      },
    } as unknown as Response;
    const expected = {};
    getAllowedPersonsForLoggedInUserMock.mockReturnValue([
      {
        identifier: 'id-2',
        firstName: 'mock-first-dep',
        lastName: 'mock-last-dep',
        dateOfBirth: '2002-01-01',
      },
    ]);
    successResponseMock.mockReturnValueOnce(expected);
    const addedWaitlist: ICreateWaitlist = {
      serviceType: ServiceTypes.c19VaccineDose1,
      identifier: 'identifier',
      zipCode: '11111',
      maxMilesAway: 10,
      firstName: 'mock-first-dep',
      lastName: 'mock-last-dep',
      dateOfBirth: '2002-01-01',
      phoneNumber: 'mock-phone',
    };
    const addedWaitlistData: ICreateWaitlistData = {
      serviceType: ServiceTypes.c19VaccineDose1,
      identifier: 'identifier',
      zipCode: '11111',
      maxMilesAway: 10,
      firstName: 'mock-first-dep',
      lastName: 'mock-last-dep',
      dateOfBirth: '2002-01-01',
      phoneNumber: 'mock-phone',
      serviceName: 'COVID-19 vaccine dose 1',
    };
    createWaitlistEndpointHelperMock.mockReturnValueOnce({
      waitlist: addedWaitlist,
      message: 'success',
    });
    const actual = await createWaitlistHandler(
      request,
      response,
      databaseMock,
      configurationMock,
      twilioMock,
    );
    expect(actual).toBe(expected);
    expect(getValidWaitlistForPhoneAndServiceTypeMock).toBeCalledWith(
      databaseMock,
      'mock-phone',
      ServiceTypes.c19VaccineDose1
    );
    expect(createWaitlistEndpointHelperMock).toBeCalledWith(configurationMock, {
      addedBy: 'mock-phone',
      serviceType: ServiceTypes.c19VaccineDose1,
      zipCode: '11111',
      maxMilesAway: 10,
      firstName: 'mock-first-dep',
      lastName: 'mock-last-dep',
      dateOfBirth: '2002-01-01',
      phoneNumber: 'mock-phone',
    });
    expect(successResponseMock).toHaveBeenNthCalledWith(
      1,
      response,
      SuccessConstants.SUCCESS_OK,
      addedWaitlistData
    );
  });

  it('it adds waitlist successfully for other user and use logged in user phone if request does not have phone', async () => {
    const request = {
      body: {
        serviceType: ServiceTypes.c19VaccineDose1,
        zipCode: '11111',
        maxMilesAway: 10,
        firstName: 'name',
        lastName: 'test',
        dateOfBirth: 'January-02-2001',
      },
    } as unknown as Request;
    const response = {
      locals: {
        personInfo: {},
        device: { data: 'mock-phone' },
        dependents: [],
        account: {
          firstName: 'mock-first-account',
          lastName: 'mock-last-account',
        },
      },
    } as unknown as Response;
    const expected = {};
    successResponseMock.mockReturnValueOnce(expected);
    const addedWaitlist: ICreateWaitlist = {
      serviceType: ServiceTypes.c19VaccineDose1,
      identifier: 'identifier',
      zipCode: '11111',
      maxMilesAway: 10,
      firstName: 'NAME',
      lastName: 'TEST',
      dateOfBirth: '2001-01-02',
      phoneNumber: 'mock-phone',
    };
    const addedWaitlistData: ICreateWaitlistData = {
      serviceType: ServiceTypes.c19VaccineDose1,
      identifier: 'identifier',
      zipCode: '11111',
      maxMilesAway: 10,
      firstName: 'NAME',
      lastName: 'TEST',
      dateOfBirth: '2001-01-02',
      phoneNumber: 'mock-phone',
      serviceName: 'COVID-19 vaccine dose 1',
    };
    createWaitlistEndpointHelperMock.mockReturnValueOnce({
      waitlist: addedWaitlist,
      message: 'success',
    });
    const actual = await createWaitlistHandler(
      request,
      response,
      databaseMock,
      configurationMock,
      twilioMock,
    );
    expect(actual).toBe(expected);
    expect(getValidWaitlistForPhoneAndServiceTypeMock).toBeCalledWith(
      databaseMock,
      'mock-phone',
      ServiceTypes.c19VaccineDose1
    );
    expect(createWaitlistEndpointHelperMock).toBeCalledWith(configurationMock, {
      addedBy: 'mock-phone',
      serviceType: ServiceTypes.c19VaccineDose1,
      zipCode: '11111',
      maxMilesAway: 10,
      firstName: 'NAME',
      lastName: 'TEST',
      dateOfBirth: '2001-01-02',
      phoneNumber: 'mock-phone',
    });
    expect(successResponseMock).toHaveBeenNthCalledWith(
      1,
      response,
      SuccessConstants.SUCCESS_OK,
      addedWaitlistData
    );
  });

  it('it adds waitlist successfully for other user and use phone from request if provided', async () => {
    const request = {
      body: {
        phoneNumber: 'mock-phone-2',
        serviceType: ServiceTypes.c19VaccineDose1,
        zipCode: '11111',
        maxMilesAway: 10,
        firstName: 'name',
        lastName: 'test',
        dateOfBirth: 'January-02-2001',
      },
    } as unknown as Request;
    const response = {
      locals: {
        personInfo: {},
        device: { data: 'mock-phone' },
        dependents: [],
        account: {
          firstName: 'mock-first-account',
          lastName: 'mock-last-account',
        },
      },
    } as unknown as Response;
    const expected = {};
    successResponseMock.mockReturnValueOnce(expected);
    const addedWaitlist: ICreateWaitlist = {
      serviceType: ServiceTypes.c19VaccineDose1,
      identifier: 'identifier',
      zipCode: '11111',
      maxMilesAway: 10,
      firstName: 'NAME',
      lastName: 'TEST',
      dateOfBirth: '2001-01-02',
      phoneNumber: 'mock-phone-2',
    };
    const addedWaitlistData: ICreateWaitlistData = {
      serviceType: ServiceTypes.c19VaccineDose1,
      identifier: 'identifier',
      zipCode: '11111',
      maxMilesAway: 10,
      firstName: 'NAME',
      lastName: 'TEST',
      dateOfBirth: '2001-01-02',
      phoneNumber: 'mock-phone-2',
      serviceName: 'COVID-19 vaccine dose 1',
    };
    createWaitlistEndpointHelperMock.mockReturnValueOnce({
      waitlist: addedWaitlist,
      message: 'success',
    });
    const actual = await createWaitlistHandler(
      request,
      response,
      databaseMock,
      configurationMock,
      twilioMock,
    );
    expect(actual).toBe(expected);
    expect(getValidWaitlistForPhoneAndServiceTypeMock).toBeCalledWith(
      databaseMock,
      'mock-phone-2',
      ServiceTypes.c19VaccineDose1
    );
    expect(createWaitlistEndpointHelperMock).toBeCalledWith(configurationMock, {
      addedBy: 'mock-phone',
      serviceType: ServiceTypes.c19VaccineDose1,
      zipCode: '11111',
      maxMilesAway: 10,
      firstName: 'NAME',
      lastName: 'TEST',
      dateOfBirth: '2001-01-02',
      phoneNumber: 'mock-phone-2',
    });
    expect(successResponseMock).toHaveBeenNthCalledWith(
      1,
      response,
      SuccessConstants.SUCCESS_OK,
      addedWaitlistData
    );
  });
});
