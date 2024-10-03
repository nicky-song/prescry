// Copyright 2022 Prescryptive Health, Inc.

export interface IPharmacyGroupContent {
  showMessage: string;
  singularLocationMessage: string;
  pluralLocationMessage: string;
}

export const pharmacyGroupContent: IPharmacyGroupContent = {
  showMessage: 'Show',
  singularLocationMessage: 'more location',
  pluralLocationMessage: 'more locations',
};
