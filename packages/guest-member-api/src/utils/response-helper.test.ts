// Copyright 2018 Prescryptive Health, Inc.

import { Response } from 'express';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';
import {
  ErrorConstants,
  TwilioErrorMessage,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { logTelemetryException } from './app-insight-helper';
import { GuestApiError } from './custom-error-helper';
import {
  trackPhoneNumberWithMaxAttemptsReachedEvent,
  trackUnsupportedPhoneNumberEvent,
} from './custom-event-helper';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
  validatePhoneNumberErrorType,
  SuccessResponseWithoutHeaders,
  errorResponseWithTwilioErrorHandling,
} from './response-helper';
import { logger } from './server-helper';
import { HttpStatusCodes } from '../constants/error-codes';
import RestException from 'twilio/lib/base/RestException';
import { ICommonBusinessMonitoringEventData } from '../models/common-business-monitoring-event';
import { publishCommonBusinessEventMessage } from './service-bus/common-business-event.helper';
import { publishCommonMonitoringEventMessage } from './service-bus/common-monitoring-event.helper';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';

const mockLoggerInfo = jest.fn();
const mockLoggerError = jest.fn();

jest.mock('./custom-event-helper');
const trackUnsupportedPhoneNumberEventMock =
  trackUnsupportedPhoneNumberEvent as jest.Mock;
const trackPhoneNumberWithMaxAttemptsReachedEventMock =
  trackPhoneNumberWithMaxAttemptsReachedEvent as jest.Mock;

jest.mock('./service-bus/common-business-event.helper');
const publishCommonBusinessEventMessageMock =
  publishCommonBusinessEventMessage as jest.Mock;

jest.mock('./service-bus/common-monitoring-event.helper');
const publishCommonMonitoringEventMessageMock =
  publishCommonMonitoringEventMessage as jest.Mock;

jest.mock('./server-helper', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));
logger.info = mockLoggerInfo;
logger.error = mockLoggerError;

jest.mock('./app-insight-helper', () => ({
  logTelemetryException: jest.fn(),
}));
const logTelemetryExceptionMock = logTelemetryException as jest.Mock;

const headerMock = jest.fn();

const jsonFunctionMock = jest.fn();
const statusFunctionResultMock = {
  json: jsonFunctionMock,
} as unknown as Response;

const statusFunctionMock = jest.fn();
const headerFunctionMock = {
  header: headerMock,
  status: statusFunctionMock,
} as unknown as Response;

const responseMock = {
  header: headerMock,
  status: statusFunctionMock,
} as unknown as Response;

beforeEach(() => {
  jest.clearAllMocks();
  statusFunctionMock.mockReturnValue(statusFunctionResultMock);
  headerMock.mockReturnValue(headerFunctionMock);
});

describe('Success response', () => {
  const mockMessage = 'success-message';
  const mockData = {
    token: 'token',
  };

  it('SuccessResponse() should be defined', () => {
    expect(SuccessResponse).toBeDefined();
  });

  it('should return response 200 with passed message and data and status as success', () => {
    const mockResponseCode = 1001;
    SuccessResponse(
      responseMock,
      mockMessage,
      mockData,
      'memberInfoRequestId',
      'newOperationId',
      undefined,
      mockResponseCode
    );
    expect(headerMock).toBeCalledTimes(2);
    expect(headerMock.mock.calls[0]).toEqual([
      RequestHeaders.memberInfoRequestId,
      'memberInfoRequestId',
    ]);
    expect(headerMock.mock.calls[1]).toEqual([
      RequestHeaders.prescriptionInfoRequestId,
      'newOperationId',
    ]);
    expect(statusFunctionMock).toHaveBeenNthCalledWith(1, 200);
    expect(jsonFunctionMock).toHaveBeenNthCalledWith(1, {
      data: mockData,
      message: mockMessage,
      responseCode: mockResponseCode,
      status: 'success',
    });
  });

  it('should return response with custom http status code when responseStatus is provided', () => {
    const mockResponseCode = 1001;
    const httpStatus = 404;

    SuccessResponse(
      responseMock,
      mockMessage,
      mockData,
      'memberInfoRequestId',
      'newOperationId',
      httpStatus,
      mockResponseCode
    );
    expect(headerMock).toBeCalledTimes(2);
    expect(headerMock.mock.calls[0]).toEqual([
      RequestHeaders.memberInfoRequestId,
      'memberInfoRequestId',
    ]);
    expect(headerMock.mock.calls[1]).toEqual([
      RequestHeaders.prescriptionInfoRequestId,
      'newOperationId',
    ]);
    expect(statusFunctionMock).toHaveBeenNthCalledWith(1, httpStatus);
    expect(jsonFunctionMock).toHaveBeenNthCalledWith(1, {
      data: mockData,
      message: mockMessage,
      responseCode: mockResponseCode,
      status: 'success',
    });
  });
});

