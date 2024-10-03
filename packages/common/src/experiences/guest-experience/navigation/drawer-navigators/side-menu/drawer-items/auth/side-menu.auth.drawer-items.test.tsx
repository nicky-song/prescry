// Copyright 2022 Prescryptive Health, Inc.

import { useNavigation } from '@react-navigation/native';
import React, { ElementType } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { LineSeparator } from '../../../../../../../components/member/line-separator/line-separator';
import {
  IPrimaryProfile,
  IProfile,
  RxGroupTypesEnum,
} from '../../../../../../../models/member-profile/member-profile-info';
import { getHighestPriorityProfile } from '../../../../../../../utils/profile.helper';
import { IFeaturesContext } from '../../../../../context-providers/features/features.context';
import { useFeaturesContext } from '../../../../../context-providers/features/use-features-context.hook';
import { IMembershipContext } from '../../../../../context-providers/membership/membership.context';
import { useMembershipContext } from '../../../../../context-providers/membership/use-membership-context.hook';
import { useContent } from '../../../../../context-providers/session/ui-content-hooks/use-content';
import { GuestExperienceFeatures } from '../../../../../guest-experience-features';
import {
  defaultMembershipState,
  IMembershipState,
} from '../../../../../state/membership/membership.state';
import { shoppingStackNavigationMock } from '../../../../stack-navigators/shopping/__mocks__/shopping.stack-navigation.mock';
import { sideMenuDrawerNavigationMock } from '../../__mocks__/side-menu.drawer-navigation.mock';
import { SideMenuDrawerItem } from '../side-menu.drawer-item';
import { LanguageSideMenuDrawerItem } from '../language.side-menu.drawer-item';
import { sideMenuDrawerItemStyles } from '../side-menu.drawer-item.styles';
import { SideMenuAuthDrawerItems } from './side-menu.auth.drawer-items';
import { useSessionContext } from '../../../../../context-providers/session/use-session-context.hook';
import { defaultSessionState } from '../../../../../state/session/session.state';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { profileListMock } from '../../../../../__mocks__/profile-list.mock';

