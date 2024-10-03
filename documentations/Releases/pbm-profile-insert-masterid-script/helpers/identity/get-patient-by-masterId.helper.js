// Copyright 2022 Prescryptive Health, Inc.

import fetch from 'node-fetch';
import fs from 'fs';
import { generateIdentityBearerToken } from './generate-auth-token.helper.js';

export async function getPatientByMasterId(exceptionLogger, masterId, rc = 0) {
  try {
    const retryCount = rc;
    const entityUrl = `${process.env.IDENTITY_API_RESOURCE}/${masterId}`;
    const apiResonse = await getDatafromUrl(entityUrl, undefined, 'GET', {
      Authorization: `Bearer ${identityToken}`,
      'Ocp-Apim-Subscription-Key':
        process.env.IDENTITY_OCP_APIM_SUBSCRIPTION_KEY,
    });
    if (apiResonse.ok) {
      const identity = await apiResonse.json();
      return identity;
    } else {
      while (retryCount < 3) {
        identityToken = await generateIdentityBearerToken(
          process.env.IDENTITY_API_CLIENT_ID,
          process.env.IDENTITY_API_CLIENT_SECRET,
          process.env.IDENTITY_API_AUDIENCE
        );
        return await getPatientByMasterId(
          exceptionLogger,
          masterId,
          retryCount + 1
        );
      }
      fs.appendFileSync(
        exceptionLogger,
        `Exception occured while processing ${masterId} so retrying with count: ${retryCount}\n`
      );
    }
  } catch (error) {
    fs.appendFileSync(
      exceptionLogger,
      `Exception occured while processing ${masterId} with error message ${error}\n`
    );
    return undefined;
  }
}

async function getDatafromUrl(
  endpoint,
  data = null,
  method = 'GET',
  headers = {}
) {
  const url = `${endpoint}`;
  const headerContent = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...headers,
  };

  const requestOptions = {
    body:
      ((method === 'POST' || method === 'PUT' || 'PATCH') &&
        data &&
        JSON.stringify(data)) ||
      null,

    headers: headerContent,
    method,
  };
  const result = await fetch(url, requestOptions);
  return result;
}
