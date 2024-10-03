// Copyright 2020 Prescryptive Health, Inc.

import { ITestResult } from '@phx/common/src/models/api-response/test-result-response';
import { IConfiguration } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { IPatientTestResultEvent } from '../../../databases/mongo-database/v1/definitions/patient-test-result-event.definition';
import { getAppointmentEventByOrderNumber } from '../../../databases/mongo-database/v1/query-helper/appointment-event.query-helper';
import { searchPersonByPrimaryMemberRxId } from '../../../databases/mongo-database/v1/query-helper/person-collection-helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { getServiceDetailsByServiceType } from '../../../utils/external-api/get-service-details-by-service-type';
import { splitAppointmentDateAndTime } from '../../provider-location/helpers/appointment-time.helper';
import { getProviderLocationByIdAndServiceType } from '../../provider-location/helpers/get-provider-location-by-id-and-service-type.helper';

export async function buildPatientTestResult(
  result: IPatientTestResultEvent,
  database: IDatabase,
  configuration: IConfiguration
): Promise<ITestResult> {
  const testResult: ITestResult = {
    fillDate: result.eventData.fillDate,
    icd10: result.eventData.icd10,
    memberId: result.eventData.primaryMemberRxId,
    orderNumber: result.eventData.orderNumber,
    productOrService: result.eventData.productOrService,
  };
  const personInfo = await searchPersonByPrimaryMemberRxId(
    database,
    result.eventData.primaryMemberRxId
  );
  if (personInfo) {
    testResult.memberFirstName = personInfo.firstName;
    testResult.memberLastName = personInfo.lastName;
    testResult.memberDateOfBirth = personInfo.dateOfBirth;
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
    const locationId = appointment.eventData.appointment.locationId;

    const serviceDetailsResponse = await getServiceDetailsByServiceType(
      configuration,
      appointment.eventData.serviceType
    );
    const service = serviceDetailsResponse.service;
    if (testResult.icd10 && service?.claimOptions) {
      const correctClaimOption = result.eventData.claimOptionId
        ? service?.claimOptions.find(
            (claimOption) =>
              claimOption.claimOptionId === result.eventData.claimOptionId
          )
        : service?.claimOptions.find((claimOption) =>
            testResult.icd10.includes(claimOption.icd10Code?.code)
          );
      testResult.factSheetLinks = correctClaimOption?.factSheetLinks;
      testResult.colorMyRx = correctClaimOption?.icd10Code?.colorMyRx;
      testResult.textColorMyRx = correctClaimOption?.icd10Code?.textColorMyRx;
      testResult.valueMyRx = correctClaimOption?.icd10Code?.valueMyRx;
      testResult.descriptionMyRx =
        correctClaimOption?.icd10Code?.descriptionMyRx;
      testResult.manufacturer = correctClaimOption?.manufacturer;
      testResult.testType = serviceDetailsResponse.service?.testType;
      testResult.administrationMethod =
        serviceDetailsResponse.service?.administrationMethod;
    }
    const providerLocationEndointResponse =
      await getProviderLocationByIdAndServiceType(configuration, locationId);
    const providerLocation = providerLocationEndointResponse.location;
    if (providerLocation) {
      testResult.providerName = providerLocation.providerInfo.providerName;
      testResult.providerAddress = {
        address1: providerLocation.address1,
        address2: providerLocation.address2,
        city: providerLocation.city,
        state: providerLocation.state,
        zip: providerLocation.zip,
      };
      testResult.providerPhoneNumber = providerLocation.phoneNumber;
      testResult.providerCliaNumber = providerLocation.cliaNumber;
    }
  }
  return testResult;
}
