// Copyright 2018 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import {
  GoBackButton,
  IGoBackButtonProps,
} from '../../../components/buttons/go-back-button/go-back.button';
import { getChildren } from '../../../testing/test.helper';
import { CloseButton } from '../../buttons/close-button/close-button';
import { DrawerHamburgerAuthButton } from '../../buttons/drawer-hamburger-auth/drawer-hamburger-auth.button';
import { ProfileAvatar } from '../../buttons/profile-avatar/profile-avatar';
import { BaseText } from '../../text/base-text/base-text';
import { ApplicationHeaderLogo } from '../application-header-logo/application-header-logo';
import {
  ApplicationHeader,
  IApplicationHeaderProps,
  LogoClickActionEnum,
} from './application-header';
import { applicationHeaderContent } from './application-header.content';
import { applicationHeaderStyles } from './application-header.styles';
import { useDrawerContext } from '../../../experiences/guest-experience/context-providers/drawer/drawer.context.hook';
import { rootStackNavigationMock } from '../../../experiences/guest-experience/navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { setDrawerOpenDispatch } from '../../../experiences/guest-experience/state/drawer/dispatch/set-drawer-open.dispatch';
import { useNavigation } from '@react-navigation/native';
import { useSessionContext } from '../../../experiences/guest-experience/context-providers/session/use-session-context.hook';
import { useFeaturesContext } from '../../../experiences/guest-experience/context-providers/features/use-features-context.hook';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { IPopUpModalContent } from '../../../models/cms-content/pop-up-modal-content';
import { PopupModal } from '../../modal/popup-modal/popup-modal';
import { navigateHomeScreenNoApiRefreshDispatch } from '../../../experiences/guest-experience/store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';
import { IReduxContext } from '../../../experiences/guest-experience/context-providers/redux/redux.context';
import { useReduxContext } from '../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook';

jest.mock('../../modal/popup-modal/popup-modal', () => ({
  PopupModal: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch'
);
const navigateHomeScreenDispatchMock =
  navigateHomeScreenNoApiRefreshDispatch as jest.Mock;

jest.mock('../../buttons/drawer-hamburger/drawer-hamburger.button', () => ({
  DrawerHamburgerButton: () => <div />,
}));

jest.mock(
  '../../buttons/drawer-hamburger-auth/drawer-hamburger-auth.button',
  () => ({
    DrawerHamburgerAuthButton: () => <div />,
  })
);

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

jest.mock(
  '../../../experiences/guest-experience/context-providers/features/use-features-context.hook'
);
const useFeaturesContextMock = useFeaturesContext as jest.Mock;

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/use-session-context.hook'
);
const useSessionContextMock = useSessionContext as jest.Mock;

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock(
  '../../../experiences/guest-experience/state/drawer/dispatch/set-drawer-open.dispatch'
);
const setDrawerOpenDispatchMock = setDrawerOpenDispatch as jest.Mock;

jest.mock(
  '../../../experiences/guest-experience/context-providers/drawer/drawer.context.hook'
);
const useDrawerContextMock = useDrawerContext as jest.Mock;

jest.mock('../application-header-logo/application-header-logo', () => ({
  ApplicationHeaderLogo: () => <div />,
}));

jest.mock('../../../components/buttons/go-back-button/go-back.button', () => ({
  GoBackButton: () => <div />,
}));

jest.mock('../../buttons/drawer-hamburger/drawer-hamburger.button', () => ({
  DrawerHamburgerButton: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook'
);

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));
const useStateMock = useState as jest.Mock;

const navigateBackMock = jest.fn();
const resetFilterMock = jest.fn();
const openDrawerMock = jest.fn();
const useReduxContextMock = useReduxContext as jest.Mock;
const reduxDispatchMock = jest.fn();
const reduxGetStateMock = jest.fn();

const applicationHeaderProps: IApplicationHeaderProps = {
  hideNavigationMenuButton: false,
  memberProfileName: 'Keanu Reeves',
  navigateBack: navigateBackMock,
  showProfileAvatar: false,
  title: 'Filter',
  testID: 'testIDMock',
};
const popUpModalContentMock: Partial<IPopUpModalContent> = {
  leavingTitle: 'leaving-title-mock',
};

describe('ApplicationHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useNavigationMock.mockReturnValue(rootStackNavigationMock);
    useDrawerContextMock.mockReturnValue({ drawerDispatch: jest.fn() });
    useContentMock.mockReturnValue({
      isContentLoading: false,
      content: popUpModalContentMock,
    });
    useSessionContextMock.mockReturnValue({
      sessionState: {},
    });
    useFeaturesContextMock.mockReturnValue({
      featuresState: {},
    });
    const reduxContextMock: IReduxContext = {
      getState: reduxGetStateMock,
      dispatch: reduxDispatchMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
    useStateMock.mockReturnValueOnce([false, jest.fn()]);
    useStateMock.mockReturnValueOnce([true, jest.fn()]);
  });

  it('should have page title', () => {
    const applicationHeader = renderer.create(
      <ApplicationHeader {...applicationHeaderProps} />
    );
    const text = applicationHeader.root.findByType(BaseText);
    expect(text.props.children).toBe(applicationHeaderProps.title);
  });

  it('should navigate to previous page on BackButton click', () => {
    const applicationHeader = renderer.create(
      <ApplicationHeader {...applicationHeaderProps} />
    );
    const props = applicationHeader.root.findByType(GoBackButton)
      .props as IGoBackButtonProps;
    expect(props.accessibilityLabel).toEqual(
      applicationHeaderContent.goBackButtonLabel
    );
    expect(props.onPress).toBe(applicationHeaderProps.navigateBack);
  });
});

