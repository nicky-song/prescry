// Copyright 2021 Prescryptive Health, Inc.

export interface ISendVerificationCodeRequestBody {
  verificationType: VerificationTypes;
}

export enum VerificationTypesEnum {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
}

export type VerificationTypes = keyof typeof VerificationTypesEnum;
