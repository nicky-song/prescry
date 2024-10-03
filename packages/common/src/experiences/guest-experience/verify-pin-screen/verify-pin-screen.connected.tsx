// Copyright 2018 Prescryptive Health, Inc.

import { connect } from 'react-redux';
import { RootState } from '../store/root-reducer';
import { addUpdatePinLoadingAction } from '../store/secure-pin/secure-pin-reducer.actions';
import {
  VerifyPinScreen,
  IVerifyPinScreenActionProps,
  IVerifyPinScreenProps,
} from './verify-pin-screen';

export const mapStateToProps = (state: RootState): IVerifyPinScreenProps => {
  return {
    errorCode: state.securePin.errorCode,
    hasErrorOccurred: state.securePin.hasPinMismatched,
  };
};

export const mapActionsToProps: IVerifyPinScreenActionProps = {
  addUpdatePinAction: addUpdatePinLoadingAction,
};

export const VerifyPinScreenConnected = connect(
  mapStateToProps,
  mapActionsToProps
)(VerifyPinScreen);
