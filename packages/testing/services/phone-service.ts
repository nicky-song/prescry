// Copyright 2023 Prescryptive Health, Inc.

import { createHash } from 'crypto';
import { PhoneData } from '../types';
import { Twilio } from './external';

export class PhoneService {
  public static phoneNumberWithCountryCode = (phone: PhoneData) =>
    `${phone.countryCode}${phone.phoneNumber}`;

  private static phoneNumberAsString(phone: PhoneData | string) {
    if (typeof phone === 'string') {
      return phone;
    }
    return this.phoneNumberWithCountryCode(phone);
  }

  public static phoneNumberHash = (phone: PhoneData | string) => {
    const phoneNumber = PhoneService.phoneNumberAsString(phone);
    const sha512Hash = createHash('sha512');
    sha512Hash.update(phoneNumber);
    return sha512Hash.digest('hex');
  };

  static async getLastMessageTime(phoneNumber: string): Promise<string | null> {
    const messages = await Twilio.getMessages(phoneNumber);
    if (messages?.length > 0) {
      return messages[0].date_created;
    }
    return null;
  }
}
