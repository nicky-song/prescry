// Copyright 2020 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../errors/error-api-response';
import { HttpStatusCodes } from '../../../errors/error-codes';
import {
  ICreateBookingResponse,
  ICreateBookingResponseData,
} from '../../../models/api-response/create-booking-response';
import { ErrorConstants } from '../../../theming/constants';
import { call, IApiConfig } from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { createBooking } from './api-v1.create-booking';
import {
  ICreateBookingRequestBody,
  IMemberAddress,
} from '../../../models/api-request-body/create-booking.request-body';
import { RequestHeaders } from './api-request-headers';

jest.mock('../../../utils/api.helper', () => ({
  ...(jest.requireActual('../../../utils/api.helper') as object),
  call: jest.fn(),
}));
const mockCall = call as jest.Mock;

jest.mock('./api-v1-helper', () => ({
  ...(jest.requireActual('./api-v1-helper') as object),
  handleHttpErrors: jest.fn(),
}));
const mockHandleHttpErrors = handleHttpErrors as jest.Mock;

const mockConfig: IApiConfig = {
  env: {
    host: 'localhost',
    port: '4300',
    protocol: 'https',
    version: 'v1',
    url: '/api',
  },
  paths: {
    createBooking: '/create-booking',
  },
};

const mockRetryPolicy = {} as IRetryPolicy;

const createBookingRequestBody = {
  locationId: '5e6a23ad138c5d191c68c892',
  serviceType: 'service-type',
  start: '2020-07-20T08:30:00',
  questions: [
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
  ],
} as ICreateBookingRequestBody;

const mockResponseData = {
  appointment: {
    serviceName: 'mock-name',
    status: 'Accepted',
    orderNumber: 'ordernumber',
    locationName: 'provider-name',
    address1: 'mock-addr1',
    address2: 'mock-addr2',
    city: 'fake-city',
    zip: 'fake-zip',
    state: 'fake-state',
    additionalInfo: undefined,
    date: 'Tuesday, June 23rd',
    time: '6:00 pm',
  },
} as unknown as ICreateBookingResponseData;

const mockResponse: ICreateBookingResponse = {
  data: mockResponseData,
  message: 'all good',
  status: 'ok',
};

