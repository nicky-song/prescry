// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { RootStackScreenName } from '../../../../stack-navigators/root/root.stack-navigator';
import { useNavigation } from '@react-navigation/native';
import { SideMenuDrawerNavigationProp } from '../../side-menu.drawer-navigator';
import { SideMenuDrawerItem } from '../side-menu.drawer-item';
import { LanguageSideMenuDrawerItem } from '../language.side-menu.drawer-item';
import { useFeaturesContext } from '../../../../../context-providers/features/use-features-context.hook';
import { useMembershipContext } from '../../../../../context-providers/membership/use-membership-context.hook';
import { getFirstRxGroupTypeByFeatureSwitch } from '../../../../../guest-experience-features';
import { getHighestPriorityProfile } from '../../../../../../../utils/profile.helper';
import { RxGroupTypesEnum } from '../../../../../../../models/member-profile/member-profile-info';
import { LineSeparator } from '../../../../../../../components/member/line-separator/line-separator';
import { ILoginPinScreenRouteProps } from '../../../../../login-pin-screen/login-pin-screen';
import { useContent } from '../../../../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../../../state/cms-content/cms-group-key';
import { ISideMenuContent } from '../../side-menu.content';
import { sideMenuDrawerItemStyles } from '../side-menu.drawer-item.styles';
import { Language } from '../../../../../../../models/language';
import { useSessionContext } from '../../../../../context-providers/session/use-session-context.hook';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { assertIsDefined } from '../../../../../../../assertions/assert-is-defined';

export type MenuIdentifierType =
  | 'SignOut'
  | 'BenefitsPlan'
  | 'ContactUs'
  | 'MemberProfile'
  | 'MedicineCabinet'
  | 'PrescriptionBenefitPlan'
  | 'FavoritePharmacies'
  | 'SelectLanguage';

export const SideMenuAuthDrawerItems = (): ReactElement => {
  const navigation = useNavigation<SideMenuDrawerNavigationProp>();

  const { featuresState: features } = useFeaturesContext();
  const { uselangselector, useDualPrice } = useFlags();

  const { membershipState: memberProfile } = useMembershipContext();
  const { sessionState } = useSessionContext();

  const { content: sideMenuContent, isContentLoading } =
    useContent<ISideMenuContent>(CmsGroupKey.sideMenu, 2);

  const getScreenRouteProps = (menuIdentifier: MenuIdentifierType): unknown => {
    switch (menuIdentifier) {
      case 'SignOut':
        return { isSignOut: true } as ILoginPinScreenRouteProps;
      default:
        return {};
    }
  };

  const onItemPress =
    (
      screenName: RootStackScreenName | 'BenefitsPlan',
      menuIdentifier: MenuIdentifierType
    ) =>
    () => {
      if (screenName === 'BenefitsPlan') {
        screenName = 'PrescriptionBenefitPlan';
        menuIdentifier = 'PrescriptionBenefitPlan';
      }

      navigation.navigate('RootStack', {
        screen: screenName,
        params: getScreenRouteProps(menuIdentifier),
      });
    };

  const rxGroupType =
    getFirstRxGroupTypeByFeatureSwitch(features) ||
    getHighestPriorityProfile(memberProfile.profileList)?.rxGroupType;

  const { membershipState } = useMembershipContext();
  const { profileList } = membershipState;

  const highestPriorityProfile = getHighestPriorityProfile(profileList);
  assertIsDefined(highestPriorityProfile);

  const profile = highestPriorityProfile.primary;

  const handleIdCardPress = () => {
    if (useDualPrice) {
      navigation.navigate('RootStack', {
        screen: 'HealthPlan',
        params: { profile },
      });
    } else {
      navigation.navigate('RootStack', { screen: 'DigitalIDCard' });
    }
  };

  const idCardDrawerItemLabel = () => {
    if (useDualPrice) {
      return sideMenuContent.viewPrescryptiveCards;
    } else {
      return sideMenuContent.idCardDrawerItemLabel;
    }
  };
  const idCardDrawerItem =
    rxGroupType === RxGroupTypesEnum.SIE ? (
      <SideMenuDrawerItem
        label={idCardDrawerItemLabel()}
        iconName='id-card'
        iconSize={18}
        onPress={handleIdCardPress}
        isSkeleton={isContentLoading}
        testID='sideMenuAuthDrawerIdCardSideMenuDrawerItem'
      />
    ) : null;

  const benefitPlanDrawerItem =
    rxGroupType === RxGroupTypesEnum.SIE ? (
      <SideMenuDrawerItem
        label={sideMenuContent.planDeductiblesLabel}
        iconName='hand-holding-medical'
        iconSize={18}
        onPress={onItemPress('BenefitsPlan', 'BenefitsPlan')}
        isSkeleton={isContentLoading}
      />
    ) : null;

  const medicineCabinetDrawerItem = (
    <SideMenuDrawerItem
      label={sideMenuContent.medicineCabinetDrawerItemLabel}
      iconName='prescription-bottle-alt'
      iconSize={18}
      onPress={onItemPress('MedicineCabinet', 'MedicineCabinet')}
      isSkeleton={isContentLoading}
    />
  );

  const favoritePharmaciesDrawerItem = memberProfile.account.favoritedPharmacies
    .length ? (
    <SideMenuDrawerItem
      label={sideMenuContent.favoritePharmaciesDrawerItemLabel}
      iconName='heart'
      iconSize={18}
      onPress={onItemPress('FavoritePharmacies', 'FavoritePharmacies')}
      isSkeleton={isContentLoading}
      testID='sideMenuAuthDrawerFavoritePharmaciesSideMenuDrawerItem'
    />
  ) : null;

  const languageName: Language = sessionState.currentLanguage;

  return (
    <>
      {idCardDrawerItem}
      {medicineCabinetDrawerItem}
      {benefitPlanDrawerItem}
      <SideMenuDrawerItem
        label={sideMenuContent.profileDrawerItemLabel}
        iconName='user'
        iconSize={17}
        onPress={onItemPress('MemberListInfo', 'MemberProfile')}
        isSkeleton={isContentLoading}
      />
      {favoritePharmaciesDrawerItem}
      <SideMenuDrawerItem
        label={sideMenuContent.supportDrawerItemLabel}
        iconName='headphones'
        iconSize={18}
        onPress={onItemPress('Support', 'ContactUs')}
        isSkeleton={isContentLoading}
      />
      <LineSeparator
        viewStyle={sideMenuDrawerItemStyles.lineSeparatorViewStyle}
      />
      {uselangselector ? (
        <LanguageSideMenuDrawerItem
          label={sideMenuContent.languageDrawerItemLabel}
          languageName={languageName}
          onPress={onItemPress('SelectLanguage', 'SelectLanguage')}
          isSkeleton={isContentLoading}
          testID='sideMenuAuthDrawerLanguageSideMenuDrawerItem'
        />
      ) : null}
      <SideMenuDrawerItem
        label={sideMenuContent.signOutDrawerItemLabel}
        iconName='sign-out'
        iconSize={18}
        onPress={onItemPress('LoginPin', 'SignOut')}
        isSkeleton={isContentLoading}
        testID='sideMenuAuthDrawerItemsSideMenuDrawerItemSignOut'
      />
    </>
  );
};
