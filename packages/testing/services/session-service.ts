// Copyright 2022 Prescryptive Health, Inc.

import { MyRxRedis } from '../data-access';

export abstract class SessionService {
  public static async clear(phoneNumber: string) {
    const session = new MyRxRedis();
    try {
      if (phoneNumber.length < 1) {
        throw new Error('No phone number');
      }
      let cursor = '0';
      do {
        const result = await session.scan(cursor, `myrx:*${phoneNumber}*`);
        if (result) {
          cursor = result.cursor;
          const keys = result.elements;
          if (keys.length > 0) {
            const keysToDelete = keys.filter(
              (key) => !key.startsWith(MyRxRedis.testAutomationLockPrefix)
            );
            await session.del(keysToDelete);
          }
        }
      } while (cursor !== '0');
    } catch (error) {
      throw new Error(`Failed to clear session with error: ${error}`);
    } finally {
      await session.close();
    }
  }
}
