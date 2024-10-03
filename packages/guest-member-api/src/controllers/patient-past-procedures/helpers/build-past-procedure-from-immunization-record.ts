// Copyright 2020 Prescryptive Health, Inc.

import { IPastProcedure } from '@phx/common/src/models/api-response/past-procedure-response';
import { ApiConstants } from '../../../constants/api-constants';
import { getAppointmentEventByOrderNumber } from '../../../databases/mongo-database/v1/query-helper/appointment-event.query-helper';
import { searchPersonByPrimaryMemberRxId } from '../../../databases/mongo-database/v1/query-helper/person-collection-helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { splitAppointmentDateAndTime } from '../../provider-location/helpers/appointment-time.helper';
import { IImmunizationRecordEvent } from '../../../models/immunization-record';

export async function buildPastProcedureFromImmunizationRecord(
  result: IImmunizationRecordEvent,
  database: IDatabase
): Promise<IPastProcedure | undefined> {
  const pastProcedure: IPastProcedure = {
    orderNumber: result.eventData.orderNumber,
    procedureType: ApiConstants.IMMUNIZATION_RESULT_TYPE,
  };
  const personInfo = await searchPersonByPrimaryMemberRxId(
    database,
    result.eventData.memberRxId
  );
  if (personInfo) {
    pastProcedure.memberFirstName = personInfo.firstName;
    pastProcedure.memberLastName = personInfo.lastName;
  }
  const appointment = await getAppointmentEventByOrderNumber(
    result.eventData.memberRxId,
    result.eventData.orderNumber,
    database
  );
  if (appointment) {
    const appointmentDateTime = splitAppointmentDateAndTime(
      appointment.eventData.appointment.start,
      ApiConstants.MONTH_DATE_YEAR_FORMAT,
      ApiConstants.TIME_TEST_RESULT_FORMAT
    );
    pastProcedure.date = appointmentDateTime.date;
    pastProcedure.time = appointmentDateTime.time;
    pastProcedure.serviceDescription =
      appointment.eventData.appointment.serviceDescription;

    pastProcedure.serviceType = appointment.eventData.serviceType;
    return pastProcedure;
  }
  return undefined;
}
