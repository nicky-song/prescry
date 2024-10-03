// Copyright 2022 Prescryptive Health, Inc.

import { connect } from 'react-redux';
import { RootState } from '../../../experiences/guest-experience/store/root-reducer';
import { ILoadingOverlayProps, LoadingOverlay } from './loading.overlay';

export const mapStateToProps = (state: RootState): ILoadingOverlayProps => {
  const { loading: loadingState } = state;
  const { message, showMessage, count } = loadingState;

  return {
    message,
    showMessage,
    visible: count > 0,
  };
};

export const LoadingOverlayConnected = connect(mapStateToProps)(LoadingOverlay);
