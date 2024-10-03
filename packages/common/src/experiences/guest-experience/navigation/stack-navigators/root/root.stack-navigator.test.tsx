// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { createStackNavigator } from '@react-navigation/stack';
import { SplashScreenConnected } from '../../../../../components/app/splash-screen/splash.screen.connected';
import { ITestContainer } from '../../../../../testing/test.container';
import { getChildren } from '../../../../../testing/test.helper';
import { FatalErrorScreen } from '../../../fatal-error-screen/fatal-error-screen';
import { HomeScreenConnected } from '../../../home-screen/home-screen-connected';
import { LoginPinScreenConnected } from '../../../login-pin-screen/login-pin-screen.connected';
import { PhoneNumberVerificationScreenConnected } from '../../../phone-number-verification-screen/phone-number-verification-screen.connected';
import { PhoneNumberLoginScreenConnected } from '../../../screens/sign-in/phone-number-login-screen/phone-number-login.screen.connected';
import { VerifyIdentityVerificationCodeScreenConnected } from '../../../screens/sign-in/verify-identity-verification-code/verify-identity-verification-code.screen.connected';
import { UnauthHomeScreen } from '../../../screens/unauth/home/unauth.home.screen';
import { SupportErrorScreenConnected } from '../../../support-error-screen/support-error-screen.connected';
import { VerifyIdentityScreen } from '../../../screens/verify-identity/verify-identity.screen';
import { CreatePinScreenConnected } from '../../../create-pin-screen/create-pin-screen.connected';
import { VerifyPinScreenConnected } from '../../../verify-pin-screen/verify-pin-screen.connected';
import {
  defaultScreenListeners,
  defaultStackNavigationScreenOptions,
} from '../../navigation.helper';
import { DrugSearchStackNavigator } from '../drug-search/drug-search.stack-navigator';
import { RootStackNavigator } from './root.stack-navigator';
import { MedicineCabinetScreen } from '../../../screens/medicine-cabinet/medicine-cabinet.screen';
import { ClaimAlertStackNavigator } from '../claim-alert/claim-alert.stack-navigator';
import { PastProceduresStackNavigator } from '../past-procedures/past-procedures.stack-navigator';
import { ShoppingStackNavigator } from '../shopping/shopping.stack-navigator';
import { SupportScreen } from '../../../support-screen/support.screen';
import { AppointmentsStackNavigator } from '../appointments/appointments.stack-navigator';
import { DigitalIDCardScreen } from '../../../screens/digital-id-card/digital-id-card.screen';
import { MemberListInfoScreen } from '../../../member-list-info-screen/member-list-info-screen';
import { SmartPriceScreen } from '../../../smart-price-screen/smart-price-screen';
import { LoginScreen } from '../../../login-screen/login-screen';
import { EditMemberProfileScreenConnected } from '../../../edit-member-profile-screen/edit-member-profile-screen.connected';
import { VerifyIdentitySendCodeScreenConnected } from '../../../verify-identity-send-code-screen/verify-identity-send-code-screen.connected';
import { PinFeatureWelcomeScreen } from '../../../screens/pin-feature-welcome/pin-feature-welcome.screen';
import { CreateAccountScreen } from '../../../screens/sign-in/create-account/create-account.screen';
import { PbmMemberBenefitsScreen } from '../../../screens/unauth/pbm-member-benefits/pbm-member-benefits.screen';
import { AccountLockedScreen } from '../../../screens/sign-in/account-locked/account-locked.screen';
import { AccountInformationScreen } from '../../../account-information-screen/account-information-screen';
import { ConfigureFiltersScreen } from '../../../screens/drug-search/configure-filters/configure-filters.screen';
import { FindLocationScreen } from '../../../screens/drug-search/find-location/find-location.screen';
import { AccountAndFamilyStackNavigator } from '../account-and-family/account-and-family.stack-navigator';
import { PrescriptionBenefitPlanScreen } from '../../../screens/prescription-benefit-plan/prescription-benefit-plan.screen';
import { ClaimHistoryScreen } from '../../../screens/claim-history/claim-history.screen';
import { FavoritePharmaciesScreen } from '../../../screens/favorite-pharmacies/favorite-pharmacies.screen';
import { SelectLanguageScreen } from '../../../screens/select-language/select-language.screen';
import { SsoTermsOfUseScreen } from '../../../sso-terms-of-use-screen/sso-terms-of-use-screen';
import { ContactCaregiverScreen } from '../../../contact-caregiver-screen/contact-caregiver.screen';
import { HealthPlanScreen } from '../../../screens/health-plan/health-plan.screen';

jest.mock('@react-navigation/stack');
const createStackNavigatorMock = createStackNavigator as jest.Mock;

