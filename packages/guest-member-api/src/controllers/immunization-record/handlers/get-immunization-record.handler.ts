// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { getAllowedMemberIdsForLoggedInUser } from '../../../utils/person/get-dependent-person.helper';
import {
  IImmunizationRecord,
  IImmunizationRecordResponseData,
} from '@phx/common/src/models/api-response/immunization-record-response';
import { buildImmunizationRecord } from '../helpers/build-immunization-record';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import {
  SuccessConstants,
  ErrorConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import {
  getImmunizationRecordByOrderNumberForMembers,
  getImmunizationRecordByVaccineCodeForMembers,
} from '../../../databases/mongo-database/v1/query-helper/immunization-record-event.query-helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { IImmunizationRecordEvent } from '../../../models/immunization-record';
import {
  SuccessResponse,
  KnownFailureResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { IConfiguration } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { publishViewAuditEvent } from '../../../utils/health-record-event/publish-view-audit-event';
import { knownFailureResponseAndPublishEvent } from '../../../utils/known-failure-and-publish-audit-event';

export async function getImmunizationRecordHandler(
  request: Request,
  response: Response,
  database: IDatabase,
  configuration: IConfiguration
) {
  try {
    const orderNumber = request.params.identifier;
    const memberIds = getAllowedMemberIdsForLoggedInUser(response);
    if (orderNumber) {
      const dbResults: IImmunizationRecordEvent | null =
        await getImmunizationRecordByOrderNumberForMembers(
          memberIds,
          orderNumber,
          database
        );

      if (dbResults) {
        const pastProcedureResults: IImmunizationRecord[] = [];
        const procedureDetails = await buildImmunizationRecord(
          dbResults,
          database,
          configuration
        );
        pastProcedureResults.push(procedureDetails);
        let doseNumber = procedureDetails.doseNumber;
        if (doseNumber !== 1) {
          const immunizationRecordByVaccineCode =
            await getImmunizationRecordByVaccineCodeForMembers(
              memberIds,
              procedureDetails.vaccineCode,
              database
            );
          while (doseNumber > 1) {
            const previousDoseProcedures =
              immunizationRecordByVaccineCode.filter(
                (procedure) =>
                  procedure.eventData.protocolApplied.doseNumber ===
                  doseNumber - 1
              );

            if (previousDoseProcedures && previousDoseProcedures.length > 0) {
              const procedureDetailsForPreviousDose =
                await findLatestProcedureByCreatedOn(
                  previousDoseProcedures,
                  database,
                  configuration
                );
              pastProcedureResults.push(procedureDetailsForPreviousDose);
            }
            doseNumber -= 1;
          }
        }
        await publishViewAuditEvent(
          request,
          response,
          ApiConstants.AUDIT_VIEW_EVENT_VACCINE_RECORD,
          orderNumber,
          true
        );
        return SuccessResponse<IImmunizationRecordResponseData>(
          response,
          SuccessConstants.SUCCESS_OK,
          {
            immunizationResult: pastProcedureResults,
          }
        );
      }
      return await knownFailureResponseAndPublishEvent(
        request,
        response,
        ApiConstants.AUDIT_VIEW_EVENT_VACCINE_RECORD,
        orderNumber,
        HttpStatusCodes.UNAUTHORIZED_REQUEST,
        ErrorConstants.UNAUTHORIZED_ACCESS
      );
    }
    return KnownFailureResponse(
      response,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.ORDER_NUMBER_MISSING
    );
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}

async function findLatestProcedureByCreatedOn(
  proceduresForOrderNumber: IImmunizationRecordEvent[],
  database: IDatabase,
  configuration: IConfiguration
) {
  proceduresForOrderNumber.sort(
    (a: IImmunizationRecordEvent, b: IImmunizationRecordEvent) =>
      b.createdOn - a.createdOn
  );
  const procedureDetails = await buildImmunizationRecord(
    proceduresForOrderNumber[0],
    database,
    configuration
  );

  return procedureDetails;
}
