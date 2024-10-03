// Copyright 2021 Prescryptive Health, Inc.

import { IAddress } from './address';
import { IHours } from './date-time/hours';

export interface IPharmacy {
  address: IAddress;
  isMailOrderOnly: boolean;
  name: string;
  ncpdp: string;
  hours: IHours[];
  phoneNumber?: string;
  twentyFourHours: boolean;
  distance?: number;
  inNetwork?: boolean;
  nationalProviderIdentifier?: string;
  type?: string;
  hasDriveThru?: boolean;
  fax?: string;
  email?: string;
  brand?: string;
  chainId?: number;
}
