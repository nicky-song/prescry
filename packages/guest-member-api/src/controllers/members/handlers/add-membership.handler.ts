// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import {
  ErrorConstants,
  LoginMessages,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import {
  differenceInYear,
  UTCDate,
} from '@phx/common/src/utils/date-time-helper';
import { IConfiguration } from '../../../configuration';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { trackRegistrationFailureEvent } from '../../../utils/custom-event-helper';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import {
  KnownFailureResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { membershipVerificationHelper } from '../helpers/membership-verification.helper';
import {
  publishPersonUpdatePatientDetailsMessage,
  publishPhoneNumberVerificationMessage,
} from '../../../utils/service-bus/person-update-helper';
import { loginSuccessResponse } from '../../login/helpers/login-response.helper';
import dateFormat from 'dateformat';
import { membershipVerificationHelperV2 } from '../helpers/membership-verification-v2.helper';
import { addMembershipPlan } from '../helpers/add-membership-link.helper';
import { RequestError } from '../../../errors/request-errors/request.error';
import { getMasterId } from '../../../utils/patient-account/patient-account.helper';
import { assertHasMasterId } from '../../../assertions/assert-has-master-id';
import { assertHasAccountId } from '../../../assertions/assert-has-account-id';
import { getEndpointVersion } from '../../../utils/request/get-endpoint-version';

export async function addMembershipHandler(
  request: Request,
  response: Response,
  database: IDatabase,
  configuration: IConfiguration
) {
  try {
    const version = getEndpointVersion(request);
    const isV2Endpoint = version === 'v2';
    const { firstName, lastName, primaryMemberRxId, dateOfBirth } =
      request.body;
    const dateOfBirthToUse = dateFormat(dateOfBirth, 'yyyy-mm-dd');
    const phoneNumber = getRequiredResponseLocal(response, 'device').data;
    const { childMemberAgeLimit, redisPhoneNumberRegistrationKeyExpiryTime } =
      configuration;

    const age = differenceInYear(
      UTCDate(new Date()),
      UTCDate(new Date(dateOfBirth))
    );

    if (age < childMemberAgeLimit) {
      trackRegistrationFailureEvent(
        'ChildMember',
        firstName,
        lastName,
        primaryMemberRxId,
        dateOfBirthToUse
      );
      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        LoginMessages.AUTHENTICATION_FAILED
      );
    }

    const verifyMembershipHelperResponse = isV2Endpoint
      ? await membershipVerificationHelperV2(
          database,
          phoneNumber,
          firstName,
          lastName,
          dateOfBirthToUse,
          primaryMemberRxId,
          configuration
        )
      : await membershipVerificationHelper(
          database,
          phoneNumber,
          firstName,
          lastName,
          dateOfBirthToUse,
          primaryMemberRxId
        );

    if (!verifyMembershipHelperResponse.isValidMembership) {
      return KnownFailureResponse(
        response,
        verifyMembershipHelperResponse.responseCode ??
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
        verifyMembershipHelperResponse.responseMessage ?? ''
      );
    }
    if (!verifyMembershipHelperResponse.member) {
      return UnknownFailureResponse(
        response,
        ErrorConstants.INTERNAL_SERVER_ERROR
      );
    }

    if (isV2Endpoint) {
      const patientAccount = getRequiredResponseLocal(
        response,
        'patientAccount'
      );
      const cashPatient = getRequiredResponseLocal(response, 'patient');

      const pbmMasterId = verifyMembershipHelperResponse.masterId;

      if (!pbmMasterId) {
        return KnownFailureResponse(
          response,
          HttpStatusCodes.BAD_REQUEST,
          ErrorConstants.COVERAGE_MASTER_ID_MISSING
        );
      }

      const memberId = verifyMembershipHelperResponse.memberId;

      if (memberId) {
        await addMembershipPlan(
          patientAccount,
          cashPatient,
          pbmMasterId,
          configuration,
          memberId
        );

        const cashMasterId = getMasterId(patientAccount);
        const cashPatientAccountId = patientAccount?.accountId;

        assertHasMasterId(cashMasterId, phoneNumber);

        assertHasAccountId(cashPatientAccountId);

        await publishPersonUpdatePatientDetailsMessage(
          verifyMembershipHelperResponse.member.identifier,
          cashMasterId,
          cashPatientAccountId
        );
      }
    }

    if (!verifyMembershipHelperResponse.member.phoneNumber) {
      await publishPhoneNumberVerificationMessage(
        verifyMembershipHelperResponse.member.identifier,
        phoneNumber
      );
    }

    return await loginSuccessResponse(
      response,
      phoneNumber,
      firstName,
      lastName,
      dateOfBirthToUse,
      redisPhoneNumberRegistrationKeyExpiryTime,
      verifyMembershipHelperResponse.member,
      true
    );
  } catch (error) {
    if (error instanceof RequestError) {
      return KnownFailureResponse(response, error.httpCode, error.message);
    }
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
