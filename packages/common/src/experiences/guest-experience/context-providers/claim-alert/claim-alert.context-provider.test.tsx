// Copyright 2022 Prescryptive Health, Inc.

import React, { useReducer } from 'react';
import renderer from 'react-test-renderer';
import { ClaimAlertContextProvider } from './claim-alert.context-provider';
import { IClaimAlertContext, ClaimAlertContext } from './claim-alert.context';
import { ITestContainer } from '../../../../testing/test.container';
import {
  defaultClaimAlertState,
  IClaimAlertState,
} from '../../state/claim-alert/claim-alert.state';
import { claimAlertReducer } from '../../state/claim-alert/claim-alert.reducer';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useReducer: jest.fn(),
}));
const useReducerMock = useReducer as jest.Mock;

jest.mock('./claim-alert.context', () => ({
  ClaimAlertContext: {
    Provider: ({ children }: ITestContainer) => <div>{children}</div>,
  },
}));

const ChildMock = jest.fn().mockReturnValue(<div />);

describe('ClaimAlertContextProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useReducerMock.mockReturnValue([{}, jest.fn()]);
  });

  it('calls useReducer with expected arguments', () => {
    renderer.create(
      <ClaimAlertContextProvider>
        <ChildMock />
      </ClaimAlertContextProvider>
    );

    const initialState: IClaimAlertState = defaultClaimAlertState;
    expect(useReducerMock).toHaveBeenCalledWith(
      claimAlertReducer,
      initialState
    );
  });

  it('renders as context provider with expected properties', () => {
    const stateMock: IClaimAlertState = defaultClaimAlertState;
    const dispatchMock = jest.fn();
    useReducerMock.mockReturnValue([stateMock, dispatchMock]);

    const testRenderer = renderer.create(
      <ClaimAlertContextProvider>
        <ChildMock />
      </ClaimAlertContextProvider>
    );

    const provider = testRenderer.root.findByType(ClaimAlertContext.Provider);

    const expectedContext: IClaimAlertContext = {
      claimAlertState: stateMock,
      claimAlertDispatch: dispatchMock,
    };
    expect(provider.props.value).toEqual(expectedContext);
    expect(provider.props.children).toEqual(<ChildMock />);
  });
});
