// Copyright 2022 Prescryptive Health, Inc.

export interface ILoadingState {
  count: number;
  showMessage?: boolean;
  message?: string;
}

export const defaultLoadingState: ILoadingState = {
  count: 0,
};