jest.mock('../../../screens/health-plan/health-plan.screen', () => ({
  HealthPlanScreen: () => <div />,
}));

jest.mock(
  '../../../../../components/app/splash-screen/splash.screen.connected',
  () => ({
    SplashScreenConnected: () => <div />,
  })
);

jest.mock('../../../smart-price-screen/smart-price-screen', () => ({
  SmartPriceScreen: () => <div />,
}));

jest.mock('../../../support-screen/support.screen', () => ({
  SupportScreen: () => <div />,
}));

jest.mock('../../../screens/unauth/home/unauth.home.screen', () => ({
  UnauthHomeScreen: () => <div />,
}));

jest.mock('../../../screens/medicine-cabinet/medicine-cabinet.screen', () => ({
  MedicineCabinetScreen: () => <div />,
}));

jest.mock(
  '../../../screens/prescription-benefit-plan/prescription-benefit-plan.screen',
  () => ({
    PrescriptionBenefitPlanScreen: () => <div />,
  })
);

jest.mock('../../../screens/claim-history/claim-history.screen', () => ({
  ClaimHistoryScreen: () => <div />,
}));

jest.mock(
  '../../../screens/sign-in/phone-number-login-screen/phone-number-login.screen.connected',
  () => ({
    PhoneNumberLoginScreenConnected: () => <div />,
  })
);

jest.mock('../../../screens/digital-id-card/digital-id-card.screen', () => ({
  DigitalIDCardScreen: () => <div />,
}));

jest.mock('../../../member-list-info-screen/member-list-info-screen', () => ({
  MemberListInfoScreen: () => <div />,
}));

jest.mock(
  '../../../phone-number-verification-screen/phone-number-verification-screen.connected',
  () => ({
    PhoneNumberVerificationScreenConnected: () => <div />,
  })
);

jest.mock('../drug-search/drug-search.stack-navigator', () => ({
  DrugSearchStackNavigator: () => <div />,
}));

jest.mock('../claim-alert/claim-alert.stack-navigator', () => ({
  ClaimAlertStackNavigator: () => <div />,
}));

jest.mock('../past-procedures/past-procedures.stack-navigator', () => ({
  PastProceduresStackNavigator: () => <div />,
}));

jest.mock('../shopping/shopping.stack-navigator', () => ({
  ShoppingStackNavigator: () => <div />,
}));

jest.mock('../../../fatal-error-screen/fatal-error-screen', () => ({
  FatalErrorScreen: () => <div />,
}));

jest.mock(
  '../../../support-error-screen/support-error-screen.connected',
  () => ({
    SupportErrorScreenConnected: () => <div />,
  })
);

jest.mock(
  '../../../screens/sign-in/verify-identity-verification-code/verify-identity-verification-code.screen.connected',
  () => ({
    VerifyIdentityVerificationCodeScreenConnected: () => <div />,
  })
);

jest.mock('../../../create-pin-screen/create-pin-screen.connected', () => ({
  CreatePinScreenConnected: () => <div />,
}));

jest.mock('../../../verify-pin-screen/verify-pin-screen.connected', () => ({
  VerifyPinScreenConnected: () => <div />,
}));

jest.mock('../../../login-pin-screen/login-pin-screen.connected', () => ({
  LoginPinScreenConnected: () => <div />,
}));

jest.mock('../../../login-screen/login-screen', () => ({
  LoginScreen: () => <div />,
}));

jest.mock('../../../home-screen/home-screen-connected', () => ({
  HomeScreenConnected: () => <div />,
}));

jest.mock('../../../screens/verify-identity/verify-identity.screen', () => ({
  VerifyIdentityScreen: () => <div />,
}));

jest.mock('../appointments/appointments.stack-navigator', () => ({
  AppointmentsStackNavigator: () => <div />,
}));

jest.mock('../account-and-family/account-and-family.stack-navigator', () => ({
  AccountAndFamilyStackNavigator: () => <div />,
}));

jest.mock(
  '../../../edit-member-profile-screen/edit-member-profile-screen.connected',
  () => ({
    EditMemberProfileScreenConnected: () => <div />,
  })
);

jest.mock(
  '../../../screens/pin-feature-welcome/pin-feature-welcome.screen',
  () => ({
    PinFeatureWelcomeScreen: () => <div />,
  })
);

