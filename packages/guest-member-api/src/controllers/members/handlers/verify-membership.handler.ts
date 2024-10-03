// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IConfiguration } from '../../../configuration';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import {
  errorResponseWithTwilioErrorHandling,
  KnownFailureResponse,
  SuccessResponseWithoutHeaders,
} from '../../../utils/response-helper';
import {
  ErrorConstants,
  LoginMessages as responseMessage,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import {
  differenceInYear,
  UTCDate,
} from '@phx/common/src/utils/date-time-helper';
import { trackRegistrationFailureEvent } from '../../../utils/custom-event-helper';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '@phx/common/src/errors/error-codes';
import { membershipVerificationHelper } from '../helpers/membership-verification.helper';
import dateFormat from 'dateformat';
import RestException from 'twilio/lib/base/RestException';
import { membershipVerificationHelperV2 } from '../helpers/membership-verification-v2.helper';
import { getEndpointVersion } from '../../../utils/request/get-endpoint-version';

export async function verifyMembershipHandler(
  request: Request,
  response: Response,
  database: IDatabase,
  configuration: IConfiguration
) {
  const version = getEndpointVersion(request);
  const {
    firstName,
    lastName,
    dateOfBirth,
    primaryMemberRxId: memberOrFamilyId,
    phoneNumber,
  } = request.body;
  const dateOfBirthToUse = dateFormat(dateOfBirth, 'yyyy-mm-dd');
  const { childMemberAgeLimit } = configuration;

  try {
    const age = differenceInYear(
      UTCDate(new Date()),
      UTCDate(new Date(dateOfBirth))
    );

    if (age < childMemberAgeLimit) {
      trackRegistrationFailureEvent(
        'ChildMember',
        firstName,
        lastName,
        memberOrFamilyId || '',
        dateOfBirthToUse
      );
      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        responseMessage.AUTHENTICATION_FAILED
      );
    }
    const verifyMembershipHelperResponse =
      version === 'v2'
        ? await membershipVerificationHelperV2(
            database,
            phoneNumber,
            firstName,
            lastName,
            dateOfBirthToUse,
            memberOrFamilyId,
            configuration
          )
        : await membershipVerificationHelper(
            database,
            phoneNumber,
            firstName,
            lastName,
            dateOfBirthToUse,
            memberOrFamilyId
          );

    if (verifyMembershipHelperResponse.isValidMembership) {
      return SuccessResponseWithoutHeaders(
        response,
        SuccessConstants.VERIFY_MEMBERSHIP_SUCCESS
      );
    }
    return KnownFailureResponse(
      response,
      verifyMembershipHelperResponse.responseCode ??
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      verifyMembershipHelperResponse.responseMessage ??
        ErrorConstants.INTERNAL_SERVER_ERROR,
      undefined,
      verifyMembershipHelperResponse.responseMessage ===
        ErrorConstants.ACCOUNT_PERSON_DATA_MISMATCH
        ? InternalResponseCode.ACCOUNT_PERSON_DATA_MISMATCH
        : verifyMembershipHelperResponse.responseMessage ===
          ErrorConstants.ACCOUNT_CREATION_ACTIVATION_PERSON_RECORD_DATA_MISMATCH
        ? InternalResponseCode.ACTIVATION_PERSON_DATA_MISMATCH
        : undefined
    );
  } catch (error) {
    return errorResponseWithTwilioErrorHandling(
      response,
      phoneNumber,
      error as RestException
    );
  }
}
