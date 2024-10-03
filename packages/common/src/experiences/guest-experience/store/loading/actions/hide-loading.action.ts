// Copyright 2021 Prescryptive Health, Inc.

import { ILoadingAction } from './loading.action';

export type IHideLoadingAction = ILoadingAction<'LOADING_HIDE'>;

export const hideLoadingAction = (): IHideLoadingAction => ({
  type: 'LOADING_HIDE',
  payload: {},
});
