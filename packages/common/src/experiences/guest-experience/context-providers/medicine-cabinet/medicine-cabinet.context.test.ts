// Copyright 2021 Prescryptive Health, Inc.

import { createContext } from 'react';
import { defaultMedicineCabinetState } from '../../state/medicine-cabinet/medicine-cabinet.state';
import {
  MedicineCabinetContext,
  IMedicineCabinetContext,
} from './medicine-cabinet.context';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  createContext: jest.fn().mockReturnValue({}),
}));
const createContextMock = createContext as jest.Mock;

describe('MedicineCabinetContext', () => {
  it('creates context', () => {
    expect(MedicineCabinetContext).toBeDefined();

    const expectedContext: IMedicineCabinetContext = {
      medicineCabinetState: defaultMedicineCabinetState,
      medicineCabinetDispatch: expect.any(Function),
    };
    expect(createContextMock).toHaveBeenCalledWith(expectedContext);
  });
});
