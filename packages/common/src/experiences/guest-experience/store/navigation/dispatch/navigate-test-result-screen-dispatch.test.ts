// Copyright 2020 Prescryptive Health, Inc.

import { pastProceduresStackNavigationMock } from '../../../navigation/stack-navigators/past-procedures/__mocks__/past-procedures.stack-navigation.mock';
import { navigateTestResultScreenDispatch } from './navigate-test-result-screen-dispatch';

const orderNumberMock = '12345';

describe('navigateTestResultListDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should navigate with undefined backToList params where there is no backToList in props', async () => {
    await navigateTestResultScreenDispatch(
      pastProceduresStackNavigationMock,
      orderNumberMock
    );
    expect(pastProceduresStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(pastProceduresStackNavigationMock.navigate).toHaveBeenCalledWith(
      'PastProceduresStack',
      {
        screen: 'TestResult',
        params: { orderNumber: orderNumberMock, backToList: undefined }
      }
    );
  });

  it('should call navigate with true backToList params where there is true backToList in props', async () => {
    await navigateTestResultScreenDispatch(
      pastProceduresStackNavigationMock,
      orderNumberMock,
      true
    );
    expect(pastProceduresStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(pastProceduresStackNavigationMock.navigate).toHaveBeenCalledWith(
      'PastProceduresStack',
      {
        screen: 'TestResult',
        params: { orderNumber: orderNumberMock, backToList: true }
      }
    );
  });
});
