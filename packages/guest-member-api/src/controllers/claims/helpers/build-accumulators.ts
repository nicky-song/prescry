// Copyright 2022 Prescryptive Health, Inc.

import { IAccumulators } from '@phx/common/src/models/accumulators';
import { IAccumulatorsResponse } from '../../../utils/external-api/accumulators/get-accumulators';
import { IPlanDataResponse } from '../../../utils/external-api/cms-api-content/get-cms-plan-content';

export const buildAccumulators = (
  accumulatorsResponse: IAccumulatorsResponse | undefined,
  planData: Partial<IPlanDataResponse> | undefined
): IAccumulators => {
  const result: IAccumulators = {
    individualDeductible: {
      used: accumulatorsResponse?.individualTotalDeductible ?? 0,
      maximum: planData?.IndividualDeductible ?? 0,
    },
    familyDeductible: {
      used: accumulatorsResponse?.familyTotalDeductible ?? 0,
      maximum: planData?.FamilyDeductible ?? 0,
    },
    individualOutOfPocket: {
      used: accumulatorsResponse?.individualTotalOutOfPocket ?? 0,
      maximum: planData?.IndividualMax ?? 0,
    },
    familyOutOfPocket: {
      used: accumulatorsResponse?.familyTotalOutOfPocket ?? 0,
      maximum: planData?.FamilyMax ?? 0,
    },
    planDetailsPdf: planData?.PlanDetailsDocument?.url,
  };
  return result;
};
