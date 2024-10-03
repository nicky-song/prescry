// Copyright 2022 Prescryptive Health, Inc.

import { getClaimAlertHandler } from './get-claim-alert.handler';
import { Request, Response } from 'express';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import {
  SuccessResponse,
  KnownFailureResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import {
  ErrorConstants,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import {
  alternativePlanComboBrand,
  alternativePlanComboGenericMock,
  alternativePlanSingleBrand,
  alternativePlanSingleGeneric,
  alternativeMemberComboBrand,
  alternativeMemberComboGeneric,
  alternativeMemberSingleBrand,
  alternativeMemberSingleGeneric,
  bestPriceBrand,
  bestPriceGeneric,
} from '@phx/common/src/experiences/guest-experience/__mocks__/claim-alert.mock';
import { getPendingPrescriptionsByIdentifier } from '../../../databases/mongo-database/v1/query-helper/pending-prescriptions.query-helper';
import { HttpStatusCodes } from '../../../constants/error-codes';
import { setPendingPrescriptionsTelemetryIds } from '../../../utils/telemetry-helper';
import { ITelemetryIds } from '@phx/common/src/models/telemetry-id';
import { claimAlertMapper } from '../../../utils/transformers/claim-alert/claim-alert';
import { IPendingPrescription } from '@phx/common/src/models/pending-prescription';
import { publishViewAuditEvent } from '../../../utils/health-record-event/publish-view-audit-event';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { getAllPendingPrescriptionsByIdentifierFromMessageEnvelope } from '../../../databases/mongo-database/v1/query-helper/pending-prescriptions.query-helper';
import { IMessageEnvelope } from '@phx/common/src/models/message-envelope';
import { fetchRequestHeader } from '../../../utils/request-helper';

jest.mock('../../../utils/request-helper');
const fetchRequestHeaderMock = fetchRequestHeader as jest.Mock;

jest.mock('../../../utils/request/request-app-locals.helper');
const getRequiredResponseLocalMock = getRequiredResponseLocal as jest.Mock;

jest.mock('../../../utils/health-record-event/publish-view-audit-event');
const publishViewAuditEventMock = publishViewAuditEvent as jest.Mock;

jest.mock('../../../utils/transformers/claim-alert/claim-alert', () => ({
  claimAlertMapper: jest.fn(),
}));
const claimAlertMapperMock = claimAlertMapper as jest.Mock;

jest.mock('../../../utils/telemetry-helper');
const setPendingPrescriptionsTelemetryIdsMock =
  setPendingPrescriptionsTelemetryIds as jest.Mock;

jest.mock(
  '../../../databases/mongo-database/v1/query-helper/pending-prescriptions.query-helper'
);
const getPendingPrescriptionsByIdentifierMock =
  getPendingPrescriptionsByIdentifier as jest.Mock;
const getAllPendingPrescriptionsByIdentifierFromMessageEnvelopeMock =
  getAllPendingPrescriptionsByIdentifierFromMessageEnvelope as jest.Mock;

jest.mock('../../../utils/response-helper');
const successResponseMock = SuccessResponse as jest.Mock;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;

describe('getClaimAlertHandler', () => {
  const databaseMock = {
    Models: {},
  } as unknown as IDatabase;

  const memberInfoRequestIdMock = 'request-id';

  const requestMock = {
    app: {},
    query: {},
    params: {
      identifier: '1234',
    },
    headers: {
      'request-id': memberInfoRequestIdMock,
    },
  } as unknown as Request;

  const masterIdMock = 'patient-id-mock';

  const responseMock = {
    locals: {
      patientAccount: { patientId: masterIdMock },
    },
  } as unknown as Response;

  const claimAlertMock = {};

  const newOperationIdMock = 'new-operation-id-mock';

  const phoneNumberMock = 'phone-number-mock';

  beforeEach(() => {
    jest.clearAllMocks();
    claimAlertMapperMock.mockReturnValue(claimAlertMock);
    getRequiredResponseLocalMock.mockReturnValue({
      data: phoneNumberMock,
    });

    fetchRequestHeaderMock.mockReturnValue(memberInfoRequestIdMock);

    JSON.parse = jest
      .fn()
      .mockImplementation((pendingPrescription: IPendingPrescription) => {
        return pendingPrescription;
      });
    JSON.stringify = jest
      .fn()
      .mockImplementation((pendingPrescription: IPendingPrescription) => {
        return pendingPrescription;
      });
  });

  test.concurrent.each`
    key| mock
    ${'alternative-plan-combo-brand'} |${alternativePlanComboBrand}
    ${'alternative-plan-combo-generic'} |${alternativePlanComboGenericMock}
    ${'alternative-plan-single-brand'} |${alternativePlanSingleBrand}
    ${'alternative-plan-single-generic'} |${alternativePlanSingleGeneric}
    ${'alternative-member-combo-brand'} |${alternativeMemberComboBrand}
    ${'alternative-member-combo-generic'} |${alternativeMemberComboGeneric}
    ${'alternative-member-single-brand'} |${alternativeMemberSingleBrand}
    ${'alternative-member-single-generic'} |${alternativeMemberSingleGeneric}
    ${'best-price-brand'} |${bestPriceBrand}
    ${'best-price-generic'} |${bestPriceGeneric}
  };
  `('$key returns the correct mock object', async ({ key, mock }) => {
    await getClaimAlertHandler(
      { ...requestMock, params: { identifier: key } } as unknown as Request,
      responseMock,
      databaseMock
    );
    expect(successResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.DOCUMENT_FOUND,
      mock,
      'request-id'
    );
  });

  test('returns expected SuccessResponse when identifier starts with rogue', async () => {
    const identifierMock = 'rogue-3';

    const eventsMock = [{} as ITelemetryIds] as ITelemetryIds[];

    const prescriptionsMock = [{} as IPendingPrescription];

    getPendingPrescriptionsByIdentifierMock.mockReturnValue({
      prescriptions: prescriptionsMock,
      events: eventsMock,
    });

    setPendingPrescriptionsTelemetryIdsMock.mockReturnValue(newOperationIdMock);

    await getClaimAlertHandler(
      {
        ...requestMock,
        params: { identifier: identifierMock },
      } as unknown as Request,
      responseMock,
      databaseMock
    );

    expect(successResponseMock).toHaveBeenCalledTimes(1);
    expect(successResponseMock).toHaveBeenCalledWith(
      responseMock,
      SuccessConstants.DOCUMENT_FOUND,
      claimAlertMock,
      memberInfoRequestIdMock,
      newOperationIdMock
    );
  });

  test('returns expected KnownFailureResponse when identifier starts with rogue and no prescriptions', async () => {
    const identifierMock = 'rogue-3';

    const eventsMock = [{} as ITelemetryIds] as ITelemetryIds[];

    const prescriptionsMock: IPendingPrescription[] = [];

    getPendingPrescriptionsByIdentifierMock.mockReturnValue({
      prescriptions: prescriptionsMock,
      events: eventsMock,
    });

    setPendingPrescriptionsTelemetryIdsMock.mockReturnValue(newOperationIdMock);

    await getClaimAlertHandler(
      {
        ...requestMock,
        params: { identifier: identifierMock },
      } as unknown as Request,
      responseMock,
      databaseMock
    );

    expect(knownFailureResponseMock).toHaveBeenCalledTimes(1);
    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      HttpStatusCodes.NOT_FOUND,
      ErrorConstants.DOCUMENT_NOT_FOUND
    );
  });

  test('returns UnknownFailureResponse when method fails after known failures', async () => {
    const identifierMock = 'abcd1234';

    setPendingPrescriptionsTelemetryIdsMock.mockReturnValue(newOperationIdMock);

    const errorMock = new Error();

    publishViewAuditEventMock.mockImplementationOnce(() => {
      throw errorMock;
    });

    const modelsFoundMock: IMessageEnvelope[] = [
      {
        identifier: 'identifier-mock-1',
        pendingPrescriptionList: {
          identifier: 'identifier-mock-2',
          prescriptions: [
            {
              personId: 'person-id-mock',
              bestPrice: '1',
              identifier: 'identifier-mock-3',
              medication: {
                form: 'form-mock',
                genericName: 'generic-name-mock',
                genericProductId: 'generic-product-id-mock',
                medicationId: 'medication-id-mock',
                name: 'name-mock',
                strength: 'strength-mock',
                units: 'units-mock',
              },
              medicationId: 'medication-id-mock',
              offers: [],
              pharmacies: [
                {
                  name: 'pharmacy-name-mock',
                  phone: 'pharmacy-phone-mock',
                  ncpdp: 'pharmacy-ncpdp-mock',
                  hours: [],
                },
              ],
              prescription: {
                expiresOn: new Date(),
                fillOptions: [],
                prescribedOn: new Date(),
                prescriber: {
                  name: 'prescriber-name-mock',
                  phone: 'prescriber-phone-mock',
                  ncpdp: 'prescriber-ncpdp-mock',
                  hours: [],
                },
                referenceNumber: 'reference-number-mock',
                sig: 'sig-mock',
              },
            },
          ],
          type: 'type-mock',
        },
        notificationTarget: 'notification-target-mock',
      },
    ];

    getAllPendingPrescriptionsByIdentifierFromMessageEnvelopeMock.mockReturnValue(
      modelsFoundMock
    );

    await getClaimAlertHandler(
      {
        ...requestMock,
        params: { identifier: identifierMock },
      } as unknown as Request,
      responseMock,
      databaseMock
    );

    expect(publishViewAuditEventMock).toHaveBeenCalledTimes(1);

    expect(unknownFailureResponseMock).toHaveBeenCalledTimes(1);
    expect(unknownFailureResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      errorMock
    );
  });

  test('returns SuccessResponse when claimAlertMapper returns valid object', async () => {
    const identifierMock = 'abcd1234';

    setPendingPrescriptionsTelemetryIdsMock.mockReturnValue(newOperationIdMock);

    const modelsFoundMock: IMessageEnvelope[] = [
      {
        identifier: 'identifier-mock-1',
        pendingPrescriptionList: {
          identifier: 'identifier-mock-2',
          prescriptions: [
            {
              personId: 'person-id-mock',
              bestPrice: '1',
              identifier: 'identifier-mock-3',
              medication: {
                form: 'form-mock',
                genericName: 'generic-name-mock',
                genericProductId: 'generic-product-id-mock',
                medicationId: 'medication-id-mock',
                name: 'name-mock',
                strength: 'strength-mock',
                units: 'units-mock',
              },
              medicationId: 'medication-id-mock',
              offers: [],
              pharmacies: [
                {
                  name: 'pharmacy-name-mock',
                  phone: 'pharmacy-phone-mock',
                  ncpdp: 'pharmacy-ncpdp-mock',
                  hours: [],
                },
              ],
              prescription: {
                expiresOn: new Date(),
                fillOptions: [],
                prescribedOn: new Date(),
                prescriber: {
                  name: 'prescriber-name-mock',
                  phone: 'prescriber-phone-mock',
                  ncpdp: 'prescriber-ncpdp-mock',
                  hours: [],
                },
                referenceNumber: 'reference-number-mock',
                sig: 'sig-mock',
              },
            },
          ],
          type: 'type-mock',
        },
        notificationTarget: 'notification-target-mock',
      },
    ];

    getAllPendingPrescriptionsByIdentifierFromMessageEnvelopeMock.mockReturnValue(
      modelsFoundMock
    );

    await getClaimAlertHandler(
      {
        ...requestMock,
        params: { identifier: identifierMock },
      } as unknown as Request,
      responseMock,
      databaseMock
    );

    expect(publishViewAuditEventMock).toHaveBeenCalledTimes(1);

    // TODO: expect claimAlertMapper
  });
});