describe('ApplicationHeader > applicationHeaderTitle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSessionContextMock.mockReturnValue({
      sessionState: {
        isUnauthExperience: false,
      },
    });
    useFeaturesContextMock.mockReturnValue({
      featuresState: {
        usehome: true,
      },
    });

    useStateMock.mockReturnValueOnce([false, jest.fn()]);
  });

  it('should return title', () => {
    const applicationHeader = renderer.create(
      <ApplicationHeader {...applicationHeaderProps} />
    );
    const baseText = applicationHeader.root.findByType(BaseText);

    expect(baseText.props.children).toEqual(applicationHeaderProps.title);
  });

  it('should exist ApplicationHeaderLogo when title is not provided', () => {
    const applicationHeader = renderer.create(
      <ApplicationHeader {...applicationHeaderProps} title={undefined} />
    );
    expect(
      applicationHeader.root.findByType(ApplicationHeaderLogo)
    ).toBeTruthy();
  });

  it('should exist clickable ApplicationHeaderLogo when no title, auth flow, confirm logo, and usehome featureflag', () => {
    const applicationHeaderPropsWithLogoClickAction: IApplicationHeaderProps = {
      ...applicationHeaderProps,
      logoClickAction: LogoClickActionEnum.CONFIRM,
    };
    const applicationHeader = renderer.create(
      <ApplicationHeader
        {...applicationHeaderPropsWithLogoClickAction}
        title={undefined}
      />
    );
    const touchableOpacity = applicationHeader.root.findByType(
      TouchableOpacity
    ) as ReactTestInstance;
    expect(touchableOpacity.props.onPress).toEqual(expect.any(Function));
    expect(touchableOpacity.props.accessibilityRole).toEqual('link');
    expect(getChildren(touchableOpacity).length).toEqual(1);
    const applicationHeaderLogo = getChildren(touchableOpacity)[0];
    expect(applicationHeaderLogo.type).toEqual(ApplicationHeaderLogo);
  });
});

