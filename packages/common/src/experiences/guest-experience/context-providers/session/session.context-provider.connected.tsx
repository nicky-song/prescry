// Copyright 2021 Prescryptive Health, Inc.

import { connect } from 'react-redux';
import { RootState } from '../../store/root-reducer';
import {
  ISessionContextProviderProps,
  SessionContextProvider,
} from './session.context-provider';

export const mapStateToProps = (
  state: RootState
): Partial<ISessionContextProviderProps> => {
  const { securePin } = state;
  return {
    isUnauthExperience: !securePin.isAuthExperience,
    isUserAuthenticated: securePin.isUserAuthenticated,
  };
};

export const SessionContextProviderConnected = connect(
  mapStateToProps,
  undefined
)(SessionContextProvider);
