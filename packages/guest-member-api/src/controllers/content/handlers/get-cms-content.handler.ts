// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';
import { IConfiguration } from '../../../configuration';
import { IUICMSResponse } from '@phx/common/src/models/api-response/ui-content-response';
import { getRequestQuery } from '../../../utils/request/get-request-query';
import { defaultLanguage, Language } from '@phx/common/src/models/language';
import { CMSExperience } from '@phx/common/src/models/cms-content/experience.cms-content';
import { searchAndCacheCMSContent } from '../helpers/search-and-cache-cms-content';

export async function getCMSContentHandler(
  request: Request,
  response: Response,
  configuration: IConfiguration
) {
  try {
    const groupKey = getRequestQuery(request, 'groupKey') ?? '';
    const language = (getRequestQuery(request, 'language') ??
      defaultLanguage) as Language;
    const version = getRequestQuery(request, 'version');
    const experienceKey = getRequestQuery(
      request,
      'experienceKey'
    ) as CMSExperience;

    const { content, errorCode, message } = await searchAndCacheCMSContent(
      configuration,
      groupKey,
      language,
      version,
      experienceKey
    );

    if (content) {
      return SuccessResponse<IUICMSResponse[]>(
        response,
        SuccessConstants.SUCCESS_OK,
        content
      );
    }

    if (!errorCode) {
      return SuccessResponse<IUICMSResponse[]>(
        response,
        SuccessConstants.SUCCESS_OK,
        []
      );
    }

    return KnownFailureResponse(
      response,
      errorCode,
      message ?? ErrorConstants.INTERNAL_SERVER_ERROR
    );
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
