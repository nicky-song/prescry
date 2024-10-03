// Copyright 2021 Prescryptive Health, Inc.

import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { getDrugPrice } from '../../../api/api-v1.get-drug-price';
import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';
import { IGetDrugPriceAsyncActionArgs } from '../async-actions/get-drug-price.async-action';
import { setDrugPriceResponseDispatch } from './set-drug-price-response.dispatch';
import { setNoPharmacyErrorDispatch } from './set-no-pharmacy-error.dispatch';

export const getDrugPriceResponseDispatch = async ({
  location,
  ndc,
  supply,
  quantity,
  sortBy,
  isUnauthExperience,
  distance,
  drugSearchDispatch,
  reduxDispatch,
  reduxGetState,
}: IGetDrugPriceAsyncActionArgs): Promise<void> => {
  const state = reduxGetState();
  const { config, settings } = state;
  const apiConfig = config.apis.guestExperienceApi;
  const response = await getDrugPrice(
    apiConfig,
    location,
    sortBy,
    ndc,
    supply,
    quantity,
    isUnauthExperience,
    distance,
    settings.token,
    settings.deviceToken,
    getEndpointRetryPolicy
  );

  if (!isUnauthExperience) {
    await tokenUpdateDispatch(reduxDispatch, response.refreshToken);
  }
  setDrugPriceResponseDispatch(
    drugSearchDispatch,
    response.data.pharmacyPrices,
    response.data.bestPricePharmacy
  );
  setNoPharmacyErrorDispatch(
    drugSearchDispatch,
    response.data.bestPricePharmacy || response.data.pharmacyPrices.length > 0
      ? false
      : true
  );
};
