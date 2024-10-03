// Copyright 2022 Prescryptive Health, Inc.

import { RxGroupTypesEnum } from '@phx/common/src/models/member-profile/member-profile-info';
import { Response } from 'express';
import { IConfiguration } from '../../../configuration';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';
import { getAccumulators } from '../../../utils/external-api/accumulators/get-accumulators';
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
import { buildAccumulators } from '../helpers/build-accumulators';
import { getCmsPlanContent } from '../../../utils/external-api/cms-api-content/get-cms-plan-content';
import { BadRequestError } from '../../../errors/request-errors/bad.request-error';
import { RequestError } from '../../../errors/request-errors/request.error';
import { UnauthorizedRequestError } from '../../../errors/request-errors/unauthorized.request-error';

export const getClaimsAccumulatorsHandler = async (
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

    if (!memberId || !rxSubGroup) {
      throw new BadRequestError(ErrorConstants.SIE_PROFILE_NOT_FOUND);
    }

    const isAccessAuthorized =
      emulatedMemberId ||
      isMemberIdValidForUserAndDependents(response, memberId);
    if (!isAccessAuthorized) {
      throw new UnauthorizedRequestError();
    }

    const { claimsAccumulators } = await getAccumulators(
      memberId,
      rxSubGroup,
      configuration
    );

    const { planData } = await getCmsPlanContent(
      rxSubGroup,
      configuration,
      true
    );

    return SuccessResponse(
      response,
      SuccessConstants.SUCCESS_OK,
      buildAccumulators(claimsAccumulators, planData)
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
};
