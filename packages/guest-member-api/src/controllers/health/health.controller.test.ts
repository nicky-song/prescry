// Copyright 2018 Prescryptive Health, Inc.

import { Response } from 'express';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../constants/response-messages';
import {
  ErrorFailureResponse,
  SuccessResponse,
} from '../../utils/response-helper';
import { getHealthStatusResponse, HealthController } from './health.controller';

jest.mock('../../utils/response-helper', () => ({
  ErrorFailureResponse: jest.fn(),
  SuccessResponse: jest.fn(),
}));
const successResponseMock = SuccessResponse as jest.Mock;
const ErrorFailureResponseMock = ErrorFailureResponse as jest.Mock;

const routerResponseMock = {} as Response;

beforeEach(() => {
  jest.resetAllMocks();
});

describe('HealthController', () => {
  it('should create controller object with readiness route method', () => {
    const healthController = new HealthController();
    expect(HealthController.state).toEqual('starting');
    expect(healthController.readiness).toBeDefined();
    expect(healthController.liveness).toBeDefined();
  });
});

describe('getHealthStatusResponse', () => {
  it('should return success if state is live', async () => {
    HealthController.state = 'live';

    await getHealthStatusResponse('live', routerResponseMock);
    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock.mock.calls[0][0]).toBe(routerResponseMock);
    expect(successResponseMock.mock.calls[0][1]).toBe(
      SuccessConstants.SUCCESS_OK
    );
  });

  it('should return failure with 503 if state is Starting', async () => {
    HealthController.state = 'starting';

    await getHealthStatusResponse('starting', routerResponseMock);
    expect(ErrorFailureResponseMock).toBeCalledTimes(1);
    expect(ErrorFailureResponseMock).toHaveBeenCalledWith(
      {},
      HttpStatusCodes.SERVICE_UNAVAILABLE,
      new Error(ErrorConstants.SERVER_IS_STARTING)
    );
  });

  it('should return failure with 500 if the state is failed', async () => {
    HealthController.state = 'failed';
    HealthController.failureReason = 'failure reason';

    await getHealthStatusResponse('failed', routerResponseMock);
    expect(ErrorFailureResponseMock).toBeCalledTimes(1);
    expect(ErrorFailureResponseMock).toHaveBeenCalledWith(
      {},
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      new Error('failure reason')
    );
  });
});
