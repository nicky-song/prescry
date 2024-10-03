// Copyright 2022 Prescryptive Health, Inc.

import { useContext } from 'react';
import { ILoadingContext, LoadingContext } from './loading.context';

export const useLoadingContext = (): ILoadingContext =>
  useContext(LoadingContext);
