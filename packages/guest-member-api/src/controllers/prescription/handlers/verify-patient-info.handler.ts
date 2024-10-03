// Copyright 2023 Prescryptive Health, Inc.

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
import { HttpStatusCodes } from '../../../constants/error-codes';
import { IConfiguration } from '../../../configuration';
import { validateIdentity } from '../helpers/validate-identity';
import { IValidateIdentity } from '@phx/common/src/models/air/validate-identity.response';
import { IValidateIdentityRequest } from '@phx/common/src/models/air/validate-identity.request';
import { IAddConsent } from '@phx/common/src/models/air/add-consent.response';
import { validateAndAddConsent } from '../helpers/validate-and-add-consent';

export async function verifyPatientInfoHandler(
  request: Request,
  response: Response,
  configuration: IConfiguration
) {
  const { smartContractAddress } = request.params;
  const { consent } = request.body as IValidateIdentityRequest;

  try {
    if (consent) {
      if (!request.body.accountId) {
        return KnownFailureResponse(
          response,
          HttpStatusCodes.BAD_REQUEST,
          ErrorConstants.ACCOUNT_ID_MISSING
        );
      }
      const validateAndAddConsentHelperResponse: IAddConsent =
        await validateAndAddConsent(configuration, {
          ...request.body,
          smartContractAddress,
        } as IValidateIdentityRequest);

      if (!validateAndAddConsentHelperResponse.success) {
        const { error } = validateAndAddConsentHelperResponse;

        return KnownFailureResponse(
          response,
          HttpStatusCodes.BAD_REQUEST,
          error ?? ErrorConstants.INVALID_PRESCRIPTION_DATA
        );
      }
    } else {
      const validateIdentityHelperResponse: IValidateIdentity =
        await validateIdentity(configuration, {
          ...request.body,
          smartContractAddress,
        } as IValidateIdentityRequest);

      if (!validateIdentityHelperResponse.success) {
        const { error } = validateIdentityHelperResponse;

        return KnownFailureResponse(
          response,
          HttpStatusCodes.BAD_REQUEST,
          error ?? ErrorConstants.INVALID_PRESCRIPTION_DATA
        );
      }
    }

    return SuccessResponse(response, SuccessConstants.SEND_SUCCESS_MESSAGE, {
      success: true,
    });
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
