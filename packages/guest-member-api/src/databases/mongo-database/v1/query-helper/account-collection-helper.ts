// Copyright 2018 Prescryptive Health, Inc.

import { delay } from '@azure/service-bus';
import { logTelemetryEvent } from '../../../../utils/app-insight-helper';
import { IRetryPolicy } from '../../../../utils/fetch-retry.helper';
import { IDatabase } from '../setup/setup-database';

export type SearchAccountRetryPolicy = 'none' | 'retryIfNotFound';

const maxRetries = 5;

export const searchAccountByPhoneNumber = async (
  database: IDatabase,
  phoneNumber: string,
  searchAccountRetryPolicy: SearchAccountRetryPolicy = 'none'
) => {
  const retryPolicy: IRetryPolicy = {
    pause: 1000,
    remaining: searchAccountRetryPolicy === 'none' ? 0 : maxRetries,
  };

  do {
    const account = await database.Models.AccountModel.findOne(
      { phoneNumber: phoneNumber.trim() },
      'firstName lastName dateOfBirth phoneNumber pinHash accountKey featuresDefault featuresAllowed _id recoveryEmail masterId favoritedPharmacies isFavoritedPharmaciesFeatureKnown languageCode'
    );

    if (account || !retryPolicy.remaining) {
      return account;
    }

    logTelemetryEvent('ACCOUNT_UPDATE_TAKING_LONG_TIME', {
      retryPause: retryPolicy.pause,
      remainingRetries: retryPolicy.remaining,
    });

    await delay(retryPolicy.pause);

    retryPolicy.pause *= 2;
    --retryPolicy.remaining;
    // eslint-disable-next-line no-constant-condition
  } while (true);
};