describe('Failure response', () => {
  const mockStatus = 400;
  const mockMessage = 'failure-message';
  const mockError = 'mock-error';
  const mockCode = 6200;
  const mockDetails = { code: 'test' };
  const mockMessageObject: ICommonBusinessMonitoringEventData = {
    idType: 'smartContractId',
    id: '0x3e8b4f3Bd1118e6679cf0187DC0cf6fBE8e6B111',
    messageOrigin: 'myPHX',
    tags: ['dRx', 'supportDashboard'],
    type: 'error',
    subject: 'prescription and account data mismatch',
    messageData: '',
    eventDateTime: '2022-12-06T16:46:36.3317519Z',
  };

  it('KnownFailureResponse() should be defined', () => {
    expect(KnownFailureResponse).toBeDefined();
  });

  it('should return response with passed status code and message with status as failure', () => {
    KnownFailureResponse(responseMock, mockStatus, mockMessage);
    expect(statusFunctionMock).toHaveBeenNthCalledWith(1, 400);
    expect(jsonFunctionMock).toHaveBeenNthCalledWith(1, {
      message: mockMessage,
      status: 'failure',
    });
  });

  it('should call logger.info with error if error is defined', () => {
    KnownFailureResponse(
      responseMock,
      mockStatus,
      mockMessage,
      new Error(mockError)
    );
    expect(mockLoggerInfo).toBeCalledWith(mockError);
    expect(logTelemetryExceptionMock).toHaveBeenNthCalledWith(1, {
      exception: new GuestApiError(mockError),
    });
  });

  it('should call logger.info with message if error is not defined', () => {
    KnownFailureResponse(responseMock, mockStatus, mockMessage);
    expect(mockLoggerInfo).toBeCalledWith(mockMessage);
    expect(logTelemetryExceptionMock).toHaveBeenNthCalledWith(1, {
      exception: new GuestApiError(mockMessage),
    });
  });

  it('should accept error code and provide in response', () => {
    KnownFailureResponse(
      responseMock,
      mockStatus,
      mockMessage,
      new Error(mockError),
      mockCode
    );
    expect(statusFunctionMock).toHaveBeenNthCalledWith(1, 400);
    expect(jsonFunctionMock).toHaveBeenNthCalledWith(1, {
      code: 6200,
      message: mockMessage,
      status: 'failure',
    });
  });

  it('should accept error details and provide in response', () => {
    KnownFailureResponse(
      responseMock,
      mockStatus,
      mockMessage,
      new Error(mockError),
      mockCode,
      mockDetails
    );
    expect(statusFunctionMock).toHaveBeenNthCalledWith(1, 400);
    expect(jsonFunctionMock).toHaveBeenNthCalledWith(1, {
      code: 6200,
      details: { code: 'test' },
      message: mockMessage,
      status: 'failure',
    });
  });

  it('should call publishCommonBusinessEventMessage if topicType is "Business"', () => {
    KnownFailureResponse(
      responseMock,
      mockStatus,
      mockMessage,
      new Error(mockError),
      mockCode,
      mockDetails,
      { eventData: mockMessageObject, topic: 'Business' }
    );

    expectToHaveBeenCalledOnceOnlyWith(publishCommonBusinessEventMessageMock, {
      idType: 'smartContractId',
      id: '0x3e8b4f3Bd1118e6679cf0187DC0cf6fBE8e6B111',
      messageOrigin: 'myPHX',
      tags: ['dRx', 'supportDashboard'],
      type: 'error',
      subject: 'prescription and account data mismatch',
      messageData: '',
      eventDateTime: '2022-12-06T16:46:36.3317519Z',
    });
  });

  it('should call publishCommonMonitoringEventMessage if topicType is "Monitoring"', () => {
    KnownFailureResponse(
      responseMock,
      mockStatus,
      mockMessage,
      new Error(mockError),
      mockCode,
      mockDetails,
      { eventData: mockMessageObject, topic: 'Monitoring' }
    );

    expectToHaveBeenCalledOnceOnlyWith(
      publishCommonMonitoringEventMessageMock,
      {
        idType: 'smartContractId',
        id: '0x3e8b4f3Bd1118e6679cf0187DC0cf6fBE8e6B111',
        messageOrigin: 'myPHX',
        tags: ['dRx', 'supportDashboard'],
        type: 'error',
        subject: 'prescription and account data mismatch',
        messageData: '',
        eventDateTime: '2022-12-06T16:46:36.3317519Z',
      }
    );
  });
});

