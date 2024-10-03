// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { publishViewAuditEvent } from './health-record-event/publish-view-audit-event';
import { KnownFailureResponse } from './response-helper';
import { knownFailureResponseAndPublishEvent } from './known-failure-and-publish-audit-event';
import { InternalResponseCode } from '../constants/error-codes';

jest.mock('./health-record-event/publish-view-audit-event');
const publishViewAuditEventMock = publishViewAuditEvent as jest.Mock;

jest.mock('./response-helper');
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;

describe('knownFailureResponseAndPublishEvent', () => {
  it('knownFailureResponseAndPublishEvent() should be defined', () => {
    expect(knownFailureResponseAndPublishEvent).toBeDefined();
  });

  it('should return response with passed status code and message and publish an event', async () => {
    const mockStatus = 400;
    const mockMessage = 'failure-message';
    const requestMock = {} as Request;
    const responseMock = {} as Response;
    const itemId = 'order-number';
    const eventType = 'myrx-view/appointment';
    const internalCodeMock =
      InternalResponseCode.CAREGIVER_NEW_DEPENDENT_PRESCRIPTION;

    await knownFailureResponseAndPublishEvent(
      requestMock,
      responseMock,
      eventType,
      itemId,
      mockStatus,
      mockMessage,
      internalCodeMock
    );
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      mockStatus,
      mockMessage,
      undefined,
      internalCodeMock
    );
    expect(publishViewAuditEventMock).toBeCalledWith(
      requestMock,
      responseMock,
      eventType,
      itemId,
      false,
      mockMessage
    );
  });
});
