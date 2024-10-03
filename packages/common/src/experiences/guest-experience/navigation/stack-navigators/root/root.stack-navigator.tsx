// Copyright 2021 Prescryptive Health, Inc.

import { RouteProp } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import React, { ReactElement } from 'react';
import { SplashScreenConnected } from '../../../../../components/app/splash-screen/splash.screen.connected';
import { AccountInformationScreen } from '../../../account-information-screen/account-information-screen';
import type { IContactCaregiverScreenRouteProps } from '../../../contact-caregiver-screen/contact-caregiver.screen';
import { ContactCaregiverScreen } from '../../../contact-caregiver-screen/contact-caregiver.screen';
import { ICreatePinScreenRouteProps } from '../../../create-pin-screen/create-pin-screen';
import { CreatePinScreenConnected } from '../../../create-pin-screen/create-pin-screen.connected';
import { EditMemberProfileScreenConnected } from '../../../edit-member-profile-screen/edit-member-profile-screen.connected';
import {
  FatalErrorScreen,
  IFatalErrorScreenRouteProps,
} from '../../../fatal-error-screen/fatal-error-screen';
import { IHomeScreenRouteProps } from '../../../home-screen/home-screen';
import { HomeScreenConnected } from '../../../home-screen/home-screen-connected';
import { ILoginPinScreenRouteProps } from '../../../login-pin-screen/login-pin-screen';
import { LoginPinScreenConnected } from '../../../login-pin-screen/login-pin-screen.connected';
import {
  ILoginScreenRouteProps,
  LoginScreen,
} from '../../../login-screen/login-screen';
import { MemberListInfoScreen } from '../../../member-list-info-screen/member-list-info-screen';
import { IPhoneNumberVerificationScreenRouteProps } from '../../../phone-number-verification-screen/phone-number-verification-screen';
import { PhoneNumberVerificationScreenConnected } from '../../../phone-number-verification-screen/phone-number-verification-screen.connected';
import { ClaimHistoryScreen } from '../../../screens/claim-history/claim-history.screen';
import {
  DigitalIDCardScreen,
  IDigitalIDCardScreenRouteProps,
} from '../../../screens/digital-id-card/digital-id-card.screen';
import {
  ConfigureFiltersScreen,
  IConfigureFiltersScreenRouteProps,
} from '../../../screens/drug-search/configure-filters/configure-filters.screen';
import { FindLocationScreen } from '../../../screens/drug-search/find-location/find-location.screen';
import { FavoritePharmaciesScreen } from '../../../screens/favorite-pharmacies/favorite-pharmacies.screen';
import {
  HealthPlanScreen,
  IHealthPlanScreenRouteProps,
} from '../../../screens/health-plan/health-plan.screen';
import {
  IMedicineCabinetScreenRouteProps,
  MedicineCabinetScreen,
} from '../../../screens/medicine-cabinet/medicine-cabinet.screen';
import {
  IPinFeatureWelcomeScreenRouteProps,
  PinFeatureWelcomeScreen,
} from '../../../screens/pin-feature-welcome/pin-feature-welcome.screen';
import { PrescriptionBenefitPlanScreen } from '../../../screens/prescription-benefit-plan/prescription-benefit-plan.screen';
import { SelectLanguageScreen } from '../../../screens/select-language/select-language.screen';
import {
  AccountLockedScreen,
  IAccountLockedScreenRouteProps,
} from '../../../screens/sign-in/account-locked/account-locked.screen';
import {
  CreateAccountScreen,
  ICreateAccountScreenRouteProps,
} from '../../../screens/sign-in/create-account/create-account.screen';
import { IPhoneNumberLoginScreenRouteProps } from '../../../screens/sign-in/phone-number-login-screen/phone-number-login.screen';
import { PhoneNumberLoginScreenConnected } from '../../../screens/sign-in/phone-number-login-screen/phone-number-login.screen.connected';
import { VerifyIdentityVerificationCodeScreenConnected } from '../../../screens/sign-in/verify-identity-verification-code/verify-identity-verification-code.screen.connected';
import { UnauthHomeScreen } from '../../../screens/unauth/home/unauth.home.screen';
import {
  IPbmMemberBenefitsScreenRouteProps,
  PbmMemberBenefitsScreen,
} from '../../../screens/unauth/pbm-member-benefits/pbm-member-benefits.screen';
import { VerifyIdentityScreen } from '../../../screens/verify-identity/verify-identity.screen';
import { SmartPriceScreen } from '../../../smart-price-screen/smart-price-screen';
import type { ISsoTermsOfUseScreenRouteProps } from '../../../sso-terms-of-use-screen/sso-terms-of-use-screen';
import { SsoTermsOfUseScreen } from '../../../sso-terms-of-use-screen/sso-terms-of-use-screen';
import { SupportErrorScreenConnected } from '../../../support-error-screen/support-error-screen.connected';
import { SupportScreen } from '../../../support-screen/support.screen';
import { VerifyIdentitySendCodeScreenConnected } from '../../../verify-identity-send-code-screen/verify-identity-send-code-screen.connected';
import { IVerifyPinScreenRouteProps } from '../../../verify-pin-screen/verify-pin-screen';
import { VerifyPinScreenConnected } from '../../../verify-pin-screen/verify-pin-screen.connected';
import { SideMenuDrawerNavigationProp } from '../../drawer-navigators/side-menu/side-menu.drawer-navigator';
import {
  defaultScreenListeners,
  defaultStackNavigationScreenOptions,
} from '../../navigation.helper';
import {
  AccountAndFamilyStackNavigator,
  AccountAndFamilyStackScreenName,
} from '../account-and-family/account-and-family.stack-navigator';
import {
  AppointmentsStackNavigator,
  AppointmentsStackScreenName,
} from '../appointments/appointments.stack-navigator';
import {
  ClaimAlertStackNavigator,
  ClaimAlertStackScreenName,
} from '../claim-alert/claim-alert.stack-navigator';
import {
  DrugSearchStackNavigator,
  DrugSearchStackScreenName,
} from '../drug-search/drug-search.stack-navigator';
import {
  PastProceduresStackNavigator,
  PastProceduresStackScreenName,
} from '../past-procedures/past-procedures.stack-navigator';
import {
  ShoppingStackNavigator,
  ShoppingStackScreenName,
} from '../shopping/shopping.stack-navigator';

