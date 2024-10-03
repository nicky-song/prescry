// Copyright 2018 Prescryptive Health, Inc.

import { startServer } from './server';

startServer().catch((ex) => {
  // eslint-disable-next-line no-console
  console.error(ex);
  process.exit(1);
});
