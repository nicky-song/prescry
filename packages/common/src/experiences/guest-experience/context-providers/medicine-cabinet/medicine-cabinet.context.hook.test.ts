// Copyright 2021 Prescryptive Health, Inc.

import { useContext } from 'react';
import { defaultMedicineCabinetState } from '../../state/medicine-cabinet/medicine-cabinet.state';
import { IMedicineCabinetContext } from './medicine-cabinet.context';
import { useMedicineCabinetContext } from './medicine-cabinet.context.hook';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useContext: jest.fn(),
}));
const useContextMock = useContext as jest.Mock;

describe('useMedicineCabinetContext', () => {
  it('returns expected context', () => {
    const contextMock: IMedicineCabinetContext = {
      medicineCabinetState: defaultMedicineCabinetState,
      medicineCabinetDispatch: jest.fn(),
    };
    useContextMock.mockReturnValue(contextMock);

    const context: IMedicineCabinetContext = useMedicineCabinetContext();
    expect(context).toEqual(contextMock);
  });
});
