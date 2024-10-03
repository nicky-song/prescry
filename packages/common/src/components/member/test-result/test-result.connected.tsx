// Copyright 2020 Prescryptive Health, Inc.

import { connect } from 'react-redux';
import { RootState } from '../../../experiences/guest-experience/store/root-reducer';
import { ITestResultDataProps, TestResult } from './test-result';

export const mapStateToProps = (
  state: RootState,
  ownProps?: ITestResultDataProps
): ITestResultDataProps => {
  return {
    testResult: state.testResult,
    ...ownProps,
  };
};

export const TestResultConnected = connect(mapStateToProps, {})(TestResult);
