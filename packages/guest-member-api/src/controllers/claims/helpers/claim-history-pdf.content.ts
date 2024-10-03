// Copyright 2022 Prescryptive Health, Inc.

export type ClaimHistoryPdfContentField =
  | 'amount'
  | 'amountAppliedToDeductible'
  | 'dateOfBirth'
  | 'daysSupply'
  | 'fillDate'
  | 'footerPageInfo'
  | 'footerPrintedDate'
  | 'format'
  | 'medicationName'
  | 'memberId'
  | 'memberName'
  | 'npi'
  | 'patientInformation'
  | 'patientPayAmount'
  | 'pharmacyName'
  | 'pharmacyPhoneNumber'
  | 'quantity'
  | 'strength'
  | 'title'
  | 'total';

export type IClaimHistoryPdfContent = Partial<
  Record<ClaimHistoryPdfContentField, string>
>;
