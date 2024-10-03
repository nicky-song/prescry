// Copyright 2022 Prescryptive Health, Inc.

import { makeRequestWithRetries } from '../request/request.helper.js';

export async function updatePatient(patient, logScope) {
  const entityUrl = `${process.env.IDENTITY_API_RESOURCE}/${patient?.id}`;
  const { isSuccess, error } = await makeRequestWithRetries(
    entityUrl,
    patient,
    'PUT',
    global.auth0Token,
    null,
    {
      'x-tenant-id': process.env.PBM_TENANT,
    }
  );

  if (isSuccess) {
    return { isSuccess };
  } else if (error) {
    return { isSuccess, error };
  } else {
    const errorMessage = `${logScope}: Update patient by masterId:${patient?.id} request failed`;
    logProgress(errorMessage);
    return { isSuccess: false, error: { error: errorMessage } };
  }
}
