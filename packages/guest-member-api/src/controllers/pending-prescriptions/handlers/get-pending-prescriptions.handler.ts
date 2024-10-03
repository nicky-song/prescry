// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  HttpStatusCodes,
  InternalErrorCode,
} from '@phx/common/src/errors/error-codes';
import {
  ErrorConstants,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { mockPendingPrescriptionsList } from '@phx/common/src/experiences/guest-experience/__mocks__/pending-prescriptions.mock';
import { IMessageEnvelope } from '@phx/common/src/models/message-envelope';
import { IPendingPrescriptionsList } from '@phx/common/src/models/pending-prescription';
import {
  getAllPendingPrescriptionsByIdentifierFromMessageEnvelope,
  getPendingPrescriptionsByIdentifier,
} from '../../../databases/mongo-database/v1/query-helper/pending-prescriptions.query-helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { fetchRequestHeader } from '../../../utils/request-helper';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import {
  KnownFailureResponse,
  SuccessResponse,
} from '../../../utils/response-helper';
import { setPendingPrescriptionsTelemetryIds } from '../../../utils/telemetry-helper';
import { IPendingMedicationResponseData } from '@phx/common/src/models/api-response/pending-prescriptions-response';
import { ApiConstants } from '../../../constants/api-constants';
import { publishViewAuditEvent } from '../../../utils/health-record-event/publish-view-audit-event';
import { knownFailureResponseAndPublishEvent } from '../../../utils/known-failure-and-publish-audit-event';

export async function getPendingPrescriptionsHandler(
  request: Request,
  response: Response,
  database: IDatabase
) {
  if (request.params.identifier === 'mock') {
    return SuccessResponse<IPendingMedicationResponseData>(
      response,
      'pendingPrescriptionList',
      {
        memberIdentifier: getRequiredResponseLocal(response, 'verifiedPayload')
          .identifier,
        pendingPrescriptionList: mockPendingPrescriptionsList,
      }
    );
  } else if (request.params.identifier.startsWith('rogue')) {
    const modelsFound: IPendingPrescriptionsList | null =
      await getPendingPrescriptionsByIdentifier(
        request.params.identifier,
        database
      );
    if (!modelsFound) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.NOT_FOUND,
        ErrorConstants.DOCUMENT_NOT_FOUND
      );
    }
    const memberInfoRequestId = fetchRequestHeader(request, 'request-id');
    let newOperationId;

    if (modelsFound.events) {
      newOperationId = setPendingPrescriptionsTelemetryIds(modelsFound.events);
    }

    return SuccessResponse<IPendingMedicationResponseData>(
      response,
      SuccessConstants.DOCUMENT_FOUND,
      {
        memberIdentifier: getRequiredResponseLocal(response, 'verifiedPayload')
          .identifier,
        pendingPrescriptionList: modelsFound,
      },
      memberInfoRequestId,
      newOperationId
    );
  } else {
    const phoneNumber = getRequiredResponseLocal(response, 'device').data;
    const modelsFound: IMessageEnvelope[] | null =
      await getAllPendingPrescriptionsByIdentifierFromMessageEnvelope(
        request.params.identifier,
        database
      );

    if (!modelsFound || !modelsFound.length) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.NOT_FOUND,
        ErrorConstants.DOCUMENT_NOT_FOUND
      );
    }
    if (
      modelsFound.every(
        (model) =>
          model.notificationTarget === null || model.notificationTarget === ''
      )
    ) {
      return await knownFailureResponseAndPublishEvent(
        request,
        response,
        ApiConstants.AUDIT_VIEW_EVENT_CLAIM_ALERT,
        request.params.identifier,
        HttpStatusCodes.UNAUTHORIZED_REQUEST,
        ErrorConstants.PHONE_NUMBER_MISSING
      );
    }

    const filteredPrescription = modelsFound.filter((prescription) => {
      return prescription.notificationTarget.trim() === phoneNumber.trim();
    });

    const memberInfoRequestId = fetchRequestHeader(request, 'request-id');
    let prescriptionInfoRequestId;

    if (!filteredPrescription.length) {
      await publishViewAuditEvent(
        request,
        response,
        ApiConstants.AUDIT_VIEW_EVENT_CLAIM_ALERT,
        request.params.identifier,
        false,
        ErrorConstants.UNAUTHORIZED_ACCESS
      );
      return KnownFailureResponse(
        response,
        HttpStatusCodes.UNAUTHORIZED_REQUEST,
        ErrorConstants.UNAUTHORIZED_ACCESS,
        undefined,
        InternalErrorCode.UNAUTHORIZED_ACCESS_PHONE_NUMBER_MISMATCHED
      );
    }

    if (filteredPrescription[0].pendingPrescriptionList.events) {
      prescriptionInfoRequestId = setPendingPrescriptionsTelemetryIds(
        filteredPrescription[0].pendingPrescriptionList.events
      );
    }
    const pendingPrescriptionList =
      filteredPrescription[0].pendingPrescriptionList;
    const memberIdentifier =
      (pendingPrescriptionList &&
        pendingPrescriptionList.prescriptions &&
        pendingPrescriptionList.prescriptions.length &&
        pendingPrescriptionList.prescriptions[0].personId) ||
      undefined;
    await publishViewAuditEvent(
      request,
      response,
      ApiConstants.AUDIT_VIEW_EVENT_CLAIM_ALERT,
      request.params.identifier,
      true
    );
    return SuccessResponse<IPendingMedicationResponseData>(
      response,
      SuccessConstants.DOCUMENT_FOUND,
      {
        memberIdentifier,
        pendingPrescriptionList,
      },
      memberInfoRequestId,
      prescriptionInfoRequestId
    );
  }
}
