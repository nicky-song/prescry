// Copyright 2021 Prescryptive Health, Inc.

import { Twilio } from 'twilio';
import { IConfiguration } from '../../../configuration';
import {
  errorResponseWithTwilioErrorHandling,
  SuccessResponse,
} from '../../../utils/response-helper';
import { Request, Response } from 'express';
import { SuccessConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import {
  CmsApiFieldKeysEnum,
  CmsSmsGroupKeysEnum,
  cmsApiValueConstants,
} from '../../../constants/cms-api-constants';
import { IRegistrationTextRequestBody } from '@phx/common/src/models/api-request-body/registration-text.request-body';
import { findContentValue } from '@phx/common/src/utils/content/cms-content-wrapper.helper';
import { searchAndCacheCMSContent } from '../../content/helpers/search-and-cache-cms-content';
import { defaultLanguage } from '@phx/common/src/models/language';
import RestException from 'twilio/lib/base/RestException';

export const myPrescryptiveLink = 'https://myprescryptive.com';

export async function sendRegistrationTextHandler(
  request: Request,
  response: Response,
  configuration: IConfiguration,
  twilioClient: Twilio
) {
  const requestBody: IRegistrationTextRequestBody = request.body;

  const cmsResponse = await searchAndCacheCMSContent(
    configuration,
    CmsSmsGroupKeysEnum.myRxApi,
    requestBody.language ?? defaultLanguage
  );

  const cmsResponseContent = cmsResponse.content
    ? findContentValue(
        CmsApiFieldKeysEnum.inviteTextMessage,
        cmsResponse.content
      )
    : undefined;
  const cmsContent =
    cmsResponseContent ||
    cmsApiValueConstants
      .get(CmsSmsGroupKeysEnum.myRxApi)
      ?.get(CmsApiFieldKeysEnum.inviteTextMessage);
  const registrationText = cmsContent?.concat(
    myPrescryptiveLink,
    requestBody.path
  );
  try {
    await twilioClient.messages.create({
      to: requestBody.phoneNumber,
      body: registrationText,
      from: configuration.twilioMessagingFromPhoneNumber,
    });
    return SuccessResponse(
      response,
      SuccessConstants.SEND_REGISTRATION_TEXT_SUCCESS
    );
  } catch (error) {
    return errorResponseWithTwilioErrorHandling(
      response,
      requestBody.phoneNumber,
      error as RestException
    );
  }
}
