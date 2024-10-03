// Copyright 2021 Prescryptive Health, Inc.

import { IDrugForm } from '../../../../../models/drug-form';
import {
  drugForm1Mock,
  drugForm2Mock,
} from '../../../__mocks__/drug-forms.mock';
import { ISessionState } from '../session.state';
import { drugFormsSetAction } from './drug-forms-set.action';

describe('drugFormsSetAction', () => {
  it('returns action', () => {
    const drugFormsMock: IDrugForm[] = [drugForm1Mock, drugForm2Mock];

    const action = drugFormsSetAction(drugFormsMock);

    expect(action.type).toEqual('DRUG_FORMS_SET');

    const expectedDrugFormsMap = new Map([
      [drugForm1Mock.formCode, drugForm1Mock],
      [drugForm2Mock.formCode, drugForm2Mock],
    ]);
    const expectedPayload: Partial<ISessionState> = {
      drugFormMap: expectedDrugFormsMap,
    };
    expect(action.payload).toEqual(expectedPayload);
  });
});
