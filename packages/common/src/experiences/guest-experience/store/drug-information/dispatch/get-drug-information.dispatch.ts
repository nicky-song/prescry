// Copyright 2020 Prescryptive Health, Inc.

import { Dispatch } from 'react';
import { IGetDrugInformationActionType } from '../async-actions/get-drug-information.async-action';
import { getDrugInformationResponseAction } from '../actions/get-drug-information-response.action';
import { getDrugInformation } from '../../../api/api-v1.get-drug-information';
import { RootState } from '../../root-reducer';

export const getDrugInformationDispatch = async (
  dispatch: Dispatch<IGetDrugInformationActionType>,
  getState: () => RootState,
  ndc?: string
) => {
  const state = getState();
  const api = state.config.apis.contentManagementApi;
  try {
    const response = await getDrugInformation(api, ndc);
    if (response) {
      dispatch(getDrugInformationResponseAction(response));
    }
    // eslint-disable-next-line no-empty
  } catch {}
};
