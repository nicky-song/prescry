// Copyright 2021 Prescryptive Health, Inc.

import { searchPersonByPrimaryMemberRxId } from '../../../databases/mongo-database/v1/query-helper/person-collection-helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { IImmunizationRecord } from '@phx/common/src/models/api-response/immunization-record-response';
import { IImmunizationRecordEvent } from '../../../models/immunization-record';
import { ApiConstants } from '../../../constants/api-constants';
import { splitAppointmentDateAndTime } from '../../provider-location/helpers/appointment-time.helper';
import { getAppointmentEventByOrderNumber } from '../../../databases/mongo-database/v1/query-helper/appointment-event.query-helper';
import { IProviderLocationResponse } from '../../../models/pharmacy-portal/get-provider-location.response';
import { IConfiguration } from '../../../configuration';
import { getProviderLocationByIdAndServiceType } from '../../provider-location/helpers/get-provider-location-by-id-and-service-type.helper';

export async function buildImmunizationRecord(
  result: IImmunizationRecordEvent,
  database: IDatabase,
  configuration: IConfiguration
): Promise<IImmunizationRecord> {
  const procedureDetails: IImmunizationRecord = {
    orderNumber: result.eventData.orderNumber,
    lotNumber: result.eventData.lotNumber,
    manufacturer: result.eventData.manufacturer,
    doseNumber: result.eventData.protocolApplied.doseNumber,
    memberId: result.eventData.memberRxId,
    vaccineCode: result.eventData.vaccineCodes[0].code,
  };
  const personInfo = await searchPersonByPrimaryMemberRxId(
    database,
    result.eventData.memberRxId
  );
  if (personInfo) {
    procedureDetails.memberFirstName = personInfo.firstName;
    procedureDetails.memberLastName = personInfo.lastName;
    procedureDetails.memberDateOfBirth = personInfo.dateOfBirth;
  }
  const appointmentDetails = await getAppointmentEventByOrderNumber(
    result.eventData.memberRxId,
    result.eventData.orderNumber,
    database
  );
  if (appointmentDetails) {
    const appointmentDateTime = splitAppointmentDateAndTime(
      appointmentDetails.eventData.appointment.start,
      ApiConstants.MONTH_DATE_YEAR_FORMAT,
      ApiConstants.TIME_TEST_RESULT_FORMAT
    );
    procedureDetails.date = appointmentDateTime.date;
    procedureDetails.time = appointmentDateTime.time;

    const providerLocationResponse: IProviderLocationResponse =
      await getProviderLocationByIdAndServiceType(
        configuration,
        appointmentDetails.eventData.appointment.locationId,
        appointmentDetails.eventData.serviceType
      );
    const providerLocation = providerLocationResponse.location;

    procedureDetails.serviceDescription =
      appointmentDetails.eventData.appointment.serviceDescription;

    const service = providerLocationResponse.service;
    if (procedureDetails.vaccineCode && service?.claimOptions) {
      const correctClaimOption = service?.claimOptions.find(
        (claimOption) =>
          claimOption.cptCode?.code === procedureDetails.vaccineCode
      );

      procedureDetails.factSheetLinks = correctClaimOption?.factSheetLinks;
    }

    if (providerLocation) {
      procedureDetails.locationName =
        providerLocation.providerInfo.providerName;
      procedureDetails.address1 = providerLocation.address1;
      procedureDetails.address2 = providerLocation.address2;
      procedureDetails.city = providerLocation.city;
      procedureDetails.state = providerLocation.state;
      procedureDetails.zip = providerLocation.zip;
    }
  }
  return procedureDetails;
}
