// Copyright 2021 Prescryptive Health, Inc.

import { getEndpointRetryPolicy } from '../../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { getPrescriptionUserStatus } from '../../../../api/shopping/api-v1.get-prescription-user-status';
import { RootState } from '../../../root-reducer';

export const getPrescriptionUserStatusDispatch = async (
  getState: () => RootState,
  prescriptionId: string,
  blockchain?: boolean
) => {
  const state = getState();
  const { config } = state;
  const apiConfig = config.apis.guestExperienceApi;

  const response = await getPrescriptionUserStatus(
    apiConfig,
    prescriptionId,
    getEndpointRetryPolicy,
    blockchain
  );
  const { data } = response;
  return data.personExists;
};
