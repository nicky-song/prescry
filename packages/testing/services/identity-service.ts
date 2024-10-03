// Copyright 2022 Prescryptive Health, Inc.

import { MyRxRedis } from '../data-access';

export abstract class IdentityService {
  public static async unlock(phoneNumber: string) {
    const session = new MyRxRedis();
    try {
      if (phoneNumber.length < 1) {
        throw new Error('No phone number');
      }
      const identityAttemptsResult = await session.del([
        `myrx:identity-verification-attempts:${phoneNumber}`,
      ]);
      if (identityAttemptsResult === 1) {
        // eslint-disable-next-line no-console
        console.log('Removed identity verification key');
      }
    } catch (error) {
      throw new Error(`Failed to unlock identity with error: ${error}`);
    } finally {
      await session.close();
    }
  }
}
