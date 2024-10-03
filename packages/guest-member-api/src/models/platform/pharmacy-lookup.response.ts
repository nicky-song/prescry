// Copyright 2021 Prescryptive Health, Inc.

import { IAddress } from '@phx/common/src/models/address';

export interface IPrescriptionPharmacy {
  address: IAddress;
  email?: string;
  hasDriveThru?: boolean;
  hours: IPrescriptionPharmacyHours[];
  inNetwork?: boolean;
  name: string;
  nationalProviderIdentifier?: string;
  ncpdp: string;
  phone?: string;
  fax?: string;
  twentyFourHours?: boolean;
  type: string;
  distanceFromSearchPointInMiles?: number;
  isMailOrderOnly?: boolean;
  brand?: string;
  chainId?: number;
}

export interface IPrescriptionPharmacyHours {
  closes?: IPrescriptionPharmacyTime;
  day: string;
  opens?: IPrescriptionPharmacyTime;
}

export interface IPrescriptionPharmacyTime {
  hours: number;
  minutes: number;
  pm: boolean;
}
