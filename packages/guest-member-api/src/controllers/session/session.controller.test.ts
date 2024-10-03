// Copyright 2018 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../constants/response-messages';
import {
  SuccessResponseWithInternalResponseCode,
  UnknownFailureResponse,
} from '../../utils/response-helper';
import { SessionController } from './session.controller';

jest.mock('../../utils/response-helper');
const successResponseMock =
  SuccessResponseWithInternalResponseCode as jest.Mock;
const errorResponseMock = UnknownFailureResponse as jest.Mock;

const mockPhoneNumber = 'fake-phone';
const routerResponseMock = {
  locals: {
    device: {
      data: mockPhoneNumber,
    },
    account: {
      phoneNumber: mockPhoneNumber,
      firstName: 'test',
      lastName: 'test-last',
      recoveryEmail: '',
    },
  },
} as unknown as Response;

const requestMock = {} as unknown as Request;

describe('SessionController', () => {
  beforeEach(() => {
    errorResponseMock.mockReset();
    successResponseMock.mockReset();
  });

  it('should return success with recoveryEmail if user email is in DB', () => {
    const responseMock = {
      locals: {
        ...routerResponseMock,
        account: {
          ...routerResponseMock.locals.account,
          recoveryEmail: 'abc@test.com',
        },
      },
    } as unknown as Response;

    const routeHandler = new SessionController().getSession;
    routeHandler(requestMock, responseMock);

    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock.mock.calls[0][0]).toBe(responseMock);
    expect(successResponseMock.mock.calls[0][1]).toBe(
      SuccessConstants.SUCCESS_OK
    );
    expect(successResponseMock.mock.calls[0][2]).toEqual({
      recoveryEmailExists: true,
    });
  });

  it('should return success with different data if user recovery email is not in DB', () => {
    const routeHandler = new SessionController().getSession;
    routeHandler(requestMock, routerResponseMock);

    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock.mock.calls[0][0]).toBe(routerResponseMock);
    expect(successResponseMock.mock.calls[0][1]).toBe(
      SuccessConstants.SUCCESS_OK
    );
    expect(successResponseMock.mock.calls[0][2]).toEqual({
      recoveryEmailExists: false,
    });
  });

  it('should call UnknownFailureResponse if exception occurred', () => {
    const routeHandler = new SessionController().getSession;
    const error = { message: 'internal error' };
    successResponseMock.mockImplementation(() => {
      throw error;
    });

    routeHandler(requestMock, routerResponseMock);

    expect(errorResponseMock).toHaveBeenCalled();
    expect(errorResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error
    );
  });
});
