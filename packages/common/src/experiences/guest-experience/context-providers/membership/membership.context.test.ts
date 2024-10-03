// Copyright 2021 Prescryptive Health, Inc.

import { createContext } from 'react';
import { defaultMembershipState } from '../../state/membership/membership.state';
import { MembershipContext, IMembershipContext } from './membership.context';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  createContext: jest.fn().mockReturnValue({}),
}));
const createContextMock = createContext as jest.Mock;

describe('MembershipContext', () => {
  it('creates context', () => {
    expect(MembershipContext).toBeDefined();

    const expectedContext: IMembershipContext = {
      membershipState: defaultMembershipState,
      membershipDispatch: expect.any(Function),
    };
    expect(createContextMock).toHaveBeenCalledWith(expectedContext);
  });
});
