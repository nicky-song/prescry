// Copyright 2018 Prescryptive Health, Inc.

import { connect } from 'react-redux';
import { RootState } from '../store/root-reducer';
import {
  setPinAction,
  navigateToBackAction,
} from '../store/secure-pin/secure-pin-reducer.actions';
import {
  CreatePinScreen,
  ICreatePinScreenActionProps,
  ICreatePinScreenProps,
} from './create-pin-screen';

export const mapStateToProps = (state: RootState): ICreatePinScreenProps => {
  const errorCode = state.securePin.errorCode;
  return { errorCode };
};

export const mapActionsToProps: ICreatePinScreenActionProps = {
  setPinAction,
  navigateToBack: navigateToBackAction,
};

export const CreatePinScreenConnected = connect(
  mapStateToProps,
  mapActionsToProps
)(CreatePinScreen);
