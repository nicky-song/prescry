// Copyright 2021 Prescryptive Health, Inc.

import React, { useState } from 'react';
import renderer from 'react-test-renderer';
import { TouchableOpacity } from 'react-native';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { SmartPriceScreen } from './smart-price-screen';
import { smartPriceScreenStyle } from './smart-price-screen.style';
import { useMembershipContext } from '../context-providers/membership/use-membership-context.hook';
import {
  defaultMembershipState,
  IMembershipState,
} from '../state/membership/membership.state';
import { profileListMock } from '../__mocks__/profile-list.mock';
import { FontAwesomeIcon } from '../../../components/icons/font-awesome/font-awesome.icon';
import { useNavigation } from '@react-navigation/native';
import { getProfilesByGroup } from '../../../utils/profile.helper';
import {
  IPrimaryProfile,
  IProfile,
} from '../../../models/member-profile/member-profile-info';
import { rootStackNavigationMock } from '../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { BaseText } from '../../../components/text/base-text/base-text';
import { BodyContentContainer } from '../../../components/containers/body-content/body-content.container';
import { resetStackToHome } from '../store/navigation/navigation-reducer.actions';
import { useSessionContext } from '../context-providers/session/use-session-context.hook';
import { useReduxContext } from '../context-providers/redux/use-redux-context.hook';
import { defaultSessionState } from '../state/session/session.state';
import { IReduxContext } from '../context-providers/redux/redux.context';
import { ISessionContext } from '../context-providers/session/session.context';
import { IUIContentGroup } from '../../../models/ui-content';
import { CmsGroupKey } from '../state/cms-content/cms-group-key';
import { ISmartPriceScreenContent } from './smart-price-screen.ui-content.model';
import { useContent } from '../context-providers/session/ui-content-hooks/use-content';
import { RxIdCard } from '../../../components/cards/rx-id-card/rx-id-card';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));
const useStateMock = useState as jest.Mock;

jest.mock('../context-providers/session/use-session-context.hook');
const useSessionContextMock = useSessionContext as jest.Mock;

jest.mock('../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../../../utils/profile.helper');
const getProfilesByGroupMock = getProfilesByGroup as jest.Mock;

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock('../../../components/pages/basic-page-connected');

jest.mock('../context-providers/session/ui-content-hooks/use-content');

const useContentMock = useContent as jest.Mock;

jest.mock('../context-providers/membership/use-membership-context.hook');
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock('../../../components/icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

jest.mock('../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock('../store/navigation/navigation-reducer.actions');
const resetStackToHomeMock = resetStackToHome as jest.Mock;

jest.mock('../../../utils/cms-content.helper');

const primaryProfileMock: IPrimaryProfile = {
  identifier: 'identifier-mock',
  firstName: 'first-name-mock',
  lastName: 'last-name-mock',
  dateOfBirth: 'date-of-birth-mock',
  rxGroupType: 'COVID19',
  rxSubGroup: 'rx-sub-group-mock',
  primaryMemberRxId: 'primary-member-rx-id-mock',
  phoneNumber: 'phone-number-mock',
};

const profileMock: IProfile = {
  rxGroupType: 'rx-group-type',
  primary: primaryProfileMock,
};

const smartPriceScreenContentMock: ISmartPriceScreenContent = {
  startSavingTodayLabel: 'start-saving-today-value-mock',
  showYourPharmacistLabel: 'show-your-pharmacist-value-mock',
  showYourPharmacistContent: 'show-your-pharmacist-content-value-mock',
  manageMyInformationLabel: 'manage-my-information-value-mock',
  digitalIdCard: {
    sieUserHeader: 'smart-price-card-header-value-mock',
    name: 'smart-price-card-name-value-mock',
    memberId: 'smart-price-card-member-id-value-mock',
    group: 'smart-price-card-group-value-mock',
    bin: 'smart-price-card-bin-value-mock',
    pcn: 'smart-price-card-pcn-value-mock',
  },
  unauthSmartPriceCard: {
    defaultMessage: 'smart-price-card-cash-default-message-mock',
    pcnValue: 'smart-price-card-cash-pcn-value-mock',
    groupValue: 'smart-price-card-cash-group-value-mock',
    binValue: 'smart-price-card-cash-bin-value-mock',
  },
};

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
      isContentLoading: true,
    },
  ],
]);

interface IStateCalls {
  isContentLoading: [boolean, jest.Mock];
}

function stateReset({
  isContentLoading = [false, jest.fn()],
}: Partial<IStateCalls>) {
  useStateMock.mockReset();

  useStateMock.mockReturnValueOnce(isContentLoading);
}

