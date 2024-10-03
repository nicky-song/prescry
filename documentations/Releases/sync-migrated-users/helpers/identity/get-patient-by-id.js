// Copyright 2023 Prescryptive Health, Inc.

import { makeRequestWithRetries } from '../request/request.helper.js';

export async function getPatientById(patientId, logScope) {
  const entityUrl = `${process.env.IDENTITY_API_RESOURCE}/${patientId}?allTenants=true`;
  const { isSuccess, record, error } = await makeRequestWithRetries(
    entityUrl,
    null,
    'GET',
    global.auth0Token
  );

  if (isSuccess) {
    return { isSuccess, record };
  } else if (error) {
    return { isSuccess, error };
  } else {
    const errorMessage = `${logScope}: Get patient by masterId:${patientId} request failed`;
    logProgress(errorMessage);
    return { isSuccess: false, error: { error: errorMessage } };
  }
}
