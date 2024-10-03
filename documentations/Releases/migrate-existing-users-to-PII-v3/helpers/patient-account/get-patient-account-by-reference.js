// Copyright 2022 Prescryptive Health, Inc.

import { logProgress, logToFile } from '../log.helper.js';
import { makeRequestWithRetries } from '../request/request.helper.js';

export const getPatientAccountByReference = async (reference, logScope) => {
  const entityUrl = `${process.env.ACCOUNT_API_RESOURCE}?sourceReference=${reference}&expand=patient`;
  const { isSuccess, error, record } = await makeRequestWithRetries(entityUrl);

  if (isSuccess) {
    if (!record.length) {
      return { isSuccess };
    }
    return { isSuccess, record: record[0] };
  } else if (error) {
    if (process.argv.includes('--verbose')) {
      logToFile(
        logScope,
        'RequestFailures',
        `${logScope}: Get patient account by reference:${reference} request failed\n${JSON.stringify(
          error
        )}`
      );
    }
    return { isSuccess, error };
  } else {
    const errorMessage = `${logScope}: Get patient account by reference:${reference} request failed`;
    logProgress(errorMessage);
    return { isSuccess: false, error: { error: errorMessage } };
  }
};

export const getPatientAccountByAccountId = async (accountId) => {
  const entityUrl = `${process.env.ACCOUNT_API_RESOURCE}/${accountId}?expand=patient`;
  const { isSuccess, error, record } = await makeRequestWithRetries(entityUrl);

  if (isSuccess) {
    return { isSuccess, record };
  } else if (error) {
    return { isSuccess, error };
  } else {
    const errorMessage = `Get patient account by accountId:${accountId} request failed`;
    logProgress(errorMessage);
    return { isSuccess: false, error: { error: errorMessage } };
  }
};
