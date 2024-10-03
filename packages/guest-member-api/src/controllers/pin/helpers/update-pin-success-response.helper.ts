// Copyright 2020 Prescryptive Health, Inc.

import { Response } from 'express';
import { IPinKeyValues } from '../../../utils/redis/redis.helper';
import { addPinKeyInRedis } from '../../../databases/redis/redis-query-helper';
import { SuccessResponse } from '../../../utils/response-helper';
import { SuccessConstants } from '../../../constants/response-messages';
import { generateHash } from '../../../utils/bcryptjs-helper';
import { publishAccountUpdateMessage } from '../../../utils/service-bus/account-update-helper';
import { trackUpdatePinEvent } from '../../../utils/custom-event-helper';
import { EndpointVersion } from '../../../models/endpoint-version';
import { IPatientAccount } from '../../../models/platform/patient-account/patient-account';
import { IConfiguration } from '../../../configuration';
import { updatePatientAccountPin } from '../../../utils/patient-account/update-patient-account-pin';

export const updatePinSuccessResponse = async (
  response: Response,
  phoneNumber: string,
  encryptedPinNew: string,
  pinDetails: IPinKeyValues,
  configuration: IConfiguration,
  version: EndpointVersion,
  patientAccount?: IPatientAccount
): Promise<Response> => {
  const pinHash = await generateHash(encryptedPinNew);
  if (version === 'v2' && patientAccount) {
    await updatePatientAccountPin(
      pinDetails.accountKey,
      pinHash,
      configuration,
      patientAccount
    );
  }
  const pinKeyValues: IPinKeyValues = {
    ...pinDetails,
    pinHash,
  };
  await addPinKeyInRedis(
    phoneNumber,
    pinKeyValues,
    configuration.redisPinKeyExpiryTime
  );
  await publishAccountUpdateMessage({
    phoneNumber,
    pinHash,
    recentlyUpdated: true,
  });
  trackUpdatePinEvent(phoneNumber);

  return SuccessResponse(response, SuccessConstants.UPDATE_PIN_SUCCESS);
};
