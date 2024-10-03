// Copyright 2022 Prescryptive Health, Inc.

import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { getAlternativeDrugPrice } from '../../../api/api-v1.get-alternative-drug-price';
import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';
import { IGetAlternativeDrugPriceAsyncActionArgs } from '../async-actions/get-alternative-drug-price-response.async-action';
import { setAlternativeDrugPriceResponseDispatch } from './set-alternative-drug-price-response.dispatch';

export const getAlternativeDrugPriceResponseDispatch = async ({
  ndc,
  ncpdp,
  isUnauthExperience,
  shoppingDispatch,
  reduxDispatch,
  reduxGetState,
}: IGetAlternativeDrugPriceAsyncActionArgs): Promise<void> => {
  const state = reduxGetState();
  const { config, settings } = state;
  const apiConfig = config.apis.guestExperienceApi;
  const response = await getAlternativeDrugPrice(
    apiConfig,
    ndc,
    ncpdp,
    settings.token,
    settings.deviceToken,
    getEndpointRetryPolicy
  );

  if (!isUnauthExperience)
    await tokenUpdateDispatch(reduxDispatch, response.refreshToken);

  setAlternativeDrugPriceResponseDispatch(shoppingDispatch, response.data);
};
