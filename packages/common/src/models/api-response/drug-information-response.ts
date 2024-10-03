// Copyright 2021 Prescryptive Health, Inc.

import { IApiDataResponse } from '../api-response';

export type IDrugInformationResponse =
  IApiDataResponse<IDrugInformationItem | null>;

export interface IDrugInformationItem {
  drugName: string;
  NDC: string;
  externalLink: string;
  videoImage: string;
  videoLink: string;
}
