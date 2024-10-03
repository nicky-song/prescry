// Copyright 2021 Prescryptive Health, Inc.

import { IApiDataResponse } from '../api-response';

export type IUIContentResponse = IApiDataResponse<IUICMSResponse[] | null>;

export interface IUICMSResponse {
  groupKey: string;
  fieldKey: string;
  language: string;
  value: string;
  type: string;
}