export type RootStackParamList = {
  Splash: undefined;
  Support: undefined;
  FatalError: IFatalErrorScreenRouteProps;
  SupportError: undefined;
  UnauthHome: undefined;
  PhoneNumberLogin: IPhoneNumberLoginScreenRouteProps;
  PhoneNumberVerification: IPhoneNumberVerificationScreenRouteProps;
  VerifyIdentityVerificationCode: undefined;
  VerifyIdentity: undefined;
  CreatePin: ICreatePinScreenRouteProps;
  VerifyPin: IVerifyPinScreenRouteProps;
  VerifyIdentitySendCode: undefined;
  DigitalIDCard: IDigitalIDCardScreenRouteProps | undefined;
  MemberListInfo: undefined;
  LoginPin: ILoginPinScreenRouteProps;
  Login: ILoginScreenRouteProps;
  CreateAccount: ICreateAccountScreenRouteProps;
  Home: IHomeScreenRouteProps;
  MedicineCabinet: IMedicineCabinetScreenRouteProps;
  PrescriptionBenefitPlan: undefined;
  ClaimHistory: undefined;
  SmartPrice: undefined;
  DrugSearchStack: Partial<{
    screen: DrugSearchStackScreenName;
    params: unknown;
  }>;
  ClaimAlertStack: Partial<{
    screen: ClaimAlertStackScreenName;
  }>;
  PastProceduresStack: Partial<{
    screen: PastProceduresStackScreenName;
    params: unknown;
  }>;
  ShoppingStack: Partial<{
    screen: ShoppingStackScreenName;
    params: unknown;
  }>;
  AppointmentsStack: Partial<{
    screen: AppointmentsStackScreenName;
    params: unknown;
  }>;
  AccountAndFamilyStack: Partial<{
    screen: AccountAndFamilyStackScreenName;
    params: unknown;
  }>;
  PinFeatureWelcome: IPinFeatureWelcomeScreenRouteProps;
  EditMemberProfile: undefined;
  PbmMemberBenefits: IPbmMemberBenefitsScreenRouteProps;
  AccountLocked: IAccountLockedScreenRouteProps;
  AccountInformation: undefined;
  ConfigureFilters: IConfigureFiltersScreenRouteProps;
  FindLocation: undefined;
  FavoritePharmacies: undefined;
  SelectLanguage: undefined;
  SsoTermsOfUse: ISsoTermsOfUseScreenRouteProps;
  ContactCaregiver: IContactCaregiverScreenRouteProps;
  HealthPlan: IHealthPlanScreenRouteProps;
};

export type RootStackScreenName = keyof RootStackParamList;

type ScreenNavigationProp<TScreenName extends RootStackScreenName> =
  SideMenuDrawerNavigationProp &
    StackNavigationProp<RootStackParamList, TScreenName>;

type ScreenRouteProp<TScreenName extends RootStackScreenName> = RouteProp<
  RootStackParamList,
  TScreenName
