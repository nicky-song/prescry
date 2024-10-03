// Copyright 2023 Prescryptive Health, Inc.

import {
  logProgress,
  logTime,
  logToFile,
  setStartTime,
} from '../helpers/log.helper.js';
import { formatDuration, now } from '../utils/time-formatter.js';
import { getPublishedCashUsers } from '../helpers/db-helpers/query.helper.js';
import { searchCoverageRecordsByMasterId } from '../helpers/cash-coverage/search-coverage-records.js';

const batchSize = process.env.BATCH_SIZE ? parseInt(process.env.BATCH_SIZE) : 1;

const skip = process.env.RECORD_START ? parseInt(process.env.RECORD_START) : 0;

const recordCount = process.env.RECORD_COUNT
  ? parseInt(process.env.RECORD_COUNT)
  : 1;

const step1 = {
  name: 'Fetch',
  queryAsync: async (skip, limit) =>
    (await getPublishedCashUsers(skip, limit)).map((x) => ({
      cashProfile: x,
      exceptions: [],
    })),
};

const step2 = {
  name: 'Identify',
  queryEachAsync: async (profile) => {
    return await searchCoverageRecordsByMasterId(
      profile.cashProfile.masterId,
      logProcessor
    );
  },
  processEachAsync: (profile, response) => {
    if (!response.isSuccess) {
      profile.exceptions.push(response.error);
      logScoped(
        `${profile.cashProfile.masterId} ${
          profile.cashProfile.primaryMemberRxId
        } threw an error fetching coverages ${JSON.stringify(response.error)}`
      );
      return profile;
    }
    const cashCoverages = response.record.entry ?? [];
    if (cashCoverages.length === 0) {
      logScoped(`${profile.cashProfile.masterId} had 0 coverages`);
      profile.count = cashCoverages.length;
      logToFile(
        'Results',
        'Zeroes',
        `${getLogScope()} ${profile.cashProfile.phoneNumber} ${
          profile.cashProfile.masterId
        } ${profile.cashProfile.primaryMemberRxId}`
      );
    }
    if (cashCoverages.length === 1) {
      console.log(profile.cashProfile.masterId);
      logScoped(`${profile.cashProfile.masterId} had 1 coverage`);
      profile.count = cashCoverages.length;
      logToFile(
        'Results',
        'Singles',
        `${getLogScope()} ${profile.cashProfile.phoneNumber} ${
          profile.cashProfile.masterId
        } ${profile.cashProfile.primaryMemberRxId}: ${
          cashCoverages[0].resource?.id ?? ''
        }`
      );
    }
    if (cashCoverages.length > 1) {
      logScoped(
        `${profile.cashProfile.masterId} had ${cashCoverages.length} coverages`
      );
      profile.count = cashCoverages.length;
      profile.foundIds = cashCoverages.map((x) => x.resource.id);
      logToFile(
        'Results',
        'Duplicates',
        `${getLogScope()} ${profile.cashProfile.phoneNumber} ${
          profile.cashProfile.masterId
        } ${profile.cashProfile.primaryMemberRxId}: ${profile.foundIds.join(
          ' '
        )}`
      );
    }

    return profile;
  },
};

const logProcessor = 'CashCoverages';
let logBatchNumber = null;
let logStep = null;
const getLogScope = () =>
  `${logProcessor}${logBatchNumber ? '.' + logBatchNumber : ''}${
    logStep ? '.' + logStep : ''
  }`;
const logScoped = (message) => logProgress(`${getLogScope()}: ${message}`);

export const processCashCoverages = async (isPublishMode) => {
  logProgress(`\nBeginning ${logProcessor} processor`);
  const allFailures = [];
  const allSuccessful = [];
  const allSkips = [];
  setStartTime(now());

  const lastTenDurations = [];

  for (
    let start = skip, batchNumber = 1;
    start < skip + recordCount;
    start += batchSize, batchNumber++
  ) {
    const batchStartTime = now();
    logBatchNumber = batchNumber;
    logStep = step1.name;
    const end = Math.min(start + batchSize, skip + recordCount);
    logScoped(
      `Beginning batch ${batchNumber} of appx ${Math.ceil(
        recordCount / batchSize
      )} - records ${start} to ${end}`
    );

    logScoped(`Beginning ${step1.name} step`);
    const fetchResults = await step1.queryAsync(start, end - start);

    if (!fetchResults.length) {
      logScoped('No more profiles to fetch');
      break;
    }

    const fetchedProfiles = getByStatus(fetchResults);

    logScoped(`Found ${fetchResults.length} records`);

    logStep = step2.name;
    logScoped(`Beginning ${step2.name} step`);
    const { successful, failures, skips } = await eachAsync(
      fetchedProfiles.successful,
      async (profile) => {
        const response = await step2.queryEachAsync(profile);
        return await step2.processEachAsync(profile, response);
      }
    );

    allSuccessful.push(...successful);
    allFailures.push(...failures);
    allSkips.push(...skips);

    logStep = null;
    const totalCount = fetchResults.length;
    logScoped(
      `Batch stats - total: ${totalCount}, successful: ${successful.length}, failures: ${failures.length}, skips: ${skips.length}`
    );

    const batchDuration = now() - batchStartTime;
    logScoped(`Batch run time: ${formatDuration(batchDuration)}`);
    const timePerRecord = batchDuration / totalCount;

    lastTenDurations.shift();
    lastTenDurations.push(timePerRecord);
    const averageTimePerRecord =
      lastTenDurations.reduce((s, v) => s + v, 0) / lastTenDurations.length;

    const remaining = recordCount - end;
    if (remaining > 0) {
      logScoped(
        `Estimated time left: ${formatDuration(
          averageTimePerRecord * remaining
        )}`
      );
    }
    logTime();
    const zeroes = successful.filter((x) => x.count === 0);
    const singles = successful.filter((x) => x.count === 1);
    const duplicates = successful.filter((x) => x.count > 1);

    logProgress(
      `Batch result stats - Profiles with no coverages: ${zeroes.length}, single coverage: ${singles.length}, more coverages: ${duplicates.length}\n`
    );
  }

  logProgress(`Publish mode: ${isPublishMode}`);
  logProgress(`Record # to start: ${skip}`);
  logProgress(`Number of records: ${recordCount}`);
  logProgress(`Batch size: ${batchSize}`);
  if (process.env.OVERRIDE_NUMBERS) {
    logProgress(`Override numbers: ${process.env.OVERRIDE_NUMBERS}`);
  }

  const totalCount =
    allSuccessful.length + allFailures.length + allSkips.length;
  logProgress(
    `\nTotal stats - total: ${totalCount}, successful: ${
      allSuccessful.length
    }, failures: ${allFailures.length}${
      allSkips.length ? ', skips: ' + allSkips.length : ''
    }\n`
  );

  const zeroes = allSuccessful.filter((x) => x.count === 0);
  const singles = allSuccessful.filter((x) => x.count === 1);
  const duplicates = allSuccessful.filter((x) => x.count > 1);

  logProgress(
    `# of Patients found with:\nNo coverages: ${zeroes.length}\nA single coverage: ${singles.length}\nDuplicate coverages: ${duplicates.length}\n`
  );
};

const getByStatus = (batchResults) => ({
  successful: batchResults.filter((x) => !x.exceptions.length),
  failures: batchResults.filter((x) => x.exceptions.length),
  skips: batchResults.filter((x) => x.skip && !x.exceptions.length),
});

async function eachAsync(batch, action) {
  const promises = [];
  for (const item of batch) {
    promises.push(action(item));
  }
  const results = await Promise.all(promises);

  return getByStatus(results);
}
