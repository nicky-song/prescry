// Copyright 2023 Prescryptive Health, Inc.

import { addConsent } from '../../../api/membership/api-v1.add-consent';
import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';
import { IAddConsentAsyncActionArgs } from '../async-actions/add-consent.async-action';
import { setAddConsentDispatch } from './set-add-consent.dispatch';

export const addConsentDispatch = async ({
  accountId,
  smartContractAddress,
  firstName,
  lastName,
  dateOfBirth,
  consent,
  membershipDispatch,
  reduxGetState,
  reduxDispatch,
}: IAddConsentAsyncActionArgs): Promise<void> => {
  const state = reduxGetState();
  const { config, settings } = state;
  const apiConfig = config.apis.guestExperienceApi;
  const response = await addConsent(
    apiConfig,
    accountId,
    smartContractAddress,
    firstName,
    lastName,
    dateOfBirth,
    consent,
    settings.token,
    settings.deviceToken,
    undefined
  );

  await tokenUpdateDispatch(reduxDispatch, response.refreshToken);
  setAddConsentDispatch(membershipDispatch, response.data);
};
