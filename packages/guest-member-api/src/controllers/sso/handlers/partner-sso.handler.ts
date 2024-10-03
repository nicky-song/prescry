// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import type { IConfiguration } from '../../../configuration';

import type {
  SsoTokenPayload,
  SsoToken,
} from '@phx/common/src/models/sso/sso-external-jwt';
import { isSsoToken } from '@phx/common/src/models/sso/sso-external-jwt';
import { decode } from 'jsonwebtoken';

import { JwksManager } from '../../../tokens/jwks-manager';

import { ErrorConstants } from '../../../constants/response-messages';

import {
  ErrorFailureResponse,
  KnownFailureResponse,
} from '../../../utils/response-helper';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { RequestError } from '../../../errors/request-errors/request.error';
import { ErrorPartnerTokenInvalid } from '@phx/common/src/errors/error-partner-token-invalid';

import type { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { createAccountHandler } from '../../account/handlers/create-account.handler';
import type { Twilio } from 'twilio';

export async function partnerSsoHandler(
  request: Request,
  response: Response,
  configuration: IConfiguration,
  database: IDatabase,
  jwksManager: JwksManager,
  twilioClient: Twilio
) {
  try {
    const { jwt_token } = request.body;
    const unverifiedToken = decode(jwt_token, { complete: true }) as SsoToken;

    if (!isSsoToken(unverifiedToken)) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.FORBIDDEN_ERROR,
        ErrorConstants.INVALID_TOKEN
      );
    }

    const verified = (await jwksManager.verifyExternalJwt(
      unverifiedToken.payload.partner_id,
      jwt_token
    )) as SsoTokenPayload;

    return await createAccountHandler(
      request,
      response,
      database,
      configuration,
      twilioClient,
      {
        requestBody: {
          firstName: verified.first_name,
          lastName: verified.last_name,
          dateOfBirth: verified.birthdate,
          email: verified.email,
          code: '',
          phoneNumber: verified.phone_number,
          primaryMemberRxId: verified.member_id,
        },
        tokenPayload: verified,
      }
    );
  } catch (error) {
    if (error instanceof RequestError) {
      return KnownFailureResponse(
        response,
        error.httpCode,
        error.message,
        undefined,
        error.internalCode
      );
    } else if (error instanceof ErrorPartnerTokenInvalid) {
      return KnownFailureResponse(response, error.code, error.message, error);
    }

    return ErrorFailureResponse(
      response,
      HttpStatusCodes.FORBIDDEN_ERROR,
      error as Error
    );
  }
}
