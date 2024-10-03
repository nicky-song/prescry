// Copyright 2018 Prescryptive Health, Inc.

import { connect } from 'react-redux';
import { RootState } from '../store/root-reducer';
import { navigateToPhoneLoginScreenAndResetSettings } from '../store/support-error/support-error.reducer.actions';
import {
  ISupportErrorScreenActionProps,
  ISupportErrorScreenProps,
  SupportErrorScreen,
} from './support-error-screen';

export const mapStateToProps = (state: RootState): ISupportErrorScreenProps => {
  const errorBackNavigationType = state.supportError.errorBackNavigationType;
  return {
    errorBackNavigationType,
    errorMessage: state.supportError.errorMessage,
  };
};
const actions: ISupportErrorScreenActionProps = {
  reloadPageAction: navigateToPhoneLoginScreenAndResetSettings,
};

export const SupportErrorScreenConnected = connect(
  mapStateToProps,
  actions
)(SupportErrorScreen);
