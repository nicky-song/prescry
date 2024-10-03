// Copyright 2021 Prescryptive Health, Inc.

import { getPrescriptionInfo } from '../../../api/shopping/api-v1.get-prescription-info';
import { IGetPrescriptionInfoAsyncActionArgs } from '../async-actions/get-prescription-info.async-action';
import { setPrescriptionInfoDispatch } from './set-prescription-info.dispatch';
import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';
import { getDrugInformation } from '../../../api/api-v1.get-drug-information';

export const getPrescriptionInfoDispatch = async ({
  prescriptionId,
  shoppingDispatch,
  reduxGetState,
  reduxDispatch,
  blockchain,
}: IGetPrescriptionInfoAsyncActionArgs): Promise<void> => {
  const state = reduxGetState();
  const { config, settings } = state;
  const apiConfig = config.apis.guestExperienceApi;
  const contentApiConfig = config.apis.contentManagementApi;

  const response = await getPrescriptionInfo(
    apiConfig,
    prescriptionId,
    settings.token,
    settings.deviceToken,
    undefined,
    blockchain
  );
  const ndc = response.data.ndc;
  const drugInfo = await getDrugInformation(contentApiConfig, ndc);
  await tokenUpdateDispatch(reduxDispatch, response.refreshToken);
  setPrescriptionInfoDispatch(shoppingDispatch, response.data, drugInfo);
};
