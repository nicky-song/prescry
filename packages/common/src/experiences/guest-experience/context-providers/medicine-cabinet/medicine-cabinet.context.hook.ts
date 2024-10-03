// Copyright 2021 Prescryptive Health, Inc.

import { useContext } from 'react';
import {
  IMedicineCabinetContext,
  MedicineCabinetContext,
} from './medicine-cabinet.context';

export const useMedicineCabinetContext = (): IMedicineCabinetContext =>
  useContext(MedicineCabinetContext);
