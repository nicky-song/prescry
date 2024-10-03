// Copyright 2020 Prescryptive Health, Inc.

import { getDrugInformationResponseAction } from './actions/get-drug-information-response.action';
import {
  IDrugInformationState,
  drugInformationReducer,
} from './drug-information.reducer';
import { IDrugInformationItem } from '../../../../models/api-response/drug-information-response';

describe('drugInformationReducer', () => {
  it('updates state for get response', () => {
    const drug = {
      drugName: 'Basaglar KwikPen',
      NDC: '00002771501',
      externalLink: 'https://e.lilly/2FMmWRZ',
      videoImage: '',
      videoLink: 'https://e.lilly/3j6MMi1',
    } as IDrugInformationItem;
    const action = getDrugInformationResponseAction(drug);
    const expectedState: IDrugInformationState = {
      drug,
    };

    const initialState: IDrugInformationState = {};
    const updatedState = drugInformationReducer(initialState, action);
    expect(updatedState).toEqual(expectedState);
  });
});
