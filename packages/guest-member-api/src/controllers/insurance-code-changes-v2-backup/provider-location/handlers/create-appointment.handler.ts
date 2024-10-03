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
import {
  CalculateAbsoluteAge,
  UTCDateString,
} from '@phx/common/src/utils/date-time-helper';
import { StringFormatter } from '@phx/common/src/utils/formatters/string.formatter';
import AddressValidator from '@phx/common/src/utils/validators/address.validator';
import { IConfiguration } from '../../../../configuration';
import { ApiConstants } from '../../../../constants/api-constants';
import { IDatabase } from '../../../../databases/mongo-database/v1/setup/setup-database';
import { ICreateAppointmentRequest } from '../../../../models/pharmacy-portal/appointment-create.request';
import { getSessionIdFromRequest } from '../../../../utils/health-record-event/get-sessionid-from-request';
import { getNext } from '../../../../utils/redis/redis-order-number.helper';
import { fetchRequestHeader } from '../../../../utils/request-helper';
import {
  getRequiredResponseLocal,
  getResponseLocal,
} from '../../../../utils/request/request-app-locals.helper';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../../utils/response-helper';
import { createBookingPaymentCheckoutSessionIfNecessary } from '../../../provider-location/handlers/create-booking-checkout-session-info';
import { IAppointmentDateTime } from '../../../provider-location/helpers/appointment-time.helper';
import { convertOutlookTimezoneToIANATimezone } from '../../../provider-location/helpers/appointment-timezone.helper';
import { buildDependentPersonDetails } from '../../../provider-location/helpers/build-dependent-person-details';
import { buildPersonDetails } from '../../../provider-location/helpers/build-person-details';
import { createAcceptanceTextMessage } from '../../../provider-location/helpers/create-appointment-event.helper';
import { isDepdendentValid } from '../../../provider-location/helpers/is-dependent-valid';
import { createAppointmentEndpointHelper } from '../../../provider-location/helpers/create-appointment-endpoint.helper';
import { allRequiredQuestionsAnswered } from '../../../provider-location/helpers/all-required-questions-answered.helper';
import { IProviderLocationResponse } from '../../../../models/pharmacy-portal/get-provider-location.response';
import { getProviderLocationByIdAndServiceType } from '../../../provider-location/helpers/get-provider-location-by-id-and-service-type.helper';
import { isInsuranceEligible } from '../../../provider-location/helpers/is-insurance-eligibile';
import { getLoggedInUserProfileForRxGroupType } from '../../../../utils/person/get-dependent-person.helper';
import { IAccount } from '@phx/common/src/models/account';
import { encodeAscii } from '@phx/common/src/utils/base-64-helper';
import { getNewDate } from '@phx/common/src/utils/date-time/get-new-date';
import { assertHasPerson } from '../../../../assertions/assert-has-person';

export async function createAppointmentHandler(
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
      insuranceInformation,
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

    const dateOfBirth = getRequiredResponseLocal(
      response,
      'account'
    ).dateOfBirth;

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
    let dependentPersonInfo: IPerson | undefined;

    if (dependentInfo) {
      if (dependentInfo.identifier) {
        const dependents: IPerson[] | undefined = getResponseLocal(
          response,
          'dependents'
        );
        dependentPersonInfo = dependents?.find(
          (dep) => dep.identifier === dependentInfo.identifier
        );
        if (
          !dependentPersonInfo ||
          dependentPersonInfo.rxGroupType !== 'CASH'
        ) {
          return KnownFailureResponse(
            response,
            HttpStatusCodes.BAD_REQUEST,
            ErrorConstants.INVALID_DEPENDENT_IDENTIFIER
          );
        }
        if (
          CalculateAbsoluteAge(getNewDate(), dependentPersonInfo.dateOfBirth) <
          minAge
        ) {
          return KnownFailureResponse(
            response,
            HttpStatusCodes.BAD_REQUEST,
            ErrorConstants.AGE_REQUIREMENT_NOT_MET_VACCINE
          );
        }
        if (insuranceInformation) {
          insuranceInformation.insuranceCard.firstName =
            dependentPersonInfo.firstName;
          insuranceInformation.insuranceCard.lastName =
            dependentPersonInfo.lastName;
          insuranceInformation.insuranceCard.dateOfBirth =
            dependentPersonInfo.dateOfBirth;
        }
      } else {
        if (!isDepdendentValid(dependentInfo, minAge)) {
          return KnownFailureResponse(
            response,
            HttpStatusCodes.BAD_REQUEST,
            ErrorConstants.MISSING_DEPENDENT_INFORMATION
          );
        }
        if (
          dependentInfo.firstName &&
          dependentInfo.lastName &&
          dependentInfo.dateOfBirth &&
          insuranceInformation
        ) {
          insuranceInformation.insuranceCard.firstName =
            dependentInfo.firstName;
          insuranceInformation.insuranceCard.lastName = dependentInfo.lastName;
          insuranceInformation.insuranceCard.dateOfBirth = UTCDateString(
            dependentInfo.dateOfBirth
          );
        }
      }
    } else {
      if (insuranceInformation) {
        const personInformation: IPerson | undefined =
          getLoggedInUserProfileForRxGroupType(response, 'CASH');
        if (personInformation) {
          insuranceInformation.insuranceCard.firstName =
            personInformation.firstName;
          insuranceInformation.insuranceCard.lastName =
            personInformation.lastName;
          insuranceInformation.insuranceCard.dateOfBirth =
            personInformation.dateOfBirth;
        } else {
          const account: IAccount = getRequiredResponseLocal(
            response,
            'account'
          );

          insuranceInformation.insuranceCard.firstName = (
            account.firstName?.trim() ?? ''
          ).toUpperCase();
          insuranceInformation.insuranceCard.lastName = (
            account.lastName?.trim() ?? ''
          ).toUpperCase();
          insuranceInformation.insuranceCard.dateOfBirth = account.dateOfBirth
            ? UTCDateString(account.dateOfBirth)
            : '';
        }
      }
    }
    if (
      insuranceInformation &&
      !isInsuranceEligible(
        insuranceInformation?.insuranceCard,
        providerLocationDetails.location?.providerInfo.providerName,
        configuration
      )
    ) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.NO_INSURANCE_ELIGIBILTY_ASSOCIATED_WITH_MEMBER
      );
    }

    const orderNumber = await getNext(
      database,
      configuration.orderNumberBlockLength
    );
    const personInfo = await buildPersonDetails(request, response);

    assertHasPerson(personInfo);

    let isDependentAppointment = false;
    if (dependentInfo) {
      try {
        dependentPersonInfo = await buildDependentPersonDetails(
          dependentInfo,
          database,
          personInfo,
          configuration.redisPersonCreateKeyExpiryTime,
          dependentPersonInfo
        );
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
      isDependentAppointment = true;
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

    const personInfoForAppointment: IPerson =
      isDependentAppointment && dependentPersonInfo
        ? dependentPersonInfo
        : personInfo;

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
      personInfo.phoneNumber,
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
      customerPhone: isDependentAppointment
        ? personInfo.phoneNumber
        : personInfoForAppointment.phoneNumber,
      bookingId,
      acceptMessageText,
      memberRxId: personInfoForAppointment.primaryMemberRxId,
      questions,
      serviceType: selectedService.serviceType,
      isTestAppointment,
      isDependentAppointment,
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