describe('ApplicationHeader > popUpModal', () => {
  const setIsOpenMock = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    useSessionContextMock.mockReturnValue({
      sessionState: {
        isUnauthExperience: false,
      },
    });
    useFeaturesContextMock.mockReturnValue({
      featuresState: {
        usehome: true,
      },
    });
    useContentMock.mockReturnValue({
      isContentLoading: false,
      content: popUpModalContentMock,
    });
    const reduxContextMock: IReduxContext = {
      getState: reduxGetStateMock,
      dispatch: reduxDispatchMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
    useStateMock.mockReturnValueOnce([false, setIsOpenMock]);
  });

  it('should show Modal after clicking clickable ApplicationHeaderLogo', () => {
    const applicationHeaderPropsWithLogoClickAction: IApplicationHeaderProps = {
      ...applicationHeaderProps,
      logoClickAction: LogoClickActionEnum.CONFIRM,
    };
    const applicationHeader = renderer.create(
      <ApplicationHeader
        {...applicationHeaderPropsWithLogoClickAction}
        title={undefined}
      />
    );
    const touchableOpacity = applicationHeader.root.findByType(
      TouchableOpacity
    ) as ReactTestInstance;
    touchableOpacity.props.onPress();
    const modal = applicationHeader.root.findByType(
      PopupModal
    ) as ReactTestInstance;
    expect(modal).toBeTruthy();
    expect(modal.props.isOpen).toEqual(false);
    expect(modal.props.titleText).toEqual(popUpModalContentMock.leavingTitle);
    expect(modal.props.content).toEqual(popUpModalContentMock.leavingDesc);
    expect(modal.props.primaryButtonLabel).toEqual(
      popUpModalContentMock.leavingPrimaryButton
    );
    expect(modal.props.secondaryButtonLabel).toEqual(
      popUpModalContentMock.leavingSecondButton
    );
    expect(modal.props.onPrimaryButtonPress).toEqual(expect.any(Function));
    expect(modal.props.onSecondaryButtonPress).toEqual(expect.any(Function));
  });

  it('should call navigateHomeScreenNoApiRefreshDispatch when click primary button', () => {
    const applicationHeaderPropsWithLogoClickAction: IApplicationHeaderProps = {
      ...applicationHeaderProps,
      logoClickAction: LogoClickActionEnum.CONFIRM,
    };
    const applicationHeader = renderer.create(
      <ApplicationHeader
        {...applicationHeaderPropsWithLogoClickAction}
        title={undefined}
      />
    );
    const touchableOpacity = applicationHeader.root.findByType(
      TouchableOpacity
    ) as ReactTestInstance;
    touchableOpacity.props.onPress();
    const modal = applicationHeader.root.findByType(
      PopupModal
    ) as ReactTestInstance;
    modal.props.onPrimaryButtonPress();
    expect(navigateHomeScreenDispatchMock).toHaveBeenCalledWith(
      reduxGetStateMock,
      rootStackNavigationMock
    );
  });

  it('should stay in the page when click second button', () => {
    const applicationHeaderPropsWithLogoClickAction: IApplicationHeaderProps = {
      ...applicationHeaderProps,
      logoClickAction: LogoClickActionEnum.CONFIRM,
    };
    const applicationHeader = renderer.create(
      <ApplicationHeader
        {...applicationHeaderPropsWithLogoClickAction}
        title={undefined}
      />
    );
    const touchableOpacity = applicationHeader.root.findByType(
      TouchableOpacity
    ) as ReactTestInstance;
    touchableOpacity.props.onPress();
    const modal = applicationHeader.root.findByType(
      PopupModal
    ) as ReactTestInstance;
    modal.props.onSecondaryButtonPress();
    expect(setIsOpenMock).toHaveBeenCalledTimes(2);
    expect(setIsOpenMock).toHaveBeenNthCalledWith(1, true);
    expect(setIsOpenMock).toHaveBeenNthCalledWith(2, false);
  });
});

