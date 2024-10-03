// Copyright 2023 Prescryptive Health, Inc.

import { MyRxRedis } from '../data-access';

export abstract class PinService {
  public static async get(
    phoneNumber: string
  ): Promise<{ accountKey: string; pinHash: string } | null> {
    const session = new MyRxRedis();
    try {
      const pin = await session.get(`myrx:pin:${phoneNumber}`);
      if (pin) {
        return JSON.parse(pin);
      }
      return null;
    } catch (error) {
      throw new Error(`Failed to check pin with error: ${error}`);
    } finally {
      await session.close();
    }
  }

  static async remove(phoneNumber: string) {
    const session = new MyRxRedis();
    try {
      await session.del([`myrx:pin:${phoneNumber}`]);
    } catch (error) {
      throw new Error(`Failed to remove pin with error: ${error}`);
    } finally {
      await session.close();
    }
  }

  public static async unlock(phoneNumber: string) {
    const session = new MyRxRedis();
    try {
      if (phoneNumber.length < 1) {
        throw new Error('No phone number');
      }
      let cursor = '0';
      do {
        const result = await session.scan(
          cursor,
          `myrx:pin-verification:${phoneNumber}:*`
        );
        if (result) {
          cursor = result.cursor;
          const keys = result.elements;
          for (const key in keys) {
            const pinVerification = await session.get(key);
            if (
              pinVerification &&
              JSON.parse(pinVerification)?.pinVerificationAttempt > 0
            ) {
              // eslint-disable-next-line no-console
              console.log('Removed pin verification key', key);
              await session.del([key]);
            }
          }
        }
      } while (cursor !== '0');
    } catch (error) {
      throw new Error(`Failed to unlock pin with error: ${error}`);
    } finally {
      await session.close();
    }
  }
}
