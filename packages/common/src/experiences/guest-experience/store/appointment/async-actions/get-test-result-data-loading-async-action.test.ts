// Copyright 2022 Prescryptive Health, Inc.

import { pastProceduresStackNavigationMock } from '../../../navigation/stack-navigators/past-procedures/__mocks__/past-procedures.stack-navigation.mock';
import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { getTestResultAsyncAction } from '../../test-result/async-actions/get-test-result.async-action';
import { getTestResultDataLoadingAsyncAction } from './get-test-result-data-loading-async-action';

jest.mock('../../modal-popup/modal-popup.reducer.actions', () => ({
  dataLoadingAction: jest.fn(),
}));
const dataLoadingActionMock = dataLoadingAction as jest.Mock;

describe('getTestResultDataLoadingAsyncAction', () => {
  it('Should call dataLoadingAction', async () => {
    const orderNumberMock = '1234';

    await getTestResultDataLoadingAsyncAction(
      pastProceduresStackNavigationMock,
      orderNumberMock
    );
    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      getTestResultAsyncAction,
      {
        navigation: pastProceduresStackNavigationMock,
        orderNumber: orderNumberMock,
      }
    );
  });
});
