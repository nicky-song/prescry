// Copyright 2022 Prescryptive Health, Inc.

interface IDrugInfo {
  ndc: string;
}

interface IPatientPlanInfo {
  bin?: string;
  pcn?: string;
  group?: string;
  memberId?: string;
  personCode?: string;
}

interface IPatientInfo {
  patientId?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  zipCode: string;
}

interface IProviderInfo {
  providerNpi: string;
}

interface ICostCalculatorRequest {
  patientInfo: IPatientInfo;
  patientPlanInfo?: IPatientPlanInfo;
  drugInfo: IDrugInfo;
  providerInfo: IProviderInfo;
}

export interface IGetInsuranceInfoRequestBody {
  costCalculatorRequest: ICostCalculatorRequest;
}
