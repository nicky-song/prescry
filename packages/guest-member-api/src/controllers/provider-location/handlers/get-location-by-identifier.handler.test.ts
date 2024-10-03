// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';

import { ErrorConstants } from '../../../constants/response-messages';
import {
  KnownFailureResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { ServiceTypes } from '@phx/common/src/models/provider-location';
import { getRequiredRequestQuery } from '../../../utils/request/get-request-query';
import { getLocationByIdentifierHandler } from './get-location-by-identifier.handler';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '../../../constants/error-codes';
import {
  getResponseLocal,
  getRequiredResponseLocal,
} from '../../../utils/request/request-app-locals.helper';
import { IAccount } from '@phx/common/src/models/account';
import { trackProviderLocationDetailsFailureEvent } from '../../../utils/custom-event-helper';
import { CalculateAbsoluteAge } from '@phx/common/src/utils/date-time-helper';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { StringFormatter } from '@phx/common/src/utils/formatters/string.formatter';
import { generateSuccessResponseForLocation } from '../helpers/generate-success-response-location.helper';
import { getProviderLocationByIdAndServiceType } from '../helpers/get-provider-location-by-id-and-service-type.helper';
import {
  providerLocationResponseWithServiceTypeFilterMock,
  providerLocationResponseWithoutServicesMock,
} from '../../../mock-data/provider-location.mock';

jest.mock('../../../utils/response-helper');
jest.mock('../../../utils/request/get-request-query');
jest.mock('../../../utils/request/request-app-locals.helper');
jest.mock('../../../utils/custom-event-helper');
jest.mock('@phx/common/src/utils/date-time-helper');
jest.mock('../helpers/generate-success-response-location.helper');
jest.mock('../helpers/get-provider-location-by-id-and-service-type.helper');
const routerResponseMock = {} as Response;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;
const getRequiredRequestQueryMock = getRequiredRequestQuery as jest.Mock;
const getResponseLocalMock = getResponseLocal as jest.Mock;
const getRequiredResponseLocalMock = getRequiredResponseLocal as jest.Mock;
const trackProviderLocationDetailsFailureEventMock =
  trackProviderLocationDetailsFailureEvent as jest.Mock;
const calculateAbsoluteAgeMock = CalculateAbsoluteAge as jest.Mock;
const generateSuccessResponseForLocationMock =
  generateSuccessResponseForLocation as jest.Mock;
const getProviderLocationByIdAndServiceTypeMock =
  getProviderLocationByIdAndServiceType as jest.Mock;

const serviceTypeMock = 'COVID-19 Antigen Testing';
const accountMock = { dateOfBirth: '01-01-2000' } as IAccount;

const personListMock = [
  {
    identifier: 'person-identifier',
    phoneNumber: 'phone-number',
    personCode: '01',
    primaryMemberFamilyId: 'CAJY',
    primaryMemberRxId: 'CAJY01',
    isPrimary: true,
    isTestMembership: true,
  },
  {
    identifier: 'person-identifier2',
    phoneNumber: 'phone-number',
    personCode: '02',
    primaryMemberFamilyId: 'T12345',
    primaryMemberRxId: 'T1234501',
    isPrimary: true,
  },
];

const featuresMock = {
  usePharmacy: false,
  usePin: true,
  useTestPharmacy: false,
};
beforeEach(() => {
  jest.clearAllMocks();
  getProviderLocationByIdAndServiceTypeMock.mockReturnValue(
    providerLocationResponseWithServiceTypeFilterMock
  );
  getResponseLocalMock.mockReturnValue(personListMock);
  getRequiredResponseLocalMock.mockReturnValue(featuresMock);
  calculateAbsoluteAgeMock.mockReturnValue(21);
});

describe('getLocationByIdentifierHandler', () => {
  it('should return success from getProviderLocationsHandler when test users trying to access test locations/service and there is no error from endpoint', async () => {
    const requestMock = {
      app: {},
      query: {
        servicetype: ServiceTypes.antigen,
      },
      params: {
        identifier: 'id-1',
      },
    } as unknown as Request;

    getRequiredRequestQueryMock.mockReturnValue(ServiceTypes.antigen);
    getRequiredResponseLocalMock.mockReturnValueOnce(featuresMock);
    getRequiredResponseLocalMock.mockReturnValueOnce(accountMock);

    await getLocationByIdentifierHandler(
      requestMock,
      routerResponseMock,
      configurationMock
    );

    expect(getRequiredRequestQueryMock).toHaveBeenCalledTimes(1);
    expect(getRequiredRequestQueryMock).toHaveBeenCalledWith(
      requestMock,
      'servicetype'
    );
    expect(getProviderLocationByIdAndServiceTypeMock).toHaveBeenCalledWith(
      configurationMock,
      'id-1',
      serviceTypeMock
    );

    expect(generateSuccessResponseForLocationMock).toBeCalledTimes(1);
    expect(generateSuccessResponseForLocationMock).toHaveBeenCalledWith(
      routerResponseMock,
      providerLocationResponseWithServiceTypeFilterMock.location,
      providerLocationResponseWithServiceTypeFilterMock.service
    );
  });

  it('should return LOCATION NOT FOUND error if no location exists in the database', async () => {
    const requestMock = {
      app: {},
      query: {
        servicetype: ServiceTypes.antigen,
      },
      params: {
        identifier: 'id-1',
      },
    } as unknown as Request;
    getRequiredRequestQueryMock.mockReturnValue(ServiceTypes.antigen);
    getProviderLocationByIdAndServiceTypeMock.mockReturnValue({
      errorCode: 404,
      message: 'not found',
    });
    await getLocationByIdentifierHandler(
      requestMock,
      routerResponseMock,
      configurationMock
    );
    expect(getProviderLocationByIdAndServiceTypeMock).toHaveBeenCalledWith(
      configurationMock,
      'id-1',
      serviceTypeMock
    );
    expect(trackProviderLocationDetailsFailureEventMock).toHaveBeenCalledTimes(
      1
    );
    expect(trackProviderLocationDetailsFailureEventMock).toHaveBeenCalledWith(
      serviceTypeMock,
      StringFormatter.format(
        ErrorConstants.LOCATION_NOT_FOUND,
        new Map<string, string>([['locationId', 'id-1']])
      )
    );
    expect(knownFailureResponseMock).toBeCalledTimes(1);
    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.INVALID_SERVICE_LOCATION
    );
  });
  it('should return location not found error if location is disabled in the database and api doesnt return it', async () => {
    const requestMock = {
      app: {},
      query: {
        servicetype: ServiceTypes.antigen,
      },
      params: {
        identifier: 'id-1',
      },
    } as unknown as Request;

    getRequiredRequestQueryMock.mockReturnValue(ServiceTypes.antigen);
    getProviderLocationByIdAndServiceTypeMock.mockReturnValue({
      errorCode: 404,
      message: 'not found',
    });
    await getLocationByIdentifierHandler(
      requestMock,
      routerResponseMock,
      configurationMock
    );
    expect(getProviderLocationByIdAndServiceTypeMock).toHaveBeenCalledWith(
      configurationMock,
      'id-1',
      serviceTypeMock
    );
    expect(trackProviderLocationDetailsFailureEventMock).toHaveBeenCalledTimes(
      1
    );
    expect(trackProviderLocationDetailsFailureEventMock).toHaveBeenCalledWith(
      serviceTypeMock,
      StringFormatter.format(
        ErrorConstants.LOCATION_NOT_FOUND,
        new Map<string, string>([['locationId', 'id-1']])
      )
    );
    expect(knownFailureResponseMock).toBeCalledTimes(1);
    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.INVALID_SERVICE_LOCATION
    );
  });
  it('should return empty services if service does not exist in that location', async () => {
    const requestMock = {
      app: {},
      query: {
        servicetype: ServiceTypes.antigen,
      },
      params: {
        identifier: 'id-1',
      },
    } as unknown as Request;

    getRequiredRequestQueryMock.mockReturnValue(ServiceTypes.antigen);
    getProviderLocationByIdAndServiceTypeMock.mockReturnValue(
      providerLocationResponseWithoutServicesMock
    );
    await getLocationByIdentifierHandler(
      requestMock,
      routerResponseMock,
      configurationMock
    );
    expect(getProviderLocationByIdAndServiceTypeMock).toHaveBeenCalledWith(
      configurationMock,
      'id-1',
      serviceTypeMock
    );
    expect(trackProviderLocationDetailsFailureEventMock).toHaveBeenCalledTimes(
      1
    );
    expect(trackProviderLocationDetailsFailureEventMock).toHaveBeenCalledWith(
      serviceTypeMock,
      StringFormatter.format(
        ErrorConstants.SERVICE_TYPE_NOT_FOUND,
        new Map<string, string>([
          ['locationId', 'id-1'],
          ['serviceType', serviceTypeMock],
        ])
      )
    );
    expect(knownFailureResponseMock).toBeCalledTimes(1);
    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.INVALID_SERVICE_LOCATION
    );
  });
  it('should return invalid service type if service is not set for everyone ', async () => {
    const requestMock = {
      app: {},
      query: {
        servicetype: ServiceTypes.antigen,
      },
      params: {
        identifier: 'id-1',
      },
    } as unknown as Request;

    const providerLocationsMock = {
      ...providerLocationResponseWithServiceTypeFilterMock,
      location: {
        ...providerLocationResponseWithServiceTypeFilterMock.location,
        serviceList: [
          {
            serviceName: 'fake-name',
            serviceDescription: 'fake-desc',
            questions: [],
            serviceType: 'COVID-19 Antigen Testing',
            screenTitle: 'screen1',
            screenDescription: 'screen-desc',
            confirmationDescription: 'confirm-desc',
            duration: 15,
            minLeadDays: 'P6D',
            maxLeadDays: 'P30D',
            status: 'inviteOnly',
            isTestService: false,
          },
        ],
      },
    };

    getRequiredRequestQueryMock.mockReturnValue(ServiceTypes.antigen);
    getProviderLocationByIdAndServiceTypeMock.mockReturnValue(
      providerLocationsMock
    );
    await getLocationByIdentifierHandler(
      requestMock,
      routerResponseMock,
      configurationMock
    );
    expect(getProviderLocationByIdAndServiceTypeMock).toHaveBeenCalledWith(
      configurationMock,
      'id-1',
      serviceTypeMock
    );
    expect(trackProviderLocationDetailsFailureEventMock).toHaveBeenCalledTimes(
      1
    );
    expect(trackProviderLocationDetailsFailureEventMock).toHaveBeenCalledWith(
      serviceTypeMock,
      StringFormatter.format(
        ErrorConstants.SERVICE_TYPE_NOT_FOUND,
        new Map<string, string>([
          ['locationId', 'id-1'],
          ['serviceType', serviceTypeMock],
        ])
      )
    );
    expect(knownFailureResponseMock).toBeCalledTimes(1);
    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.INVALID_SERVICE_LOCATION
    );
  });

  it('should return success if users tries to access test provider location/service using featureflag', async () => {
    const requestMock = {
      app: {},
      query: {
        servicetype: ServiceTypes.antigen,
      },
      params: {
        identifier: 'id-1',
      },
    } as unknown as Request;

    getResponseLocalMock.mockReturnValueOnce(undefined);
    getProviderLocationByIdAndServiceTypeMock.mockReturnValue(
      providerLocationResponseWithServiceTypeFilterMock
    );
    getRequiredRequestQueryMock.mockReturnValue(ServiceTypes.antigen);
    getRequiredResponseLocalMock.mockReturnValueOnce({ usepharmacy: true });
    getRequiredResponseLocalMock.mockReturnValueOnce(accountMock);

    await getLocationByIdentifierHandler(
      requestMock,
      routerResponseMock,
      configurationMock
    );

    expect(getRequiredRequestQueryMock).toHaveBeenCalledTimes(1);
    expect(getRequiredRequestQueryMock).toHaveBeenCalledWith(
      requestMock,
      'servicetype'
    );
    expect(getProviderLocationByIdAndServiceTypeMock).toHaveBeenCalledWith(
      configurationMock,
      'id-1',
      serviceTypeMock
    );
    expect(generateSuccessResponseForLocationMock).toBeCalledTimes(1);
    expect(generateSuccessResponseForLocationMock).toHaveBeenCalledWith(
      routerResponseMock,
      providerLocationResponseWithServiceTypeFilterMock.location,
      providerLocationResponseWithServiceTypeFilterMock.service
    );
  });

  it('should return error if user age is younger than service minimum age', async () => {
    const requestMock = {
      app: {},
      query: {
        servicetype: ServiceTypes.antigen,
      },
      params: {
        identifier: 'id-1',
      },
    } as unknown as Request;

    getProviderLocationByIdAndServiceTypeMock.mockReturnValue(
      providerLocationResponseWithServiceTypeFilterMock
    );
    getRequiredRequestQueryMock.mockReturnValue(ServiceTypes.antigen);
    getRequiredResponseLocalMock.mockReturnValueOnce(featuresMock);
    getRequiredResponseLocalMock.mockReturnValueOnce(accountMock);
    calculateAbsoluteAgeMock.mockReturnValue(14);

    const ageError = StringFormatter.format(
      ErrorConstants.DEEP_LINK_SCHEDULER_AGE_REQUIREMENT_NOT_MET,
      new Map<string, string>([
        [
          'ageRequirement',
          providerLocationResponseWithServiceTypeFilterMock.service?.schedulerMinimumAge?.toString() ??
            '',
        ],
        [
          'serviceName',
          providerLocationResponseWithServiceTypeFilterMock.service
            ?.serviceName ?? '',
        ],
        ['supportEmail', configurationMock.supportEmail],
      ])
    );

    await getLocationByIdentifierHandler(
      requestMock,
      routerResponseMock,
      configurationMock
    );

    expect(getRequiredRequestQueryMock).toHaveBeenCalledTimes(1);
    expect(getRequiredRequestQueryMock).toHaveBeenCalledWith(
      requestMock,
      'servicetype'
    );
    expect(getProviderLocationByIdAndServiceTypeMock).toHaveBeenCalledWith(
      configurationMock,
      'id-1',
      serviceTypeMock
    );
    expect(trackProviderLocationDetailsFailureEventMock).toHaveBeenCalledTimes(
      1
    );
    expect(trackProviderLocationDetailsFailureEventMock).toHaveBeenCalledWith(
      serviceTypeMock,
      ageError,
      accountMock.dateOfBirth
    );
    expect(knownFailureResponseMock).toHaveBeenCalledTimes(1);
    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      HttpStatusCodes.BAD_REQUEST,
      ageError,
      undefined,
      InternalResponseCode.SCHEDULER_AGE_REQUIREMENT_NOT_MET
    );
  });
  it('should return error if api throws any exception', async () => {
    const requestMock = {
      app: {},
      query: {
        servicetype: ServiceTypes.antigen,
      },
      params: { identifier: 'id-1' },
    } as unknown as Request;

    const error = { message: 'internal error' };

    getProviderLocationByIdAndServiceTypeMock.mockImplementation(() => {
      throw error;
    });
    getRequiredRequestQueryMock.mockReturnValue(serviceTypeMock);

    await getLocationByIdentifierHandler(
      requestMock,
      routerResponseMock,
      configurationMock
    );
    expect(unknownFailureResponseMock).toHaveBeenNthCalledWith(
      1,
      routerResponseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error
    );
  });
});
