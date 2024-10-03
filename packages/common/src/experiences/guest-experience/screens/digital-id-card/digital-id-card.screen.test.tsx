// Copyright 2018 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BodyContentContainer } from '../../../../components/containers/body-content/body-content.container';
import { LineSeparator } from '../../../../components/member/line-separator/line-separator';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { BaseText } from '../../../../components/text/base-text/base-text';
import {
  IPrimaryProfile,
  RxGroupTypesEnum,
} from '../../../../models/member-profile/member-profile-info';
import { getChildren } from '../../../../testing/test.helper';
import {
  DigitalIDCardScreen,
  IDigitalIDCardScreenRouteProps,
} from './digital-id-card.screen';
import { IDigitalIdCardScreenContent } from './digital-id-card.screen.content';
import { rootStackNavigationMock } from '../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMembershipContext } from '../../context-providers/membership/use-membership-context.hook';
import {
  getHighestPriorityProfile,
  getProfileName,
} from '../../../../utils/profile.helper';
import { IMembershipContext } from '../../context-providers/membership/membership.context';
import {
  defaultMembershipState,
  IMembershipState,
} from '../../state/membership/membership.state';
import { digitalIdCardScreenStyles } from './digital-id-card.screen.styles';
import { PlanMemberSupportSection } from './sections/plan-member-support/plan-member-support.section';
import { resetStackToHome } from '../../store/navigation/navigation-reducer.actions';
import { useSessionContext } from '../../context-providers/session/use-session-context.hook';
import { useReduxContext } from '../../context-providers/redux/use-redux-context.hook';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { IReduxContext } from '../../context-providers/redux/redux.context';
import { ISessionContext } from '../../context-providers/session/session.context';
import { defaultSessionState } from '../../state/session/session.state';
import { IUIContentGroup } from '../../../../models/ui-content';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { assertIsDefined } from '../../../../assertions/assert-is-defined';
import { ProtectedBaseText } from '../../../../components/text/protected-base-text/protected-base-text';
import { RxIdCard } from '../../../../components/cards/rx-id-card/rx-id-card';
import { RxCardType } from '../../../../models/rx-id-card';

jest.mock('../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));
const useStateMock = useState as jest.Mock;

jest.mock('../../context-providers/session/use-session-context.hook');
const useSessionContextMock = useSessionContext as jest.Mock;

jest.mock('../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

jest.mock('../../context-providers/membership/use-membership-context.hook');
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock('../../../../utils/cms-content.helper');

jest.mock('../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock('../../../../components/cards/rx-id-card/rx-id-card', () => ({
  RxIdCard: () => <div />,
}));

jest.mock('./sections/plan-member-support/plan-member-support.section', () => ({
  PlanMemberSupportSection: () => <div />,
}));

jest.mock('../../store/navigation/navigation-reducer.actions');
const resetStackToHomeMock = resetStackToHome as jest.Mock;

jest.mock('../../../../assertions/assert-is-defined');
const assertIsDefinedMock = assertIsDefined as jest.Mock;

jest.mock(
  '../../../../components/text/protected-base-text/protected-base-text',
  () => ({
    ProtectedBaseText: () => <div />,
  })
);

