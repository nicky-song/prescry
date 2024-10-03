// Copyright 2022 Prescryptive Health, Inc.

export type DrawerStatus = 'open' | 'closed';

export interface IDrawerState {
  status: DrawerStatus;
}

export const defaultDrawerState: IDrawerState = {
  status: 'closed',
};
