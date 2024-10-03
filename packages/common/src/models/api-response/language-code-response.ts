// Copyright 2022 Prescryptive Health, Inc.

import { IApiDataResponse } from '../api-response';
import { LanguageCode } from '../language';

export type ILanguageCodeResponse = IApiDataResponse<ILanguageCodeResponseData>;

export interface ILanguageCodeResponseData {
  languageCode: LanguageCode;
}
