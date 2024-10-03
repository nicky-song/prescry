// Copyright 2021 Prescryptive Health, Inc.

import { getPrescriptionPharmacies } from '../../../api/shopping/api-v1.get-prescription-pharmacies';
import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';
import { IGetPrescriptionPharmaciesAsyncActionArgs } from '../async-actions/get-prescription-pharmacies.async-action';
import { setPrescriptionPharmaciesDispatch } from './set-prescription-pharmacies.dispatch';

export const getPrescriptionPharmaciesDispatch = async ({
  location,
  prescriptionId,
  sortBy,
  distance,
  shoppingDispatch,
  reduxGetState,
  reduxDispatch,
  blockchain,
}: IGetPrescriptionPharmaciesAsyncActionArgs): Promise<void> => {
  const state = reduxGetState();
  const { config, settings } = state;
  const apiConfig = config.apis.guestExperienceApi;
  const response = await getPrescriptionPharmacies(
    apiConfig,
    location,
    sortBy,
    prescriptionId,
    distance,
    settings.token,
    settings.deviceToken,
    undefined,
    blockchain
  );
  await tokenUpdateDispatch(reduxDispatch, response.refreshToken);
  setPrescriptionPharmaciesDispatch(
    shoppingDispatch,
    response.data,
    prescriptionId
  );
};
