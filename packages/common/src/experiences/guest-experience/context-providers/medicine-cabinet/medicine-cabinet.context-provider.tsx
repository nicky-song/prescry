// Copyright 2021 Prescryptive Health, Inc.

import React, { FunctionComponent, useReducer } from 'react';
import { MedicineCabinetReducer } from '../../state/medicine-cabinet/medicine-cabinet.reducer';
import { defaultMedicineCabinetState } from '../../state/medicine-cabinet/medicine-cabinet.state';
import { MedicineCabinetContext } from './medicine-cabinet.context';

export const MedicineCabinetContextProvider: FunctionComponent = ({
  children,
}) => {
  const [state, dispatch] = useReducer<MedicineCabinetReducer>(
    MedicineCabinetReducer,
    defaultMedicineCabinetState
  );
  return (
    <MedicineCabinetContext.Provider
      value={{
        medicineCabinetState: state,
        medicineCabinetDispatch: dispatch,
      }}
    >
      {children}
    </MedicineCabinetContext.Provider>
  );
};
