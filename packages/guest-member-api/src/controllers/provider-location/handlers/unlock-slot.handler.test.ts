// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  SuccessConstants,
  ErrorConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { IConfiguration } from '../../../configuration';
import {
  SuccessResponse,
  KnownFailureResponse,
  UnknownFailureResponse,
  validatePhoneNumberErrorType,
} from '../../../utils/response-helper';

import * as unlockSlotEndpointHelper from '../helpers/unlock-slot-endpoint.helper';
import { IUnlockSlotEndpointResponse } from '../helpers/unlock-slot-endpoint.helper';
import { unlockSlotHandler } from './unlock-slot.handler';

jest.mock('../../../utils/response-helper');

const successResponseMock = SuccessResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;

const validatePhoneNumberErrorTypeMock =
  validatePhoneNumberErrorType as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Unlock slot handler', () => {
  it('should call unlock slot handler with success response', async () => {
    // arrange
    const request = createUnlockSlotRequest() as unknown as Request;
    const response = {} as unknown as Response;
    const configuration = {} as IConfiguration;
    const createUnlockSlotEndpointHelperMock = jest.spyOn(
      unlockSlotEndpointHelper,
      'createUnlockSlotEndpointHelper'
    );

    const slotExpirationDate = new Date();
    slotExpirationDate.setMinutes(slotExpirationDate.getMinutes() + 5);

    const createUnlockSlotEndpointHelperMockedResponse: IUnlockSlotEndpointResponse =
      {
        message: 'success',
      };
    createUnlockSlotEndpointHelperMock.mockReturnValueOnce(
      Promise.resolve(createUnlockSlotEndpointHelperMockedResponse)
    );
    // act
    await unlockSlotHandler(request, response, configuration);
    // assert
    expect(createUnlockSlotEndpointHelperMock).toBeCalledTimes(1);
    expect(createUnlockSlotEndpointHelperMock).toHaveBeenCalledWith(
      configuration,
      request.params.id
    );
    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock).toHaveBeenCalledWith(
      response,
      SuccessConstants.SUCCESS_OK
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
    const createUnlockSlotEndpointHelperMock = jest.spyOn(
      unlockSlotEndpointHelper,
      'createUnlockSlotEndpointHelper'
    );

    createUnlockSlotEndpointHelperMock.mockImplementationOnce(() => {
      throw error;
    });

    validatePhoneNumberErrorTypeMock.mockReturnValue({
      isKnownError: false,
    });

    // act
    const unlockHandlerResponse = await sut();
    // assert
    expect(unknownFailureResponseMock).toBeCalled();
    expect(unlockHandlerResponse.statusCode).toBe(500);
    expect(unlockHandlerResponse.statusMessage).toBe(
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
      unlockSlotEndpointHelper,
      'createUnlockSlotEndpointHelper'
    );

    const createLockSlotEndpointHelperMockedResponse: IUnlockSlotEndpointResponse =
      {
        message: 'Booking not found',
        errorCode: 404,
      };

    createLockSlotEndpointHelperMock.mockReturnValueOnce(
      Promise.resolve(createLockSlotEndpointHelperMockedResponse)
    );

    // act
    const unlockHandlerResponse = await sut();
    // assert
    expect(knownFailureResponseMock).toBeCalled();
    expect(unlockHandlerResponse.statusCode).toBe(404);
  });
});

function createUnlockSlotRequest(bookingId = 'bookingId') {
  return {
    params: {
      id: bookingId,
    },
  };
}

function sut(
  request: Request = createUnlockSlotRequest() as unknown as Request,
  response: Response = {} as unknown as Response,
  configuration: IConfiguration = {} as unknown as IConfiguration
) {
  return unlockSlotHandler(request, response, configuration);
}
