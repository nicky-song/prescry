// Copyright 2022 Prescryptive Health, Inc.

// TODO: M.Meletti - IPrescriptionDetails extends IDrugDetails
export interface IPrescriptionDetails {
  productName: string;
  strength?: string;
  unit?: string;
  quantity: number;
  supply?: number;
  formCode: string;
  memberPays?: number;
  planPays?: number;
}
