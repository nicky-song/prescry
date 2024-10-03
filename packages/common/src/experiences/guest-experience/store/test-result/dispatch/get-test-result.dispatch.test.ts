// Copyright 2020 Prescryptive Health, Inc.

import {
  ITestResult,
  ITestResultResponse,
} from '../../../../../models/api-response/test-result-response';
import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { getTestResult } from '../../../api/api-v1.get-test-result';
import { getTestResultDispatch } from './get-test-result.dispatch';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { getTestResultResponseAction } from '../actions/get-test-result-response-action';

jest.mock('../../../api/api-v1.get-test-result', () => ({
  getTestResult: jest.fn().mockResolvedValue({ data: {} }),
}));
const getTestResultMock = getTestResult as jest.Mock;

jest.mock('../../settings/dispatch/token-update.dispatch');
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;

const authTokenMock = 'auth_token';
const deviceTokenMock = 'device_token';

const defaultStateMock = {
  config: {
    apis: {},
  },
  settings: {
    deviceToken: deviceTokenMock,
    token: authTokenMock,
  },
};
const getStateMock = jest.fn();

describe('getTestResultDispatch', () => {
  beforeEach(() => {
    getStateMock.mockReset();
    getStateMock.mockReturnValue(defaultStateMock);
    tokenUpdateDispatchMock.mockReset();
  });

  it('calls getTestResults API with expected arguments', async () => {
    const guestExperienceApiMock = 'guestExperienceApiMock';

    const stateMock = {
      ...defaultStateMock,
      config: {
        apis: {
          guestExperienceApi: guestExperienceApiMock,
        },
      },
    };
    getStateMock.mockReturnValue(stateMock);

    const dispatchMock = jest.fn();
    await getTestResultDispatch(dispatchMock, getStateMock);

    expect(getTestResultMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      authTokenMock,
      getEndpointRetryPolicy,
      deviceTokenMock,
      undefined
    );
  });

  it('calls getTestResults API with expected arguments when testResultId is provided', async () => {
    const guestExperienceApiMock = 'guestExperienceApiMock';
    const testId = 'mock-id';
    const stateMock = {
      ...defaultStateMock,
      config: {
        apis: {
          guestExperienceApi: guestExperienceApiMock,
        },
      },
    };
    getStateMock.mockReturnValue(stateMock);

    const dispatchMock = jest.fn();
    await getTestResultDispatch(dispatchMock, getStateMock, testId);

    expect(getTestResultMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      authTokenMock,
      getEndpointRetryPolicy,
      deviceTokenMock,
      testId
    );
  });

  it('dispatches getTestResult API response', async () => {
    const result: ITestResult = {
      icd10: ['U07.1'],
      fillDate: new Date(),
      memberId: 'member_1',
      orderNumber: '1234',
      time: 'appointment-time',
      date: 'appointment-date',
      productOrService: 'test-service',
      serviceDescription: 'test',
    };

    const testResultsResponseMock: ITestResultResponse = {
      data: { testResult: result },
      message: 'all good',
      refreshToken: 'refresh-token',
      status: 'ok',
    };
    getTestResultMock.mockResolvedValue(testResultsResponseMock);

    const dispatchMock = jest.fn();
    await getTestResultDispatch(dispatchMock, getStateMock);

    const responseAction = getTestResultResponseAction({ testResult: result });
    expect(dispatchMock).toHaveBeenCalledWith(responseAction);

    expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      testResultsResponseMock.refreshToken
    );
  });
});
