// Copyright 2021 Prescryptive Health, Inc.

import { transferPrescription } from '../../../api/api-v1.transfer-prescription';
import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';
import { ITransferPrescriptionAsyncActionArgs } from '../async-actions/transfer-prescription.async-action';

export const transferPrescriptionDispatch = async ({
  transferPrescriptionRequestBody,
  reduxDispatch,
  reduxGetState,
}: ITransferPrescriptionAsyncActionArgs): Promise<void> => {
  const { config, settings } = reduxGetState();
  const apiConfig = config.apis.guestExperienceApi;
  const response = await transferPrescription(
    apiConfig,
    transferPrescriptionRequestBody,
    settings.token,
    settings.deviceToken
  );
  await tokenUpdateDispatch(reduxDispatch, response.refreshToken);
};
