// Copyright 2020 Prescryptive Health, Inc.

import { IVaccineCode } from './immunization-record';
export interface IServices {
  administrationMethod?: string;
  serviceType: string;
  serviceName: string;
  confirmationDescriptionMyRx: string;
  cancellationPolicyMyRx?: string;
  serviceNameMyRx: string;
  minimumAge?: number;
  schedulerMinimumAge?: number;
  aboutQuestionsDescriptionMyRx: string;
  aboutDependentDescriptionMyRx: string;
  claimOptions?: IClaimOptionServices[];
  procedureCode?: string;
  serviceDescription?: string;
  testType?: string;
  informationLinks?: string[];
}

export interface IIcd10Code {
  code: string;
  text?: string;
  system?: string;
  textColorMyRx?: string;
  colorMyRx?: string;
  valueMyRx?: string;
  descriptionMyRx?: string;
}
export interface IClaimOptionServices {
  claimOptionId: string;
  text?: string;
  ndc?: string;
  qualifier?: string;
  manufacturer?: string;
  factSheetLinks?: string[];
  icd10Code: IIcd10Code;
  productOrServiceId: string;
  cptCode?: IVaccineCode;
}
