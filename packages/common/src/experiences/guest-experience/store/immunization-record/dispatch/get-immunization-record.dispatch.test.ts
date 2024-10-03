// Copyright 2021 Prescryptive Health, Inc.

import {
  IImmunizationRecord,
  IImmunizationRecordResponse,
} from '../../../../../models/api-response/immunization-record-response';
import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { getImmunizationRecordDetails } from '../../../api/api-v1.get-immunization-record';

import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { getImmunizationRecordResponseAction } from '../actions/get-immunization-record-response.action';
import { getImmunizationRecordDispatch } from './get-immunization-record.dispatch';

jest.mock('../../../api/api-v1.get-immunization-record', () => ({
  getImmunizationRecordDetails: jest.fn().mockResolvedValue({ data: {} }),
}));
const getImmunizationRecordDetailsMock =
  getImmunizationRecordDetails as jest.Mock;

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

describe('getImmunizationRecordDetailsDispatch', () => {
  beforeEach(() => {
    getStateMock.mockReset();
    getStateMock.mockReturnValue(defaultStateMock);
    tokenUpdateDispatchMock.mockReset();
  });

  it('calls getImmunizationRecordDetails API with expected arguments', async () => {
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

    const orderNumber = '1234';

    const dispatchMock = jest.fn();
    await getImmunizationRecordDispatch(
      dispatchMock,
      getStateMock,
      orderNumber
    );

    expect(getImmunizationRecordDetailsMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      orderNumber,
      authTokenMock,
      getEndpointRetryPolicy,
      deviceTokenMock
    );
  });

  it('dispatches getImmunizationRecordResponseAction', async () => {
    const result: IImmunizationRecord[] = [
      {
        orderNumber: '1234',
        manufacturer: 'Moderna',
        lotNumber: '1234',
        doseNumber: 1,
        locationName: 'Lonehollow Pharmacy',
        address1: '1010 Cooley Lane',
        city: 'Vanderpool',
        state: 'TX',
        zip: '78885',
        time: 'appointment-time',
        date: 'appointment-date',
        memberId: 'member_1',
        vaccineCode: 'vaccine-1',
        serviceDescription: 'test',
      },
    ];

    const testResultsResponseMock: IImmunizationRecordResponse = {
      data: { immunizationResult: result },
      message: 'all good',
      refreshToken: 'refresh-token',
      status: 'ok',
    };
    getImmunizationRecordDetailsMock.mockResolvedValue(testResultsResponseMock);

    const orderNumber = '1234';

    const dispatchMock = jest.fn();
    await getImmunizationRecordDispatch(
      dispatchMock,
      getStateMock,
      orderNumber
    );

    const responseAction = getImmunizationRecordResponseAction(result);
    expect(dispatchMock).toHaveBeenCalledWith(responseAction);

    expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      testResultsResponseMock.refreshToken
    );
  });
});
