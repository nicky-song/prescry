// Copyright 2021 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { medicineCabinetNavigateDispatch } from './medicine-cabinet-navigate.dispatch';

jest.mock('../navigation-reducer.actions');

describe('medicineCabinetNavigateDispatch', () => {
  it('should call navigation.navigate with backToHome undefined if there is no backToHome in props', () => {
    medicineCabinetNavigateDispatch(rootStackNavigationMock);

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'MedicineCabinet',
      { backToHome: undefined }
    );
  });
  
  it('should call navigation.navigate with backToHome true if there is no backToHome in props', () => {
    medicineCabinetNavigateDispatch(rootStackNavigationMock, true);

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'MedicineCabinet',
      { backToHome: true }
    );
  });
});
