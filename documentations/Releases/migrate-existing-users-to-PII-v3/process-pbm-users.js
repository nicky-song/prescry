// Copyright 2022 Prescryptive Health, Inc.

import { initialize } from './helpers/environment.helper.js';
import { logProgress } from './helpers/log.helper.js';
import { processPbmUsers } from './processors/process-pbm-users.js';

await initialize(async () => {
  const isPublishMode = process.argv.includes('--publish');
  if (isPublishMode) {
    logProgress('Publish mode is TRUE. Proceeding to update records');
  } else {
    logProgress('Publish mode is FALSE. Continuing with dry run');
  }
  await processPbmUsers(isPublishMode);
});
