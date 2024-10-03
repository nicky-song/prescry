// Copyright 2021 Prescryptive Health, Inc.

import { ServiceTypes } from '../models/provider-location';

export function isVaccineServiceType(serviceType: string) {
  return (
    serviceType === ServiceTypes.c19Vaccine ||
    serviceType === ServiceTypes.c19VaccineDose1 ||
    serviceType === ServiceTypes.c19VaccineDose2
  );
}
