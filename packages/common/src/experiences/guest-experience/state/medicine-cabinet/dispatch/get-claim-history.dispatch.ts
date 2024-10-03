// Copyright 2022 Prescryptive Health, Inc.

import { getClaimHistory } from '../../../api/api-v1.get-claim-history';
import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';
import { IGetClaimHistoryAsyncActionArgs } from '../async-actions/get-claim-history.async-action';
import { setClaimHistoryDispatch } from './set-claim-history.dispatch';

export const getClaimHistoryDispatch = async ({
  medicineCabinetDispatch,
  reduxGetState,
  reduxDispatch,
}: IGetClaimHistoryAsyncActionArgs): Promise<void> => {
  const state = reduxGetState();
  const { config, settings } = state;
  const apiConfig = config.apis.guestExperienceApi;

  const response = await getClaimHistory(
    apiConfig,
    settings.token,
    settings.deviceToken
  );

  await tokenUpdateDispatch(reduxDispatch, response.refreshToken);

  setClaimHistoryDispatch(medicineCabinetDispatch, response.data);
};
