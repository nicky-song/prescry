// Copyright 2018 Prescryptive Health, Inc.

export interface IMedication {
  form: string;
  genericName: string;
  genericProductId: string;
  isGeneric?: boolean;
  medicationId: string;
  name: string;
  strength: string;
  units: string;
}