describe('ApplicationHeader > renderNavigation', () => {
  beforeEach(() => {
    navigateBackMock.mockReset();
    openDrawerMock.mockReset();
    resetFilterMock.mockReset();
    useStateMock.mockReturnValueOnce([false, jest.fn()]);
  });

  it('should return BackButton along with props', () => {
    const testRenderer = renderer.create(
      <ApplicationHeader {...applicationHeaderProps} />
    );

    const headerView = testRenderer.root.children[0] as ReactTestInstance;

    expect(headerView.type).toEqual(View);

    applicationHeaderStyles.headerMyPrescryptineBrandingViewStyle;

    expect(getChildren(headerView).length).toEqual(3);

    const buttonView = getChildren(headerView)[0];

    expect(buttonView.type).toEqual(View);
    expect(buttonView.props.style).toEqual(
      applicationHeaderStyles.navigateBackViewStyle
    );
    expect(getChildren(buttonView).length).toEqual(1);

    const button = getChildren(buttonView)[0];

    expect(button.type).toEqual(GoBackButton);
    button.props.onPress();

    expect(applicationHeaderProps.navigateBack).toHaveBeenCalled();
  });

  it('should return undefined', () => {
    const applicationHeaderPropsMock: IApplicationHeaderProps = {
      hideNavigationMenuButton: false,
      memberProfileName: 'Keanu Reeves',
      navigateBack: undefined,
      showProfileAvatar: false,
      title: 'Filter',
    };

    const applicationHeader = renderer.create(
      <ApplicationHeader {...applicationHeaderPropsMock} />
    );

    expect(applicationHeader.root.findAllByType(GoBackButton).length).toEqual(
      0
    );
  });

  it('should set margin left to hamburger menu if present', () => {
    const applicationHeader = renderer.create(
      <ApplicationHeader
        {...applicationHeaderProps}
        showProfileAvatar={false}
        showCloseButton={false}
      />
    );

    expect(applicationHeader.root.findAllByType(CloseButton).length).toEqual(0);

    const mainContainer = applicationHeader.root.findAllByType(View, {
      deep: false,
    })[0];
    const hamburgerContainer = mainContainer.props.children[2];
    expect(hamburgerContainer.props.style[1]).toEqual({ marginLeft: 0 });
  });
});

describe('ApplicationHeader > renderResetOrProfileAvatarIcon', () => {
  beforeEach(() => {
    navigateBackMock.mockReset();
    openDrawerMock.mockReset();
    resetFilterMock.mockReset();
    useStateMock.mockReturnValueOnce([false, jest.fn()]);
  });

  it('should return ProfileAvatar and Hamburger Menu along with props when showProfileAvatar is true', () => {
    const dispatchMock = jest.fn();

    useDrawerContextMock.mockReturnValueOnce({
      drawerDispatch: dispatchMock,
    });

    const applicationHeader = renderer.create(
      <ApplicationHeader {...applicationHeaderProps} showProfileAvatar={true} />
    );

    expect(
      applicationHeader.root.findAllByType(DrawerHamburgerAuthButton).length
    ).toEqual(1);

    expect(applicationHeader.root.findAllByType(ProfileAvatar).length).toEqual(
      0
    );

    const drawerHamburgerAuthButtonProps = applicationHeader.root.findByType(
      DrawerHamburgerAuthButton
    ).props;

    expect(drawerHamburgerAuthButtonProps.onPress).toBeDefined();

    if (drawerHamburgerAuthButtonProps.onPress) {
      drawerHamburgerAuthButtonProps.onPress();
    }

    expect(rootStackNavigationMock.openDrawer).toBeCalledWith();
    expect(setDrawerOpenDispatchMock).toBeCalledWith(dispatchMock);
  });

  it('should not called when hideNavigationMenuButton is true ', () => {
    const applicationHeader = renderer.create(
      <ApplicationHeader
        {...applicationHeaderProps}
        hideNavigationMenuButton={true}
      />
    );

    expect(applicationHeader.root.findAllByType(CloseButton).length).toEqual(0);

    expect(applicationHeader.root.findAllByType(ProfileAvatar).length).toEqual(
      0
    );
  });
});
