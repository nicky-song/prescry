// Copyright 2018 Prescryptive Health, Inc.

import { delay } from '@azure/service-bus';
import { IAccount } from '@phx/common/src/models/account';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { logTelemetryEvent } from '../../../../utils/app-insight-helper';
import { IDatabase } from '../setup/setup-database';
import { searchAccountByPhoneNumber } from './account-collection-helper';

jest.mock('../../../../utils/app-insight-helper');
const logTelemetryEventMock = logTelemetryEvent as jest.Mock;

jest.mock('@azure/service-bus');
const delayMock = delay as jest.Mock;

const findOneMock = jest.fn();
const databaseMock = {
  Models: {
    AccountModel: {
      findOne: findOneMock,
    },
  },
} as unknown as IDatabase;

describe('searchAccountByPhoneNumber', () => {
  const accountMock: Partial<IAccount> = {
    accountId: 'account-id',
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calls findOne() with no retries', async () => {
    findOneMock.mockResolvedValue(accountMock);

    const phoneNumberMock = ' +11111111111 ';
    const account = await searchAccountByPhoneNumber(
      databaseMock,
      phoneNumberMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      findOneMock,
      {
        phoneNumber: phoneNumberMock.trim(),
      },
      'firstName lastName dateOfBirth phoneNumber pinHash accountKey featuresDefault featuresAllowed _id recoveryEmail masterId favoritedPharmacies isFavoritedPharmaciesFeatureKnown languageCode'
    );
    expect(account).toEqual(accountMock);

    expect(logTelemetryEventMock).not.toHaveBeenCalled();
    expect(delayMock).not.toHaveBeenCalled();
  });

  it.each([
    [0, 1, accountMock],
    [1, 2, accountMock],
    [2, 3, accountMock],
    [5, 6, accountMock],
    [6, 6, undefined],
  ])(
    'calls findOne() with %p retries',
    async (
      numRetriesMock: number,
      expectedCalls: number,
      expectedAccount: Partial<IAccount> | undefined
    ) => {
      for (let i = 0; i < numRetriesMock; ++i) {
        findOneMock.mockResolvedValueOnce(undefined);
      }
      findOneMock.mockResolvedValueOnce(accountMock);

      const phoneNumberMock = ' +11111111111 ';

      const account = await searchAccountByPhoneNumber(
        databaseMock,
        phoneNumberMock,
        'retryIfNotFound'
      );

      expect(findOneMock).toHaveBeenCalledTimes(expectedCalls);

      expect(logTelemetryEventMock).toHaveBeenCalledTimes(expectedCalls - 1);
      expect(delayMock).toHaveBeenCalledTimes(expectedCalls - 1);

      for (let i = 0; i < expectedCalls - 1; ++i) {
        const expectedPause = 1000 * 2 ** i;
        const expectedRemaining = 5 - i;

        expect(logTelemetryEventMock).toHaveBeenNthCalledWith(
          i + 1,
          'ACCOUNT_UPDATE_TAKING_LONG_TIME',
          {
            retryPause: expectedPause,
            remainingRetries: expectedRemaining,
          }
        );
        expect(delayMock).toHaveBeenNthCalledWith(i + 1, expectedPause);
      }

      expect(account).toEqual(expectedAccount);
    }
  );
});
