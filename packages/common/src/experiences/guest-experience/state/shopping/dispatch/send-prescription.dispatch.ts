// Copyright 2021 Prescryptive Health, Inc.

import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';
import { sendPrescription } from '../../../api/shopping/api-v1.send-prescription';
import { ISendPrescriptionAsyncActionArgs } from '../async-actions/send-prescription.async-action';
import { setOrderDateDispatch } from './set-order-date.dispatch';

export const sendPrescriptionDispatch = async ({
  ncpdp,
  prescriptionId,
  orderDate,
  shoppingDispatch,
  reduxGetState,
  reduxDispatch,
  blockchain,
}: ISendPrescriptionAsyncActionArgs): Promise<void> => {
  const state = reduxGetState();
  const { config, settings } = state;
  const apiConfig = config.apis.guestExperienceApi;
  const response = await sendPrescription(
    apiConfig,
    ncpdp,
    prescriptionId,
    settings.token,
    settings.deviceToken,
    undefined,
    blockchain
  );

  await tokenUpdateDispatch(reduxDispatch, response.refreshToken);
  await setOrderDateDispatch(shoppingDispatch, orderDate);
};
