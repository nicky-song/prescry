// Copyright 2020 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { RootState } from '../../../experiences/guest-experience/store/root-reducer';
import { ITestResultState } from '../../../experiences/guest-experience/store/test-result/test-result.reducer';
import { ITestResultDataProps } from './test-result';
import { mapStateToProps } from './test-result.connected';

const testStateMock: ITestResultState = {
  date: 'some-date',
  time: 'some-time',
  productOrServiceId: 'some-id',
  providerName: 'Test Provider Name',
  providerAddress: {
    address1: '111 E 1st St.',
    address2: '#954',
    city: 'Minneapolis',
    state: 'MN',
    zip: '56804',
  },
};

describe('TestResultConnected', () => {
  it('maps state', () => {
    const customViewStyle: ViewStyle = { backgroundColor: 'red' };
    const ownProps = {
      viewStyle: customViewStyle,
    };

    const initialState: RootState = {
      features: {},
      testResult: testStateMock,
    } as RootState;

    const mappedProps: ITestResultDataProps = mapStateToProps(
      initialState,
      ownProps
    );

    const expectedProps: ITestResultDataProps = {
      viewStyle: customViewStyle,
      testResult: testStateMock,
    };
    expect(mappedProps).toEqual(expectedProps);
  });
});
