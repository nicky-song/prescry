// Copyright 2022 Prescryptive Health, Inc.

export interface IPharmacyInfoCardContent {
  distanceText: (distance: number) => string;
}

export const pharmacyInfoCardContent: IPharmacyInfoCardContent = {
  distanceText: (distance: number) => `${distance} mi`,
};
