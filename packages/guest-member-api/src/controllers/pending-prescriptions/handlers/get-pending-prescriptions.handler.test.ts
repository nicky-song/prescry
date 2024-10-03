// Copyright 2018 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { mockPendingPrescriptionsList } from '@phx/common/src/experiences/guest-experience/__mocks__/pending-prescriptions.mock';
import {
  ErrorConstants,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { fetchRequestHeader } from '../../../utils/request-helper';
import {
  KnownFailureResponse,
  SuccessResponse,
} from '../../../utils/response-helper';
import { setPendingPrescriptionsTelemetryIds } from '../../../utils/telemetry-helper';
import { getPendingPrescriptionsHandler } from './get-pending-prescriptions.handler';
import {
  getAllPendingPrescriptionsByIdentifierFromMessageEnvelope,
  getPendingPrescriptionsByIdentifier,
} from '../../../databases/mongo-database/v1/query-helper/pending-prescriptions.query-helper';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { ApiConstants } from '../../../constants/api-constants';
import { publishViewAuditEvent } from '../../../utils/health-record-event/publish-view-audit-event';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { knownFailureResponseAndPublishEvent } from '../../../utils/known-failure-and-publish-audit-event';
import { databaseMock } from '../../../mock-data/database.mock';

jest.mock('../../../utils/server-helper', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock('../../../utils/custom-event-helper');

jest.mock('../../../utils/app-insight-helper');

jest.mock('../../../utils/telemetry-helper');

jest.mock('../../../utils/request-helper');

jest.mock('../../../utils/response-helper');

jest.mock(
  '../../../databases/mongo-database/v1/query-helper/pending-prescriptions.query-helper'
);

jest.mock('../../../utils/request/request-app-locals.helper');

const routerResponseMock = {
  locals: {
    verifiedPayload: {
      identifier: 'mock-identifier',
    },
  },
} as unknown as Response;

const requestMock = {
  params: {
    identifier: 'mock-id',
  },
} as unknown as Request;

const rogueRequestMock = {
  params: {
    identifier: 'rogue-0',
  },
} as unknown as Request;

const rogueResponseMock = {
  locals: {
    verifiedPayload: {
      identifier: 'mock-identifier',
    },
  },
} as unknown as Response;

const requestKnownMock = {
  params: {
    identifier: 'mock',
  },
} as unknown as Request;

const documentsFoundMock = {
  notificationTarget: 'mock-number',
  pendingPrescriptionList: {
    fake: [{ fake: 'docs' }],
    prescriptions: [
      {
        personId: 'mock-identifier',
      },
    ],
  },
};

const successResponseMock = SuccessResponse as jest.Mock;
const failureResponseMock = KnownFailureResponse as jest.Mock;
const fetchRequestHeaderMock = fetchRequestHeader as jest.Mock;
const setPendingPrescriptionsTelemetryIdsMock =
  setPendingPrescriptionsTelemetryIds as jest.Mock;
const getPendingPrescriptionsByIdentifierMock =
  getPendingPrescriptionsByIdentifier as jest.Mock;
const getAllPendingPrescriptionsByIdentifierFromMessageEnvelopeMock =
  getAllPendingPrescriptionsByIdentifierFromMessageEnvelope as jest.Mock;

const getRequiredResponseLocalMock = getRequiredResponseLocal as jest.Mock;
jest.mock('../../../utils/known-failure-and-publish-audit-event');
const knownFailureResponseAndPublishEventMock =
  knownFailureResponseAndPublishEvent as jest.Mock;

jest.mock('../../../utils/health-record-event/publish-view-audit-event');
const publishViewAuditEventMock = publishViewAuditEvent as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  fetchRequestHeaderMock.mockReturnValue('requestId');
  setPendingPrescriptionsTelemetryIdsMock.mockReturnValue('newOperationId');
});

