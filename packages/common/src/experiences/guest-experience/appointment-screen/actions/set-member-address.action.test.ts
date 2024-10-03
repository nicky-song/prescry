// Copyright 2021 Prescryptive Health, Inc.

import { IAppointmentScreenState } from '../appointment.screen.state';
import { memberAddressMock } from '../__mocks__/member-address.mock';
import { setMemberAddressAction } from './set-member-address.action';

describe('setMemberAddressAction', () => {
  it('returns action', () => {
    const action = setMemberAddressAction(memberAddressMock);

    expect(action.type).toEqual('SET_MEMBER_ADDRESS');

    const expectedPayload: Partial<IAppointmentScreenState> = {
      memberAddress: memberAddressMock,
    };
    expect(action.payload).toStrictEqual(expectedPayload);
  });
});
