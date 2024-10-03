// Copyright 2020 Prescryptive Health, Inc.

import { connect } from 'react-redux';
import {
  TestResultScreen,
  ITestResultScreenDataProps,
  ITestResultScreenDispatchProps,
} from './test-result.screen';
import { RootState } from '../store/root-reducer';
import { getTestResultDataLoadingAsyncAction } from '../store/appointment/async-actions/get-test-result-data-loading-async-action';

export const mapStateToProps = (
  state: RootState
): ITestResultScreenDataProps => {
  const { type } = state.serviceType;
  const { serviceDescription, orderNumber } = state.testResult;
  return {
    serviceType: type,
    serviceDescription,
    orderNumber,
  };
};

export const actions: ITestResultScreenDispatchProps = {
  getTestResult: getTestResultDataLoadingAsyncAction,
};

export const TestResultScreenConnected = connect(
  mapStateToProps,
  actions
)(TestResultScreen);
