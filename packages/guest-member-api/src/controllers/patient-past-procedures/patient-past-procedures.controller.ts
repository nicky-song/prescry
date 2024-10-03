// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  IPastProcedure,
  IPastProcedureResponseData,
} from '@phx/common/src/models/api-response/past-procedure-response';
import { ApiConstants } from '../../constants/api-constants';
import {
  SuccessConstants,
  ErrorConstants,
} from '../../constants/response-messages';
import { IPatientTestResultEvent } from '../../databases/mongo-database/v1/definitions/patient-test-result-event.definition';
import { getAllImmunizationRecordsForMember } from '../../databases/mongo-database/v1/query-helper/immunization-record-event.query-helper';
import { getAllTestResultsForMember } from '../../databases/mongo-database/v1/query-helper/patient-test-result-event.query-helper';
import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import { IImmunizationRecordEvent } from '../../models/immunization-record';
import {
  SuccessResponse,
  UnknownFailureResponse,
} from '../../utils/response-helper';
import { getAllowedMemberIdsForLoggedInUser } from '../../utils/person/get-dependent-person.helper';
import { buildPastProcedureFromImmunizationRecord } from './helpers/build-past-procedure-from-immunization-record';
import { buildPastProcedureFromTestResults } from './helpers/build-past-procedure-from-test-results';
import { sortPastProceduresByAppointmentDate } from './helpers/sort-past-procedure-by-appointment-date';

export class PatientPastProceduresController {
  public database: IDatabase;

  constructor(database: IDatabase) {
    this.database = database;
  }

  public getAllPastProceduresForPatients = async (
    _: Request,
    response: Response
  ) => {
    try {
      const memberIds = await getAllowedMemberIdsForLoggedInUser(response);
      const dbResults: IPatientTestResultEvent[] | [] =
        await getAllTestResultsForMember(
          memberIds,
          this.database,
          ApiConstants.APPOINTMENT_NO_SHOW_CODE
        );
      const pastProcedures: IPastProcedure[] = [];
      if (dbResults && dbResults.length > 0) {
        for (const test of dbResults) {
          if (
            !test.eventData.orderNumber ||
            pastProcedures.find(
              (exist) => exist.orderNumber === test.eventData.orderNumber
            )
          ) {
            continue;
          }
          const testsForOrderNumber = dbResults.filter(
            (res) => res.eventData.orderNumber === test.eventData.orderNumber
          );

          testsForOrderNumber.sort(
            (
              first: IPatientTestResultEvent,
              second: IPatientTestResultEvent
            ) => {
              return second.createdOn - first.createdOn;
            }
          );
          const testResult = await buildPastProcedureFromTestResults(
            testsForOrderNumber[0],
            this.database
          );
          if (testResult) {
            pastProcedures.push(testResult);
          }
        }
      }

      const immunizationDbResults: IImmunizationRecordEvent[] | [] =
        await getAllImmunizationRecordsForMember(memberIds, this.database);
      if (immunizationDbResults && immunizationDbResults.length > 0) {
        for (const record of immunizationDbResults) {
          if (
            !record.eventData.orderNumber ||
            pastProcedures.find(
              (exist) => exist.orderNumber === record.eventData.orderNumber
            )
          ) {
            continue;
          }
          const recordsForOrderNumber = immunizationDbResults.filter(
            (res) => res.eventData.orderNumber === record.eventData.orderNumber
          );
          recordsForOrderNumber.sort(
            (
              first: IImmunizationRecordEvent,
              second: IImmunizationRecordEvent
            ) => {
              return second.createdOn - first.createdOn;
            }
          );
          const immunization = await buildPastProcedureFromImmunizationRecord(
            recordsForOrderNumber[0],
            this.database
          );
          if (immunization) {
            pastProcedures.push(immunization);
          }
        }
      }
      return SuccessResponse<IPastProcedureResponseData>(
        response,
        SuccessConstants.SUCCESS_OK,
        {
          pastProcedures: sortPastProceduresByAppointmentDate(pastProcedures),
        }
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
