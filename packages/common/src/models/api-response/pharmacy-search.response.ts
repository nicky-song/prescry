// Copyright 2021 Prescryptive Health, Inc.

import { IApiDataResponse } from '../api-response';

import { IPharmacy } from '../pharmacy';

export type IPharmacySearchResponse = IApiDataResponse<IPharmacy[]>;
