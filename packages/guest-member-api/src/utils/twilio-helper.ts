// Copyright 2018 Prescryptive Health, Inc.

import { Twilio } from 'twilio';

export function sendOneTimePassword(
  client: Twilio,
  serviceId: string,
  phoneNumber: string
) {
  return client.verify
    .services(serviceId)
    .verifications.create({ to: phoneNumber, channel: 'sms' });
}

export function verifyOneTimePassword(
  client: Twilio,
  serviceId: string,
  emailOrPhoneNumber: string,
  code: string
) {
  return client.verify.services(serviceId).verificationChecks.create({
    code,
    to: emailOrPhoneNumber,
  });
}

export function sendOneTimeCodeToEmail(
  client: Twilio,
  serviceId: string,
  email: string
) {
  return client.verify.services(serviceId).verifications.create({
    to: email,
    channel: 'email',
  });
}
