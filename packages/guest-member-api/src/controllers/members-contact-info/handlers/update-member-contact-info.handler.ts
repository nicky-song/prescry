// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { IPerson } from '@phx/common/src/models/person';
import { CalculateAbsoluteAge } from '@phx/common/src/utils/date-time-helper';
import { IConfiguration } from '../../../configuration';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';
import { getLoggedInUserProfileForRxGroupType } from '../../../utils/person/get-dependent-person.helper';

import { getResponseLocal } from '../../../utils/request/request-app-locals.helper';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { publishUpdatePersonContactInformationMessage } from '../../../utils/service-bus/person-update-helper';

export async function updateMemberContactInfoHandler(
  request: Request,
  response: Response,
  configuration: IConfiguration
) {
  const identifier = request.params.identifier;
  const { email, phoneNumber, secondaryMemberIdentifier } = request.body;
  let editingAdultMemberInformation = true;
  const dependents = getResponseLocal(response, 'dependents');
  const sieProfileInfo = getLoggedInUserProfileForRxGroupType(response, 'SIE');

  if (sieProfileInfo) {
    if (sieProfileInfo.identifier.trim() !== identifier.trim()) {
      if (!sieProfileInfo.isPrimary) {
        return KnownFailureResponse(
          response,
          HttpStatusCodes.UNAUTHORIZED_REQUEST,
          ErrorConstants.UNAUTHORIZED_ACCESS
        );
      }
      const member: IPerson[] | undefined =
        dependents &&
        dependents.filter(
          (dependent) =>
            dependent.primaryMemberFamilyId ===
              sieProfileInfo.primaryMemberFamilyId &&
            dependent.identifier === identifier
        );
      if (
        !member?.length ||
        CalculateAbsoluteAge(new Date(), member[0].dateOfBirth) >=
          configuration.childMemberAgeLimit
      ) {
        return KnownFailureResponse(
          response,
          HttpStatusCodes.UNAUTHORIZED_REQUEST,
          ErrorConstants.UPDATE_CONTACT_INFO_FAILED
        );
      }
      editingAdultMemberInformation = false;
    }
    try {
      await publishUpdatePersonContactInformationMessage(
        identifier,
        secondaryMemberIdentifier,
        editingAdultMemberInformation,
        phoneNumber,
        email
      );

      return SuccessResponse(
        response,
        SuccessConstants.MEMBER_UPDATE_SENT_SUCCESSFULLY
      );
    } catch (error) {
      return UnknownFailureResponse(
        response,
        ErrorConstants.SERVICE_BUS_FAILURE,
        error as Error
      );
    }
  }
  return KnownFailureResponse(
    response,
    HttpStatusCodes.UNAUTHORIZED_REQUEST,
    ErrorConstants.SIE_PROFILE_NOT_FOUND
  );
}