jest.mock(
  '../../../screens/sign-in/create-account/create-account.screen',
  () => ({
    CreateAccountScreen: () => <div />,
  })
);
jest.mock(
  '../../../screens/unauth/pbm-member-benefits/pbm-member-benefits.screen',
  () => ({
    PbmMemberBenefitsScreen: () => <div />,
  })
);
jest.mock(
  '../../../screens/drug-search/configure-filters/configure-filters.screen',
  () => ({
    ConfigureFiltersScreen: () => <div />,
  })
);
jest.mock(
  '../../../screens/favorite-pharmacies/favorite-pharmacies.screen',
  () => ({
    FavoritePharmaciesScreen: () => <div />,
  })
);
jest.mock('../../../screens/select-language/select-language.screen', () => ({
  SelectLanguageScreen: () => <div />,
}));

jest.mock('../../../sso-terms-of-use-screen/sso-terms-of-use-screen', () => ({
  SelectLanguageScreen: () => <div />,
}));

jest.mock('../../../contact-caregiver-screen/contact-caregiver.screen', () => ({
  SelectLanguageScreen: () => <div />,
}));

const StackNavigatorMock = {
  Navigator: ({ children }: ITestContainer) => <div>{children}</div>,
  Screen: () => <div />,
};

describe('RootStackNavigator', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    createStackNavigatorMock.mockReturnValue(StackNavigatorMock);
  });

  it('renders in StackNavigator', () => {
    const testRenderer = renderer.create(<RootStackNavigator />);

    const stackNavigator = testRenderer.root.children[0] as ReactTestInstance;

    expect(stackNavigator.type).toEqual(StackNavigatorMock.Navigator);
    expect(stackNavigator.props.screenOptions).toEqual(
      defaultStackNavigationScreenOptions
    );
    expect(stackNavigator.props.screenListeners).toEqual(
      defaultScreenListeners
    );
  });

  it('renders screens', () => {
    const expectedScreens = [
      ['Splash', SplashScreenConnected],
      ['Support', SupportScreen],
      ['FatalError', FatalErrorScreen],
      ['SupportError', SupportErrorScreenConnected],
      ['UnauthHome', UnauthHomeScreen],
      ['PhoneNumberLogin', PhoneNumberLoginScreenConnected],
      ['PhoneNumberVerification', PhoneNumberVerificationScreenConnected],
      [
        'VerifyIdentityVerificationCode',
        VerifyIdentityVerificationCodeScreenConnected,
      ],
      ['SsoTermsOfUse', SsoTermsOfUseScreen],
      ['VerifyIdentity', VerifyIdentityScreen],
      ['CreatePin', CreatePinScreenConnected],
      ['VerifyPin', VerifyPinScreenConnected],
      ['CreateAccount', CreateAccountScreen],
      ['VerifyIdentitySendCode', VerifyIdentitySendCodeScreenConnected],
      ['PbmMemberBenefits', PbmMemberBenefitsScreen],
      ['DigitalIDCard', DigitalIDCardScreen],
      ['MemberListInfo', MemberListInfoScreen],
      ['LoginPin', LoginPinScreenConnected],
      ['Login', LoginScreen],
      ['Home', HomeScreenConnected],
      ['MedicineCabinet', MedicineCabinetScreen],
      ['PrescriptionBenefitPlan', PrescriptionBenefitPlanScreen],
      ['ClaimHistory', ClaimHistoryScreen],
      ['SmartPrice', SmartPriceScreen],
      ['DrugSearchStack', DrugSearchStackNavigator],
      ['ClaimAlertStack', ClaimAlertStackNavigator],
      ['PastProceduresStack', PastProceduresStackNavigator],
      ['ShoppingStack', ShoppingStackNavigator],
      ['AppointmentsStack', AppointmentsStackNavigator],
      ['AccountAndFamilyStack', AccountAndFamilyStackNavigator],
      ['PinFeatureWelcome', PinFeatureWelcomeScreen],
      ['EditMemberProfile', EditMemberProfileScreenConnected],
      ['AccountLocked', AccountLockedScreen],
      ['AccountInformation', AccountInformationScreen],
      ['ConfigureFilters', ConfigureFiltersScreen],
      ['FindLocation', FindLocationScreen],
      ['FavoritePharmacies', FavoritePharmaciesScreen],
      ['SelectLanguage', SelectLanguageScreen],
      ['ContactCaregiver', ContactCaregiverScreen],
      ['HealthPlan', HealthPlanScreen],
    ];

    const testRenderer = renderer.create(<RootStackNavigator />);

    const stackNavigator = testRenderer.root.findByType(
      StackNavigatorMock.Navigator
    );
    const stackScreens = getChildren(stackNavigator);

    expect(stackScreens.length).toEqual(expectedScreens.length);

    expectedScreens.forEach(([expectedName, expectedComponent], index) => {
      const screen = stackScreens[index];

      expect(screen.type).toEqual(StackNavigatorMock.Screen);
      expect(screen.props.name).toEqual(expectedName);
      expect(screen.props.component).toEqual(expectedComponent);
    });
  });
});
