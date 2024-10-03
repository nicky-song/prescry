// Copyright 2022 Prescryptive Health, Inc.

import { logToFile } from '../log.helper.js';
import { makeRequestWithRetries } from '../request/request.helper.js';

export const getCashCoverage = async (memberId, logScope) => {
  const { isSuccess, record, error } = await makeRequestWithRetries(
    `${process.env.ELIGIBILITY_API_RESOURCE}/search`,
    { query: `identifier=${memberId}` },
    'POST',
    global.auth0Token,
    null,
    { 'Content-Type': 'application/fhir+json' }
  );

  if (isSuccess) {
    return { isSuccess, record };
  } else if (error) {
    if (process.argv.includes('--verbose')) {
      logToFile(
        logScope,
        'RequestFailures',
        `${logScope}: Get cash coverage request failed for memberId: ${memberId}}\n${JSON.stringify(
          error
        )}`
      );
    }
    return { isSuccess, error };
  } else {
    const errorMessage = `${logScope}: Get cash coverage request failed for memberId: ${memberId}`;
    logProgress(errorMessage);
    return { isSuccess: false, error: { error: errorMessage } };
  }
};
