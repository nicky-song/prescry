// Copyright 2021 Prescryptive Health, Inc.

import { IDrugForm } from '../../../../models/drug-form';
import { drugForm1Mock, drugForm2Mock } from '../../__mocks__/drug-forms.mock';
import { drugFormsSetAction } from './actions/drug-forms-set.action';
import { sessionReducer } from './session.reducer';
import { defaultSessionState, ISessionState } from './session.state';

describe('sessionReducer', () => {
  it('reduces drug forms set action', () => {
    const drugFormsMock: IDrugForm[] = [drugForm1Mock, drugForm2Mock];
    const action = drugFormsSetAction(drugFormsMock);

    const initialState: ISessionState = {
      ...defaultSessionState,
      drugFormMap: new Map(),
    };
    const reducedState = sessionReducer(initialState, action);

    const expectedState: ISessionState = {
      ...initialState,
      ...(action.payload as Partial<ISessionState>),
    };
    expect(reducedState).toEqual(expectedState);
  });
});
