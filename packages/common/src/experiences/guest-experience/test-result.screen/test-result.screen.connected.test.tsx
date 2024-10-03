// Copyright 2020 Prescryptive Health, Inc.

import { ITestResultScreenDataProps } from './test-result.screen';
import { TestResultScreenConnected } from './test-result.screen.connected';
import { RootState } from '../store/root-reducer';
import { ITestResultState } from '../store/test-result/test-result.reducer';
import { mapStateToProps } from './test-result.screen.connected';
import { IServiceTypeState } from '../store/service-type/service-type.reducer';
import React from 'react';
import { connect } from 'react-redux';
import { getTestResultDataLoadingAsyncAction } from '../store/appointment/async-actions/get-test-result-data-loading-async-action';

jest.mock('./test-result.screen', () => ({
  TestResultScreen: () => <div />,
}));

jest.mock('react-redux', () => {
  return {
    connect: jest.fn().mockReturnValue(() => jest.fn()),
  };
});
const connectMock = connect as unknown as jest.Mock;

const testStateMock: ITestResultState = {
  time: 'appointment-time',
  date: 'appointment-date',
  serviceDescription: 'test header',
  orderNumber: '1234',
};

const serviceTypeStateMock: IServiceTypeState = {
  type: 'pcr',
  serviceNameMyRx: 'friendly-service-name',
};

describe('TestResultScreenConnected', () => {
  it('is defined', () => {
    expect(TestResultScreenConnected).toBeDefined();
  });

  it('connect should get called once', () => {
    expect(connectMock).toHaveBeenCalledTimes(1);
  });

  it('connect method should be called with annonymous function as argument', () => {
    const annonymousFunction = connectMock.mock.calls[0][0];
    expect(annonymousFunction).toBeInstanceOf(Function);
    expect(connectMock.mock.calls[0][1].getTestResult).toBeDefined();
    expect(connectMock.mock.calls[0][1].getTestResult).toBeInstanceOf(
      Function
    );
    expect(connectMock.mock.calls[0][1].getTestResult).toBe(
      getTestResultDataLoadingAsyncAction
    );
  });

  it('maps state', () => {
    const initialState: RootState = {
      features: {},
      testResult: testStateMock,
      serviceType: serviceTypeStateMock,
    } as RootState;

    const mappedProps: ITestResultScreenDataProps =
      mapStateToProps(initialState);

    const expectedProps: ITestResultScreenDataProps = {
      serviceType: serviceTypeStateMock.type,
      serviceDescription: testStateMock.serviceDescription,
      orderNumber: testStateMock.orderNumber,
    };
    expect(mappedProps).toEqual(expectedProps);
  });
});
