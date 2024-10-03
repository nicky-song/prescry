// Copyright 2022 Prescryptive Health, Inc.

import { initialize } from './helpers/environment.helper.js';
import { logProgress } from './helpers/log.helper.js';
import { processUpdatedUsers } from './processors/process-updated-users.js';

await initialize(async () => {
  const isPublishMode = process.argv.includes('--publish');
  if (isPublishMode) {
    logProgress('Publish mode is TRUE. Proceeding to update records');
  } else {
    logProgress('Publish mode is FALSE. Continuing with dry run.');
  }
  await processUpdatedUsers(isPublishMode);
});
