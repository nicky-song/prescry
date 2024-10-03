// Copyright 2021 Prescryptive Health, Inc.

import { IRegistrationTextRequestBody } from '../../../models/api-request-body/registration-text.request-body';
import { IFailureResponse } from '../../../models/api-response';
import { Language } from '../../../models/language';
import {
  ErrorConstants,
  PhoneNumberDialingCode,
  PhoneNumberOtherCountryDialingCode,
} from '../../../theming/constants';
import { buildUrl, call, IApiConfig } from '../../../utils/api.helper';
import { GuestExperienceFeatures } from '../guest-experience-features';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { ensureSendRegistrationText } from './ensure-api-response/ensure-send-registration-text';

export const sendRegistrationText = async (
  config: IApiConfig,
  phoneNumber: string,
  language: Language,
  path = ''
) => {
  const url = buildUrl(config, 'sendRegistrationText', {});
  const countryCode = GuestExperienceFeatures.usecountrycode
    ? PhoneNumberOtherCountryDialingCode
    : PhoneNumberDialingCode;
  const data: IRegistrationTextRequestBody = {
    phoneNumber: `${countryCode}${phoneNumber}`,
    path,
    language,
  };
  const response: Response = await call(url, data, 'POST', {
    'Access-Control-Allow-Origin': '*',
  });

  const responseJson = await response.json();
  if (response.ok && ensureSendRegistrationText(responseJson)) {
    return responseJson;
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorInvalidPhoneNumber,
    APITypes.SEND_REGISTRATION_TEXT,
    errorResponse.code,
    errorResponse
  );
};
