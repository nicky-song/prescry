// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { logTelemetryEvent } from '../utils/app-insight-helper';
import { logRequestBodyMiddleware } from './log-request-body.middleware';

jest.mock('../utils/app-insight-helper');

const logTelemetryEventMock = logTelemetryEvent as jest.Mock;

describe('logRequestBodyMiddleware', () => {
  beforeEach(() => {
    logTelemetryEventMock.mockReset();
  });
  it('expects logTelemetryEvent to be called with request body and request url if request is POST', () => {
    const requestMock: Request = {
      body: { orderNumber: '1234' },
      url: 'req-url',
      originalUrl: 'orig-url',
      method: 'POST',
    } as unknown as Request;
    const nextMock = jest.fn();
    const responseMock = {} as Response;

    logRequestBodyMiddleware(requestMock, responseMock, nextMock);

    expect(logTelemetryEventMock).toBeCalledTimes(1);
    expect(logTelemetryEventMock).toBeCalledWith('REQUEST_BODY_req-url', {
      body: '{"orderNumber":"1234"}',
      originalUrl: 'orig-url',
    });
    expect(nextMock).toBeCalled();
  });
  it('expects logTelemetryEvent not to be called if request is not POST', () => {
    const requestMock: Request = {
      body: { orderNumber: '1234' },
      url: 'req-url',
      originalUrl: 'orig-url',
      method: 'GET',
    } as unknown as Request;
    const nextMock = jest.fn();
    const responseMock = {} as Response;

    logRequestBodyMiddleware(requestMock, responseMock, nextMock);
    expect(logTelemetryEventMock).not.toBeCalled();
    expect(nextMock).toBeCalled();
  });

  it('expects logTelemetryEvent not to be called if request is POST but has empty body', () => {
    const requestMock: Request = {
      body: {},
      url: 'req-url',
      originalUrl: 'orig-url',
      method: 'POST',
    } as unknown as Request;
    const nextMock = jest.fn();
    const responseMock = {} as Response;

    logRequestBodyMiddleware(requestMock, responseMock, nextMock);
    expect(logTelemetryEventMock).not.toBeCalled();
    expect(nextMock).toBeCalled();
  });

  it.each([
    ['/api/one-time-password/verify', 1],
    ['/api/one-time-password/send', 1],
    ['/api/Account/pin/verify', 0],
  ])(
    'expects logTelemetryEvent not to be called if url is one of the pin URLs (%p) (%p)',
    (origUrl: string, count: number) => {
      const requestMock: Request = {
        body: { orderNumber: '1234' },
        url: 'req-url',
        originalUrl: origUrl,
        method: 'POST',
      } as unknown as Request;
      const nextMock = jest.fn();
      const responseMock = {} as Response;

      logRequestBodyMiddleware(requestMock, responseMock, nextMock);
      expect(logTelemetryEventMock).toBeCalledTimes(count);

      expect(nextMock).toBeCalled();
    }
  );
});
