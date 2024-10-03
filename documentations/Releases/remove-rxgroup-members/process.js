// Copyright 2022 Prescryptive Health, Inc.

import { initialize } from './helpers/environment.helper.js';
import { logProgress } from './helpers/log.helper.js';
import { processDeactivatedUsers } from './processors/process-deactivated-users.js';

await initialize(async () => {
  const isPublishMode = process.argv.includes('--publish');
  if (isPublishMode) {
    logProgress('Publish mode is TRUE. Proceeding to update records');
  } else {
    logProgress('Publish mode is FALSE. Continuing with dry run');
  }
  await processDeactivatedUsers(isPublishMode);
});
