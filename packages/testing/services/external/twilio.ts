// Copyright 2023 Prescryptive Health, Inc.

import fetch, { RequestInit } from 'node-fetch';

import { TEST_SETTINGS } from '../../utilities/settings';
const TWILIO_BASE_URL = 'https://api.twilio.com/';

export class Twilio {
  static async getMessages(
    phoneNumber: string
  ): Promise<{ body: string; date_created: string }[]> {
    const { TESTING_ACCOUNT_SID, TESTING_ACCOUNT_TOKEN } =
      TEST_SETTINGS.getTwilio();

    const url = `${TWILIO_BASE_URL}/2010-04-01/Accounts/${TESTING_ACCOUNT_SID}/Messages.json?To="+1${phoneNumber}"`;

    const token = Buffer.from(
      `${TESTING_ACCOUNT_SID}:${TESTING_ACCOUNT_TOKEN}`
    ).toString('base64');
    const init: RequestInit = {
      headers: {
        Authorization: `Basic ${token}`,
      },
    };

    const response = await fetch(url, init);
    if (response.status !== 200) {
      throw new Error(
        `Fetch messages from Twilio failed with status ${response.status} ${response.statusText} and ${response.text}`
      );
    }
    const textResponse = await response.json();
    return textResponse.messages;
  }
}
