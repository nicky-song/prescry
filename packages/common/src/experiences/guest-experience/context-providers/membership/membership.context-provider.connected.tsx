// Copyright 2021 Prescryptive Health, Inc.

import { connect } from 'react-redux';
import { RootState } from '../../store/root-reducer';
import {
  IMembershipContextProviderProps,
  MembershipContextProvider,
} from './membership.context-provider';

export const mapStateToProps = (
  state: RootState
): IMembershipContextProviderProps => {
  const { memberProfile } = state;
  return {
    memberProfileState: memberProfile,
  };
};

export const MembershipContextProviderConnected = connect(
  mapStateToProps,
  undefined
)(MembershipContextProvider);
