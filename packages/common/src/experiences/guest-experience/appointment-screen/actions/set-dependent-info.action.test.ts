// Copyright 2021 Prescryptive Health, Inc.

import { IAppointmentScreenState } from '../appointment.screen.state';
import { dependentInfoMock } from '../__mocks__/dependent-info.mock';
import { setDependentInfoAction } from './set-dependent-info.action';

describe('setDependentInfoAction', () => {
  it('returns action', () => {
    const action = setDependentInfoAction(dependentInfoMock);

    expect(action.type).toEqual('SET_DEPENDENT_INFO');

    const expectedPayload: Partial<IAppointmentScreenState> = {
      dependentInfo: dependentInfoMock,
    };
    expect(action.payload).toStrictEqual(expectedPayload);
  });
});