>;

export type SupportNavigationProp = ScreenNavigationProp<'Support'>;

export type SplashNavigationProp = ScreenNavigationProp<'Splash'>;

export type FatalErrorNavigationProp = ScreenNavigationProp<'FatalError'>;
export type FatalErrorRouteProp = ScreenRouteProp<'FatalError'>;

export type SupportErrorNavigationProp = ScreenNavigationProp<'SupportError'>;

export type UnauthHomeNavigationProp = ScreenNavigationProp<'UnauthHome'>;

export type PhoneNumberLoginNavigationProp =
  ScreenNavigationProp<'PhoneNumberLogin'>;
export type PhoneNumberLoginRouteProp = ScreenRouteProp<'PhoneNumberLogin'>;

export type PhoneNumberVerificationNavigationProp =
  ScreenNavigationProp<'PhoneNumberVerification'>;
export type PhoneNumberVerificationRouteProp =
  ScreenRouteProp<'PhoneNumberVerification'>;

export type VerifyIdentityVerificationCodeNavigationProp =
  ScreenNavigationProp<'VerifyIdentityVerificationCode'>;

export type VerifyIdentityNavigationProp =
  ScreenNavigationProp<'VerifyIdentity'>;

export type CreatePinNavigationProp = ScreenNavigationProp<'CreatePin'>;
export type CreatePinRouteProp = ScreenRouteProp<'CreatePin'>;

export type VerifyPinNavigationProp = ScreenNavigationProp<'VerifyPin'>;
export type VerifyPinRouteProp = ScreenRouteProp<'VerifyPin'>;

export type VerifyIdentitySendCodeNavigationProp =
  ScreenNavigationProp<'VerifyIdentitySendCode'>;
export type DigitalIDCardNavigationProp = ScreenNavigationProp<'DigitalIDCard'>;
export type DigitalIDCardRouteProp = ScreenRouteProp<'DigitalIDCard'>;

export type MemberListInfoNavigationProp =
  ScreenNavigationProp<'MemberListInfo'>;

export type LoginPinNavigationProp = ScreenNavigationProp<'LoginPin'>;
export type LoginPinRouteProp = ScreenRouteProp<'LoginPin'>;

export type LoginNavigationProp = ScreenNavigationProp<'Login'>;
export type LoginRouteProp = ScreenRouteProp<'Login'>;

export type CreateAccountNavigationProp = ScreenNavigationProp<'CreateAccount'>;
export type CreateAccountRouteProp = ScreenRouteProp<'CreateAccount'>;

export type HomeNavigationProp = ScreenNavigationProp<'Home'>;
export type HomeRouteProp = ScreenRouteProp<'Home'>;

export type MedicineCabinetNavigationProp =
  ScreenNavigationProp<'MedicineCabinet'>;
export type MedicineCabinetRouteProps = ScreenRouteProp<'MedicineCabinet'>;

export type PrescriptionBenefitPlanNavigationProp =
  ScreenNavigationProp<'PrescriptionBenefitPlan'>;

export type ClaimHistoryNavigationProp = ScreenNavigationProp<'ClaimHistory'>;

export type SmartPriceNavigationProp = ScreenNavigationProp<'SmartPrice'>;

export type PinFeatureWelcomeNavigationProp =
  ScreenNavigationProp<'PinFeatureWelcome'>;
export type PinFeatureWelcomeRouteProp = ScreenRouteProp<'PinFeatureWelcome'>;

export type EditMemberProfileNavigationProp =
  ScreenNavigationProp<'EditMemberProfile'>;

export type PbmMemberBenefitsNavigationProp =
  ScreenNavigationProp<'PbmMemberBenefits'>;

export type PbmMemberBenefitsRouteProp = ScreenRouteProp<'PbmMemberBenefits'>;

export type AccountLockedNavigationProp = ScreenNavigationProp<'AccountLocked'>;
export type AccountLockedRouteProp = ScreenRouteProp<'AccountLocked'>;

export type AccountInformationNavigationProp =
  ScreenNavigationProp<'AccountInformation'>;

export type ConfigureFiltersNavigationProp =
  ScreenNavigationProp<'ConfigureFilters'>;
export type ConfigureFiltersRouteProp = ScreenRouteProp<'ConfigureFilters'>;

export type RootStackNavigationProp = SideMenuDrawerNavigationProp &
  StackNavigationProp<RootStackParamList, RootStackScreenName>;

export type FavoritePharmaciesNavigationProp =
  ScreenNavigationProp<'FavoritePharmacies'>;

export type SelectLanguageNavigationProp =
  ScreenNavigationProp<'SelectLanguage'>;

