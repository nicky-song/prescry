// Copyright 2022 Prescryptive Health, Inc.

import { pastProceduresStackNavigationMock } from '../../../navigation/stack-navigators/past-procedures/__mocks__/past-procedures.stack-navigation.mock';
import { getImmunizationRecordAsyncAction } from '../../immunization-record/async-actions/get-immunization-record.async-action';
import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { getImmunizationRecordDataLoadingAsyncAction } from './get-immunization-record-data-loading-async-action';

jest.mock('../../modal-popup/modal-popup.reducer.actions', () => ({
  dataLoadingAction: jest.fn(),
}));
const dataLoadingActionMock = dataLoadingAction as jest.Mock;

describe('getImmunizationRecordDataLoadingAsyncAction', () => {
  const orderNumberMock = '1234';

  it('Should call dataLoadingAction', async () => {
    await getImmunizationRecordDataLoadingAsyncAction(
      pastProceduresStackNavigationMock,
      orderNumberMock
    );
    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      getImmunizationRecordAsyncAction,
      {
        navigation: pastProceduresStackNavigationMock,
        orderNumber: orderNumberMock,
      }
    );
  });
});
