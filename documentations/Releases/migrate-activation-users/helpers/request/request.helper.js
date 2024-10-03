// Copyright 2022 Prescryptive Health, Inc.

import fetch from 'node-fetch';
import { sleep } from '../../utils/sleep-interval.js';
import { logToFile } from '../log.helper.js';

const defaultTimeout = 10000;

export const makeRequestWithRetries = async (
  url,
  body,
  type,
  token,
  options = {},
  headers = {}
) => {
  let retryCount = 0;
  while (retryCount < 3) {
    const { isSuccess, error, record } = await makeRequest(
      url,
      body,
      type,
      token,
      options,
      headers
    );
    if (isSuccess) {
      return { isSuccess, record };
    } else if (retryCount === 2) {
      return { isSuccess, error };
    }
    retryCount++;
    const exponentialBackoff = defaultTimeout * (retryCount * retryCount);
    if (process.argv.includes('--verbose')) {
      logToFile(
        'Requests',
        'Retries',
        `Request ${type} ${url} failed, retrying ${retryCount} after ${
          exponentialBackoff / 1000
        }s Data:\n${JSON.stringify(body)}`
      );
    }
    await sleep(exponentialBackoff);
  }
};

async function makeRequest(
  url,
  body,
  type = 'GET',
  token = null,
  options = {},
  headers = {}
) {
  try {
    const apiResponse = await getDataFromUrl(
      url,
      body,
      type,
      {
        'Ocp-Apim-Subscription-Key': process.env.GEARS_API_SUBSCRIPTION_KEY,
        ...(token
          ? {
              Authorization: token,
            }
          : {}),
        ...headers,
      },
      options
    );
    if (apiResponse.ok) {
      let record = null;
      try {
        record = await apiResponse.json();
      } catch (e) {
        // No record body
      }
      return { isSuccess: true, record };
    } else {
      let error = null;
      try {
        error = await apiResponse.json();
      } catch (e) {
        error = apiResponse;
      }
      return { isSuccess: false, error };
    }
  } catch (error) {
    return { isSuccess: false, error };
  }
}

export async function getDataFromUrl(
  endpoint,
  data = null,
  method = 'GET',
  headers = {},
  options = {}
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
    ...options,
  };
  const result = await fetch(url, requestOptions);
  return result;
}
