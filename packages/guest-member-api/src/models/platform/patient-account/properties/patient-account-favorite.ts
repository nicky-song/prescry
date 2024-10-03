// Copyright 2022 Prescryptive Health, Inc.

export type PatientAccountFavoriteType =
  | 'medications'
  | 'pharmacies'
  | 'languageCode';

export interface IPatientAccountFavorite {
  type: PatientAccountFavoriteType;
  value: string[];
}
