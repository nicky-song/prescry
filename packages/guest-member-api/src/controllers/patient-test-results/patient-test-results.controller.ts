// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { ITestResultResponseData } from '@phx/common/src/models/api-response/test-result-response';
import { IConfiguration } from '../../configuration';
import {
  SuccessConstants,
  ErrorConstants,
} from '../../constants/response-messages';
import { IPatientTestResultEvent } from '../../databases/mongo-database/v1/definitions/patient-test-result-event.definition';
import { getTestResultByOrderNumberForMembers } from '../../databases/mongo-database/v1/query-helper/patient-test-result-event.query-helper';
import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import { getAllowedMemberIdsForLoggedInUser } from '../../utils/person/get-dependent-person.helper';
import { getRequestQuery } from '../../utils/request/get-request-query';
import {
  SuccessResponse,
  KnownFailureResponse,
  UnknownFailureResponse,
} from '../../utils/response-helper';
import { buildPatientTestResultPdf } from './helpers/build-patient-test-result.pdf';
import { buildPatientTestResult } from './helpers/build-patient-test-results';
import { ApiConstants } from '../../constants/api-constants';
import { publishViewAuditEvent } from '../../utils/health-record-event/publish-view-audit-event';
import { knownFailureResponseAndPublishEvent } from '../../utils/known-failure-and-publish-audit-event';

export class PatientTestResultsController {
  public database: IDatabase;
  public configuration: IConfiguration;

  constructor(database: IDatabase, configuration: IConfiguration) {
    this.database = database;
    this.configuration = configuration;
  }

  public getPatientTestResults = async (
    request: Request,
    response: Response
  ) => {
    try {
      const orderNumber = getRequestQuery(request, 'ordernumber');
      const memberIds = getAllowedMemberIdsForLoggedInUser(response);
      if (orderNumber) {
        const dbResults: IPatientTestResultEvent | null =
          await getTestResultByOrderNumberForMembers(
            memberIds,
            orderNumber,
            this.database
          );

        const testResult = dbResults
          ? await buildPatientTestResult(
              dbResults,
              this.database,
              this.configuration
            )
          : undefined;

        if (!testResult) {
          return await knownFailureResponseAndPublishEvent(
            request,
            response,
            ApiConstants.AUDIT_VIEW_EVENT_TEST_RESULTS,
            orderNumber,
            HttpStatusCodes.NOT_FOUND,
            ErrorConstants.TEST_RESULT_NOT_FOUND
          );
        }
        await publishViewAuditEvent(
          request,
          response,
          ApiConstants.AUDIT_VIEW_EVENT_TEST_RESULTS,
          orderNumber,
          true
        );
        return SuccessResponse<ITestResultResponseData>(
          response,
          SuccessConstants.SUCCESS_OK,
          {
            testResult,
            testResultPdf: await buildPatientTestResultPdf(testResult),
          }
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
  };
}
