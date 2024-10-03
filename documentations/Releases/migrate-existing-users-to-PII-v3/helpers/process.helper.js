// Copyright 2022 Prescryptive Health, Inc.

import { formatDuration, now } from '../utils/time-formatter.js';
import { logProgress, logTime, logVerbose, runFolder } from './log.helper.js';

export async function batchAndLogStep(scope, processor, noLimit = false) {
  let batchNumber = 0;
  let isFinished = false;
  const batchCount = process.env.BATCH_COUNT ?? 1;
  if (!process.env.BATCH_COUNT || process.env.BATCH_COUNT === '0') {
    noLimit = true;
  }
  const successfulUsers = [];
  const exceptionUsers = [];

  while (!isFinished) {
    const startTime = now();
    const getterResponse = await processor(batchNumber);

    if (
      !getterResponse.successfulUsers.length &&
      !getterResponse.exceptionUsers.length
    ) {
      logVerbose(`${scope}: Reached end of users, skipping next batches`);
      break;
    }

    exceptionUsers.push(...getterResponse.exceptionUsers);
    successfulUsers.push(...getterResponse.successfulUsers);

    logProgress(`${scope}: Batch time - ${formatDuration(now() - startTime)}`);
    logProgress(
      `${scope}: Batch result - successful: ${getterResponse.successfulUsers.length}, failures: ${getterResponse.exceptionUsers.length}`
    );
    logTime();

    batchNumber++;
    if (!noLimit && batchNumber >= batchCount) {
      isFinished = true;
    }
  }

  return { successfulUsers, exceptionUsers };
}

export const batchStep = async (scope, step, processor, noLimit = false) => {
  const stepScope = `${scope}.${step}`;
  logProgress(`\nBeginning ${stepScope} step`);
  const startTime = now();
  const { successfulUsers, exceptionUsers } = await batchAndLogStep(
    stepScope,
    async (batchNumber) => processor(batchNumber, stepScope),
    noLimit
  );
  if (!noLimit) {
    const logPath = `logs/${runFolder}/${scope}/${step}.log`;
    logProgress(
      `${stepScope}: step result - successful: ${successfulUsers.length}, failures: ${exceptionUsers.length} - see ${logPath} for details`
    );
    logProgress(`${stepScope} step time: ${formatDuration(now() - startTime)}`);
  }

  return { successfulUsers, exceptionUsers };
};

export const asyncBatch = async (list, run, after) => {
  const promises = [];
  for (const item of list) {
    promises.push(run(item));
  }
  const results = await Promise.all(promises);
  const postPromises = [];
  for (const [index, result] of Object.entries(results)) {
    postPromises.push(after(list[index], result));
  }
  await Promise.all(postPromises);
};
