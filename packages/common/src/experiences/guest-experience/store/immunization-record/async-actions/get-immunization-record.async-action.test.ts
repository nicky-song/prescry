// Copyright 2021 Prescryptive Health, Inc.

import { pastProceduresStackNavigationMock } from '../../../navigation/stack-navigators/past-procedures/__mocks__/past-procedures.stack-navigation.mock';
import { handlePostLoginApiErrorsAction } from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { getImmunizationRecordDispatch } from '../dispatch/get-immunization-record.dispatch';
import { getImmunizationRecordAsyncAction } from './get-immunization-record.async-action';

jest.mock('../dispatch/get-immunization-record.dispatch', () => ({
  getImmunizationRecordDispatch: jest.fn(),
}));
const getImmunizationRecordDispatchMock =
  getImmunizationRecordDispatch as jest.Mock;

jest.mock(
  '../../navigation/dispatch/navigate-post-login-error.dispatch',
  () => ({
    handlePostLoginApiErrorsAction: jest.fn(),
  })
);
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

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

describe('getImmunizationRecordAsyncAction', () => {
  beforeEach(() => {
    getStateMock.mockReset();
    getStateMock.mockReturnValue(defaultStateMock);
  });

  it('requests getImmunizationRecordDispatch', async () => {
    const dispatchMock = jest.fn();
    const orderNumber = '1234';
    await getImmunizationRecordAsyncAction({
      navigation: pastProceduresStackNavigationMock,
      orderNumber
    })(
      dispatchMock,
      getStateMock
    );

    expect(getImmunizationRecordDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      orderNumber
    );
  });

  it('dispatches error action on failure', async () => {
    const errorMock = Error('Boom!');
    getImmunizationRecordDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const dispatchMock = jest.fn();
    const orderNumber = '1234';
    await getImmunizationRecordAsyncAction({
      navigation: pastProceduresStackNavigationMock,
      orderNumber
    })(
      dispatchMock,
      getStateMock
    );

    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      dispatchMock,
      pastProceduresStackNavigationMock
    );
  });
});
