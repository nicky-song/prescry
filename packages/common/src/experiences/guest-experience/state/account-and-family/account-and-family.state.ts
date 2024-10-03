// Copyright 2022 Prescryptive Health, Inc.

export type PrescriptionPersonSelection = 'self' | 'other';

export interface IAccountAndFamilyState {
  prescriptionPersonSelection?: PrescriptionPersonSelection;
}

export const defaultAccountAndFamilyState: IAccountAndFamilyState = {};
