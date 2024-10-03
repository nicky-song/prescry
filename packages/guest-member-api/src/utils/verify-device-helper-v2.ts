// Copyright 2018 Prescryptive Health, Inc.

import { IConfiguration } from '../configuration';
import {
  addDeviceKeyInRedis,
  addPinVerificationKeyInRedis,
  getPinDataFromRedis,
} from '../databases/redis/redis-query-helper';
import { IPatientAccount } from '../models/platform/patient-account/patient-account';
import { generateSalt } from './bcryptjs-helper';
import { getPreferredEmailFromPatient } from './fhir-patient/get-contact-info-from-patient';
import { generateJsonWebToken, IDeviceTokenPayload } from './jwt-device-helper';
import { getPinDetails } from './patient-account/get-pin-details';
import {
  deviceTokenKeyExpiryIn,
  IPinKeyValues,
  pinVerificationKeyExpiryIn,
} from './redis/redis.helper';
import { createRandomString } from './string-helper';

export interface IGenerateDeviceTokenResponseV2 {
  account: IPatientAccount | undefined;
  accountKey: string | undefined;
  token: string;
  recoveryEmailExists: boolean;
}

export const generateDeviceTokenV2 = async (
  phoneNumber: string,
  configuration: IConfiguration,
  patientAccount?: IPatientAccount
): Promise<IGenerateDeviceTokenResponseV2> => {
  const { jwtTokenSecretKey, deviceTokenExpiryTime } = configuration;

  const patient = patientAccount?.patient;
  const recoveryEmailExists = !!getPreferredEmailFromPatient(patient);

  const pinDetails = getPinDetails(patientAccount);
  let accountKey = pinDetails?.accountKey;
  if (!pinDetails) {
    const redisPinDetails: IPinKeyValues | undefined =
      await getPinDataFromRedis(phoneNumber);
    accountKey = redisPinDetails && redisPinDetails.accountKey;
  }

  const deviceIdentifier = createRandomString();
  const deviceKey = accountKey || (await generateSalt());

  const tokenPayload: IDeviceTokenPayload = {
    device: phoneNumber,
    deviceIdentifier,
    deviceKey,
    deviceType: 'phone',
    patientAccountId: patientAccount?.accountId,
  };

  const token = generateJsonWebToken(
    tokenPayload,
    jwtTokenSecretKey,
    deviceTokenExpiryTime
  );

  await addDeviceKeyInRedis(
    phoneNumber,
    token,
    deviceTokenKeyExpiryIn,
    deviceIdentifier
  );

  await addPinVerificationKeyInRedis(
    phoneNumber,
    pinVerificationKeyExpiryIn,
    deviceIdentifier
  );

  return {
    account: patientAccount,
    accountKey,
    token,
    recoveryEmailExists,
  };
};
