// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  ErrorConstants,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '../../../constants/error-codes';
import { IConfiguration } from '../../../configuration';
import {
  IPrescriptionVerificationInfo,
  IPrescriptionVerificationResponse,
  verifyPrescriptionInfoHelper,
} from '../helpers/verify-prescription-info.helper';
import {
  differenceInYear,
  UTCDate,
} from '@phx/common/src/utils/date-time-helper';
import { Twilio } from 'twilio';
import dateFormat from 'dateformat';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { sendOneTimePassword } from '../../../utils/one-time-password/send-one-time-password';

export async function verifyPrescriptionInfoHandler(
  request: Request,
  response: Response,
  configuration: IConfiguration,
  twilioClient: Twilio,
  database: IDatabase
) {
  const prescriptionId = request.params.identifier;
  if (!prescriptionId || prescriptionId.length === 0) {
    return KnownFailureResponse(
      response,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.PRESCRIPTION_ID_MISSING
    );
  }
  const { firstName, dateOfBirth, blockchain } = request.body;

  const age = differenceInYear(
    UTCDate(new Date()),
    UTCDate(new Date(dateOfBirth))
  );

  const { childMemberAgeLimit } = configuration;
  if (age < childMemberAgeLimit) {
    return KnownFailureResponse(
      response,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.ACCOUNT_CREATION_AGE_REQUIREMENT_NOT_MET(
        childMemberAgeLimit
      )
    );
  }
  const dateOfBirthToUse = dateFormat(dateOfBirth, 'yyyy-mm-dd');
  const prescriptionInfo: IPrescriptionVerificationInfo = {
    prescriptionId,
    firstName,
    dateOfBirth: dateOfBirthToUse,
  };

  try {
    const verifyPrescriptionHelperResponse: IPrescriptionVerificationResponse =
      await verifyPrescriptionInfoHelper(
        database,
        prescriptionInfo,
        configuration,
        undefined,
        blockchain
      );

    if (!verifyPrescriptionHelperResponse.prescriptionIsValid) {
      const { errorCode, errorMessage, serviceBusEvent } =
        verifyPrescriptionHelperResponse;

      return KnownFailureResponse(
        response,
        errorCode ?? HttpStatusCodes.BAD_REQUEST,
        errorMessage ?? ErrorConstants.INVALID_PRESCRIPTION_DATA,
        undefined,
        errorMessage === ErrorConstants.ACCOUNT_PERSON_DATA_MISMATCH
          ? InternalResponseCode.ACCOUNT_PERSON_DATA_MISMATCH
          : undefined,
        undefined,
        serviceBusEvent
      );
    }
    const telephone =
      verifyPrescriptionHelperResponse.filteredUserInfo?.telephone;
    if (!telephone) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.PHONE_NUMBER_MISSING
      );
    }
    const helperResponse = await sendOneTimePassword(
      request,
      response,
      twilioClient,
      configuration,
      telephone
    );

    if (!helperResponse.isCodeSent) {
      return KnownFailureResponse(
        response,
        helperResponse.errorCode ?? HttpStatusCodes.INTERNAL_SERVER_ERROR,
        helperResponse.errorMessage ?? ErrorConstants.SOMETHING_WENT_WRONG
      );
    }

    return SuccessResponse(response, SuccessConstants.SEND_SUCCESS_MESSAGE, {
      phoneNumber: telephone,
    });
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
