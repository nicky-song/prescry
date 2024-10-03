// Copyright 2021 Prescryptive Health, Inc.

import { ApiConstants } from '../constants/api-constants';

export const isSmartpriceUser = (rxSubGroup: string): boolean => {
  return (
    // tslint:disable-next-line: tsr-detect-possible-timing-attacks
    rxSubGroup === ApiConstants.CASH_USER_RX_SUB_GROUP ||
    // tslint:disable-next-line: tsr-detect-possible-timing-attacks
    rxSubGroup === ApiConstants.CASH_USER_SMARTPRICE_SUB_GROUP
  );
};