export type SsoTermsOfUseNavigationProp = ScreenNavigationProp<'SsoTermsOfUse'>;

export type SsoTermsOfUseRouteProp = ScreenRouteProp<'SsoTermsOfUse'>;

export type ContactCaregiverScreenRouteProp =
  ScreenRouteProp<'ContactCaregiver'>;

export type HealthPlanScreenNavigationProp = ScreenNavigationProp<'HealthPlan'>;
export type HealthPlanScreenRouteProp = ScreenRouteProp<'HealthPlan'>;

export const RootStackNavigator = (): ReactElement => {
  const Stack = createStackNavigator<RootStackParamList>();

  return (
    <Stack.Navigator
      screenOptions={defaultStackNavigationScreenOptions}
      screenListeners={defaultScreenListeners}
    >
      <Stack.Screen name='Splash' component={SplashScreenConnected} />
      <Stack.Screen name='Support' component={SupportScreen} />
      <Stack.Screen name='FatalError' component={FatalErrorScreen} />
      <Stack.Screen
        name='SupportError'
        component={SupportErrorScreenConnected}
      />
      <Stack.Screen name='UnauthHome' component={UnauthHomeScreen} />
      <Stack.Screen
        name='PhoneNumberLogin'
        component={PhoneNumberLoginScreenConnected}
      />
      <Stack.Screen
        name='PhoneNumberVerification'
        component={PhoneNumberVerificationScreenConnected}
      />
      <Stack.Screen
        name='VerifyIdentityVerificationCode'
        component={VerifyIdentityVerificationCodeScreenConnected}
      />
      <Stack.Screen name='SsoTermsOfUse' component={SsoTermsOfUseScreen} />
      <Stack.Screen name='VerifyIdentity' component={VerifyIdentityScreen} />
      <Stack.Screen name='CreatePin' component={CreatePinScreenConnected} />
      <Stack.Screen name='VerifyPin' component={VerifyPinScreenConnected} />
      <Stack.Screen name='CreateAccount' component={CreateAccountScreen} />
      <Stack.Screen
        name='VerifyIdentitySendCode'
        component={VerifyIdentitySendCodeScreenConnected}
      />
      <Stack.Screen
        name='PbmMemberBenefits'
        component={PbmMemberBenefitsScreen}
      />
      <Stack.Screen name='DigitalIDCard' component={DigitalIDCardScreen} />
      <Stack.Screen name='MemberListInfo' component={MemberListInfoScreen} />
      <Stack.Screen name='LoginPin' component={LoginPinScreenConnected} />
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Home' component={HomeScreenConnected} />
      <Stack.Screen name='MedicineCabinet' component={MedicineCabinetScreen} />
      <Stack.Screen
        name='PrescriptionBenefitPlan'
        component={PrescriptionBenefitPlanScreen}
      />
      <Stack.Screen name='ClaimHistory' component={ClaimHistoryScreen} />
      <Stack.Screen name='SmartPrice' component={SmartPriceScreen} />
      <Stack.Screen
        name='DrugSearchStack'
        component={DrugSearchStackNavigator}
      />
      <Stack.Screen
        name='ClaimAlertStack'
        component={ClaimAlertStackNavigator}
      />

      <Stack.Screen
        name='PastProceduresStack'
        component={PastProceduresStackNavigator}
      />
      <Stack.Screen name='ShoppingStack' component={ShoppingStackNavigator} />
      <Stack.Screen
        name='AppointmentsStack'
        component={AppointmentsStackNavigator}
      />
      <Stack.Screen
        name='AccountAndFamilyStack'
        component={AccountAndFamilyStackNavigator}
      />
      <Stack.Screen
        name='PinFeatureWelcome'
        component={PinFeatureWelcomeScreen}
      />
      <Stack.Screen
        name='EditMemberProfile'
        component={EditMemberProfileScreenConnected}
      />
      <Stack.Screen name='AccountLocked' component={AccountLockedScreen} />
      <Stack.Screen
        name='AccountInformation'
        component={AccountInformationScreen}
      />
      <Stack.Screen
        name='ConfigureFilters'
        component={ConfigureFiltersScreen}
      />
      <Stack.Screen name='FindLocation' component={FindLocationScreen} />
      <Stack.Screen
        name='FavoritePharmacies'
        component={FavoritePharmaciesScreen}
      />
      <Stack.Screen name='SelectLanguage' component={SelectLanguageScreen} />
      <Stack.Screen
        name='ContactCaregiver'
        component={ContactCaregiverScreen}
      />
      <Stack.Screen name='HealthPlan' component={HealthPlanScreen} />
    </Stack.Navigator>
  );
};
