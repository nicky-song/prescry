// Copyright 2022 Prescryptive Health, Inc.

import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';
import { IGetClaimAlertAsyncActionArgs } from '../async-actions/get-claim-alert.async-action';
import { setClaimAlertDispatch } from './set-claim-alert.dispatch';
import { getClaimAlert } from '../../../api/api-v1.get-claim-alert';

export const getClaimAlertDispatch = async ({
  identifier,
  claimAlertDispatch,
  reduxGetState,
  reduxDispatch,
}: IGetClaimAlertAsyncActionArgs): Promise<void> => {
  const state = reduxGetState();
  const { config, settings } = state;
  const apiConfig = config.apis.guestExperienceApi;
  const response = await getClaimAlert(
    apiConfig,
    identifier,
    settings.token,
    settings.deviceToken
  );

  await tokenUpdateDispatch(reduxDispatch, response.refreshToken);

  setClaimAlertDispatch(
    claimAlertDispatch,
    response.data.prescribedMedication,
    response.data.alternativeMedicationList,
    response.data.pharmacyInfo,
    response.data.notificationType,
    response.data.prescriber
  );
};
