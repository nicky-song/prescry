// Copyright 2021 Prescryptive Health, Inc.

import { useContext } from 'react';
import { defaultMembershipState } from '../../state/membership/membership.state';
import { IMembershipContext } from './membership.context';
import { useMembershipContext } from './use-membership-context.hook';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useContext: jest.fn(),
}));
const useContextMock = useContext as jest.Mock;

describe('useMembershipContext', () => {
  it('returns expected context', () => {
    const contextMock: IMembershipContext = {
      membershipState: defaultMembershipState,
      membershipDispatch: jest.fn(),
    };
    useContextMock.mockReturnValue(contextMock);

    const context: IMembershipContext = useMembershipContext();
    expect(context).toEqual(contextMock);
  });
});
