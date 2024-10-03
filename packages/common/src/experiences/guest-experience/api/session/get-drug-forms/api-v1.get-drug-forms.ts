// Copyright 2021 Prescryptive Health, Inc.

import { IDrugForm } from '../../../../../models/drug-form';
import { ErrorConstants } from '../../../../../theming/constants';
import { buildUrl, call, IApiConfig } from '../../../../../utils/api.helper';
import { IRetryPolicy } from '../../../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from '../../api-v1-helper';
import {
  getDrugFormsResponse,
  IDrugFormResponse,
} from './get-drug-forms-response';

export const getDrugForms = async (
  apiConfig: IApiConfig,
  subscriptionKey: string,
  retryPolicy?: IRetryPolicy
): Promise<IDrugForm[]> => {
  const url = buildUrl(apiConfig, 'drugForms', {});

  const response: Response = await call(
    url,
    undefined,
    'GET',
    { ['Ocp-Apim-Subscription-Key']: subscriptionKey },
    retryPolicy
  );

  if (response.ok) {
    const drugFormsResponse = await getDrugFormsResponse(response);

    const responseForms = drugFormsResponse.forms ?? [];
    return responseForms.map((responseForm: Partial<IDrugFormResponse>) => {
      const form: IDrugForm = {
        abbreviation: responseForm.abbreviation?.trimRight() ?? '',
        description: responseForm.description?.trimRight() ?? '',
        formCode: responseForm.formCode?.trimRight() ?? '',
      };
      return form;
    });
  }

  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorGettingDrugForms,
    APITypes.GET_DRUG_FORMS
  );
};
