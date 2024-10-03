// Copyright 2022 Prescryptive Health, Inc.

export interface IDigitalIdCardContent {
  sieUserHeader: string;
  name: string;
  memberId: string;
  group: string;
  bin: string;
  pcn: string;
}

export interface IUnauthSmartPriceCardContent {
  defaultMessage: string;
  pcnValue: string;
  groupValue: string;
  binValue: string;
}

export interface ISmartPriceScreenContent {
  startSavingTodayLabel: string;
  showYourPharmacistLabel: string;
  showYourPharmacistContent: string;
  manageMyInformationLabel: string;
  digitalIdCard: IDigitalIdCardContent;
  unauthSmartPriceCard: IUnauthSmartPriceCardContent;
}