describe('create booking', () => {
  beforeEach(() => {
    mockCall.mockReset();
    mockHandleHttpErrors.mockReset();
  });

  it('makes expected api request', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const authToken = 'auth-token';
    const deviceToken = 'device-token';
    await createBooking(
      mockConfig,
      createBookingRequestBody,
      authToken,
      deviceToken,
      mockRetryPolicy
    );

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.createBooking}`;
    const expectedBody = createBookingRequestBody;
    const expectedHeaders = {
      Authorization: authToken,
      'x-prescryptive-device-token': deviceToken,
      [RequestHeaders.apiVersion]: version
    };

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      expectedBody,
      'POST',
      expectedHeaders,
      mockRetryPolicy
    );
  });

  it('throws expected error if response invalid', async () => {
    const statusCode = HttpStatusCodes.SUCCESS;
    const expectedError = new ErrorApiResponse(
      ErrorConstants.errorInternalServer()
    );

    mockCall.mockResolvedValue({
      json: () => ({}),
      ok: true,
      status: statusCode,
    });

    try {
      await createBooking(
        mockConfig,
        createBookingRequestBody,
        'auth-token',
        'device-token',
        mockRetryPolicy
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }
  });

  it('returns expected response', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const response = await createBooking(
      mockConfig,
      createBookingRequestBody,
      'auth-token',
      'device-token',
      mockRetryPolicy
    );
    expect(response).toEqual(mockResponse);
  });

  it('throws expected error if response failed', async () => {
    const statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    const expectedError = Error('Failed');
    const errorCode = 1;

    mockCall.mockResolvedValue({
      json: () => ({
        code: errorCode,
      }),
      ok: false,
      status: statusCode,
    });

    mockHandleHttpErrors.mockReturnValue(expectedError);

    try {
      await createBooking(
        mockConfig,
        createBookingRequestBody,
        'auth-token',
        'device-token',
        mockRetryPolicy
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }

    expect(mockHandleHttpErrors).toHaveBeenCalledWith(
      statusCode,
      ErrorConstants.errorForCreateBooking,
      APITypes.CREATE_BOOKING,
      errorCode,
      {
        code: errorCode,
      }
    );
  });

  it('sends expected dependentInfo values when address matches parent', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });
    const contentBodySameAddress = {
      ...createBookingRequestBody,
      dependentInfo: {
        firstName: 'Test-first',
        lastName: 'Test-last',
        dateOfBirth: '2005-01-01',
        addressSameAsParent: true,
      },
    };

    const reducedBodySameAddress = {
      ...createBookingRequestBody,
      dependentInfo: {
        firstName: 'Test-first',
        lastName: 'Test-last',
        dateOfBirth: '2005-01-01',
        addressSameAsParent: true,
      },
    };

    const authToken = 'auth-token';
    const deviceToken = 'device-token';
    await createBooking(
      mockConfig,
      contentBodySameAddress,
      authToken,
      deviceToken,
      mockRetryPolicy
    );

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.createBooking}`;
    const expectedBody = reducedBodySameAddress;
    const expectedHeaders = {
      Authorization: authToken,
      'x-prescryptive-device-token': deviceToken,
      [RequestHeaders.apiVersion]: version
    };

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      expectedBody,
      'POST',
      expectedHeaders,
      mockRetryPolicy
    );
  });

  it('sends expected dependentInfo values when address does not match parent', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });
    const contentBodySameAddress = {
      ...createBookingRequestBody,
      dependentInfo: {
        firstName: 'Test-first',
        lastName: 'Test-last',
        dateOfBirth: '2005-01-01',
        addressSameAsParent: false,
        address: {
          address1: '123 Main St',
          county: 'King',
          city: 'Seattle',
          state: 'WA',
          zip: '99999',
        } as IMemberAddress,
      },
    };

    const reducedBodySameAddress = {
      ...createBookingRequestBody,
      dependentInfo: {
        firstName: 'Test-first',
        lastName: 'Test-last',
        dateOfBirth: '2005-01-01',
        addressSameAsParent: false,
        address: {
          address1: '123 Main St',
          county: 'King',
          city: 'Seattle',
          state: 'WA',
          zip: '99999',
        } as IMemberAddress,
      },
    };

    const authToken = 'auth-token';
    const deviceToken = 'device-token';
    await createBooking(
      mockConfig,
      contentBodySameAddress,
      authToken,
      deviceToken,
      mockRetryPolicy
    );

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.createBooking}`;
    const expectedBody = reducedBodySameAddress;
    const expectedHeaders = {
      Authorization: authToken,
      'x-prescryptive-device-token': deviceToken,
      [RequestHeaders.apiVersion]: version
    };

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      expectedBody,
      'POST',
      expectedHeaders,
      mockRetryPolicy
    );
  });

  it('sends expected dependentInfo values when dependent already exists', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });
    const contentBodySameAddress = {
      ...createBookingRequestBody,
      dependentInfo: {
        identifier: 'id-1',
        firstName: 'Test-first',
        lastName: 'Test-last',
        dateOfBirth: '2005-01-01',
        masterId: 'master-id',
      },
    };

    const reducedBodySameAddress = {
      ...createBookingRequestBody,
      dependentInfo: {
        identifier: 'id-1',
        masterId: 'master-id',
      },
    };

    const authToken = 'auth-token';
    const deviceToken = 'device-token';
    await createBooking(
      mockConfig,
      contentBodySameAddress,
      authToken,
      deviceToken,
      mockRetryPolicy
    );

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.createBooking}`;
    const expectedBody = reducedBodySameAddress;
    const expectedHeaders = {
      Authorization: authToken,
      'x-prescryptive-device-token': deviceToken,
      [RequestHeaders.apiVersion]: version
    };

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      expectedBody,
      'POST',
      expectedHeaders,
      mockRetryPolicy
    );
  });

  it('trims leading nad trailing spaces for dependent first and last name before sending info to API', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });
    const contentBodySameAddress = {
      ...createBookingRequestBody,
      dependentInfo: {
        firstName: '     Test-first',
        lastName: 'Test-last    ',
        dateOfBirth: '2005-01-01',
        addressSameAsParent: false,
        address: {
          address1: '123 Main St',
          county: 'King',
          city: 'Seattle',
          state: 'WA',
          zip: '99999',
        } as IMemberAddress,
      },
    };

    const reducedBodySameAddress = {
      ...createBookingRequestBody,
      dependentInfo: {
        firstName: 'Test-first',
        lastName: 'Test-last',
        dateOfBirth: '2005-01-01',
        addressSameAsParent: false,
        address: {
          address1: '123 Main St',
          county: 'King',
          city: 'Seattle',
          state: 'WA',
          zip: '99999',
        } as IMemberAddress,
      },
    };

    const authToken = 'auth-token';
    const deviceToken = 'device-token';
    await createBooking(
      mockConfig,
      contentBodySameAddress,
      authToken,
      deviceToken,
      mockRetryPolicy
    );

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.createBooking}`;
    const expectedBody = reducedBodySameAddress;
    const expectedHeaders = {
      Authorization: authToken,
      'x-prescryptive-device-token': deviceToken,
      [RequestHeaders.apiVersion]: version
    };

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      expectedBody,
      'POST',
      expectedHeaders,
      mockRetryPolicy
    );
  });
});
