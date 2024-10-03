// Copyright 2023 Prescryptive Health, Inc.

import { getDataFromUrl } from './request.helper.js';

export const getAuth0Token = async () => {
  const apiResponse = await getDataFromUrl(
    process.env.AUTH0_TOKEN_API,
    {
      client_id: process.env.AUTH0_API_CLIENT_ID,
      client_secret: process.env.AUTH0_API_CLIENT_SECRET,
      audience: process.env.AUTH0_AUDIENCE_IDENTITY,
      grant_type: 'client_credentials',
    },
    'POST'
  );

  if (apiResponse.ok) {
    const response = await apiResponse.json();
    return `${response.token_type} ${response.access_token}`;
  }

  throw new EndpointError(apiResponse.status, apiResponse.statusText);
};

class EndpointError extends Error {
  errorCode;

  constructor(errorCode, errorMessage) {
    super(errorMessage);
    this.errorCode = errorCode;
    Object.setPrototypeOf(this, EndpointError.prototype);
  }
}
