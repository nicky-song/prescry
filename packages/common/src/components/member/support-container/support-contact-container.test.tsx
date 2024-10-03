// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { SupportContactContainer } from './support-contact-container';
import { supportContactContainerContent } from './support-contact-container.content';
import { InlineLink } from '../links/inline/inline.link';
import { ITestContainer } from '../../../testing/test.container';
import { getChildren } from '../../../testing/test.helper';
import { BaseText } from '../../text/base-text/base-text';
import { supportContactContainerStyles } from './support-contact-container.style';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { useConfigContext } from '../../../experiences/guest-experience/context-providers/config/use-config-context.hook';
import { IConfigContext } from '../../../experiences/guest-experience/context-providers/config/config.context';
import { GuestExperienceConfig } from '../../../experiences/guest-experience/guest-experience-config';
import { useMembershipContext } from '../../../experiences/guest-experience/context-providers/membership/use-membership-context.hook';
import { IMembershipContext } from '../../../experiences/guest-experience/context-providers/membership/membership.context';
import {
  defaultMembershipState,
  IMembershipState,
} from '../../../experiences/guest-experience/state/membership/membership.state';
import { IFeaturesContext } from '../../../experiences/guest-experience/context-providers/features/features.context';
import { GuestExperienceFeatures } from '../../../experiences/guest-experience/guest-experience-features';
import { useFeaturesContext } from '../../../experiences/guest-experience/context-providers/features/use-features-context.hook';
import { ContactInfoPanel } from '../panels/contact-info/contact-info.panel';
import {
  IPrimaryProfile,
  RxGroupTypesEnum,
} from '../../../models/member-profile/member-profile-info';
import { isPbmMember } from '../../../utils/profile.helper';
import { goToUrl } from '../../../utils/link.helper';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { ICommunicationContent } from '../../../models/cms-content/communication.content';
import { useTalkativeWidget } from '../../../hooks/use-talkative-widget/use-talkative-widget';

jest.mock(
  '../../../experiences/guest-experience/context-providers/config/use-config-context.hook'
);
const useConfigContextMock = useConfigContext as jest.Mock;

jest.mock(
  '../../../experiences/guest-experience/context-providers/membership/use-membership-context.hook'
);
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock(
  '../../../experiences/guest-experience/context-providers/features/use-features-context.hook'
);
const useFeaturesContextMock = useFeaturesContext as jest.Mock;

jest.mock('../../../utils/link.helper');
const goToUrlMock = goToUrl as jest.Mock;

jest.mock('../panels/contact-info/contact-info.panel', () => ({
  ContactInfoPanel: () => <div />,
}));

