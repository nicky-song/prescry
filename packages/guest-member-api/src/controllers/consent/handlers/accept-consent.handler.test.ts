// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IHealthRecordEvent } from '../../../models/health-record-event';
import { publishHealthRecordEventMessage } from '../../../utils/service-bus/health-record-event-helper';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';

import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { acceptConsentEventBuilder } from '../builders/accept-consent-event.builder';
import { acceptConsentHandler } from './accept-consent.handler';
import { IConsentEvent } from '../../../models/consent-event';
import { ServiceTypes } from '@phx/common/src/models/provider-location';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { getRequiredRequestQuery } from '../../../utils/request/get-request-query';
import { getServiceDetailsByServiceType } from '../../../utils/external-api/get-service-details-by-service-type';
import { mockServiceTypeDetails } from '../../../mock-data/service-type-details.mock';

jest.mock('../../../utils/response-helper');
jest.mock('../../../utils/service-bus/health-record-event-helper');
jest.mock('../builders/accept-consent-event.builder');
jest.mock('../../../utils/external-api/get-service-details-by-service-type');
jest.mock('../../../utils/request/get-request-query');

const publishHealthRecordEventMessageMock =
  publishHealthRecordEventMessage as jest.Mock;
const successResponseMock = SuccessResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const acceptConsentEventBuilderMock = acceptConsentEventBuilder as jest.Mock;
const getServiceDetailsByServiceTypeMock =
  getServiceDetailsByServiceType as jest.Mock;
const getRequiredRequestQueryMock = getRequiredRequestQuery as jest.Mock;

const consentEventMessage: IHealthRecordEvent<IConsentEvent> = {
  identifiers: [
    { type: 'primaryMemberRxId', value: 'fake-rx-member-id' },
    {
      type: 'accountIdentifier',
      value: 'fake-account-id',
    },
  ],
  createdOn: 1590954510,
  createdBy: 'rxassistant-api',
  tags: ['fake-rx-member-id'],
  eventType: 'questionnaire/covid-19',
  eventData: {
    sessionId: 'fake-session-id',
    acceptedDateTime: '1590954510',
    authToken: 'token',
    browser: 'chrome',
    fromIP: '192.168.10.3',
  },
};

beforeEach(() => {
  unknownFailureResponseMock.mockReset();
  knownFailureResponseMock.mockReset();
  successResponseMock.mockReset();
  publishHealthRecordEventMessageMock.mockReset();
  acceptConsentEventBuilderMock.mockReset();
  acceptConsentEventBuilderMock.mockReturnValue(consentEventMessage);
  getServiceDetailsByServiceTypeMock.mockReturnValue(mockServiceTypeDetails);
});
describe('acceptConsentHandler', () => {
  const requestMock = {
    query: { servicetype: ServiceTypes.covid },
    body: {},
    connection: {
      remoteAddress: '192.168.10.3',
    },
    headers: {
      authorization: 'token',
    },
  } as unknown as Request;
  const routerResponseMock = {
    locals: {
      personInfo: {
        dateOfBirth: '01-01-2000',
        primaryMemberRxId: 'fake-rx-member-id',
      },
      accountIdentifier: 'fake-account-id',
    },
  } as unknown as Response;
  it('should acceptConsentHandler with no endtime when next steps are there in question', async () => {
    getRequiredRequestQueryMock.mockReturnValue(ServiceTypes.covid);
    await acceptConsentHandler(
      requestMock,
      routerResponseMock,
      configurationMock
    );
    expect(acceptConsentEventBuilderMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      ServiceTypes.covid
    );
    expect(publishHealthRecordEventMessageMock).toBeCalledWith(
      consentEventMessage
    );
    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      SuccessConstants.SUCCESS_OK
    );
  });

  it('should call UnknownFailureResponse if exception occured', async () => {
    const error = { message: 'internal error' };
    publishHealthRecordEventMessageMock.mockImplementation(() => {
      throw error;
    });
    await acceptConsentHandler(
      requestMock,
      routerResponseMock,
      configurationMock
    );
    expect(unknownFailureResponseMock).toHaveBeenCalled();
    expect(unknownFailureResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error
    );
  });

  it('should throw knownFailureResponse if serviceType passed in queryString doesnt exist in services collection', async () => {
    const requestMockInvalidServiceType = {
      query: { servicetype: 'invalid-service-type' },
      body: {},
      connection: {
        remoteAddress: '192.168.10.3',
      },
      headers: {
        authorization: 'token',
      },
    } as unknown as Request;
    getServiceDetailsByServiceTypeMock.mockReturnValueOnce(null);
    await acceptConsentHandler(
      requestMockInvalidServiceType,
      routerResponseMock,
      configurationMock
    );
    expect(knownFailureResponseMock).toHaveBeenCalled();
    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.QUERYSTRING_INVALID
    );
    expect(publishHealthRecordEventMessageMock).not.toHaveBeenCalled();
  });
});
