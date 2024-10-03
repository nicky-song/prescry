// Copyright 2022 Prescryptive Health, Inc.

import { IClaimHistory } from '@phx/common/src/models/claim';
import { RxGroupTypesEnum } from '@phx/common/src/models/member-profile/member-profile-info';
import { Response } from 'express';
import { IConfiguration } from '../../../configuration';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';
import { BadRequestError } from '../../../errors/request-errors/bad.request-error';
import { RequestError } from '../../../errors/request-errors/request.error';
import { UnauthorizedRequestError } from '../../../errors/request-errors/unauthorized.request-error';
import { getClaims } from '../../../utils/external-api/claims/get-claims';
import { isMemberIdValidForUserAndDependents } from '../../../utils/person/get-dependent-person.helper';
import {
  getRequiredResponseLocal,
  getResponseLocal,
} from '../../../utils/request/request-app-locals.helper';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { buildClaimHistoryPdf } from '../helpers/build-claim-history-pdf';
import { buildClaims } from '../helpers/build-claims';

export const getClaimsHandler = async (
  response: Response,
  configuration: IConfiguration
) => {
  const features = getRequiredResponseLocal(response, 'features');
  const { rxSubGroup: emulatedRxSubGroup, memberId: emulatedMemberId } =
    features;

  try {
    const personList = getResponseLocal(response, 'personList');
    const pbmMember = personList?.find(
      (x) => x.rxGroupType === RxGroupTypesEnum.SIE
    );

    const memberId = emulatedMemberId ?? pbmMember?.primaryMemberRxId;
    const rxSubGroup = emulatedRxSubGroup ?? pbmMember?.rxSubGroup;
    const dateOfBirth = emulatedMemberId
      ? '1999-01-01'
      : pbmMember?.dateOfBirth;
    const firstName = emulatedMemberId ? 'Mock' : pbmMember?.firstName;
    const lastName = emulatedMemberId ? 'Member' : pbmMember?.lastName;

    if (!memberId || !rxSubGroup || !dateOfBirth || !firstName || !lastName) {
      throw new BadRequestError(ErrorConstants.SIE_PROFILE_NOT_FOUND);
    }

    const isAccessAuthorized =
      emulatedMemberId ||
      isMemberIdValidForUserAndDependents(response, memberId);
    if (!isAccessAuthorized) {
      throw new UnauthorizedRequestError();
    }

    const { claims: responseClaims } = await getClaims(
      memberId,
      rxSubGroup,
      configuration
    );

    const claims = buildClaims(responseClaims);

    const claimPdf = await buildClaimHistoryPdf(
      configuration,
      claims,
      memberId,
      {
        firstName,
        lastName,
        isoDateOfBirth: dateOfBirth,
      }
    );

    const claimHistoryData: IClaimHistory = {
      claims,
      claimPdf,
    };
    return SuccessResponse(
      response,
      SuccessConstants.SUCCESS_OK,
      claimHistoryData
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
    }

    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
};