const cmsContentMapMock: Map<string, IUIContentGroup> = new Map([
  [
    CmsGroupKey.smartPriceScreen,
    {
      content: [
        {
          fieldKey: 'start-saving-today',
          language: 'English',
          type: 'text',
          value: 'start-saving-today-value-mock',
        },
      ],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
]);

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
  rxGroup: 'rxGroup',
  rxGroupType: RxGroupTypesEnum.SIE,
  rxSubGroup: '',
  primaryMemberRxId: '',
};

interface IStateCalls {
  isContentLoading: [boolean, jest.Mock];
}

const setIsContentLoadingMock = jest.fn();

function stateReset({
  isContentLoading = [false, setIsContentLoadingMock],
}: Partial<IStateCalls>) {
  useStateMock.mockReset();

  useStateMock.mockReturnValueOnce(isContentLoading);
}

const reduxDispatchMock = jest.fn();
const reduxGetStateMock = jest.fn();
const sessionDispatchMock = jest.fn();

const contentMock: IDigitalIdCardScreenContent = {
  title: 'title-mock',
  preamble: 'preamble-mock',
  issuerNumber: 'issuer-number-mock',
};

describe('DigitalIDCardScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    stateReset({});

    const membershipStateMock: IMembershipState = {
      ...defaultMembershipState,
      profileList: [
        {
          primary: {} as IPrimaryProfile,
          rxGroupType: '',
        },
      ],
    };
    const membershipContextMock: Partial<IMembershipContext> = {
      membershipState: membershipStateMock,
    };
    useMembershipContextMock.mockReturnValue(membershipContextMock);

    useNavigationMock.mockReturnValue(rootStackNavigationMock);
    useRouteMock.mockReturnValue({ params: {} });

    const reduxContextMock: IReduxContext = {
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    const sessionContextMock: ISessionContext = {
      sessionState: {
        ...defaultSessionState,
        uiCMSContentMap: cmsContentMapMock,
      },
      sessionDispatch: sessionDispatchMock,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);

    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: false,
    });
  });

  it('has expected number of assertions', () => {
    renderer.create(<DigitalIDCardScreen />);

    expect(assertIsDefinedMock).toHaveBeenCalledTimes(1);
  });

  it('asserts profile is defined', () => {
    const membershipStateMock: IMembershipState = {
      ...defaultMembershipState,
      profileList: [
        {
          primary: primaryMemberMock,
          rxGroupType: '',
        },
      ],
    };
    const membershipContextMock: Partial<IMembershipContext> = {
      membershipState: membershipStateMock,
    };
    useMembershipContextMock.mockReturnValue(membershipContextMock);

    renderer.create(<DigitalIDCardScreen />);

    const expectedProfile = getHighestPriorityProfile(
      membershipStateMock.profileList
    );
    expect(assertIsDefinedMock).toHaveBeenNthCalledWith(1, expectedProfile);
  });

  it('renders as BasicPage', () => {
    const membershipStateMock: IMembershipState = {
      ...defaultMembershipState,
      profileList: [
        {
          primary: primaryMemberMock,
          rxGroupType: '',
        },
      ],
    };
    const membershipContextMock: Partial<IMembershipContext> = {
      membershipState: membershipStateMock,
    };
    useMembershipContextMock.mockReturnValue(membershipContextMock);

    const testRenderer = renderer.create(<DigitalIDCardScreen />);

    const basicPage = testRenderer.root.children[0] as ReactTestInstance;

    expect(basicPage.type).toEqual(BasicPageConnected);
    expect(basicPage.props.showProfileAvatar).toEqual(true);

    const expectedProfileName = getProfileName(
      primaryMemberMock.firstName,
      primaryMemberMock.lastName
    );
    expect(basicPage.props.memberProfileName).toEqual(expectedProfileName);
    expect(basicPage.props.navigateBack).toEqual(expect.any(Function));
    expect(basicPage.props.bodyViewStyle).toEqual(
      digitalIdCardScreenStyles.digitalIdCardScreenBodyViewStyle
    );
    expect(basicPage.props.translateContent).toEqual(true);
  });

  it.each([[undefined], [false], [true]])(
    'handles navigate back (backToHome: %p)',
    (backToHomeMock: undefined | boolean) => {
      const routeParamsMock: IDigitalIDCardScreenRouteProps = {
        backToHome: backToHomeMock,
      };
      useRouteMock.mockReturnValue({ params: routeParamsMock });

      const testRenderer = renderer.create(<DigitalIDCardScreen />);

      const basicPage = testRenderer.root.findByType(BasicPageConnected);

      basicPage.props.navigateBack();

      if (backToHomeMock) {
        expect(resetStackToHomeMock).toHaveBeenCalledWith(
          rootStackNavigationMock
        );
      } else {
        expect(rootStackNavigationMock.goBack).toHaveBeenCalledWith();
      }
    }
  );

  it('renders body in content container', () => {
    const testRenderer = renderer.create(<DigitalIDCardScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const contentContainer = basicPage.props.body;

    expect(contentContainer.type).toEqual(BodyContentContainer);
    expect(contentContainer.props.testID).toEqual('digitalIdCardScreen');
    expect(contentContainer.props.title).toEqual(contentMock.title);
    expect(contentContainer.props.isSkeleton).toEqual(false);
    expect(getChildren(contentContainer).length).toEqual(5);
  });

  it('renders pre-amble', () => {
    const testRenderer = renderer.create(<DigitalIDCardScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const contentContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const preamble = getChildren(contentContainer)[0];

    expect(preamble.type).toEqual(BaseText);
    expect(preamble.props.children).toEqual(contentMock.preamble);
    expect(preamble.props.isSkeleton).toEqual(false);
    expect(preamble.props.skeletonWidth).toEqual('long');
  });

  it.each([
    [RxGroupTypesEnum.SIE, 'pbm' as RxCardType],
    [RxGroupTypesEnum.CASH, 'smartPrice' as RxCardType],
  ])(
    `renders rx id card with the correct type (rxGroupTypesEnumMock: %p)`,
    (
      rxGroupTypesEnumMock: RxGroupTypesEnum,
      expectedRxCardType: RxCardType
    ) => {
      const modifiedPrimaryMemberMock = {
        ...primaryMemberMock,
        rxGroupType: rxGroupTypesEnumMock,
      };
      const membershipStateMock: IMembershipState = {
        ...defaultMembershipState,
        profileList: [
          {
            primary: {
              ...primaryMemberMock,
              rxGroupType: rxGroupTypesEnumMock,
            },
            rxGroupType: '',
          },
        ],
      };
      const membershipContextMock: Partial<IMembershipContext> = {
        membershipState: membershipStateMock,
      };
      useMembershipContextMock.mockReturnValue(membershipContextMock);

      const testRenderer = renderer.create(<DigitalIDCardScreen />);

      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const bodyRenderer = renderer.create(basicPage.props.body);
      const contentContainer =
        bodyRenderer.root.findByType(BodyContentContainer);
      const digitalIdCard = getChildren(contentContainer)[1];

      expect(digitalIdCard.type).toEqual(RxIdCard);
      expect(digitalIdCard.props.profile).toEqual(modifiedPrimaryMemberMock);
      expect(digitalIdCard.props.viewStyle).toEqual(
        digitalIdCardScreenStyles.digitalIdCardViewStyle
      );
      expect(digitalIdCard.props.rxCardType).toEqual(expectedRxCardType);
    }
  );

  it.each([
    ['issuer-number', 'issuer-number'],
    ['', '9151014609'],
    [undefined, '9151014609'],
  ])(
    'renders issuer number (issuerNumber: %p)',
    (issuerNumberMock: string | undefined, expectedIssuerNumber: string) => {
      const membershipStateMock: IMembershipState = {
        ...defaultMembershipState,
        profileList: [
          {
            primary: { ...primaryMemberMock, issuerNumber: issuerNumberMock },
            rxGroupType: '',
          },
        ],
      };
      const membershipContextMock: Partial<IMembershipContext> = {
        membershipState: membershipStateMock,
      };
      useMembershipContextMock.mockReturnValue(membershipContextMock);

      const testRenderer = renderer.create(<DigitalIDCardScreen />);

      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const bodyRenderer = renderer.create(basicPage.props.body);
      const contentContainer =
        bodyRenderer.root.findByType(BodyContentContainer);
      const issuerNumberContainer = getChildren(contentContainer)[2];

      expect(issuerNumberContainer.type).toEqual(View);
      expect(issuerNumberContainer.props.testID).toEqual('issuerNumber');
      expect(issuerNumberContainer.props.style).toEqual(
        digitalIdCardScreenStyles.issuerNumberViewStyle
      );

      const children = getChildren(issuerNumberContainer);
      expect(children.length).toEqual(2);

      const label = children[0];
      expect(label.type).toEqual(BaseText);
      expect(label.props.style).toEqual(
        digitalIdCardScreenStyles.issuerNumberLabelTextStyle
      );
      expect(label.props.children).toEqual(contentMock.issuerNumber);
      expect(label.props.isSkeleton).toEqual(false);
      expect(label.props.skeletonWidth).toEqual('medium');

      const issuerNumber = children[1];
      expect(issuerNumber.type).toEqual(ProtectedBaseText);
      expect(issuerNumber.props.style).toEqual(
        digitalIdCardScreenStyles.issuerNumberTextStyle
      );
      expect(issuerNumber.props.children).toEqual(expectedIssuerNumber);
    }
  );

  it('renders line separator', () => {
    const testRenderer = renderer.create(<DigitalIDCardScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const contentContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const lineSeparator = getChildren(contentContainer)[3];

    expect(lineSeparator.type).toEqual(LineSeparator);
    expect(lineSeparator.props.viewStyle).toEqual(
      digitalIdCardScreenStyles.separatorViewStyle
    );
  });

  it('renders support section', () => {
    const testRenderer = renderer.create(<DigitalIDCardScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const contentContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const supportSection = getChildren(contentContainer)[4];

    expect(supportSection.type).toEqual(PlanMemberSupportSection);
  });
});
