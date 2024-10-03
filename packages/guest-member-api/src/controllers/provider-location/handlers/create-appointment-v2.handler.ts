// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import moment from 'moment-timezone';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '@phx/common/src/errors/error-codes';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';
import {
  ErrorConstants,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';

import { ICreateBookingRequestBody } from '@phx/common/src/models/api-request-body/create-booking.request-body';
import { ICreateBookingResponseData } from '@phx/common/src/models/api-response/create-booking-response';
import { IPerson } from '@phx/common/src/models/person';
import { CalculateAbsoluteAge } from '@phx/common/src/utils/date-time-helper';
import { StringFormatter } from '@phx/common/src/utils/formatters/string.formatter';
import AddressValidator from '@phx/common/src/utils/validators/address.validator';
import { IConfiguration } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { ICreateAppointmentRequest } from '../../../models/pharmacy-portal/appointment-create.request';
import { getSessionIdFromRequest } from '../../../utils/health-record-event/get-sessionid-from-request';
import { getNext } from '../../../utils/redis/redis-order-number.helper';
import { fetchRequestHeader } from '../../../utils/request-helper';
import {
  getRequiredResponseLocal,
  getResponseLocal,
} from '../../../utils/request/request-app-locals.helper';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { createBookingPaymentCheckoutSessionIfNecessary } from './create-booking-checkout-session-info';
import { IAppointmentDateTime } from '../helpers/appointment-time.helper';
import { convertOutlookTimezoneToIANATimezone } from '../helpers/appointment-timezone.helper';
import { buildDependentPersonDetails } from '../helpers/build-dependent-person-details';
import { createAcceptanceTextMessage } from '../helpers/create-appointment-event.helper';
import { isDepdendentValid } from '../helpers/is-dependent-valid';
import { createAppointmentEndpointHelper } from '../helpers/create-appointment-endpoint.helper';
import { allRequiredQuestionsAnswered } from '../helpers/all-required-questions-answered.helper';
import { IProviderLocationResponse } from '../../../models/pharmacy-portal/get-provider-location.response';
import { getProviderLocationByIdAndServiceType } from '../helpers/get-provider-location-by-id-and-service-type.helper';
import { encodeAscii } from '@phx/common/src/utils/base-64-helper';
import { getNewDate } from '@phx/common/src/utils/date-time/get-new-date';
import { getPatientAccountByAccountId } from '../../../utils/external-api/patient-account/get-patient-account-by-account-id';
import {
  createCashCoverageRecord,
  IDependentInfo,
} from '../../../utils/coverage/create-cash-coverage-record';
import { createAccount } from '../../../utils/patient-account/create-account';
import { IIdentity } from '../../../models/identity';
import {
  getDependentByPatientDetails,
  IGetDependentByPatientDetailsProps,
} from '../../../utils/get-dependent-by-person-details';
import { assertHasFamilyId } from '../../../assertions/assert-has-family-id';
import { assertHasMasterId } from '../../../assertions/assert-has-master-id';
import { assertHasPatientAccount } from '../../../assertions/assert-has-patient-account';
import dateFormat from 'dateformat';
import { assertHasPatient } from '../../../assertions/assert-has-patient';
import { RxGroupTypesEnum } from '@phx/common/src/models/member-profile/member-profile-info';
import { assertHasDateOfBirth } from '../../../assertions/assert-has-date-of-birth';
import { IPatient } from '../../../models/fhir/patient/patient';
import {
  getNextAvailablePersonCodePatientCoverages,
  getPatientDependentByMasterIdAndRxGroupType,
} from '../../../utils/fhir-patient/patient.helper';
import { getMobileContactPhone } from '../../../utils/fhir-patient/get-contact-info-from-patient';
import { assertHasPhoneNumber } from '../../../assertions/assert-has-phone-number';
import { getPatientCoverageByQuery } from '../../../utils/external-api/coverage/get-patient-coverage-by-query';
import { getActiveCoveragesOfPatient } from '../../../utils/fhir-patient/get-active-coverages-of-patient';
import { assertHasAccountId } from '../../../assertions/assert-has-account-id';
import { mapMemberAddressToPatientAddress } from '../helpers/build-patient-details';
import { assertHasPerson } from '../../../assertions/assert-has-person';
import { mapPatientToPersonForAppointment } from '../../../utils/patient/map-patient-to-person-for-appointment.helper';
import { updatePersonDetailsIfNecessary } from '../helpers/update-person-details-if-necessary';
import {
  getLoggedInUserPatientForRxGroupType,
  getLoggedInUserProfileForRxGroupType,
} from '../../../utils/person/get-dependent-person.helper';
import { updatePatientDetailsIfNecessary } from '../helpers/update-patient-details-if-necessary';
import { getCurrentAnswer } from '@phx/common/src/utils/answer.helper';
import { AdministrativeGender } from '../../../models/fhir/types';

export async function createAppointmentHandlerV2(
  request: Request,
  response: Response,
  database: IDatabase,
  configuration: IConfiguration
) {
  try {
    const {
      bookingId,
      locationId,
      serviceType,
      start,
      questions,
      experienceBaseUrl,
      memberAddress,
      dependentInfo,
      inviteCode,
    } = request.body as ICreateBookingRequestBody;

    if (bookingId === undefined || bookingId === '') {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.MISSING_BOOKINGID
      );
    }

    const providerLocationDetails: IProviderLocationResponse =
      await getProviderLocationByIdAndServiceType(
        configuration,
        locationId,
        serviceType
      );

    const location = providerLocationDetails.location;

    if (!location) {
      return KnownFailureResponse(
        response,
        providerLocationDetails.errorCode ??
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
        providerLocationDetails.message ??
          StringFormatter.format(
            ErrorConstants.LOCATION_NOT_FOUND,
            new Map<string, string>([['locationId', locationId]])
          )
      );
    }

    const service = providerLocationDetails.service;
    if (!service) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.NOT_FOUND,
        StringFormatter.format(
          ErrorConstants.SERVICE_TYPE_NOT_FOUND,
          new Map<string, string>([
            ['locationId', locationId],
            ['serviceType', serviceType],
          ])
        )
      );
    }

    const selectedService = location.serviceList?.find(
      (s) => s.serviceType && s.serviceType === serviceType
    );

    if (!selectedService) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.NOT_FOUND,
        StringFormatter.format(
          ErrorConstants.SERVICE_TYPE_NOT_FOUND,
          new Map<string, string>([
            ['locationId', locationId],
            ['serviceType', serviceType],
          ])
        )
      );
    }

    if (!allRequiredQuestionsAnswered(selectedService.questions, questions)) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.INVALID_ANSWERS
      );
    }
    if (!AddressValidator.isAddressValid(memberAddress)) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.MISSING_ADDRESS
      );
    }

    const patient = getRequiredResponseLocal(response, 'patient');

    assertHasPatient(patient);

    const dateOfBirth = patient.birthDate;

    if (!dateOfBirth) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.SCHEDULER_AGE_REQUIREMENT_NOT_MET
      );
    }

    const age = CalculateAbsoluteAge(getNewDate(), dateOfBirth);
    const minAge = service.minimumAge || ApiConstants.APPOINTMENT_MIN_AGE_LIMIT;
    const minAgeScheduler =
      service.schedulerMinimumAge || ApiConstants.SCHEDULER_MIN_AGE_LIMIT;
    if (age < minAgeScheduler) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.SCHEDULER_AGE_REQUIREMENT_NOT_MET
      );
    }

    const patientDependents =
      getResponseLocal(response, 'patientDependents') || [];

    let dependentPersonInfo;
    let patientDependent: IPatient | undefined;

    if (dependentInfo) {
      if (dependentInfo.masterId) {
        patientDependent = getPatientDependentByMasterIdAndRxGroupType(
          patientDependents,
          dependentInfo.masterId,
          RxGroupTypesEnum.CASH
        );

        if (!patientDependent) {
          return KnownFailureResponse(
            response,
            HttpStatusCodes.BAD_REQUEST,
            ErrorConstants.INVALID_DEPENDENT_MASTER_ID
          );
        }

        const dependentBirthDate = patientDependent.birthDate;

        assertHasDateOfBirth(dependentBirthDate);

        if (CalculateAbsoluteAge(getNewDate(), dependentBirthDate) < minAge) {
          return KnownFailureResponse(
            response,
            HttpStatusCodes.BAD_REQUEST,
            ErrorConstants.AGE_REQUIREMENT_NOT_MET_VACCINE
          );
        }

        dependentPersonInfo = await mapPatientToPersonForAppointment(
          patientDependent,
          configuration
        );

        if (!dependentPersonInfo) {
          return KnownFailureResponse(
            response,
            HttpStatusCodes.BAD_REQUEST,
            ErrorConstants.APPOINTMENT_DEPENDENT_NOT_FOUND(
              dependentInfo.masterId
            )
          );
        }
      } else {
        if (!isDepdendentValid(dependentInfo, minAge)) {
          return KnownFailureResponse(
            response,
            HttpStatusCodes.BAD_REQUEST,
            ErrorConstants.MISSING_DEPENDENT_INFORMATION
          );
        }
      }
    }

    const orderNumber = await getNext(
      database,
      configuration.orderNumberBlockLength
    );

    const patientPhoneNumber = getMobileContactPhone(patient);

    assertHasPhoneNumber(patientPhoneNumber);
    let personInfo: IPerson | undefined = getLoggedInUserProfileForRxGroupType(
      response,
      'CASH'
    );

    if (personInfo) {
      personInfo = await updatePersonDetailsIfNecessary(request, personInfo);
    }

    assertHasPerson(personInfo);

    let patientInfo: IPatient | undefined =
      getLoggedInUserPatientForRxGroupType(response, 'CASH');

    assertHasPatient(patientInfo);

    patientInfo = await updatePatientDetailsIfNecessary(
      request,
      patientInfo,
      configuration
    );

    assertHasPatient(patientInfo);

    if (dependentInfo && !dependentInfo.masterId) {
      try {
        const firstNameToUse = (
          dependentInfo.firstName?.trim() ?? ''
        ).toUpperCase();
        const lastNameToUse = (
          dependentInfo.lastName?.trim() ?? ''
        ).toUpperCase();

        const getDependentByPersonDetailsProps: IGetDependentByPatientDetailsProps =
          {
            firstName: firstNameToUse,
            familyName: lastNameToUse,
            birthDate: dependentInfo.dateOfBirth,
            phoneNumber: patientPhoneNumber,
          };

        const dependentPatient = await getDependentByPatientDetails(
          configuration,
          getDependentByPersonDetailsProps
        );

        let memberFamilyId;

        const query = `beneficiary=patient/${patient.id}`;

        const patientCoverages = await getPatientCoverageByQuery(
          configuration,
          query
        );

        if (patientCoverages?.length) {
          const activeCoverages = getActiveCoveragesOfPatient(patientCoverages);

          memberFamilyId = activeCoverages[0]?.subscriberId;
        }

        assertHasFamilyId(memberFamilyId);

        if (!dependentPatient) {
          if (
            dependentInfo.firstName &&
            dependentInfo.lastName &&
            dependentInfo.dateOfBirth
          ) {
            const isoDateOfBirth = dateFormat(
              dependentInfo.dateOfBirth,
              'yyyy-mm-dd'
            );

            const createPatientAccountProps: IIdentity = {
              isoDateOfBirth,
              firstName: firstNameToUse,
              lastName: lastNameToUse,
              phoneNumber: patientPhoneNumber,
              email: '',
            };

            const personCodeNum =
              await getNextAvailablePersonCodePatientCoverages(
                memberFamilyId,
                configuration
              );

            const patientDependentAddress = dependentInfo.address
              ? mapMemberAddressToPatientAddress(dependentInfo.address)
              : undefined;

            const parentAddress = patientInfo.address?.[0];

            const address = dependentInfo.addressSameAsParent
              ? parentAddress
              : patientDependentAddress;

            const gender = getCurrentAnswer(
              'patient-gender',
              'text',
              questions
            ) as AdministrativeGender | undefined;

            const patientAccount = await createAccount(
              configuration,
              createPatientAccountProps,
              memberFamilyId,
              undefined,
              undefined,
              undefined,
              undefined,
              personCodeNum,
              address,
              gender
                ? (gender.toLowerCase() as AdministrativeGender)
                : undefined
            );

            const dependentMasterId = patientAccount.patient?.id;
            const dependentAccountId = patientAccount.accountId;

            const primaryMemberMasterId = patient.id;

            assertHasMasterId(primaryMemberMasterId, patientPhoneNumber);

            assertHasMasterId(dependentMasterId, patientPhoneNumber);

            assertHasAccountId(dependentAccountId);

            const createCashCoverageDependentInfo: IDependentInfo = {
              dependentNumber: personCodeNum,
              masterId: dependentMasterId,
            };

            const query = `beneficiary=patient/${dependentMasterId}`;

            const patientCoverages = await getPatientCoverageByQuery(
              configuration,
              query
            );

            if (!patientCoverages?.length) {
              await createCashCoverageRecord(
                configuration,
                primaryMemberMasterId,
                memberFamilyId,
                createCashCoverageDependentInfo
              );
            }

            dependentPersonInfo = await buildDependentPersonDetails(
              dependentInfo,
              database,
              personInfo,
              configuration.redisPersonCreateKeyExpiryTime,
              dependentPersonInfo,
              dependentMasterId,
              dependentAccountId,
              personCodeNum
            );
          }
        } else {
          const existingDependentMasterId = dependentPatient?.accountId;

          assertHasMasterId(existingDependentMasterId, patientPhoneNumber);

          const dependentPatientAccount = await getPatientAccountByAccountId(
            configuration,
            existingDependentMasterId,
            false,
            true
          );

          assertHasPatientAccount(dependentPatientAccount);

          const query = `beneficiary=patient/${existingDependentMasterId}`;

          const patientCoverages = await getPatientCoverageByQuery(
            configuration,
            query
          );

          if (!patientCoverages?.length) {
            const personCodeNum =
              await getNextAvailablePersonCodePatientCoverages(
                memberFamilyId,
                configuration
              );

            await createCashCoverageRecord(
              configuration,
              existingDependentMasterId,
              memberFamilyId,
              {
                dependentNumber: personCodeNum,
                masterId: existingDependentMasterId,
              }
            );
          }
        }
      } catch (exception) {
        const error = exception as Error;
        if (error.message === ErrorConstants.MAX_DEPENDENT_LIMIT_REACHED) {
          return KnownFailureResponse(
            response,
            HttpStatusCodes.BAD_REQUEST,
            error.message,
            undefined,
            InternalResponseCode.MAX_DEPENDENT_LIMIT_REACHED
          );
        }
        throw exception;
      }
    }

    const operationId = getSessionIdFromRequest(request);

    const isTestAppointment =
      location.isTest || selectedService.isTestService || false;
    const payment = await createBookingPaymentCheckoutSessionIfNecessary(
      selectedService,
      orderNumber,
      experienceBaseUrl,
      configuration,
      isTestAppointment,
      operationId,
      fetchRequestHeader(request, RequestHeaders.switches)
    );

    const personInfoForAppointment: IPerson = dependentPersonInfo ?? personInfo;

    const appointmentTime = moment.tz(
      start,
      convertOutlookTimezoneToIANATimezone(location.timezone)
    );

    const appointmentDateTime: IAppointmentDateTime = {
      date: appointmentTime.format(ApiConstants.MONTH_DATE_FORMAT),
      time: appointmentTime.format(ApiConstants.SLOT_NAME_FORMAT),
    };

    const acceptMessageText = createAcceptanceTextMessage(
      appointmentDateTime,
      location,
      orderNumber,
      patientPhoneNumber,
      configuration.cancelAppointmentWindowExpiryTimeInHours,
      experienceBaseUrl,
      service
    );

    const appointmentRequest: ICreateAppointmentRequest = {
      memberFamilyId: personInfoForAppointment.primaryMemberFamilyId,
      memberPersonCode: personInfoForAppointment.primaryMemberPersonCode,
      accountIdentifier: getRequiredResponseLocal(
        response,
        'accountIdentifier'
      ),
      orderNumber,
      tags: [personInfoForAppointment.primaryMemberRxId],
      customerName: `${personInfoForAppointment.firstName} ${personInfoForAppointment.lastName}`,
      customerPhone: dependentPersonInfo
        ? patientPhoneNumber
        : personInfoForAppointment.phoneNumber,
      bookingId,
      acceptMessageText,
      memberRxId: personInfoForAppointment.primaryMemberRxId,
      questions,
      serviceType: selectedService.serviceType,
      isTestAppointment,
      isDependentAppointment: !!dependentPersonInfo,
      sessionId: operationId,
      productPriceId: payment?.productPriceId ?? '',
      unitAmount: payment?.unitAmount ?? 0,
      isTestPayment: payment?.isTestPayment ?? false,
      stripeSessionId: payment?.sessionId ?? '',
      stripeClientReferenceId: payment?.clientReferenceId ?? '',
      providerLocationId: location.identifier,
      inviteCode,
    };

    const { errorCode, message } = await createAppointmentEndpointHelper(
      configuration.pharmacyPortalApiUrl,
      appointmentRequest,
      configuration.pharmacyPortalApiTenantId,
      configuration.pharmacyPortalApiClientId,
      configuration.pharmacyPortalApiClientSecret,
      configuration.pharmacyPortalApiScope
    );

    if (!errorCode) {
      const personName = `${personInfoForAppointment.firstName} ${personInfoForAppointment.lastName}`;
      const appointmentLink = encodeAscii(
        `${orderNumber} ${appointmentRequest.customerPhone}`
      );
      const bookingInfo: ICreateBookingResponseData = {
        appointment: {
          serviceName: selectedService.serviceName,
          customerName: personName,
          customerDateOfBirth: personInfoForAppointment.dateOfBirth,
          status: 'None',
          orderNumber,
          locationName: location.providerInfo.providerName,
          address1: location.address1,
          address2: location.address2,
          city: location.city,
          state: location.state,
          zip: location.zip,
          additionalInfo: selectedService.confirmationAdditionalInfo,
          date: appointmentDateTime.date,
          time: appointmentDateTime.time,
          startInUtc: moment.utc(appointmentTime).toDate(),
          providerTaxId: location.providerTaxId,
          paymentStatus: payment?.paymentStatus || 'no_payment_required',
          procedureCode: service.procedureCode ?? '',
          serviceDescription: service.serviceDescription ?? '',
          confirmationDescription: service.confirmationDescriptionMyRx,
          cancellationPolicy: service.cancellationPolicyMyRx,
          bookingStatus: 'Requested',
          serviceType: selectedService.serviceType,
          appointmentLink,
        },
        payment,
      };

      return SuccessResponse<ICreateBookingResponseData>(
        response,
        SuccessConstants.SUCCESS_OK,
        bookingInfo
      );
    }

    return KnownFailureResponse(
      response,
      errorCode || HttpStatusCodes.INTERNAL_SERVER_ERROR,
      message
    );
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
