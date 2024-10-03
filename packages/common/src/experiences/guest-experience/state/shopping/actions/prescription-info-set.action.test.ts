// Copyright 2021 Prescryptive Health, Inc.

import { prescriptionInfoMock } from '../../../__mocks__/prescription-info.mock';
import { IShoppingState } from '../shopping.state';
import { prescriptionInfoSetAction } from './prescription-info-set.action';

describe('prescriptionInfoSetAction', () => {
  it('returns action', () => {
    const action = prescriptionInfoSetAction(prescriptionInfoMock);
    expect(action.type).toEqual('PRESCRIPTION_INFO_SET');

    const expectedPayload: Partial<IShoppingState> = {
      prescriptionInfo: prescriptionInfoMock,
    };
    expect(action.payload).toEqual(expectedPayload);
  });
});
