// Copyright 2023 Prescryptive Health, Inc.

import { logProgress, logToFile } from '../log.helper.js';
import { makeRequestWithRetries } from '../request/request.helper.js';

export const searchCoverageRecordsByMasterId = async (masterId, logScope) => {
  const { isSuccess, record, error } = await makeRequestWithRetries(
    `${process.env.COVERAGE_API_RESOURCE}/search`,
    { query: `beneficiary=patient/${masterId}` },
    'POST',
    global.auth0Token,
    null,
    { 'Content-Type': 'application/fhir+json' }
  );

  if (isSuccess) {
    return { isSuccess, record };
  } else if (error) {
    logToFile(
      logScope,
      'RequestFailures',
      `${logScope}: Get cash coverage request failed for masterId: ${masterId}\n${JSON.stringify(
        error
      )}`
    );
    return { isSuccess, error };
  } else {
    const errorMessage = `${logScope}: Get cash coverage request failed for masterId: ${masterId}`;
    logProgress(errorMessage);
    return { isSuccess: false, error: { error: errorMessage } };
  }
};