describe('SmartPriceScreen ', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    stateReset({});

    useContentMock.mockReturnValue({
      content: smartPriceScreenContentMock,
      isContentLoading: false,
    });
    useMembershipContextMock.mockReturnValue({
      membershipState: defaultMembershipState,
      membershipDispatch: jest.fn(),
    });
    useNavigationMock.mockReturnValue(rootStackNavigationMock);
    getProfilesByGroupMock.mockReturnValue([profileMock]);

    const reduxContextMock: IReduxContext = {
      dispatch: jest.fn(),
      getState: jest.fn(),
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    const sessionContextMock: ISessionContext = {
      sessionState: {
        ...defaultSessionState,
        uiCMSContentMap: cmsContentMapMock,
      },
      sessionDispatch: jest.fn(),
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);
  });

  it('should render a BasicPageConnected with props', () => {
    const testRenderer = renderer.create(<SmartPriceScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;

    expect(pageProps.hideNavigationMenuButton).toBeFalsy();
    expect(pageProps.showProfileAvatar).toBeTruthy();
    expect(pageProps.translateContent).toBeTruthy();
    expect(pageProps.navigateBack).toEqual(expect.any(Function));
    pageProps.navigateBack();
    expect(resetStackToHomeMock).toHaveBeenCalled();
  });

  it('should call useContent with the expected props', () => {
    const testRenderer = renderer.create(<SmartPriceScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;

    const expectedGroupKey = CmsGroupKey.smartPriceScreen;

    expect(pageProps.hideNavigationMenuButton).toBeFalsy();
    expect(pageProps.showProfileAvatar).toBeTruthy();
    expect(pageProps.navigateBack).toEqual(expect.any(Function));
    pageProps.navigateBack();
    expect(resetStackToHomeMock).toHaveBeenCalled();
    expect(useContentMock).toHaveBeenCalledWith(expectedGroupKey, 2);
  });

  it('should render body container as expected', () => {
    const membershipStateMock: Partial<IMembershipState> = {
      ...defaultMembershipState,
      profileList: profileListMock,
    };
    useMembershipContextMock.mockReturnValue({
      membershipState: membershipStateMock,
      membershipDispatch: jest.fn(),
    });

    const testRenderer = renderer.create(<SmartPriceScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const body = pageProps.body;
    const card = pageProps.body.props.children[0].props.children;
    const manageMyInfoSection = pageProps.body.props.children[1];
    const manageMyInfoText = manageMyInfoSection.props.children[0];
    const manageMyInfoButton = manageMyInfoSection.props.children[1];
    const manageMyInfoButtonTouchableOpacity =
      manageMyInfoButton.props.children;
    const manageMyInfoButtonIcon =
      manageMyInfoButtonTouchableOpacity.props.children;
    const startSavingHeader = pageProps.body.props.children[2];
    const startSavingContent = pageProps.body.props.children[3];
    const header = body.props.title;

    expect(header).toEqual(smartPriceScreenContentMock.startSavingTodayLabel);

    expect(body.type).toEqual(BodyContentContainer);
    expect(body.props.style).toBeUndefined();
    expect(card.type).toEqual(RxIdCard);
    expect(manageMyInfoSection.props.style).toEqual(
      smartPriceScreenStyle.manageInfoSectionViewStyle
    );
    expect(manageMyInfoText.type).toEqual(BaseText);
    expect(manageMyInfoText.props.children).toEqual(
      'manage-my-information-value-mock'
    );
    expect(manageMyInfoText.props.style).toEqual(
      smartPriceScreenStyle.manageMyInformationTextStyle
    );

    expect(manageMyInfoButton.props.style).toEqual(
      smartPriceScreenStyle.buttonContainer
    );
    expect(manageMyInfoButton.props.children.type).toEqual(TouchableOpacity);
    manageMyInfoButton.props.children.props.onPress();
    expect(manageMyInfoButtonTouchableOpacity.props.testID).toEqual(
      'smartPriceScreenManageMyInformation'
    );
    expect(rootStackNavigationMock.navigate).toBeCalledWith(
      'AccountInformation'
    );
    expect(manageMyInfoButtonIcon.type).toEqual(FontAwesomeIcon);
    expect(manageMyInfoButtonIcon.props.style).toEqual(
      smartPriceScreenStyle.editIcon
    );
    expect(startSavingHeader.type).toEqual(BaseText);
    expect(startSavingHeader.props.children).toEqual(
      'show-your-pharmacist-value-mock'
    );
    expect(startSavingContent.props.children).toEqual(
      'show-your-pharmacist-content-value-mock'
    );
  });
});