jest.mock(
  '../../../../../context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

jest.mock('../side-menu.drawer-item', () => ({
  SideMenuDrawerItem: () => <div />,
}));

jest.mock('../language.side-menu.drawer-item', () => ({
  LanguageSideMenuDrawerItem: () => <div />,
}));

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock(
  '../../../../../context-providers/features/use-features-context.hook'
);
const useFeaturesContextMock = useFeaturesContext as jest.Mock;

jest.mock(
  '../../../../../context-providers/membership/use-membership-context.hook'
);
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock('../../../../../../../utils/profile.helper');
const getHighestPriorityProfileMock = getHighestPriorityProfile as jest.Mock;

jest.mock('../../../../../context-providers/session/use-session-context.hook');
const useSessionContextMock = useSessionContext as jest.Mock;

jest.mock('launchdarkly-react-client-sdk');
const useFlagsMock = useFlags as jest.Mock;

describe('SideMenuAuthDrawerItems', () => {
  const favoritePharmaciesDrawerItemLabelMock =
    'favorite-pharmacies-drawer-item-label-mock';
  const idCardDrawerItemLabelMock = 'id-card-drawer-item-label-mock';
  const benefitPlanDrawerItemLabelMock = 'benefit-plan-drawer-item-label-mock';
  const profileDrawerItemLabelMock = 'profile-drawer-item-label-mock';
  const supportDrawerItemLabelMock = 'support-drawer-item-label-mock';
  const signOutDrawerItemLabelMock = 'sign-out-drawer-item-label-mock';
  const medicineCabinetDrawerItemLabelMock =
    'medicine-cabinet-drawer-item-label-mock';
  const planDeductiblesLabelMock = 'plan-deductibles-label-mock';
  const languageDrawerItemLabelMock = 'language-drawer-item-label-mock';
  const viewPrescryptiveCardsMock = 'view-prescryptive-cards-mock';
  const primaryMemberMock: IPrimaryProfile = {
    firstName: 'first',
    lastName: 'last',
    dateOfBirth: '',
    identifier: '',
    phoneNumber: '',
    carrierPCN: 'carrierPCN',
    issuerNumber: 'issuerNumber',
    primaryMemberFamilyId: 'primaryMemberFamilyId',
    primaryMemberPersonCode: 'primaryMemberPersonCode',
    primaryMemberRxId: 'primaryMemberRxId',
    rxBin: 'rxBin',
    rxGroup: 'rxGroup',
    rxGroupType: RxGroupTypesEnum.SIE,
    rxSubGroup: '',
  };

  const membershipStateMock: IMembershipState = {
    ...defaultMembershipState,
    account: { phoneNumber: '', favoritedPharmacies: ['ncpdp-mock-1'] },
    profileList: [
      {
        primary: primaryMemberMock,
        rxGroupType: 'rx-group-type',
      },
    ],
  };
  membershipStateMock.account.languageCode = 'en';

  const membershipContextMock: Partial<IMembershipContext> = {
    membershipState: membershipStateMock,
  };
  beforeEach(() => {
    jest.clearAllMocks();

    useNavigationMock.mockReturnValue(sideMenuDrawerNavigationMock);
    const featuresContextMock: IFeaturesContext = {
      featuresState: GuestExperienceFeatures,
    };
    useFeaturesContextMock.mockReturnValue(featuresContextMock);

    useMembershipContextMock.mockReturnValue(membershipContextMock);

    useContentMock.mockReturnValue({
      content: {
        favoritePharmaciesDrawerItemLabel:
          favoritePharmaciesDrawerItemLabelMock,
        idCardDrawerItemLabel: idCardDrawerItemLabelMock,
        benefitPlanDrawerItemLabel: benefitPlanDrawerItemLabelMock,
        profileDrawerItemLabel: profileDrawerItemLabelMock,
        supportDrawerItemLabel: supportDrawerItemLabelMock,
        signOutDrawerItemLabel: signOutDrawerItemLabelMock,
        medicineCabinetDrawerItemLabel: medicineCabinetDrawerItemLabelMock,
        planDeductiblesLabel: planDeductiblesLabelMock,
        languageDrawerItemLabel: languageDrawerItemLabelMock,
        viewPrescryptiveCards: viewPrescryptiveCardsMock,
      },
      isContentLoading: false,
    });

    useSessionContextMock.mockReturnValue({
      sessionState: defaultSessionState,
    });
    useFlagsMock.mockReturnValue({
      uselangselector: false,
      useDualPrice: false,
    });
  });

  interface IExpectedDrawerItem {
    componentType: ElementType;
    label?: string;
  }

  it.each([
    [
      [
        {
          componentType: SideMenuDrawerItem,
          label: medicineCabinetDrawerItemLabelMock,
        },
        {
          componentType: SideMenuDrawerItem,
          label: profileDrawerItemLabelMock,
        },
        {
          componentType: SideMenuDrawerItem,
          label: favoritePharmaciesDrawerItemLabelMock,
        },
        {
          componentType: SideMenuDrawerItem,
          label: supportDrawerItemLabelMock,
        },
        { componentType: LineSeparator },
        {
          componentType: LanguageSideMenuDrawerItem,
          label: languageDrawerItemLabelMock,
        },
        {
          componentType: SideMenuDrawerItem,
          label: signOutDrawerItemLabelMock,
        },
      ],
      RxGroupTypesEnum.CASH,
      true,
    ],
    [
      [
        {
          componentType: SideMenuDrawerItem,
          label: idCardDrawerItemLabelMock,
        },
        {
          componentType: SideMenuDrawerItem,
          label: medicineCabinetDrawerItemLabelMock,
        },
        {
          componentType: SideMenuDrawerItem,
          label: planDeductiblesLabelMock,
        },
        {
          componentType: SideMenuDrawerItem,
          label: profileDrawerItemLabelMock,
        },
        {
          componentType: SideMenuDrawerItem,
          label: favoritePharmaciesDrawerItemLabelMock,
        },
        {
          componentType: SideMenuDrawerItem,
          label: supportDrawerItemLabelMock,
        },
        { componentType: LineSeparator },
        {
          componentType: LanguageSideMenuDrawerItem,
          label: languageDrawerItemLabelMock,
        },
        {
          componentType: SideMenuDrawerItem,
          label: signOutDrawerItemLabelMock,
        },
      ],
      RxGroupTypesEnum.SIE,
      true,
    ],
  ])(
    'renders drawer items ',
    (
      expectedChildren: IExpectedDrawerItem[],
      rxGroupTypeMock: string,
      uselangselectorMock = false
    ) => {
      getHighestPriorityProfileMock.mockReturnValue({
        rxGroupType: rxGroupTypeMock,
      } as IProfile);

      useFlagsMock.mockReturnValue({ uselangselector: uselangselectorMock });

      const membershipContextMock: Partial<IMembershipContext> = {
        membershipState: {
          ...defaultMembershipState,
          account: {
            ...defaultMembershipState.account,
            favoritedPharmacies: ['ncpdp-mock'],
          },
        },
      };

      useMembershipContextMock.mockReturnValue(membershipContextMock);

      const testRenderer = renderer.create(<SideMenuAuthDrawerItems />);
      expect(getHighestPriorityProfileMock).toHaveBeenCalledWith(
        membershipContextMock.membershipState?.profileList
      );
      expect(testRenderer.root.children.length).toEqual(
        expectedChildren.length
      );

      expectedChildren.forEach((expectedDrawerItem, index) => {
        const component = testRenderer.root.children[
          index
        ] as ReactTestInstance;
        expect(component.type).toEqual(expectedDrawerItem.componentType);
        expect(component.props.label).toEqual(expectedDrawerItem.label);
      });
    }
  );

  it('renders "Id card" item', () => {
    useNavigationMock.mockReturnValue(shoppingStackNavigationMock);
    getHighestPriorityProfileMock.mockReturnValue({
      rxGroupType: RxGroupTypesEnum.SIE,
    } as IProfile);

    const testRenderer = renderer.create(<SideMenuAuthDrawerItems />);

    const item = testRenderer.root.findByProps({
      label: idCardDrawerItemLabelMock,
    });

    expect(item.type).toEqual(SideMenuDrawerItem);
    expect(item.props.iconName).toEqual('id-card');
    expect(item.props.iconSize).toEqual(18);
    expect(item.props.onPress).toEqual(expect.any(Function));
    expect(item.props.testID).toEqual(
      'sideMenuAuthDrawerIdCardSideMenuDrawerItem'
    );

    expect(getHighestPriorityProfileMock).toHaveBeenCalledWith(
      membershipContextMock.membershipState?.profileList
    );

    item.props.onPress();
    expect(shoppingStackNavigationMock.navigate).toBeCalledWith('RootStack', {
      screen: 'DigitalIDCard',
    });

    expect(item.props.isSkeleton).toEqual(false);
  });

  it('navigates to HealthPlanScreen when useDualPrice', () => {
    useFlagsMock.mockReturnValue({ useDualPrice: true });
    useNavigationMock.mockReturnValue(shoppingStackNavigationMock);
    getHighestPriorityProfileMock.mockReturnValue({
      rxGroupType: RxGroupTypesEnum.SIE,
    } as IProfile);

    const testRenderer = renderer.create(<SideMenuAuthDrawerItems />);

    const item = testRenderer.root.children[0] as ReactTestInstance;

    expect(item.type).toEqual(SideMenuDrawerItem);

    expect(item.props.onPress).toEqual(expect.any(Function));

    item.props.onPress();

    const highestPriorityProfile = getHighestPriorityProfile(profileListMock);

    const profileMock = highestPriorityProfile?.primary;

    expect(shoppingStackNavigationMock.navigate).toBeCalledWith('RootStack', {
      screen: 'HealthPlan',
      params: { profile: profileMock },
    });
  });

  it('renders "Plan deductibles" item', () => {
    const featuresContextMock: IFeaturesContext = {
      featuresState: {
        ...GuestExperienceFeatures,
        usegrouptypesie: true,
      },
    };
    useFeaturesContextMock.mockReturnValue(featuresContextMock);

    const testRenderer = renderer.create(<SideMenuAuthDrawerItems />);

    const item = testRenderer.root.findByProps({
      label: planDeductiblesLabelMock,
    });

    expect(item.type).toEqual(SideMenuDrawerItem);
    expect(item.props.iconName).toEqual('hand-holding-medical');
    expect(item.props.iconSize).toEqual(18);
    expect(item.props.onPress).toEqual(expect.any(Function));
    expect(item.props.isSkeleton).toEqual(false);
  });

  it('handles "Benefits plan" item press', () => {
    const featuresContextMock: IFeaturesContext = {
      featuresState: {
        ...GuestExperienceFeatures,
      },
    };
    getHighestPriorityProfileMock.mockReturnValue({
      rxGroupType: RxGroupTypesEnum.SIE,
    } as IProfile);

    useFeaturesContextMock.mockReturnValue(featuresContextMock);

    const testRenderer = renderer.create(<SideMenuAuthDrawerItems />);

    const item = testRenderer.root.findByProps({
      label: planDeductiblesLabelMock,
    });
    item.props.onPress();

    expect(getHighestPriorityProfileMock).toHaveBeenCalledWith(
      membershipContextMock.membershipState?.profileList
    );

    expect(sideMenuDrawerNavigationMock.navigate).toHaveBeenCalledWith(
      'RootStack',
      {
        screen: 'PrescriptionBenefitPlan',
        params: {},
      }
    );
  });

  it('renders "Profile" item', () => {
    const testRenderer = renderer.create(<SideMenuAuthDrawerItems />);

    const item = testRenderer.root.findByProps({
      label: profileDrawerItemLabelMock,
    });

    expect(item.type).toEqual(SideMenuDrawerItem);
    expect(item.props.iconName).toEqual('user');
    expect(item.props.iconSize).toEqual(17);
    expect(item.props.onPress).toEqual(expect.any(Function));
    expect(item.props.isSkeleton).toEqual(false);
  });

  it('handles "Profile" item press', () => {
    const testRenderer = renderer.create(<SideMenuAuthDrawerItems />);

    const item = testRenderer.root.findByProps({
      label: profileDrawerItemLabelMock,
    });

    item.props.onPress();

    expect(sideMenuDrawerNavigationMock.navigate).toHaveBeenCalledWith(
      'RootStack',
      {
        screen: 'MemberListInfo',
        params: {},
      }
    );
  });

  it('renders "Favorite Pharmacies" item', () => {
    const testRenderer = renderer.create(<SideMenuAuthDrawerItems />);

    const item = testRenderer.root.findByProps({
      label: favoritePharmaciesDrawerItemLabelMock,
    });

    expect(item.type).toEqual(SideMenuDrawerItem);
    expect(item.props.iconName).toEqual('heart');
    expect(item.props.iconSize).toEqual(18);
    expect(item.props.onPress).toEqual(expect.any(Function));
    expect(item.props.isSkeleton).toEqual(false);
    expect(item.props.testID).toEqual(
      'sideMenuAuthDrawerFavoritePharmaciesSideMenuDrawerItem'
    );
  });

  it('renders "Contact us" item', () => {
    const testRenderer = renderer.create(<SideMenuAuthDrawerItems />);

    const item = testRenderer.root.findByProps({
      label: supportDrawerItemLabelMock,
    });

    expect(item.type).toEqual(SideMenuDrawerItem);
    expect(item.props.iconName).toEqual('headphones');
    expect(item.props.iconSize).toEqual(18);
    expect(item.props.onPress).toEqual(expect.any(Function));
    expect(item.props.isSkeleton).toEqual(false);
  });

  it('handles "Contact us" item press', () => {
    useNavigationMock.mockReturnValue(sideMenuDrawerNavigationMock);

    const testRenderer = renderer.create(<SideMenuAuthDrawerItems />);

    const item = testRenderer.root.findByProps({
      label: supportDrawerItemLabelMock,
    });
    item.props.onPress();

    expect(sideMenuDrawerNavigationMock.navigate).toHaveBeenCalledWith(
      'RootStack',
      {
        screen: 'Support',
        params: {},
      }
    );
  });

  it('renders line separator', () => {
    const testRenderer = renderer.create(<SideMenuAuthDrawerItems />);

    const separator = testRenderer.root.findByType(LineSeparator);

    expect(separator.props.viewStyle).toEqual(
      sideMenuDrawerItemStyles.lineSeparatorViewStyle
    );
  });

  it('renders "Sign out" item', () => {
    const testRenderer = renderer.create(<SideMenuAuthDrawerItems />);

    const item = testRenderer.root.findByProps({
      label: signOutDrawerItemLabelMock,
    });

    expect(item.type).toEqual(SideMenuDrawerItem);
    expect(item.props.iconName).toEqual('sign-out');
    expect(item.props.iconSize).toEqual(18);
    expect(item.props.onPress).toEqual(expect.any(Function));
    expect(item.props.isSkeleton).toEqual(false);
    expect(item.props.testID).toEqual(
      'sideMenuAuthDrawerItemsSideMenuDrawerItemSignOut'
    );
  });

  it('handles "Sign out" item press', () => {
    const testRenderer = renderer.create(<SideMenuAuthDrawerItems />);

    const item = testRenderer.root.findByProps({
      label: signOutDrawerItemLabelMock,
    });
    item.props.onPress();

    expect(sideMenuDrawerNavigationMock.navigate).toHaveBeenCalledWith(
      'RootStack',
      {
        screen: 'LoginPin',
        params: { isSignOut: true },
      }
    );
  });

  it('renders "Medicine cabinet" item', () => {
    const featuresContextMock: IFeaturesContext = {
      featuresState: { ...GuestExperienceFeatures },
    };
    useFeaturesContextMock.mockReturnValue(featuresContextMock);

    const testRenderer = renderer.create(<SideMenuAuthDrawerItems />);

    const item = testRenderer.root.findByProps({
      label: medicineCabinetDrawerItemLabelMock,
    });

    expect(item.type).toEqual(SideMenuDrawerItem);
    expect(item.props.iconName).toEqual('prescription-bottle-alt');
    expect(item.props.iconSize).toEqual(18);
    expect(item.props.onPress).toEqual(expect.any(Function));
    expect(item.props.isSkeleton).toEqual(false);
  });

  it('handles "Medicine cabinet" item press', () => {
    const featuresContextMock: IFeaturesContext = {
      featuresState: GuestExperienceFeatures,
    };
    useFeaturesContextMock.mockReturnValue(featuresContextMock);

    const testRenderer = renderer.create(<SideMenuAuthDrawerItems />);

    const item = testRenderer.root.findByProps({
      label: medicineCabinetDrawerItemLabelMock,
    });
    item.props.onPress();

    expect(sideMenuDrawerNavigationMock.navigate).toHaveBeenCalledWith(
      'RootStack',
      {
        screen: 'MedicineCabinet',
        params: {},
      }
    );
  });

  it('renders "Language" item', () => {
    useFlagsMock.mockReset();
    useFlagsMock.mockReturnValue({
      uselangselector: true,
    });

    const languageMock = 'Spanish';
    useSessionContextMock.mockReset();
    useSessionContextMock.mockReturnValue({
      sessionState: { ...defaultSessionState, currentLanguage: languageMock },
    });

    const testRenderer = renderer.create(<SideMenuAuthDrawerItems />);

    const item = testRenderer.root.findByProps({
      label: languageDrawerItemLabelMock,
    });

    expect(item.type).toEqual(LanguageSideMenuDrawerItem);
    expect(item.props.languageName).toEqual(languageMock);
    expect(item.props.onPress).toEqual(expect.any(Function));
    expect(item.props.isSkeleton).toEqual(false);
    expect(item.props.testID).toEqual(
      'sideMenuAuthDrawerLanguageSideMenuDrawerItem'
    );
  });

  it('handles "Language" item press', () => {
    useFlagsMock.mockReset();
    useFlagsMock.mockReturnValue({
      uselangselector: true,
    });

    const testRenderer = renderer.create(<SideMenuAuthDrawerItems />);

    const item = testRenderer.root.findByProps({
      label: languageDrawerItemLabelMock,
    });
    item.props.onPress();

    expect(sideMenuDrawerNavigationMock.navigate).toHaveBeenCalledWith(
      'RootStack',
      {
        screen: 'SelectLanguage',
        params: {},
      }
    );
  });
});
