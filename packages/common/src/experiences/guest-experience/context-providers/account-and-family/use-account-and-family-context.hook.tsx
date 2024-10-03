// Copyright 2022 Prescryptive Health, Inc.

import { useContext } from 'react';
import {
  IAccountAndFamilyContext,
  AccountAndFamilyContext,
} from './account-and-family.context';

export const useAccountAndFamilyContext = (): IAccountAndFamilyContext =>
  useContext(AccountAndFamilyContext);
