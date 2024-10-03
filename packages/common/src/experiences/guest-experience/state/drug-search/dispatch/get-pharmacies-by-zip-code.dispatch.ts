// Copyright 2021 Prescryptive Health, Inc.

import { getPharmaciesByZipCode } from '../../../api/api-v1.get-pharmacies-by-zip-code';
import { IGetPharmaciesByZipCodeAsyncActionArgs } from '../async-actions/get-pharmacies-by-zip-code.async-action';
import { setPharmaciesByZipCodeDispatch } from './set-pharmacies-by-zip-code.dispatch';
import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';

export const getPharmaciesByZipCodeDispatch = async ({
  zipCode,
  start,
  isUnauthExperience,
  drugSearchDispatch,
  reduxGetState,
  reduxDispatch,
}: IGetPharmaciesByZipCodeAsyncActionArgs): Promise<void> => {
  const { config, settings } = reduxGetState();
  const apiConfig = config.apis.guestExperienceApi;
  const response = await getPharmaciesByZipCode(
    apiConfig,
    zipCode,
    isUnauthExperience,
    start,
    settings.token,
    settings.deviceToken,
    getEndpointRetryPolicy
  );
  if (!isUnauthExperience) {
    await tokenUpdateDispatch(reduxDispatch, response.refreshToken);
  }
  setPharmaciesByZipCodeDispatch(drugSearchDispatch, response.data, !!start);
};
