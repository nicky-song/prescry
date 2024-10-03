// Copyright 2019 Prescryptive Health, Inc.

import { IAddress } from './address';

export interface IPharmacyListItem {
  address: IAddress;
  emailAddress: string;
  isGuest?: boolean;
  name: string;
  ncpdp: string;
  userOid: string;
}