describe('Error response', () => {
  const mockMessage = 'Unable to communicate with database';
  const mockError = new Error('error');

  it('UnknownFailureResponse() should be defined', () => {
    expect(UnknownFailureResponse).toBeDefined();
  });

  it('should return response 500 with passed message in case of any internal server error', () => {
    UnknownFailureResponse(responseMock, mockMessage);
    expect(statusFunctionMock).toHaveBeenNthCalledWith(1, 500);
    expect(jsonFunctionMock).toHaveBeenNthCalledWith(1, {
      message: mockMessage,
      status: 'error',
    });
  });

  it('should call logger.error with error if error is defined', () => {
    UnknownFailureResponse(responseMock, mockMessage, mockError);
    expect(mockLoggerError).toBeCalledWith('error');
    expect(logTelemetryExceptionMock).toHaveBeenNthCalledWith(1, {
      exception: new GuestApiError('error'),
    });
  });

  it('should call logger.error with message if error is not defined', () => {
    UnknownFailureResponse(responseMock, mockMessage);
    expect(mockLoggerError).toBeCalledWith(mockMessage);
    expect(logTelemetryExceptionMock).toHaveBeenNthCalledWith(1, {
      exception: new GuestApiError(mockMessage),
    });
  });
});

describe('validatePhoneNumberErrorType', () => {
  const mockPhoneNumber = '+1111111111';
  it('should return UNABLE_TO_SEND_CODE if status = 400 and code = 60200', () => {
    const result = validatePhoneNumberErrorType(400, 60200, mockPhoneNumber);

    expect(result).toBeDefined();
    expect(result).toEqual({
      isKnownError: true,
      message: TwilioErrorMessage.UNABLE_TO_SEND_CODE,
      type: 'Twilio',
    });
  });

  it('should return TOO_MANY_TIMES message if status = 429 and code = 60203', () => {
    const result = validatePhoneNumberErrorType(429, 60203, mockPhoneNumber);
    expect(
      trackPhoneNumberWithMaxAttemptsReachedEventMock
    ).toHaveBeenCalledWith(mockPhoneNumber);
    expect(result).toBeDefined();
    expect(result).toEqual({
      isKnownError: true,
      message: TwilioErrorMessage.TOO_MANY_TIMES,
      type: 'Twilio',
    });
  });

  it('should return UNSUPPORTED_LANDLINE_NUMBER message if status = 403 and code = 60205', () => {
    const result = validatePhoneNumberErrorType(403, 60205, mockPhoneNumber);
    expect(trackUnsupportedPhoneNumberEventMock).toHaveBeenCalledWith(
      mockPhoneNumber
    );
    expect(result).toBeDefined();
    expect(result).toEqual({
      isKnownError: true,
      message: TwilioErrorMessage.UNSUPPORTED_LANDLINE_NUMBER,
      type: 'Twilio',
    });
  });

  it('should return INTERNAL_SERVER_ERROR message if status and code not from known codes', () => {
    const result = validatePhoneNumberErrorType(0, 0, mockPhoneNumber);

    expect(result).toBeDefined();
    expect(result).toEqual({
      isKnownError: false,
      message: ErrorConstants.INTERNAL_SERVER_ERROR,
    });
  });
});

describe('SuccessResponseWithoutHeaders', () => {
  const mockMessage = 'success-message';
  const mockData = {
    token: 'token',
  };

  it('SuccessResponseWithoutHeaders() should be defined', () => {
    expect(SuccessResponseWithoutHeaders).toBeDefined();
  });

  it('should return response 200 with passed message and data and status as success', () => {
    const mockResponseCode = 1001;
    SuccessResponseWithoutHeaders(
      responseMock,
      mockMessage,
      mockResponseCode,
      mockData
    );

    expect(statusFunctionMock).toHaveBeenNthCalledWith(1, 200);
    expect(jsonFunctionMock).toHaveBeenNthCalledWith(1, {
      data: mockData,
      message: mockMessage,
      responseCode: mockResponseCode,
      status: 'success',
    });
  });
});

describe('errorResponseWithTwilioErrorHandling', () => {
  const mockPhoneNumber = '+1111111111';
  it('should return KnownFailureResponse if its a known error', () => {
    const responseHelper = jest.requireActual('./response-helper');
    responseHelper.KnownFailureResponse = jest.fn();
    const errorMock: RestException = {
      code: 60203,
      message: 'Max send attempts reached',
      name: 'https://www.twilio.com/docs/errors/60203',
      status: HttpStatusCodes.TOO_MANY_REQUESTS,
      moreInfo: 'test',
      details: { error: 'error' },
    };

    errorResponseWithTwilioErrorHandling(
      responseMock,
      mockPhoneNumber,
      errorMock
    );
    expect(responseHelper.KnownFailureResponse).toHaveBeenCalledWith(
      responseMock,
      errorMock.status,
      TwilioErrorMessage.TOO_MANY_TIMES,
      errorMock,
      errorMock.code
    );
  });
  it('should return unknownFailureResponse if its a unknown error', () => {
    const responseHelper = jest.requireActual('./response-helper');
    responseHelper.UnknownFailureResponse = jest.fn();
    const errorMock: RestException = {
      message: 'Error occured',
      code: 0,
      name: 'error',
      status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      moreInfo: 'test',
      details: { error: 'error' },
    };

    errorResponseWithTwilioErrorHandling(
      responseMock,
      mockPhoneNumber,
      errorMock
    );
    expect(responseHelper.UnknownFailureResponse).toHaveBeenCalledWith(
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      errorMock
    );
  });
});
