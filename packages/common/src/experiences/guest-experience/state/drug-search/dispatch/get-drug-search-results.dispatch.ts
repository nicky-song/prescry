// Copyright 2021 Prescryptive Health, Inc.

import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { IDrugSearchAsyncActionArgs } from '../async-actions/drug-search.async-action';
import { setDrugSearchResultsDispatch } from './set-drug-search-results.dispatch';
import { getNewDate } from '../../../../../utils/date-time/get-new-date';
import { elasticDrugSearch } from '../../../api/api-v1.elastic-drug-search';

export const getDrugSearchResultsDispatch = async ({
  filter,
  maxResults,
  rxSubGroup,
  drugSearchDispatch,
  reduxGetState,
  useAllMedicationsSearch,
}: IDrugSearchAsyncActionArgs): Promise<void> => {
  const timestamp = getNewDate().getTime();
  const state = reduxGetState();
  const { config } = state;
  const apiConfig = config.apis.domainDataApi;

  const response = await elasticDrugSearch(
    apiConfig,
    config.domainDataSearchKeyPublic,
    filter,
    maxResults,
    rxSubGroup,
    getEndpointRetryPolicy,
    useAllMedicationsSearch
  );
  setDrugSearchResultsDispatch(drugSearchDispatch, response, timestamp);
};
