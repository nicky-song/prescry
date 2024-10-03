// Copyright 2023 Prescryptive Health, Inc.

import { validateIdentity } from '../../../api/membership/api-v1.validate-identity';
import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';
import { IValidateIdentityAsyncActionArgs } from '../async-actions/validate-identity.async-action';
import { setValidateIdentityDispatch } from './set-validate-identity.dispatch';

export const validateIdentityDispatch = async ({
  smartContractAddress,
  firstName,
  lastName,
  dateOfBirth,
  membershipDispatch,
  reduxGetState,
  reduxDispatch,
}: IValidateIdentityAsyncActionArgs): Promise<void> => {
  const state = reduxGetState();
  const { config, settings } = state;
  const apiConfig = config.apis.guestExperienceApi;
  const response = await validateIdentity(
    apiConfig,
    smartContractAddress,
    firstName,
    lastName,
    dateOfBirth,
    settings.token,
    settings.deviceToken,
    undefined
  );

  await tokenUpdateDispatch(reduxDispatch, response.refreshToken);
  setValidateIdentityDispatch(membershipDispatch, response.data);
};
