// Copyright 2021 Prescryptive Health, Inc.

import { useContext } from 'react';
import { useAppointmentsListContext } from './appointments-list-context.hook';
import { IAppointmentsListContext } from './appointments-list.context';
import { appointmentsListStateMock } from '../../__mocks__/appointments-list.state.mock';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useContext: jest.fn(),
}));
const useContextMock = useContext as jest.Mock;

describe('useAppointmentsListContext', () => {
  it('returns expected context', () => {
    const AppointmentsListContextMock: IAppointmentsListContext = {
      appointmentsListState: appointmentsListStateMock,
      appointmentsListDispatch: jest.fn(),
    };
    useContextMock.mockReturnValue(AppointmentsListContextMock);

    const AppointmentsListContext: IAppointmentsListContext = useAppointmentsListContext();

    expect(AppointmentsListContext).toEqual(AppointmentsListContextMock);
  });
});
