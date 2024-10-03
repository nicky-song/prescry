// Copyright 2022 Prescryptive Health, Inc.

import { IAlternativeDrugPrice } from '../../../models/alternative-drug-price';
import {
  alternativePlanComboBrandMedicationsMock,
  janumetPrescribedMedicationMock,
  pharmacyInfoMock,
} from './claim-alert.mock';

export const alternativeDrugPriceMock: IAlternativeDrugPrice = {
  prescribedMedication: janumetPrescribedMedicationMock,
  alternativeMedicationList: alternativePlanComboBrandMedicationsMock,
  pharmacyInfo: pharmacyInfoMock,
};
