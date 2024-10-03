// Copyright 2021 Prescryptive Health, Inc.

import { useContext } from 'react';
import {
  PastProceduresContext,
  IPastProceduresContext,
} from './past-procedures.context';

export const usePastProceduresContext = (): IPastProceduresContext =>
  useContext(PastProceduresContext);
