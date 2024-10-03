// Copyright 2022 Prescryptive Health, Inc.

import { createContext } from 'react';
import { defaultClaimAlertState } from '../../state/claim-alert/claim-alert.state';
import { ClaimAlertContext, IClaimAlertContext } from './claim-alert.context';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  createContext: jest.fn().mockReturnValue({}),
}));
const createContextMock = createContext as jest.Mock;

describe('ClaimAlertContext', () => {
  it('creates context', () => {
    expect(ClaimAlertContext).toBeDefined();

    const expectedContext: IClaimAlertContext = {
      claimAlertState: defaultClaimAlertState,
      claimAlertDispatch: expect.any(Function),
    };
    expect(createContextMock).toHaveBeenCalledWith(expectedContext);
  });
});
