// Copyright 2022 Prescryptive Health, Inc.

import { useContext } from 'react';
import { useClaimAlertContext } from './use-claim-alert-context';
import { IClaimAlertContext } from './claim-alert.context';
import { defaultClaimAlertState } from '../../state/claim-alert/claim-alert.state';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useContext: jest.fn(),
}));
const useContextMock = useContext as jest.Mock;

describe('useClaimAlertContext', () => {
  it('returns expected context', () => {
    const contextMock: IClaimAlertContext = {
      claimAlertState: defaultClaimAlertState,
      claimAlertDispatch: jest.fn(),
    };
    useContextMock.mockReturnValue(contextMock);

    const context: IClaimAlertContext = useClaimAlertContext();
    expect(context).toEqual(contextMock);
  });
});
