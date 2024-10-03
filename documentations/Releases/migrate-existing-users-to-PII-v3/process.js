// Copyright 2022 Prescryptive Health, Inc.

import { initialize } from './helpers/environment.helper.js';
import { logProgress } from './helpers/log.helper.js';
import { processCashUsers } from './processors/process-cash-users.js';
import { processDeletedUsers } from './processors/process-deleted-users.js';

await initialize(async () => {
  const isOverrideMode = !!process.env.OVERRIDE_NUMBERS;
  const isPublishMode = process.argv.includes('--publish');
  if (isPublishMode) {
    logProgress('Publish mode is TRUE. Proceeding to update records');
  } else {
    logProgress('Publish mode is FALSE. Continuing with dry run');
  }
  if (!isOverrideMode) {
    await processDeletedUsers(isPublishMode);
  }
  await processCashUsers(isPublishMode);
});