describe('getPendingPrescriptionsHandler with identifier other than rogue', () => {
  it('should return mockPendingPrescriptionsList when mock is sent in the params', async () => {
    const knownResponseMock = {
      locals: {
        verifiedPayload: {
          identifier: 'mock-identifier',
        },
      },
    } as unknown as Response;

    getRequiredResponseLocalMock.mockReturnValueOnce({
      identifier: 'mock-identifier',
    });
    await getPendingPrescriptionsHandler(
      requestKnownMock,
      knownResponseMock,
      databaseMock
    );
    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock.mock.calls[0][0]).toBe(knownResponseMock);
    expect(successResponseMock.mock.calls[0][1]).toBe(
      'pendingPrescriptionList'
    );
    expect(successResponseMock.mock.calls[0][2]).toEqual({
      memberIdentifier: 'mock-identifier',
      pendingPrescriptionList: mockPendingPrescriptionsList,
    });
  });

  it('should return failure response "Document Not found" if no pending prescriptions found for the user', async () => {
    getRequiredResponseLocalMock.mockReturnValueOnce({ data: '+11234567890' });
    getAllPendingPrescriptionsByIdentifierFromMessageEnvelopeMock.mockReturnValueOnce(
      []
    );
    await getPendingPrescriptionsHandler(
      requestMock,
      routerResponseMock,
      databaseMock
    );
    expect(failureResponseMock).toBeCalledTimes(1);
    expect(failureResponseMock.mock.calls[0][0]).toBe(routerResponseMock);
    expect(failureResponseMock.mock.calls[0][1]).toBe(404);
    expect(failureResponseMock.mock.calls[0][2]).toBe(
      ErrorConstants.DOCUMENT_NOT_FOUND
    );
  });

  it('should return response status 401 if notificationTarget is null or missing in the database', async () => {
    const documentFoundMockFail = [
      {
        notificationTarget: '',
        pendingPrescriptionList: {
          fake: [{ fake: 'docs' }],
          prescriptions: [
            {
              personId: 'mock-identifier',
            },
          ],
        },
      },
    ];
    getRequiredResponseLocalMock.mockReturnValueOnce({ data: '+11234567890' });
    getAllPendingPrescriptionsByIdentifierFromMessageEnvelopeMock.mockReturnValueOnce(
      documentFoundMockFail
    );
    await getPendingPrescriptionsHandler(
      requestMock,
      routerResponseMock,
      databaseMock
    );
    expect(knownFailureResponseAndPublishEventMock).toBeCalledTimes(1);
    expect(knownFailureResponseAndPublishEventMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      ApiConstants.AUDIT_VIEW_EVENT_CLAIM_ALERT,
      'mock-id',
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      ErrorConstants.PHONE_NUMBER_MISSING
    );
  });

  it('should return failure response if notificationTarget does not match to user phone number', async () => {
    getRequiredResponseLocalMock.mockReturnValueOnce({ data: '+11234567890' });
    const documentFoundMockFail = [
      {
        notificationTarget: 'mock-number2',
        pendingPrescriptionList: {
          fake: [{ fake: 'docs' }],
          prescriptions: [
            {
              personId: 'mock-identifier',
            },
          ],
        },
      },
    ];

    getAllPendingPrescriptionsByIdentifierFromMessageEnvelopeMock.mockReturnValueOnce(
      documentFoundMockFail
    );
    await getPendingPrescriptionsHandler(
      requestMock,
      routerResponseMock,
      databaseMock
    );
    expect(failureResponseMock).toBeCalledTimes(1);
    expect(failureResponseMock.mock.calls[0][0]).toBe(routerResponseMock);
    expect(failureResponseMock.mock.calls[0][1]).toBe(401);
    expect(failureResponseMock.mock.calls[0][2]).toBe(
      ErrorConstants.UNAUTHORIZED_ACCESS
    );
  });

  it('should return success response with PendingPrescriptions', async () => {
    const documentFoundMock = [
      {
        notificationTarget: '+11234567890',
        pendingPrescriptionList: {
          fake: [{ fake: 'docs' }],
          prescriptions: [
            {
              personId: 'mock-identifier',
            },
          ],
        },
      },
    ];
    getRequiredResponseLocalMock.mockReturnValueOnce({ data: '+11234567890' });
    getAllPendingPrescriptionsByIdentifierFromMessageEnvelopeMock.mockReturnValueOnce(
      documentFoundMock
    );
    await getPendingPrescriptionsHandler(
      requestMock,
      routerResponseMock,
      databaseMock
    );
    expect(fetchRequestHeaderMock).toHaveBeenCalledWith(
      requestMock,
      'request-id'
    );
    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock.mock.calls[0][0]).toBe(routerResponseMock);
    expect(successResponseMock.mock.calls[0][1]).toBe(
      SuccessConstants.DOCUMENT_FOUND
    );
    expect(successResponseMock.mock.calls[0][2]).toEqual({
      memberIdentifier: 'mock-identifier',
      pendingPrescriptionList: {
        fake: [{ fake: 'docs' }],
        prescriptions: [
          {
            personId: 'mock-identifier',
          },
        ],
      },
    });
    expect(successResponseMock.mock.calls[0][3]).toBe('requestId');

    expect(successResponseMock.mock.calls[0][4]).toBeUndefined();
    expect(publishViewAuditEventMock).toBeCalledWith(
      requestMock,
      routerResponseMock,
      ApiConstants.AUDIT_VIEW_EVENT_CLAIM_ALERT,
      'mock-id',
      true
    );
  });

  it('should not call setTelemetryId when events are not in the document', async () => {
    const documentFoundMockFail = [
      {
        notificationTarget: 'mock-number2',
        pendingPrescriptionList: {
          fake: [{ fake: 'docs' }],
          prescriptions: [
            {
              personId: 'mock-identifier',
            },
          ],
        },
      },
    ];
    getRequiredResponseLocalMock.mockReturnValueOnce({ data: '+11234567890' });
    getAllPendingPrescriptionsByIdentifierFromMessageEnvelopeMock.mockReturnValueOnce(
      documentFoundMockFail
    );
    await getPendingPrescriptionsHandler(
      requestMock,
      routerResponseMock,
      databaseMock
    );

    expect(setPendingPrescriptionsTelemetryIdsMock).toHaveBeenCalledTimes(0);
  });

  it('should call setTelemetryId when events is present in document', async () => {
    const eventsList = [
      {
        correlationId: 'fake-correlation-operation-id',
        operationId: 'fake-operation-id',
      },
    ];

    const newDocumentFoundMock = [
      {
        notificationTarget: '+11234567890',
        pendingPrescriptionList: {
          events: eventsList,
          fake: [{ fake: 'docs' }],
          prescriptions: [
            {
              personId: 'mock-identifier',
            },
          ],
        },
      },
    ];
    getRequiredResponseLocalMock.mockReturnValueOnce({ data: '+11234567890' });
    getAllPendingPrescriptionsByIdentifierFromMessageEnvelopeMock.mockReturnValueOnce(
      newDocumentFoundMock
    );
    await getPendingPrescriptionsHandler(
      requestMock,
      routerResponseMock,
      databaseMock
    );
    expect(fetchRequestHeaderMock).toHaveBeenCalledWith(
      requestMock,
      'request-id'
    );
    expect(setPendingPrescriptionsTelemetryIdsMock).toHaveBeenNthCalledWith(1, [
      {
        correlationId: 'fake-correlation-operation-id',
        operationId: 'fake-operation-id',
      },
    ]);
    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock.mock.calls[0][0]).toBe(routerResponseMock);
    expect(successResponseMock.mock.calls[0][1]).toBe(
      SuccessConstants.DOCUMENT_FOUND
    );

    expect(successResponseMock.mock.calls[0][2]).toEqual({
      memberIdentifier: 'mock-identifier',
      pendingPrescriptionList: {
        events: eventsList,
        fake: [{ fake: 'docs' }],
        prescriptions: [
          {
            personId: 'mock-identifier',
          },
        ],
      },
    });
    expect(successResponseMock.mock.calls[0][3]).toBe('requestId');
    expect(successResponseMock.mock.calls[0][4]).toBe('newOperationId');
  });
});

