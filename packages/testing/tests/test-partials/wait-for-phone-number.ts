// Copyright 2023 Prescryptive Health, Inc.

import { Page } from '@playwright/test';
import { MyRxRedis } from '../../data-access';

const unlock = async (key: string) => {
  const session = new MyRxRedis();
  try {
    await session.del([key]);
    // eslint-disable-next-line no-console
    console.log(`Unlocked phone number with key ${key}`);
  } catch (error) {
    throw new Error(`Failed to unlock the phone number with error ${error}`);
  } finally {
    await session.close();
  }
};

export const waitForPhoneNumber = async (
  page: Page,
  phoneNumber: string,
  timeout: number,
  testID: string
) => {
  let delay = 10000;
  const session = new MyRxRedis();
  const expires = Date.now() + timeout;
  try {
    while (Date.now() < expires) {
      const mode = 'PX';
      const flag = 'NX';
      const key = `${MyRxRedis.testAutomationLockPrefix}${phoneNumber}:phone`;
      const result = await session.set(key, testID, mode, timeout, flag);
      if (result) {
        return {
          key,
          unlock: () => unlock(key),
          consumedTime: expires - Date.now(),
        };
      }
      // eslint-disable-next-line no-console
      console.log(
        `Waiting for phone number ${phoneNumber} and ${testID} delay ${delay} expires ${new Date(
          expires
        )}`
      );
      const jitter = Math.random() * 1000;
      await page.waitForTimeout(delay + jitter);
      delay *= 0.9;
    }
    throw new Error(`max retries for lock ${testID}`);
  } catch (error) {
    throw new Error(`Lock failed: ${error}`);
  } finally {
    await session.close();
  }
};
