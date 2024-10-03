// Copyright 2022 Prescryptive Health, Inc.

import { logProgress, logToFile } from '../log.helper.js';
import { makeRequestWithRetries } from '../request/request.helper.js';

export const createPatientAccount = async (patientAccount, logScope) => {
  const { isSuccess, error, record } = await makeRequestWithRetries(
    process.env.ACCOUNT_API_RESOURCE,
    patientAccount,
    'POST'
  );

  if (isSuccess) {
    return { isSuccess, record };
  } else if (error) {
    if (process.argv.includes('--verbose')) {
      logToFile(
        logScope,
        'RequestFailures',
        `${logScope}: Create patient account request failed\n${JSON.stringify(
          patientAccount
        )}\n${JSON.stringify(error)}`
      );
    }
    return { isSuccess, error };
  } else {
    const errorMessage = `${logScope}: Create patient account request failed\n${JSON.stringify(
      patientAccount
    )}`;
    logProgress(errorMessage);
    return { isSuccess: false, error: { error: errorMessage } };
  }
};
