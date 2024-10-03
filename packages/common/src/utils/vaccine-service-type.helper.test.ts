// Copyright 2021 Prescryptive Health, Inc.

import { isVaccineServiceType } from './vaccine-service-type.helper';
import { ServiceTypes } from '../models/provider-location';

describe('isVaccineServiceType', () => {
  it.each([
    [ServiceTypes.c19Vaccine, true],
    [ServiceTypes.medicaidAbbottAntigen, false],
    [ServiceTypes.c19VaccineDose1, true],
  ])(
    'returns boolean based on service type',
    (serviceType: string, response: boolean) => {
      expect(isVaccineServiceType(serviceType)).toEqual(response);
    }
  );
});
