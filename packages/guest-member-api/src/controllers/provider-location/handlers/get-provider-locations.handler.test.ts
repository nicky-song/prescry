// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { getProviderLocationsHandler } from './get-provider-locations.handler';
import { ServiceTypes } from '@phx/common/src/models/provider-location';
import {
  SuccessConstants,
  ErrorConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { IServices } from '../../../models/services';
import { fetchRequestHeader } from '../../../utils/request-helper';
import {
  getRequiredRequestQuery,
  getRequestQuery,
} from '../../../utils/request/get-request-query';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import {
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { generateSuccessResponseForLocationsWithDistance } from '../helpers/generate-response-distance.helper';
import { getServiceDetailsByServiceType } from '../../../utils/external-api/get-service-details-by-service-type';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { getNearbyProviderLocationsForZipCode } from '../helpers/get-nearby-provider-locations-for-zip-code';
import { IProviderLocationListItem } from '../../../models/pharmacy-portal/get-provider-location.response';

jest.mock('../../../utils/response-helper');
jest.mock('../../../utils/request/get-request-query');
jest.mock('../../../utils/request/request-app-locals.helper');
jest.mock('../../../utils/request-helper');
jest.mock('../../../utils/external-api/get-service-details-by-service-type');
jest.mock('../helpers/generate-response-distance.helper');
jest.mock('../helpers/get-nearby-provider-locations-for-zip-code');

const routerResponseMock = {} as Response;
const successResponseMock = SuccessResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;
const getRequiredRequestQueryMock = getRequiredRequestQuery as jest.Mock;
const getRequestQueryMock = getRequestQuery as jest.Mock;
const getRequiredResponseLocalMock = getRequiredResponseLocal as jest.Mock;
const getServiceDetailsByServiceTypeMock =
  getServiceDetailsByServiceType as jest.Mock;
const generateSuccessResponseForLocationsWithDistanceMock =
  generateSuccessResponseForLocationsWithDistance as jest.Mock;
const getNearbyProviderLocationsForZipCodeMock =
  getNearbyProviderLocationsForZipCode as jest.Mock;

const fetchRequestHeaderMock = fetchRequestHeader as jest.Mock;
const serviceType = 'COVID-19 Antigen Testing';

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
  minimumAge: 3,
} as IServices;

const providerLocationsMock = [
  {
    id: 'id-1',
    providerName: 'provider',
    locationName: 'test-location',
    address: {
      line1: 'mock-address1',
      line2: 'mock-address2',
      city: 'mock-city',
      state: 'mock-state',
      zipCode: 'mock-zip',
    },
    phoneNumber: 'mock-phone',
    distanceMiles: 5,
  },
  {
    id: 'id-2',
    providerName: 'provider2',
    locationName: 'test-location2',
    address: {
      line1: 'mock2-address1',
      line2: 'mock2-address2',
      city: 'mock-city2',
      state: 'mock-state2',
      zipCode: 'mock-zip2',
    },
    phoneNumber: 'mock-phone2',
    distanceMiles: 3,
  },
  {
    id: 'id-3',
    providerName: 'provider3',
    locationName: 'test-location3',
    address: {
      line1: 'mock3-address1',
      line2: 'mock3-address2',
      city: 'mock-city3',
      state: 'mock-state3',
      zipCode: 'mock-zip3',
    },
    phoneNumber: 'mock-phone3',
    distanceMiles: 4,
  },
] as IProviderLocationListItem[];

beforeEach(() => {
  jest.clearAllMocks();
  getServiceDetailsByServiceTypeMock.mockReturnValue({
    service: mockServiceTypeDetails,
  });
});

describe('getProviderLocationsHandler', () => {
  it('should return success from getProviderLocationsHandler successfully if there is no error from database', async () => {
    const requestMock = {
      app: {},
      query: {
        servicetype: ServiceTypes.antigen,
      },
    } as unknown as Request;

    getNearbyProviderLocationsForZipCodeMock.mockReturnValue({
      locations: providerLocationsMock,
    });
    getRequiredRequestQueryMock.mockReturnValue(ServiceTypes.antigen);
    getRequestQueryMock
      .mockReturnValueOnce('22106') // zip code
      .mockReturnValueOnce(8); // distance
    getRequiredResponseLocalMock.mockReturnValueOnce({ usepharmacy: true });

    await getProviderLocationsHandler(
      requestMock,
      routerResponseMock,
      configurationMock
    );

    expect(getRequiredRequestQueryMock).toHaveBeenCalledTimes(1);
    expect(getRequiredRequestQueryMock).toHaveBeenCalledWith(
      requestMock,
      'servicetype'
    );
    expect(getRequestQueryMock).toHaveBeenCalledTimes(2);
    expect(getRequiredResponseLocalMock).toHaveBeenCalledTimes(1);
    expect(getRequiredResponseLocalMock).toHaveBeenNthCalledWith(
      1,
      routerResponseMock,
      'features'
    );

    expect(getNearbyProviderLocationsForZipCodeMock).toHaveBeenCalledWith(
      configurationMock,
      serviceType,
      true,
      8,
      '22106'
    );

    expect(getRequestQueryMock).toHaveBeenNthCalledWith(
      1,
      requestMock,
      'zipcode'
    );

    expect(getRequestQueryMock).toHaveBeenNthCalledWith(
      2,
      requestMock,
      'distance'
    );

    expect(generateSuccessResponseForLocationsWithDistanceMock).toBeCalledTimes(
      1
    );
    expect(
      generateSuccessResponseForLocationsWithDistanceMock
    ).toHaveBeenCalledWith(routerResponseMock, providerLocationsMock);
  });

  it('should return empty list from getProviderLocationsHandler if no location is received', async () => {
    const requestMock = {
      app: {},
      query: {
        servicetype: ServiceTypes.antigen,
      },
    } as unknown as Request;
    getRequiredRequestQueryMock.mockReturnValue(serviceType);
    getNearbyProviderLocationsForZipCodeMock.mockResolvedValue({
      locations: null,
    });
    getRequiredResponseLocalMock.mockReturnValueOnce({});
    await getProviderLocationsHandler(
      requestMock,
      routerResponseMock,
      configurationMock
    );
    expect(getNearbyProviderLocationsForZipCodeMock).toHaveBeenCalledWith(
      configurationMock,
      serviceType,
      false,
      undefined,
      undefined
    );
    expect(getNearbyProviderLocationsForZipCodeMock).toHaveBeenCalledTimes(1);
    expect(getRequestQueryMock).toHaveBeenCalledTimes(2);
    expect(getRequestQueryMock).toHaveBeenNthCalledWith(
      1,
      requestMock,
      'zipcode'
    );

    expect(getRequestQueryMock).toHaveBeenNthCalledWith(
      2,
      requestMock,
      'distance'
    );

    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      SuccessConstants.DOCUMENT_FOUND,
      {
        locations: [],
        serviceNameMyRx: mockServiceTypeDetails.serviceNameMyRx,
        minimumAge: mockServiceTypeDetails.minimumAge,
      }
    );
  });

  it('should return error from getProviderLocationsHandler if any exception occurs', async () => {
    const requestMock = {
      app: {},
      query: {
        servicetype: ServiceTypes.antigen,
      },
    } as unknown as Request;

    const error = { message: 'internal error' };

    getNearbyProviderLocationsForZipCodeMock.mockImplementation(() => {
      throw error;
    });
    getRequiredRequestQueryMock.mockReturnValue(serviceType);
    getRequiredResponseLocalMock.mockReturnValueOnce({});

    await getProviderLocationsHandler(
      requestMock,
      routerResponseMock,
      configurationMock
    );
    expect(getNearbyProviderLocationsForZipCodeMock).toHaveBeenCalled();
    expect(getNearbyProviderLocationsForZipCodeMock).toHaveBeenNthCalledWith(
      1,
      configurationMock,
      serviceType,
      false,
      undefined,
      undefined
    );
    expect(unknownFailureResponseMock).toHaveBeenNthCalledWith(
      1,
      routerResponseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error
    );
  });
  it('should return isTest locations also from getProviderLocationsHandler if features flag usepharmacy is provided and member is test member', async () => {
    const requestMockWithFlag = {
      app: {
        locals: {
          personInfo: {
            isTestMembership: true,
          },
        },
      },
      query: { servicetype: ServiceTypes.antigen },
    } as unknown as Request;

    getRequiredRequestQueryMock.mockReturnValue(serviceType);
    getRequiredResponseLocalMock.mockReturnValueOnce({
      usetestpharmacy: false,
      usepharmacy: true,
    });
    getNearbyProviderLocationsForZipCodeMock.mockResolvedValue({
      locations: providerLocationsMock,
    });
    await getProviderLocationsHandler(
      requestMockWithFlag,
      routerResponseMock,
      configurationMock
    );
    expect(getNearbyProviderLocationsForZipCodeMock).toBeCalledTimes(1);
    expect(getNearbyProviderLocationsForZipCodeMock).toHaveBeenCalledWith(
      configurationMock,
      serviceType,
      true,
      undefined,
      undefined
    );
  });

  it('Should return empty list if no providers are nearby', async () => {
    const requestMock = {} as unknown as Request;
    const emptyProviderLocationsMock = [] as IProviderLocationListItem[];

    getNearbyProviderLocationsForZipCodeMock.mockResolvedValue({
      locations: emptyProviderLocationsMock,
    });
    getRequiredRequestQueryMock.mockReturnValue(ServiceTypes.antigen);
    getRequestQueryMock
      .mockReturnValueOnce('99903') // zip code
      .mockReturnValueOnce(8); // distance

    getRequiredResponseLocalMock.mockReturnValueOnce({ usepharmacy: true });
    await getProviderLocationsHandler(
      requestMock,
      routerResponseMock,
      configurationMock
    );

    expect(getRequiredRequestQueryMock).toHaveBeenCalledTimes(1);
    expect(getRequiredRequestQueryMock).toHaveBeenCalledWith(
      requestMock,
      'servicetype'
    );
    expect(getRequestQueryMock).toHaveBeenCalledTimes(2);
    expect(getRequiredResponseLocalMock).toHaveBeenCalledTimes(1);
    expect(getRequiredResponseLocalMock).toHaveBeenNthCalledWith(
      1,
      routerResponseMock,
      'features'
    );

    expect(getNearbyProviderLocationsForZipCodeMock).toHaveBeenCalledWith(
      configurationMock,
      serviceType,
      true,
      8,
      '99903'
    );

    expect(getRequestQueryMock).toHaveBeenNthCalledWith(
      1,
      requestMock,
      'zipcode'
    );

    expect(getRequestQueryMock).toHaveBeenNthCalledWith(
      2,
      requestMock,
      'distance'
    );
    expect(generateSuccessResponseForLocationsWithDistanceMock).toBeCalledTimes(
      1
    );
    expect(
      generateSuccessResponseForLocationsWithDistanceMock
    ).toHaveBeenCalledWith(routerResponseMock, [], mockServiceTypeDetails);
  });
  it('should return isTest locations also if servicetype is vaccine usepharmacy is in switches header even if user is not test user ', async () => {
    const requestMockWithFlag = {
      app: {
        locals: {
          personInfo: {
            isTestMembership: false,
          },
        },
      },
      query: { servicetype: ServiceTypes.c19VaccineDose1 },
    } as unknown as Request;
    fetchRequestHeaderMock.mockReturnValueOnce('f=usepharmacy:1,usevaccine:1');
    getRequiredRequestQueryMock.mockReturnValue(ServiceTypes.c19VaccineDose1);
    getRequiredResponseLocalMock.mockReturnValueOnce({
      usetestpharmacy: false,
      usepharmacy: false,
      usevaccine: true,
    });
    getNearbyProviderLocationsForZipCodeMock.mockResolvedValue({
      locations: providerLocationsMock,
    });
    await getProviderLocationsHandler(
      requestMockWithFlag,
      routerResponseMock,
      configurationMock
    );
    expect(getNearbyProviderLocationsForZipCodeMock).toBeCalledTimes(1);
    expect(getNearbyProviderLocationsForZipCodeMock).toHaveBeenCalledWith(
      configurationMock,
      ServiceTypes.c19VaccineDose1,
      true,
      undefined,
      undefined
    );
  });
});
