// Copyright 2021 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../../errors/error-api-response';
import { ErrorConstants } from '../../../../../theming/constants';

export interface IDrugFormsResponse {
  forms: IDrugFormResponse[];
}

export interface IDrugFormResponse {
  formCode: string;
  abbreviation: string;
  description: string;
}

export const getDrugFormsResponse = async (
  response: Response
): Promise<IDrugFormsResponse> => {
  const drugFormsResponse = (await response.json()) as IDrugFormsResponse;

  if (!drugFormsResponse?.forms) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }

  return drugFormsResponse;
};
