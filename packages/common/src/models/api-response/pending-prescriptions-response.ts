// Copyright 2021 Prescryptive Health, Inc.

import { IApiDataResponse } from '../api-response';
import { IPendingPrescriptionsList } from '../pending-prescription';

export type IPendingMedicationResponse =
  IApiDataResponse<IPendingMedicationResponseData>;

export interface IPendingMedicationResponseData {
  memberIdentifier?: string;
  pendingPrescriptionList: IPendingPrescriptionsList;
}