describe('getPendingPrescriptionsHandler with identifier as rogue', () => {
  it('should return failure response "Document Not found" if no pending prescriptions found for the user', async () => {
    getPendingPrescriptionsByIdentifierMock.mockReturnValueOnce(null);
    await getPendingPrescriptionsHandler(
      rogueRequestMock,
      rogueResponseMock,
      databaseMock
    );
    expect(failureResponseMock).toBeCalledTimes(1);
    expect(failureResponseMock.mock.calls[0][0]).toBe(rogueResponseMock);
    expect(failureResponseMock.mock.calls[0][1]).toBe(404);
    expect(failureResponseMock.mock.calls[0][2]).toBe(
      ErrorConstants.DOCUMENT_NOT_FOUND
    );
  });
  it('should return PendingPrescriptions if exists for an user(identifier)', async () => {
    getRequiredResponseLocalMock.mockReturnValueOnce({
      identifier: 'mock-identifier',
    });
    const eventsList = [
      {
        correlationId: 'fake-correlation-operation-id',
        operationId: 'fake-operation-id',
      },
    ];
    const mockPendingPrescriptionList = {
      fake: [{ fake: 'docs' }],
    };
    const prescriptionsListMock = {
      identifier: 'mock-identifier',
      prescriptions: mockPendingPrescriptionList,
      events: eventsList,
    };

    getPendingPrescriptionsByIdentifierMock.mockReturnValueOnce(
      prescriptionsListMock
    );
    await getPendingPrescriptionsHandler(
      rogueRequestMock,
      rogueResponseMock,
      databaseMock
    );
    expect(fetchRequestHeaderMock).toHaveBeenCalledWith(
      rogueRequestMock,
      'request-id'
    );
    expect(setPendingPrescriptionsTelemetryIdsMock).toHaveBeenNthCalledWith(1, [
      {
        correlationId: 'fake-correlation-operation-id',
        operationId: 'fake-operation-id',
      },
    ]);
    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock.mock.calls[0][0]).toBe(rogueResponseMock);
    expect(successResponseMock.mock.calls[0][1]).toBe(
      SuccessConstants.DOCUMENT_FOUND
    );
    expect(successResponseMock.mock.calls[0][2]).toEqual({
      memberIdentifier: 'mock-identifier',
      pendingPrescriptionList: prescriptionsListMock,
    });
    expect(successResponseMock.mock.calls[0][3]).toBe('requestId');
    expect(successResponseMock.mock.calls[0][4]).toBe('newOperationId');
  });

  it('should not call setTelemetryId when events are not in the document', async () => {
    getRequiredResponseLocalMock.mockReturnValueOnce({
      identifier: 'mock-identifier',
    });
    getPendingPrescriptionsByIdentifierMock.mockReturnValueOnce(
      documentsFoundMock
    );
    await getPendingPrescriptionsHandler(
      rogueRequestMock,
      rogueResponseMock,
      databaseMock
    );
    expect(setPendingPrescriptionsTelemetryIdsMock).toHaveBeenCalledTimes(0);
  });
  it('should call setTelemetryId when events is present in document', async () => {
    getRequiredResponseLocalMock.mockReturnValueOnce({
      identifier: 'mock-identifier',
    });
    const eventsList = [
      {
        correlationId: 'fake-correlation-operation-id',
        operationId: 'fake-operation-id',
      },
    ];
    const newDocumentFoundMock = { ...documentsFoundMock, events: eventsList };
    getPendingPrescriptionsByIdentifierMock.mockReturnValueOnce(
      newDocumentFoundMock
    );
    await getPendingPrescriptionsHandler(
      rogueRequestMock,
      rogueResponseMock,
      databaseMock
    );
    expect(setPendingPrescriptionsTelemetryIdsMock).toHaveBeenNthCalledWith(1, [
      {
        correlationId: 'fake-correlation-operation-id',
        operationId: 'fake-operation-id',
      },
    ]);
  });
});
