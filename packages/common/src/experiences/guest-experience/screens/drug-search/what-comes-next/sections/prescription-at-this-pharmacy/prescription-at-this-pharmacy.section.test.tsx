// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { LinkButton } from '../../../../../../../components/buttons/link/link.button';
import { Heading } from '../../../../../../../components/member/heading/heading';
import { BaseText } from '../../../../../../../components/text/base-text/base-text';
import { useMembershipContext } from '../../../../../context-providers/membership/use-membership-context.hook';
import { useSessionContext } from '../../../../../context-providers/session/use-session-context.hook';
import { profileListMock } from '../../../../../__mocks__/profile-list.mock';
import { PrescriptionAtThisPharmacySection } from './prescription-at-this-pharmacy.section';
import { prescriptionAtThisPharmacySectionStyles } from './prescription-at-this-pharmacy.section.styles';
import { SectionView } from '../../../../../../../components/primitives/section-view';
import {
  cmsContentWithWhatComesNextMock,
  whatComesNextCMSContentMock,
} from '../../__mocks__/what-comes-next-cms-content.mock';
import { defaultSessionState } from '../../../../../state/session/session.state';
import { ISessionContext } from '../../../../../context-providers/session/session.context';
import { useReduxContext } from '../../../../../context-providers/redux/use-redux-context.hook';
import { CmsGroupKey } from '../../../../../state/cms-content/cms-group-key';
import { IUIContentGroup } from '../../../../../../../models/ui-content';
import { IReduxContext } from '../../../../../context-providers/redux/redux.context';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { RxIdCard } from '../../../../../../../components/cards/rx-id-card/rx-id-card';
import { RxGroupTypesEnum } from '../../../../../../../models/member-profile/member-profile-info';
import { RxCardType } from '../../../../../../../models/rx-id-card';
import { PricingOption } from '../../../../../../../models/pricing-option';

jest.mock('launchdarkly-react-client-sdk');
const useFlagsMock = useFlags as jest.Mock;

jest.mock(
  '../../../../../../../components/cards/rx-id-card/rx-id-card',
  () => ({
    RxIdCard: () => <div />,
  })
);

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));