jest.mock('../links/inline/inline.link', () => ({
  InlineLink: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock('../../../utils/profile.helper');
const isPbmMemberMock = isPbmMember as jest.Mock;

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

jest.mock('../../../hooks/use-talkative-widget/use-talkative-widget');
const useTalkativeWidgetMock = useTalkativeWidget as jest.Mock;

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

const uiContentMock: Partial<ICommunicationContent> = {
  supportPBMPhone: 'support-pbm-phone',
};

describe('SupportContactContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const configContextMock: IConfigContext = {
      configState: GuestExperienceConfig,
    };
    useConfigContextMock.mockReturnValue(configContextMock);

    const membershipContextMock: Partial<IMembershipContext> = {
      membershipState: defaultMembershipState,
    };
    useMembershipContextMock.mockReturnValue(membershipContextMock);

    const featuresContextMock: IFeaturesContext = {
      featuresState: GuestExperienceFeatures,
    };
    useFeaturesContextMock.mockReturnValue(featuresContextMock);

    useContentMock.mockReturnValue({
      content: uiContentMock,
      isContentLoading: false,
    });
  });

  it('renders in View container', () => {
    const testRenderer = renderer.create(<SupportContactContainer />);

    const container = testRenderer.root.children[0] as ReactTestInstance;

    expect(container.type).toEqual(View);
    expect(container.props.testID).toEqual('SupportContactContainer');
    expect(getChildren(container).length).toEqual(2);
  });

  it.each([
    [
      true,
      GuestExperienceConfig.memberSupportEmail,
      uiContentMock.supportPBMPhone,
      false,
    ],
    [false, GuestExperienceConfig.supportEmail, undefined, false],
    [
      true,
      GuestExperienceConfig.memberSupportEmail,
      uiContentMock.supportPBMPhone,
      true,
    ],
  ])(
    'renders Contact Info panel (isPbmMember: %p)',
    (
      isMemberMock: boolean,
      expectedEmail: string,
      expectedPhoneNumber: string | undefined,
      isCommunicationContentLoading: boolean
    ) => {
      const featuresContextMock: IFeaturesContext = {
        featuresState: GuestExperienceFeatures,
      };
      useFeaturesContextMock.mockReturnValue(featuresContextMock);

      const membershipStateMock: IMembershipState = {
        ...defaultMembershipState,
        profileList: [
          {
            primary: primaryMemberMock,
            rxGroupType: 'rx-group-type',
          },
        ],
      };
      const membershipContextMock: Partial<IMembershipContext> = {
        membershipState: membershipStateMock,
      };
      useMembershipContextMock.mockReturnValue(membershipContextMock);

      isPbmMemberMock.mockReturnValue(isMemberMock);

      useContentMock.mockReset();
      useContentMock.mockReturnValueOnce({
        content: uiContentMock,
        isContentLoading: isCommunicationContentLoading,
      });

      const testRenderer = renderer.create(<SupportContactContainer />);

      const container = testRenderer.root.findByProps({
        testID: 'SupportContactContainer',
      });
      const contactInfoPanel = getChildren(container)[0];

      expect(contactInfoPanel.type).toEqual(ContactInfoPanel);
      expect(contactInfoPanel.props.title).toEqual(
        supportContactContainerContent.supportText
      );
      expect(contactInfoPanel.props.email).toEqual(expectedEmail);

      if (isCommunicationContentLoading) {
        expect(contactInfoPanel.props.phoneNumber).toEqual(undefined);
      } else {
        expect(contactInfoPanel.props.phoneNumber).toEqual(expectedPhoneNumber);
      }

      expect(isPbmMemberMock).toHaveBeenCalledWith(
        membershipStateMock.profileList,
        GuestExperienceFeatures
      );
      expect(useTalkativeWidgetMock).toHaveBeenCalledTimes(1);
      expect(useTalkativeWidgetMock).toHaveBeenNthCalledWith(1, {
        showHeader: true,
        forceExpandedView: true,
      });
    }
  );

  it.each([[true], [false]])(
    'renders member portal content container for PBM member (isPbmMember: %p)',
    (isMemberMock: boolean) => {
      isPbmMemberMock.mockReturnValue(isMemberMock);

      const testRenderer = renderer.create(<SupportContactContainer />);

      const container = testRenderer.root.findByProps({
        testID: 'SupportContactContainer',
      });
      const memberPortalContainer = getChildren(container)[1];

      if (!isMemberMock) {
        expect(memberPortalContainer).toBeNull();
      } else {
        const children = getChildren(memberPortalContainer);

        expect(children.length).toEqual(2);
      }
    }
  );

  it('renders member portal content', () => {
    isPbmMemberMock.mockReturnValue(true);

    const testRenderer = renderer.create(<SupportContactContainer />);

    const container = testRenderer.root.findByProps({
      testID: 'SupportContactContainer',
    });
    const memberPortalContainer = getChildren(container)[1];
    const memberPortalComponents = getChildren(memberPortalContainer);

    const preamble = memberPortalComponents[0];
    expect(preamble.type).toEqual(BaseText);
    expect(preamble.props.style).toEqual(
      supportContactContainerStyles.memberPortalViewStyle
    );
    expect(preamble.props.children[0]).toEqual(
      supportContactContainerContent.memberPortalText
    );
    expect(preamble.props.children[1]).toEqual(' ');

    const portalLinkContainer = memberPortalComponents[1];
    expect(portalLinkContainer.type).toEqual(View);
    expect(portalLinkContainer.props.testID).toEqual('portalLinkContainer');

    const linkContainerComponents = getChildren(portalLinkContainer);
    expect(linkContainerComponents.length).toEqual(2);

    const icon = linkContainerComponents[0];
    expect(icon.type).toEqual(FontAwesomeIcon);
    expect(icon.props.name).toEqual('user-circle');
    expect(icon.props.style).toEqual(
      supportContactContainerStyles.iconTextStyle
    );
    expect(icon.props.size).toEqual(16);

    const link = linkContainerComponents[1];
    expect(link.type).toEqual(InlineLink);
    expect(link.props.textStyle).toEqual(
      supportContactContainerStyles.linkTextStyle
    );
    expect(link.props.onPress).toEqual(expect.any(Function));
    expect(link.props.children).toEqual(
      supportContactContainerContent.memberPortalLinkLabel
    );
  });

  it('handles member portal link click', () => {
    const memberPortalUrlMock = 'member-portal-url';
    const configContextMock: IConfigContext = {
      configState: {
        ...GuestExperienceConfig,
        memberPortalUrl: memberPortalUrlMock,
      },
    };
    useConfigContextMock.mockReturnValue(configContextMock);

    isPbmMemberMock.mockReturnValue(true);

    const testRenderer = renderer.create(<SupportContactContainer />);

    const portalLinkContainer = testRenderer.root.findByProps({
      testID: 'portalLinkContainer',
    });
    const link = getChildren(portalLinkContainer)[1];

    link.props.onPress();

    expect(goToUrlMock).toHaveBeenCalledWith(memberPortalUrlMock);
  });
});
