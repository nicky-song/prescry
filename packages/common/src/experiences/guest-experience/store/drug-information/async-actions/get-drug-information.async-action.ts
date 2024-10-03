// Copyright 2020 Prescryptive Health, Inc.

import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import { IGetDrugInformationResponseAction } from '../actions/get-drug-information-response.action';
import { getDrugInformationDispatch } from '../dispatch/get-drug-information.dispatch';

export type IGetDrugInformationActionType = IGetDrugInformationResponseAction;

export const getDrugInformationAsyncAction = (ndc?: string) => {
  return async (
    dispatch: Dispatch<IGetDrugInformationActionType>,
    getState: () => RootState
  ) => {
    try {
      await getDrugInformationDispatch(dispatch, getState, ndc);
    } catch {
      return;
    }
  };
};
