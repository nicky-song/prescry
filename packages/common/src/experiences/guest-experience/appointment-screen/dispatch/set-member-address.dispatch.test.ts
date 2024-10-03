// Copyright 2021 Prescryptive Health, Inc.

import { setMemberAddressAction } from '../actions/set-member-address.action';
import { memberAddressMock } from '../__mocks__/member-address.mock';
import { setMemberAddressDispatch } from './set-member-address.dispatch';

describe('setMemberAddressDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    setMemberAddressDispatch(dispatchMock, memberAddressMock);

    const expectedAction = setMemberAddressAction(memberAddressMock);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
