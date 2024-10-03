// Copyright 2022 Prescryptive Health, Inc.

import { ApiConstants } from '../../../constants/api-constants';
import { IConfiguration } from '../../../configuration';
import { getDataFromUrl } from '../../get-data-from-url';
import { defaultRetryPolicy } from '../../fetch-retry.helper';
import { EndpointError } from '../../../errors/endpoint.error';
import { ICmsFileContent } from '../../../models/cms/cms-file-content';

export interface IPlanDataResponse {
  FamilyMax: number;
  IndividualMax: number;
  IndividualDeductible: number;
  FamilyDeductible: number;
  PlanDetailsDocument: ICmsFileContent;
}

export interface IGetCmsPlanContentResponse {
  planData?: Partial<IPlanDataResponse>;
}

export const getCmsPlanContent = async (
  rxSubGroup: string,
  configuration: IConfiguration,
  retry: boolean
): Promise<IGetCmsPlanContentResponse> => {
  const apiResponse = await getDataFromUrl(
    buildGetPlanUrl(configuration.contentApiUrl, rxSubGroup),
    undefined,
    'GET',
    undefined,
    undefined,
    ApiConstants.DEFAULT_API_TIMEOUT,
    retry ? defaultRetryPolicy : undefined
  );

  if (apiResponse.ok) {
    const responseData: IPlanDataResponse[] = await apiResponse.json();
    return { planData: responseData.length ? responseData[0] : undefined };
  }

  const error: string = await apiResponse.json();
  throw new EndpointError(apiResponse.status, error);
};

const buildGetPlanUrl = (contentApiUrl: string, rxSubGroup: string) => {
  return `${contentApiUrl}/group-plans?GroupPlanCode=${rxSubGroup}`;
};
