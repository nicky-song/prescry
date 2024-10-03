// Copyright 2023 Prescryptive Health, Inc.

import { initialize } from './helpers/environment.helper.js';
import { processCashCoverages } from './processors/process-cash-coverages.js';

await initialize(async () => {
  const isPublishMode = process.argv.includes('--publish');
  await processCashCoverages(isPublishMode);
});
