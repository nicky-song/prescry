// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactNode, useReducer } from 'react';
import { AppointmentsListContextProvider } from './appointments-list.context-provider';
import { AppointmentsListContext, IAppointmentsListContext } from './appointments-list.context';
import { appointmentsListStateMock } from '../../__mocks__/appointments-list.state.mock';
import { create } from 'react-test-renderer';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useReducer: jest.fn(),
}));
const useReducerMock = useReducer as jest.Mock;

jest.mock('./appointments-list.context', () => ({
  AppointmentsListContext: {
    Provider: (props: { children: ReactNode }) => <div>{props.children}</div>,
  },
}));
const ChildMock = jest.fn().mockReturnValue(<div />);

const dispatchMock = jest.fn();

describe('AppointmentsListContextProvider', () => {
  beforeEach(() => {
    useReducerMock.mockReturnValue([appointmentsListStateMock, dispatchMock]);
  });
  it('renders as AppointmentsListContext.Provider with expected properties', () => {
    const testRenderer = create(
      <AppointmentsListContextProvider>
        <ChildMock />
      </AppointmentsListContextProvider>
    );

    const provider = testRenderer.root.findByType(AppointmentsListContext.Provider);

    const expectedAppointmentsListContext: IAppointmentsListContext = {
      appointmentsListState: appointmentsListStateMock,
      appointmentsListDispatch: dispatchMock
    };
    expect(provider.props.value).toEqual(expectedAppointmentsListContext);
    expect(provider.props.children).toEqual(<ChildMock />);
  });
});
