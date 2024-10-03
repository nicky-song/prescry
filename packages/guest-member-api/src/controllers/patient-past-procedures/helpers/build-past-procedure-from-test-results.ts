// Copyright 2020 Prescryptive Health, Inc.

import { IPastProcedure } from '@phx/common/src/models/api-response/past-procedure-response';
import { ApiConstants } from '../../../constants/api-constants';
import { IPatientTestResultEvent } from '../../../databases/mongo-database/v1/definitions/patient-test-result-event.definition';
import { getAppointmentEventByOrderNumber } from '../../../databases/mongo-database/v1/query-helper/appointment-event.query-helper';
import { searchPersonByPrimaryMemberRxId } from '../../../databases/mongo-database/v1/query-helper/person-collection-helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { splitAppointmentDateAndTime } from '../../provider-location/helpers/appointment-time.helper';

export async function buildPastProcedureFromTestResults(
  result: IPatientTestResultEvent,
  database: IDatabase
): Promise<IPastProcedure | undefined> {
  const testResult: IPastProcedure = {
    orderNumber: result.eventData.orderNumber,
    procedureType: ApiConstants.TEST_RESULT_EVENT_TYPE,
  };
  const personInfo = await searchPersonByPrimaryMemberRxId(
    database,
    result.eventData.primaryMemberRxId
  );
  if (personInfo) {
    testResult.memberFirstName = personInfo.firstName;
    testResult.memberLastName = personInfo.lastName;
  }
  const appointment = await getAppointmentEventByOrderNumber(
    result.eventData.primaryMemberRxId,
    result.eventData.orderNumber,
    database
  );
  if (appointment) {
    const appointmentDateTime = splitAppointmentDateAndTime(
      appointment.eventData.appointment.start,
      ApiConstants.MONTH_DATE_YEAR_FORMAT,
      ApiConstants.TIME_TEST_RESULT_FORMAT
    );
    testResult.date = appointmentDateTime.date;
    testResult.time = appointmentDateTime.time;
    testResult.serviceDescription =
      appointment.eventData.appointment.serviceDescription;
    testResult.serviceType = appointment.eventData.serviceType;
    return testResult;
  }
  return undefined;
}
