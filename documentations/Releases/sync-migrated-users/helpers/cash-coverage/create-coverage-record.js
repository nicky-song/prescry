// Copyright 2022 Prescryptive Health, Inc.

import { logToFile } from '../log.helper.js';
import { makeRequestWithRetries } from '../request/request.helper.js';

export const createCashCoverage = async (cashCoverage, logScope) => {
  const { isSuccess, record, error } = await makeRequestWithRetries(
    process.env.ELIGIBILITY_API_RESOURCE,
    cashCoverage,
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
        `${logScope}: Create cash coverage request failed\n${JSON.stringify(
          cashCoverage
        )}\n${JSON.stringify(error)}`
      );
    }
    return { isSuccess, error };
  } else {
    const errorMessage = `${logScope}: Create cash coverage request failed\n${JSON.stringify(
      cashCoverage
    )}`;
    logProgress(errorMessage);
    return { isSuccess: false, error: { error: errorMessage } };
  }
};
