// Copyright 2021 Prescryptive Health, Inc.

export interface IPatientPriceRequest {
  pharmacyIds: string[];
  fillDate: string;
  quantity: number;
  daysSupply: number;
  refillNo: string;
  ndcs: string[];
  rxNumber: string;
  groupPlanCode: string;
  memberId: string;
}
