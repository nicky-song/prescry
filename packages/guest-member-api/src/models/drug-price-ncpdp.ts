// Copyright 2021 Prescryptive Health, Inc.

import {
  IDrugPrice,
  IDualDrugPrice
} from '@phx/common/src/models/drug-price';

export interface IDrugPriceNcpdp {
  ncpdp: string;
  price: IDrugPrice;
  dualPrice: IDualDrugPrice;
}
