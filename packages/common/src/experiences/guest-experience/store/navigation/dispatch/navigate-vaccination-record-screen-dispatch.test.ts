// Copyright 2020 Prescryptive Health, Inc.

import { pastProceduresStackNavigationMock } from '../../../navigation/stack-navigators/past-procedures/__mocks__/past-procedures.stack-navigation.mock';
import { navigateVaccinationRecordScreenDispatch } from './navigate-vaccination-record-screen-dispatch';

describe('navigateVaccinationRecordScreenDispatch', () => {
  const orderNumberMock = '1234';
  it('should call navigate with undefined backToList params where there is no backToList in props', async () => {
    await navigateVaccinationRecordScreenDispatch(
      pastProceduresStackNavigationMock,
      orderNumberMock
    );
    expect(pastProceduresStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(pastProceduresStackNavigationMock.navigate).toHaveBeenCalledWith(
      'PastProceduresStack',
      {
        screen: 'VaccinationRecord',
        params: { orderNumber: orderNumberMock, backToList: undefined }
      }
    );
  });

  it('should call navigate with true backToList params where there is true backToList in props', async () => {
    await navigateVaccinationRecordScreenDispatch(
      pastProceduresStackNavigationMock,
      orderNumberMock,
      true
    );
    expect(pastProceduresStackNavigationMock.navigate).toHaveBeenCalledWith(
      'PastProceduresStack',
      {
        screen: 'VaccinationRecord',
        params: { orderNumber: orderNumberMock, backToList: true }
      }
    );
  });
});
