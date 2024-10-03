// Copyright 2022 Prescryptive Health, Inc.

import { getAccumulators } from '../../../api/api-v1.get-accumulators';
import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';
import { IGetAccumulatorAsyncActionArgs } from '../async-actions/get-accumulators.async-action';
import { setAccumulatorsDispatch } from './set-accumulators.dispatch';

export const getAccumulatorsDispatch = async ({
  medicineCabinetDispatch,
  reduxGetState,
  reduxDispatch,
}: IGetAccumulatorAsyncActionArgs): Promise<void> => {
  const state = reduxGetState();
  const { config, settings } = state;
  const apiConfig = config.apis.guestExperienceApi;

  const response = await getAccumulators(
    apiConfig,
    settings.token,
    settings.deviceToken
  );

  await tokenUpdateDispatch(reduxDispatch, response.refreshToken);

  setAccumulatorsDispatch(medicineCabinetDispatch, response.data);
};
