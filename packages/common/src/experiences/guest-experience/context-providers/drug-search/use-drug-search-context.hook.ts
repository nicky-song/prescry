// Copyright 2021 Prescryptive Health, Inc.

import { useContext } from 'react';
import { IDrugSearchContext, DrugSearchContext } from './drug-search.context';

export const useDrugSearchContext = (): IDrugSearchContext =>
  useContext(DrugSearchContext);
