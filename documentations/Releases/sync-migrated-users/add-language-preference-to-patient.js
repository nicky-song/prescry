// Copyright 2023 Prescryptive Health, Inc.

import { initialize } from './helpers/environment-patient.helper.js';
import { logProgress } from './helpers/log.helper.js';
import { processAllUsers } from './processors/process-all-users.js';

await initialize(async () => {
  const isPublishMode = process.argv.includes('--publish');
  if (isPublishMode) {
    logProgress('Publish mode is TRUE. Proceeding to update records');
  } else {
    logProgress('Publish mode is FALSE. Continuing with dry run.');
  }
  await processAllUsers(isPublishMode);
});
