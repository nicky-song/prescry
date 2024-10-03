// Copyright 2021 Prescryptive Health, Inc.

import { Workflow } from '../../../../../../models/workflow';
import { getCurrentScreen } from '../../../../navigation/navigation.helper';
import { rootStackNavigationMock } from '../../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { IPhoneNumberLoginScreenRouteProps } from '../../../../screens/sign-in/phone-number-login-screen/phone-number-login.screen';
import { phoneNumberLoginNavigateDispatch } from './phone-number-login-navigate.dispatch';

jest.mock('../../../../navigation/navigation.helper');
const getCurrentScreenMock = getCurrentScreen as jest.Mock;

describe('phoneNumberLoginNavigateDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    ['Splash', undefined, false],
    ['UnauthHome', undefined, true],
    ['WhatComesNext', 'pbmActivate', true],
    ['WhatComesNext', 'prescriptionTransfer', true],
    ['WhatComesNext', 'smartPriceCard', true],
  ])(
    'calls dispatchNavigateToScreen from screen %p for workflow %p',
    (
      currentScreen: string,
      workflowMock: undefined | string,
      expectedHasNavigateBack: boolean
    ) => {
      getCurrentScreenMock.mockReturnValue(currentScreen);
      phoneNumberLoginNavigateDispatch(
        rootStackNavigationMock,
        workflowMock as Workflow
      );

      expect(getCurrentScreenMock).toHaveBeenCalledWith(
        rootStackNavigationMock
      );

      const expectedScreenProps: Partial<IPhoneNumberLoginScreenRouteProps> = {
        workflow: workflowMock as Workflow,
        hasNavigateBack: expectedHasNavigateBack,
      };

      expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
      expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
        1,
        'PhoneNumberLogin',
        expectedScreenProps
      );
    }
  );

  it.each([[undefined], [true]])(
    'calls dispatchNavigateToScreen from screen "unauthCreateAccount" for workflow "prescriptionInvite" when blockchain is %p',
    (isBlockchainMock?: boolean) => {
      const prescriptionIdMock = 'test-prescription-id';

      phoneNumberLoginNavigateDispatch(
        rootStackNavigationMock,
        'prescriptionInvite' as Workflow,
        prescriptionIdMock,
        isBlockchainMock
      );

      expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);

      const expectedScreenProps: Partial<IPhoneNumberLoginScreenRouteProps> = {
        workflow: 'prescriptionInvite' as Workflow,
        hasNavigateBack: true,
        prescriptionId: prescriptionIdMock,
        isBlockchain: isBlockchainMock,
      };
      expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
        1,
        'PhoneNumberLogin',
        expectedScreenProps
      );
    }
  );
});
