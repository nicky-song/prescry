// Copyright 2022 Prescryptive Health, Inc.

import { Page } from '@playwright/test';
import { Twilio } from '../services/external';

const otpCodeRegex = /[0-9]{6}/g;

export type HandleOneTimePasswordOptions = {
  twilioPhoneNumber: string;
  delay?: number;
  beginTime?: string | null;
};

export const GET_TWILIO_MESSAGE_OPTIONS = {
  delay: 500,
};

export const getOTPMessage = async (
  page: Page,
  options: HandleOneTimePasswordOptions
) => {
  const { twilioPhoneNumber } = options;
  const delay = options.delay || 500;

  for (let count = 0; count < 10; count++) {
    const messages = await Twilio.getMessages(twilioPhoneNumber);
    const message = messages[0].body;
    const dateCreated = messages[0]?.date_created;
    if (!options.beginTime || dateCreated !== options.beginTime) {
      const otpCode = message.match(otpCodeRegex);
      if (otpCode && otpCode.length > 0) {
        return otpCode[0];
      }
    }
    await page.waitForTimeout(delay);
  }
  throw new Error(`OTP Code not found`);
};
