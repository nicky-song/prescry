// Copyright 2023 Prescryptive Health, Inc.

import { MyRxRedis } from '../data-access';

export abstract class AccountLockService {
  private static async unlock(key: string) {
    const session = new MyRxRedis();
    try {
      await session.del([key]);
      // eslint-disable-next-line no-console
      console.log(`Unlocked account with key ${key}`);
    } catch (error) {
      throw new Error(
        `Failed to unlock the account key ${key} with error ${error}`
      );
    } finally {
      await session.close();
    }
  }

  public static async lock(
    phoneNumber: string,
    timeout: number,
    isShared: boolean,
    sharedKey?: string
  ) {
    const session = new MyRxRedis();
    try {
      if (isShared) {
        const accountLock = await session.get(
          `${MyRxRedis.testAutomationLockPrefix}${phoneNumber}:account`
        );
        if (accountLock) {
          // eslint-disable-next-line no-console
          console.log(
            `You can't acquire a shared lock since there is an exclusive lock ${accountLock}`
          );
          return false;
        }
      }
      let cursor = '0';
      do {
        const scanResult = await session.scan(
          cursor,
          `${MyRxRedis.testAutomationLockPrefix}${phoneNumber}:*`
        );
        if (scanResult) {
          cursor = scanResult.cursor;
          const keys = scanResult.elements?.filter(
            (entry) => entry !== sharedKey
          );
          if (keys.length > 0) {
            // eslint-disable-next-line no-console
            console.log('There are locks', keys);
            return false;
          }
        }
      } while (cursor !== '0');

      const lockType = isShared ? 'shared' : 'exclusive';
      const mode = 'PX';
      const flag = isShared ? '' : 'NX';
      const extra = isShared ? `:${Math.random()}` : ':account';
      const key = `${MyRxRedis.testAutomationLockPrefix}${phoneNumber}${extra}`;
      const result = await session.set(key, lockType, mode, timeout, flag);
      if (!result) {
        // eslint-disable-next-line no-console
        console.log(`You can't set the key ${key} with flag ${flag}`);
        return false;
      }
      // eslint-disable-next-line no-console
      console.log(
        `Key ${key} successfully stored with flag ${flag} and timeout ${timeout}`
      );
      return {
        key,
        unlock: () => AccountLockService.unlock(key),
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Lock account failed:', error);
      return false;
    } finally {
      await session.close();
    }
  }
}
