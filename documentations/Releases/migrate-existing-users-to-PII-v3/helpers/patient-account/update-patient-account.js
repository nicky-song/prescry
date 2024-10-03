// Copyright 2022 Prescryptive Health, Inc.

import { logToFile } from '../log.helper.js';
import { makeRequestWithRetries } from '../request/request.helper.js';

export const updatePatientAccount = async (patientAccount, logScope) => {
  const entityUrl = `${process.env.ACCOUNT_API_RESOURCE}/${patientAccount?.accountId}`;
  const { isSuccess, error, record } = await makeRequestWithRetries(
    entityUrl,
    patientAccount,
    'PUT'
  );

  if (isSuccess) {
    return { isSuccess, record };
  } else if (error) {
    if (process.argv.includes('--verbose')) {
      logToFile(
        logScope,
        'RequestFailures',
        `${logScope}: Get patient account by memberId:${
          patientAccount?.accountId
        } request failed\n${JSON.stringify(error)}`
      );
    }
    return { isSuccess, error };
  } else {
    const errorMessage = `${logScope}: Update patient account by accountId:${patientAccount?.accountId} request failed`;
    logProgress(errorMessage);
    return { isSuccess: false, error: { error: errorMessage } };
  }
};
