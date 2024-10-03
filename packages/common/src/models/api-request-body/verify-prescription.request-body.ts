// Copyright 2022 Prescryptive Health, Inc.

export interface IVerifyPrescriptionRequestBody {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  blockchain?: boolean;
}
