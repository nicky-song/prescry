// Copyright 2018 Prescryptive Health, Inc.

import { IAddress } from './address';
import { IHours } from './date-time/hours';

export interface IContactInfo {
  name: string;
  phone: string;
  email?: string;
  address?: IAddress;
  ncpdp: string;
  hours: IHours[];
}
