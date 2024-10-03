// Copyright 2021 Prescryptive Health, Inc.

import { IDrugForm } from '../../../../../models/drug-form';
import {
  drugForm1Mock,
  drugForm2Mock,
} from '../../../__mocks__/drug-forms.mock';
import { drugFormsSetAction } from '../actions/drug-forms-set.action';
import { setDrugFormsDispatch } from './set-drug-forms.dispatch';

describe('setDrugFormsDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    const drugFormsMock: IDrugForm[] = [drugForm1Mock, drugForm2Mock];
    setDrugFormsDispatch(dispatchMock, drugFormsMock);

    const expectedAction = drugFormsSetAction(drugFormsMock);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
