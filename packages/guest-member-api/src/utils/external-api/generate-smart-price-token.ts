// Copyright 2020 Prescryptive Health, Inc.

import { defaultRetryPolicy } from '../fetch-retry.helper';
import { getDataFromUrl } from '../get-data-from-url';

export interface IContentManagementTokenResponse {
  jwt: string;
}
export interface IContentManagementTokenErrorMessage {
  id: string;
  message: string;
}
export interface IContentManagementTokenErrorMessages {
  messages?: IContentManagementTokenErrorMessage[];
}
export interface IContentManagementTokenErrorResponse {
  error: string;
  statusCode: number;
  message?: IContentManagementTokenErrorMessages[];
  data?: IContentManagementTokenErrorMessages[];
}
export async function generateSmartPriceToken(
  contentManagementApiUrl: string,
  userName: string,
  password: string
): Promise<string> {
  const body = {
    identifier: userName,
    password,
  };

  const apiResponse = await getDataFromUrl(
    buildTokenGenerateApiUrl(contentManagementApiUrl),
    body,
    'POST',
    undefined,
    false,
    undefined,
    defaultRetryPolicy
  );

  if (apiResponse.ok) {
    const tokenResponse: IContentManagementTokenResponse =
      await apiResponse.json();
    return tokenResponse.jwt;
  }
  const tokenError: IContentManagementTokenErrorResponse =
    await apiResponse.json();

  throw new Error(JSON.stringify(tokenError));
}

function buildTokenGenerateApiUrl(contentApi: string) {
  return `${contentApi}/auth/local`;
}