jest.mock('../../../../../../../components/text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock('../../../../../../../components/primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

jest.mock('../../../../../context-providers/session/use-session-context.hook');
const useSessionContextMock = useSessionContext as jest.Mock;

jest.mock('../../../../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock(
  '../../../../../context-providers/membership/use-membership-context.hook'
);
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock('../../../../../../../utils/cms-content.helper');

const cmsContentMapMock: Map<string, IUIContentGroup> = new Map([
  [
    CmsGroupKey.smartPriceScreen,
    {
      content: [
        {
          fieldKey: 'smart-price-card-header',
          language: 'English',
          type: 'text',
          value: 'smart-price-card-header-value-mock',
        },
      ],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
]);

const cashUserProfile = profileListMock[0];
const sieUserProfile = profileListMock[1];

const reduxDispatchMock = jest.fn();
const reduxGetStateMock = jest.fn();
const sessionDispatchMock = jest.fn();

describe('PrescriptionAtThisPharmacySection', () => {
  beforeEach(() => {
    const reduxContextMock: IReduxContext = {
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    const sessionContextMock: ISessionContext = {
      sessionDispatch: sessionDispatchMock,
      sessionState: {
        ...defaultSessionState,
        uiCMSContentMap: cmsContentMapMock,
      },
    };

    useSessionContextMock.mockReturnValue(sessionContextMock);
    useMembershipContextMock.mockReturnValue({
      membershipState: { profileList: [] },
    });
    useFlagsMock.mockReturnValue({ useDualPrice: false });
  });
  it('renders in section', () => {
    const testRenderer = renderer.create(
      <PrescriptionAtThisPharmacySection onSignUpPress={jest.fn()} />
    );

    const section = testRenderer.root.children[0] as ReactTestInstance;

    expect(section.type).toEqual(SectionView);
    expect(section.props.children.length).toEqual(3);
  });

  it('renders heading', () => {
    useSessionContextMock.mockReturnValue({
      sessionState: {
        isUnauthExperience: true,
        uiCMSContentMap: cmsContentWithWhatComesNextMock,
      },
    });

    const testRenderer = renderer.create(
      <PrescriptionAtThisPharmacySection onSignUpPress={jest.fn()} />
    );

    const section = testRenderer.root.findByType(SectionView);
    const heading = section.props.children[0];

    expect(heading.type).toEqual(Heading);
    expect(heading.props.level).toEqual(3);
    expect(heading.props.textStyle).toEqual(
      prescriptionAtThisPharmacySectionStyles.headingTextStyle
    );
    expect(heading.props.children).toEqual(
      whatComesNextCMSContentMock.prescriptionAtThisPharmacyHeadingText
    );
  });

  it('renders instructions for unauth/auth user', () => {
    useSessionContextMock.mockReturnValue({
      sessionState: {
        isUnauthExperience: true,
        uiCMSContentMap: cmsContentWithWhatComesNextMock,
      },
    });

    const testRenderer = renderer.create(
      <PrescriptionAtThisPharmacySection onSignUpPress={jest.fn()} />
    );

    const section = testRenderer.root.findByType(SectionView);
    const instructions = section.props.children[1];

    expect(instructions.type).toEqual(BaseText);
    expect(instructions.props.children).toEqual(
      whatComesNextCMSContentMock.prescriptionAtThisPharmacyInstructionsText
    );
  });

  it('renders discount text for CASH users', () => {
    useSessionContextMock.mockReturnValue({
      sessionState: {
        isUnauthExperience: true,
        uiCMSContentMap: cmsContentWithWhatComesNextMock,
      },
    });

    const onSignUpPressMock = jest.fn();

    useMembershipContextMock.mockReturnValue({
      membershipState: { profileList: [cashUserProfile] },
    });

    const testRenderer = renderer.create(
      <PrescriptionAtThisPharmacySection onSignUpPress={onSignUpPressMock} />
    );

    const section = testRenderer.root.findByType(SectionView);
    const idCardContainer = section.props.children[2];
    const discountText = idCardContainer.props.children[1];
    expect(discountText.type).toEqual(BaseText);
    expect(discountText.props.style).toEqual(
      prescriptionAtThisPharmacySectionStyles.informationTextStyle
    );
    expect(discountText.props.children).toEqual(
      whatComesNextCMSContentMock.prescriptionAtThisPharmacyUnAuthInformationText
    );
  });

  it('renders "Sign up for more savings" link button for unauth user', () => {
    useSessionContextMock.mockReturnValue({
      sessionState: {
        isUnauthExperience: true,
        uiCMSContentMap: cmsContentWithWhatComesNextMock,
      },
    });

    const onSignUpPressMock = jest.fn();
    const testRenderer = renderer.create(
      <PrescriptionAtThisPharmacySection onSignUpPress={onSignUpPressMock} />
    );

    const section = testRenderer.root.findByType(SectionView);
    const idCardContainer = section.props.children[2];
    const signUpLink = idCardContainer.props.children[2];
    expect(signUpLink.type).toEqual(LinkButton);
    expect(signUpLink.props.onPress).toEqual(onSignUpPressMock);
    expect(signUpLink.props.linkText).toEqual(
      whatComesNextCMSContentMock.prescriptionAtThisPharmacySignUpText
    );
    expect(signUpLink.props.testID).toEqual(
      'prescriptionAtThisPharmacySectionSignUpButton'
    );
  });

  it.each([
    [RxGroupTypesEnum.SIE, 'pbm' as RxCardType],
    [RxGroupTypesEnum.CASH, 'smartPrice' as RxCardType],
  ])(
    `renders correct Rx Id card type for authenticated user (rxGroupTypesEnumMock: %p)`,
    (
      rxGroupTypesEnumMock: RxGroupTypesEnum,
      expectedRxCardType: RxCardType
    ) => {
      const modifiedUserProfileMock =
        rxGroupTypesEnumMock === RxGroupTypesEnum.CASH
          ? cashUserProfile
          : sieUserProfile;
      useSessionContextMock.mockReturnValue({
        sessionState: {
          isUnauthExperience: false,
          uiCMSContentMap: cmsContentWithWhatComesNextMock,
        },
      });
      useMembershipContextMock.mockReturnValue({
        membershipState: {
          profileList: [modifiedUserProfileMock],
        },
      });
      const testRenderer = renderer.create(
        <PrescriptionAtThisPharmacySection onSignUpPress={jest.fn()} />
      );

      const section = testRenderer.root.findByType(SectionView);
      const idCardContainer = section.props.children[2];

      const idCard = idCardContainer.props.children[0];
      expect(idCard.type).toEqual(RxIdCard);
      expect(idCard.props.viewStyle).toEqual(
        prescriptionAtThisPharmacySectionStyles.smartPriceCardViewStyle
      );
      expect(idCard.props.profile).toEqual(modifiedUserProfileMock.primary);
      expect(idCard.props.rxCardType).toEqual(expectedRxCardType);
    }
  );

  it.each([
    ['smartPrice' as PricingOption, false, true],
    ['pbm' as PricingOption, false, true],
    ['thirdParty' as PricingOption, false, true],
    [undefined, false, true],
    ['smartPrice' as PricingOption, true, true],
    ['pbm' as PricingOption, true, true],
    ['thirdParty' as PricingOption, true, false],
    [undefined, true, true],
  ])(
    `renders Rx Id card type for authenticated user if pricingOpiton and useDualPrice are set appropriately (pricingOptionMock: %p; useDualPriceMock: %p)`,
    (
      pricingOptionMock: PricingOption | undefined,
      useDualPriceMock: boolean,
      displayRxIdCard: boolean
    ) => {
      useSessionContextMock.mockReturnValue({
        sessionState: {
          isUnauthExperience: false,
          uiCMSContentMap: cmsContentWithWhatComesNextMock,
        },
      });
      useMembershipContextMock.mockReturnValue({
        membershipState: {
          profileList: [cashUserProfile],
        },
      });
      useFlagsMock.mockReturnValue({ useDualPrice: useDualPriceMock });
      const testRenderer = renderer.create(
        <PrescriptionAtThisPharmacySection
          onSignUpPress={jest.fn()}
          pricingOption={pricingOptionMock}
        />
      );

      const section = testRenderer.root.findByType(SectionView);
      const idCardContainer = section.props.children[2];

      const idCard = idCardContainer.props.children[0];
      if (displayRxIdCard) {
        expect(idCard).toBeDefined();
      } else {
        expect(idCard).toBeNull();
      }
    }
  );

  it('doesnt render discount text/sign up button for PBM users', () => {
    const onSignUpPressMock = jest.fn();

    useSessionContextMock.mockReturnValue({
      sessionState: {
        isUnauthExperience: false,
        uiCMSContentMap: cmsContentWithWhatComesNextMock,
      },
    });

    useMembershipContextMock.mockReturnValue({
      membershipState: { profileList: [sieUserProfile] },
    });

    const testRenderer = renderer.create(
      <PrescriptionAtThisPharmacySection onSignUpPress={onSignUpPressMock} />
    );

    const section = testRenderer.root.findByType(SectionView);
    const idCardContainer = section.props.children[2];

    const idCard = idCardContainer.props.children[0];
    expect(idCard.type).toEqual(RxIdCard);
    const discountText = idCardContainer.props.children[1];
    expect(discountText).toBeNull();
  });

  it('renders RxIdCard for unauth users ', () => {
    useSessionContextMock.mockReturnValue({
      sessionState: {
        isUnauthExperience: true,
        uiCMSContentMap: cmsContentWithWhatComesNextMock,
      },
    });

    const onSignUpPressMock = jest.fn();
    const testRenderer = renderer.create(
      <PrescriptionAtThisPharmacySection onSignUpPress={onSignUpPressMock} />
    );

    const section = testRenderer.root.findByType(SectionView);
    const idCardContainer = section.props.children[2];

    const idCard = idCardContainer.props.children[0];
    expect(idCard.type).toEqual(RxIdCard);
    expect(idCard.props.rxCardType).toEqual('smartPrice');
    expect(idCard.props.viewStyle).toEqual(
      prescriptionAtThisPharmacySectionStyles.rxIdCardViewStyle
    );
  });

  it('renders skeletons when isSkeleton is true', () => {
    useSessionContextMock.mockReturnValue({
      sessionState: {
        isUnauthExperience: true,
        uiCMSContentMap: cmsContentWithWhatComesNextMock,
      },
    });

    const testRenderer = renderer.create(
      <PrescriptionAtThisPharmacySection onSignUpPress={jest.fn()} />
    );

    const skeletons = testRenderer.root.findAllByProps({ isSkeleton: true });

    expect(skeletons.length).toEqual(5);
  });
});
