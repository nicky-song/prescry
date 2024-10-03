// Copyright 2023 Prescryptive Health, Inc.

import { MyRxRedis } from '../data-access/myrx-redis';

export abstract class deviceIdentifierService {
  public static storeDeviceIdentifier = async (
    phoneNumberDialingCode: string,
    phoneNumber: string,
    deviceIdentifier: string,
    deviceToken: string
  ) => {
    const myRxRedis = new MyRxRedis();
    try {
      const key = `myrx:device:${phoneNumberDialingCode}${phoneNumber}:${deviceIdentifier}`;
      await myRxRedis.set(key, deviceToken);
    } catch (error) {
      throw new Error(
        `Failed to store device identifier for ${phoneNumber} with error ${error}`
      );
    } finally {
      await myRxRedis.close();
    }
  };
}
