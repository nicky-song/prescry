// Copyright 2022 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { IVerifyPatientInfoScreenRouteProps } from '../../../../screens/verify-patient-info/verify-patient-info.screen';
import { verifyPatientInfoNavigateDispatch } from './verify-patient-info-navigate.dispatch';

describe('verifyPatientInfoNavigateDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('navigates to verify patient info screen with expected route params', () => {
    expect(rootStackNavigationMock.navigate).not.toHaveBeenCalled();

    const prescriptionIdMock = 'prescription-id-mock';

    verifyPatientInfoNavigateDispatch(
      rootStackNavigationMock,
      prescriptionIdMock
    );

    const expectedRouteParams: IVerifyPatientInfoScreenRouteProps = {
      workflow: 'prescriptionInvite',
      prescriptionId: prescriptionIdMock,
    };

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'AccountAndFamilyStack',
      {
        screen: 'VerifyPatientInfo',
        params: expectedRouteParams,
      }
    );
  });
});
