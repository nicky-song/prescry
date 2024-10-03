// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  HttpStatusCodes,
  InternalErrorCode,
} from '@phx/common/src/errors/error-codes';
import {
  SuccessConstants,
  ErrorConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { IClaimAlert } from '@phx/common/src/models/claim-alert/claim-alert';
import { claimAlertMockMap } from '@phx/common/src/utils/api-helpers/build-mock-claim-alert-args';
import {
  SuccessResponse,
  KnownFailureResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { fetchRequestHeader } from '../../../utils/request-helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { ApiConstants } from '../../../constants/api-constants';
import { publishViewAuditEvent } from '../../../utils/health-record-event/publish-view-audit-event';
import {
  getAllPendingPrescriptionsByIdentifierFromMessageEnvelope,
  getPendingPrescriptionsByIdentifier,
} from '../../../databases/mongo-database/v1/query-helper/pending-prescriptions.query-helper';
import { setPendingPrescriptionsTelemetryIds } from '../../../utils/telemetry-helper';
import { claimAlertMapper } from '../../../utils/transformers/claim-alert/claim-alert';
import { IMessageEnvelope } from '@phx/common/src/models/message-envelope';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { knownFailureResponseAndPublishEvent } from '../../../utils/known-failure-and-publish-audit-event';

export async function getClaimAlertHandler(
  request: Request,
  response: Response,
  database: IDatabase
) {
  try {
    const { identifier } = request.params;
    const memberInfoRequestId = fetchRequestHeader(request, 'request-id');

    const masterId = response.locals?.patientAccount?.patientId ?? '';

    if (claimAlertMockMap.has(identifier)) {
      return SuccessResponse<IClaimAlert>(
        response,
        SuccessConstants.DOCUMENT_FOUND,
        claimAlertMockMap.get(identifier),
        memberInfoRequestId
      );
    } else if (request.params.identifier.startsWith('rogue')) {
      const modelsFound = await getPendingPrescriptionsByIdentifier(
        identifier,
        database
      );

      if (!modelsFound?.prescriptions?.length) {
        return KnownFailureResponse(
          response,
          HttpStatusCodes.NOT_FOUND,
          ErrorConstants.DOCUMENT_NOT_FOUND
        );
      }

      let newOperationId;

      if (modelsFound.events) {
        newOperationId = setPendingPrescriptionsTelemetryIds(
          modelsFound.events
        );
      }

      const { prescriptions: data } = modelsFound;

      const pendingPrescription = JSON.parse(JSON.stringify(data[0]));

      const claimAlert = claimAlertMapper({
        fromModel: pendingPrescription,
        additional: { identifier, masterId },
      });

      return SuccessResponse<IClaimAlert>(
        response,
        SuccessConstants.DOCUMENT_FOUND,
        claimAlert,
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

      const { prescriptions: data } = pendingPrescriptionList;

      const pendingPrescription = data
        ? JSON.parse(JSON.stringify(data[0]))
        : undefined;

      const claimAlert = claimAlertMapper({
        fromModel: pendingPrescription,
        additional: { identifier: memberIdentifier ?? identifier, masterId },
      });

      return SuccessResponse<IClaimAlert>(
        response,
        SuccessConstants.DOCUMENT_FOUND,
        claimAlert,
        memberInfoRequestId,
        prescriptionInfoRequestId
      );
    }
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
