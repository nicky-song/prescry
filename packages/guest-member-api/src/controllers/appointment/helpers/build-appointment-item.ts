// Copyright 2020 Prescryptive Health, Inc.

import { IAppointmentEvent } from '../../../models/appointment-event';
import { IAppointmentItem } from '@phx/common/src/models/api-response/appointment.response';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { ApiConstants } from '../../../constants/api-constants';
import { splitAppointmentDateAndTime } from '../../provider-location/helpers/appointment-time.helper';
import { getPatientTestResultForOrderNumber } from '../../../databases/mongo-database/v1/query-helper/patient-test-result-event.query-helper';
import { IPatientTestResultEvent } from '../../../databases/mongo-database/v1/definitions/patient-test-result-event.definition';
import moment from 'moment';
import { IImmunizationRecordEvent } from '../../../models/immunization-record';
import { getImmunizationRecordByOrderNumberForMembers } from '../../../databases/mongo-database/v1/query-helper/immunization-record-event.query-helper';
import { IConfiguration } from '../../../configuration';
import { getProviderLocationByIdAndServiceType } from '../../provider-location/helpers/get-provider-location-by-id-and-service-type.helper';
import { encodeAscii } from '@phx/common/src/utils/base-64-helper';

export async function buildAppointmentItem(
  appointmentDetails: IAppointmentEvent,
  database: IDatabase,
  configuration: IConfiguration,
  dateOfBirth?: string
): Promise<IAppointmentItem | undefined> {
  let procedureCode = '';
  const providerLocationResponse = await getProviderLocationByIdAndServiceType(
    configuration,
    appointmentDetails.eventData.appointment.locationId,
    appointmentDetails.eventData.serviceType
  );
  const location = providerLocationResponse.location;
  const serviceForServiceType = providerLocationResponse.service;
  if (location) {
    const service = location.serviceList?.find(
      (item) => item.serviceType === appointmentDetails.eventData.serviceType
    );
    const appointmentDateTime = splitAppointmentDateAndTime(
      appointmentDetails.eventData.appointment.start,
      ApiConstants.MONTH_DATE_YEAR_FORMAT,
      ApiConstants.TIME_TEST_RESULT_FORMAT
    );

    const patientTestResults: (IPatientTestResultEvent & Document) | null =
      await getPatientTestResultForOrderNumber(
        appointmentDetails.eventData.orderNumber,
        database
      );

    if (
      appointmentDetails.eventData.bookingStatus === 'Completed' &&
      !patientTestResults
    ) {
      const dbResults: IImmunizationRecordEvent | null =
        await getImmunizationRecordByOrderNumberForMembers(
          [appointmentDetails.eventData.appointment.memberRxId],
          appointmentDetails.eventData.orderNumber,
          database
        );
      procedureCode = dbResults?.eventData.vaccineCodes[0].code || '';
    }

    const customerDateOfBirth = dateOfBirth
      ? moment(dateOfBirth).format(ApiConstants.DATE_TEST_RESULT_FORMAT)
      : '';

    const calculateTotalCost = appointmentDetails.eventData.payment?.unitAmount
      ? (appointmentDetails.eventData.payment?.unitAmount / 100).toString()
      : undefined;

    const appointmentLink = encodeAscii(
      `${appointmentDetails.eventData.orderNumber} ${appointmentDetails.eventData.appointment.customerPhone}`
    );

    return {
      serviceName: appointmentDetails.eventData.appointment.serviceName,
      customerName: appointmentDetails.eventData.appointment.customerName,
      customerDateOfBirth,
      status: appointmentDetails.eventData.appointment.status || 'None',
      orderNumber: appointmentDetails.eventData.orderNumber,
      locationName: location.providerInfo.providerName,
      address1: location.address1,
      address2: location.address2,
      city: location.city,
      state: location.state,
      zip: location.zip,
      additionalInfo: service?.confirmationAdditionalInfo,
      date: appointmentDateTime.date,
      time: appointmentDateTime.time,
      providerTaxId: location.providerTaxId,
      totalCost: calculateTotalCost,
      providerLegalName:
        appointmentDetails.eventData.claimInformation?.providerLegalName,
      providerNpi: location.npiNumber,
      diagnosticCode: patientTestResults?.eventData.icd10?.[0] ?? undefined,
      paymentStatus:
        appointmentDetails.eventData.payment?.paymentStatus ||
        'no_payment_required',
      procedureCode:
        appointmentDetails.eventData.appointment.procedureCode || procedureCode,
      contractFee: appointmentDetails.eventData.contractFee,
      serviceDescription:
        appointmentDetails.eventData.appointment.serviceDescription,
      bookingStatus: appointmentDetails.eventData.bookingStatus,
      startInUtc: appointmentDetails.eventData.appointment.startInUtc,
      serviceType: appointmentDetails.eventData.serviceType,
      confirmationDescription:
        serviceForServiceType?.confirmationDescriptionMyRx,
      cancellationPolicy: serviceForServiceType?.cancellationPolicyMyRx,
      providerPhoneNumber: location.phoneNumber,
      providerClia: location.cliaNumber,
      appointmentLink,
    };
  }
  return undefined;
}
