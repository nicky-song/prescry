// Copyright 2021 Prescryptive Health, Inc.

import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { getDrugForms } from '../../../api/session/get-drug-forms/api-v1.get-drug-forms';
import { IGuestExperienceConfig } from '../../../guest-experience-config';
import { SessionDispatch } from './session.dispatch';
import { setDrugFormsDispatch } from './set-drug-forms.dispatch';

export const getDrugFormsDispatch = async (
  sessionDispatch: SessionDispatch,
  configState: IGuestExperienceConfig
): Promise<void> => {
  try {
    const forms = await getDrugForms(
      configState.apis.domainDataApi,
      configState.domainDataSearchKeyPublic,
      getEndpointRetryPolicy
    );

    setDrugFormsDispatch(sessionDispatch, forms);
    // eslint-disable-next-line no-empty
  } catch (error) {}
};
