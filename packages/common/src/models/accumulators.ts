// Copyright 2022 Prescryptive Health, Inc.

export interface IAccumulators {
  individualDeductible: IAccumulatorValue;
  familyDeductible: IAccumulatorValue;
  individualOutOfPocket: IAccumulatorValue;
  familyOutOfPocket: IAccumulatorValue;
  planDetailsPdf?: string;
}

export interface IAccumulatorValue {
  used: number;
  maximum: number;
}
