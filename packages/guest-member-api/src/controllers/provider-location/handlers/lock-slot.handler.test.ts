// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IConfiguration } from '../../../configuration';
import { lockSlotHandler } from './lock-slot.handler';
import * as lockSlotEndpointHelper from '../helpers/lock-slot-endpoint.helper';
import { ILockSlotRequestBody } from '@phx/common/src/models/api-request-body/lock-slot-request-body';
import { ILockSlotEndpointResponse } from '../helpers/lock-slot-endpoint.helper';
import {
  ErrorConstants,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';

jest.mock('../../../utils/response-helper');

const successResponseMock = SuccessResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Lock slot handler', () => {
  it('should call lock slot handler with success response', async () => {
    // arrange
    const request = createLockSlotRequest() as unknown as Request;
    const response = {} as unknown as Response;
    const configuration = {} as IConfiguration;
    const createLockSlotEndpointHelperMock = jest.spyOn(
      lockSlotEndpointHelper,
      'createLockSlotEndpointHelper'
    );

    const slotExpirationDate = new Date();
    slotExpirationDate.setMinutes(slotExpirationDate.getMinutes() + 5);

    const createLockSlotEndpointHelperMockedResponse: ILockSlotEndpointResponse =
      {
        message: 'success',
        data: {
          bookingId: 'bookingId',
          slotExpirationDate,
        },
      };
    createLockSlotEndpointHelperMock.mockReturnValueOnce(
      Promise.resolve(createLockSlotEndpointHelperMockedResponse)
    );
    // act
    await lockSlotHandler(request, response, configuration);
    // assert
    expect(createLockSlotEndpointHelperMock).toBeCalledTimes(1);
    expect(createLockSlotEndpointHelperMock).toHaveBeenCalledWith(
      configuration,
      request.body
    );
    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock).toHaveBeenCalledWith(
      response,
      SuccessConstants.SUCCESS_OK,
      createLockSlotEndpointHelperMockedResponse.data
    );
  });

  it('should return unknown failure response when api returns unknown error', async () => {
    // arrange
    const error = 'Internal server error';
    const expected: Partial<Response> = {
      statusCode: 500,
      statusMessage: ErrorConstants.INTERNAL_SERVER_ERROR,
    };
    unknownFailureResponseMock.mockReturnValueOnce(expected);
    const createLockSlotEndpointHelperMock = jest.spyOn(
      lockSlotEndpointHelper,
      'createLockSlotEndpointHelper'
    );

    createLockSlotEndpointHelperMock.mockImplementationOnce(() => {
      throw error;
    });
    // act
    const lockHandlerResponse = await sut();
    // assert
    expect(unknownFailureResponseMock).toBeCalled();
    expect(lockHandlerResponse.statusCode).toBe(500);
    expect(lockHandlerResponse.statusMessage).toBe(
      ErrorConstants.INTERNAL_SERVER_ERROR
    );
  });

  it('should return known failure response when api is not returning expected response', async () => {
    // arrange

    const expected: Partial<Response> = {
      statusCode: 404,
      statusMessage: 'Slot not available',
    };
    knownFailureResponseMock.mockReturnValueOnce(expected);

    const createLockSlotEndpointHelperMock = jest.spyOn(
      lockSlotEndpointHelper,
      'createLockSlotEndpointHelper'
    );

    const createLockSlotEndpointHelperMockedResponse: ILockSlotEndpointResponse =
      {
        message: 'Slot not available',
        errorCode: 404,
      };

    createLockSlotEndpointHelperMock.mockReturnValueOnce(
      Promise.resolve(createLockSlotEndpointHelperMockedResponse)
    );

    // act
    const lockHandlerResponse = await sut();
    // assert
    expect(knownFailureResponseMock).toBeCalled();
    expect(lockHandlerResponse.statusCode).toBe(404);
  });
});

function createLockSlotRequest(
  locationId = 'locationId',
  startDate: Date = new Date(),
  serviceType = 'serviceType',
  customerPhoneNumber = 'customerPhoneNumber'
) {
  const requestBody: ILockSlotRequestBody = {
    locationId,
    startDate,
    serviceType,
    customerPhoneNumber,
  };
  return {
    body: requestBody,
  };
}

function sut(
  request: Request = createLockSlotRequest() as unknown as Request,
  response: Response = {} as unknown as Response,
  configuration: IConfiguration = {} as unknown as IConfiguration
) {
  return lockSlotHandler(request, response, configuration);
}
