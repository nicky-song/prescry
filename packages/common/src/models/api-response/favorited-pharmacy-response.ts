// Copyright 2022 Prescryptive Health, Inc.

import { IApiDataResponse } from '../api-response';
import { IPharmacy } from '../pharmacy';

export type IFavoritedPharmacyResponse =
  IApiDataResponse<IFavoritedPharmacyResponseData>;

export interface IFavoritedPharmacyResponseData {
  favoritedPharmacies: IPharmacy[];
}
