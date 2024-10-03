// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import { ProfileAvatar } from '../../../components/buttons/profile-avatar/profile-avatar';
import { ImageAsset } from '../../../components/image-asset/image-asset';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { BaseButton } from '../../buttons/base/base.button';
import { IconButton } from '../../buttons/icon/icon.button';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';
import { ISideMenuHeaderProps, SideMenuHeader } from './side-menu-header';
import { sideMenuHeaderStyles as styles } from './side-menu-header.styles';

jest.mock('../../../components/buttons/profile-avatar/profile-avatar', () => ({
  ProfileAvatar: () => <div />,
}));

jest.mock('../../buttons/icon/icon.button', () => ({
  IconButton: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

const sideMenuHeaderProps: ISideMenuHeaderProps = {
  isUserAuthenticated: true,
  memberProfileName: 'Keanu Reeves',
  onCloseSideMenu: jest.fn(),
};

describe('SideMenuHeader', () => {
  const closeButtonAccessibilityLabelMock =
    'close-button-accessibility-label-mock';
  const signInButtonLabelMock = 'sign-in-button-mock';

  beforeEach(() => {
    jest.resetAllMocks();

    useContentMock.mockReturnValue({
      content: {
        closeButtonAccessibilityLabel: closeButtonAccessibilityLabelMock,
        signInButton: signInButtonLabelMock,
      },
      isContentLoading: false,
    });
  });

  it('should render with expected props', () => {
    const sideMenuHeader = renderer.create(
      <SideMenuHeader {...sideMenuHeaderProps} />
    );
    const mainContainer = sideMenuHeader.root.findAllByType(View, {
      deep: false,
    })[0];
    expect(mainContainer.props.style).toEqual(
      styles.sideMenuHeaderContainerView
    );

    const avatarContainer = mainContainer.props.children[0];
    expect(avatarContainer.type).toEqual(View);
    expect(avatarContainer.props.style).toEqual(
      styles.sideMenuAvatarContainerView
    );
  });

  it('close button name should be sideMenuCloseMenuIcon', () => {
    const sideMenuHeader = renderer.create(
      <SideMenuHeader {...sideMenuHeaderProps} />
    );
    const props = sideMenuHeader.root.findAllByType(IconButton)[0].props;
    expect(props.iconName).toBe('times');
    expect(props.accessibilityLabel).toBe(closeButtonAccessibilityLabelMock);
  });

  it('should have ProfileAvatar with hamburger icon hidden', () => {
    const sideMenuHeader = renderer.create(
      <SideMenuHeader {...sideMenuHeaderProps} />
    );

    const props = sideMenuHeader.root.findByType(ProfileAvatar).props;
    expect(props.profileName).toBe(sideMenuHeaderProps.memberProfileName);
  });

  it('should not render member Rx ID text when user is not authenticated', () => {
    const sideMenuHeader = renderer.create(
      <SideMenuHeader {...sideMenuHeaderProps} isUserAuthenticated={true} />
    );
    const mainContainer = sideMenuHeader.root.findAllByType(View, {
      deep: false,
    })[0];

    const avatarContainer = mainContainer.props.children[0];
    const memberIdInfo = avatarContainer.props.children[1];
    expect(memberIdInfo.type).toEqual(View);
    expect(memberIdInfo.props.style).toEqual(styles.memberRxContainerView);
    expect(memberIdInfo.props.children.type).toEqual(ProtectedBaseText);
    expect(memberIdInfo.props.children.props.children).toEqual('Keanu Reeves');
  });

  it('renders "Sign in" button when user not authenticated', () => {
    const onSignInPressMock = jest.fn();
    const sideMenuHeader = renderer.create(
      <SideMenuHeader
        {...sideMenuHeaderProps}
        isUserAuthenticated={false}
        onSignInPress={onSignInPressMock}
      />
    );
    const mainContainer = sideMenuHeader.root.findAllByType(View, {
      deep: false,
    })[0];

    const avatarContainer = mainContainer.props.children[0];
    const signInButton = avatarContainer.props.children[1];

    expect(signInButton.type).toEqual(BaseButton);
    expect(signInButton.props.size).toEqual('medium');
    expect(signInButton.props.onPress).toEqual(onSignInPressMock);
    expect(signInButton.props.children).toEqual(signInButtonLabelMock);
    expect(signInButton.props.testID).toEqual('sideMenuHeaderSignInButton');
  });

  it('should render a sideMenuAvatarIcon when user is authenticated but does not have memberProfileName', () => {
    const sideMenuHeader = renderer.create(
      <SideMenuHeader
        {...sideMenuHeaderProps}
        memberProfileName={undefined}
        isUserAuthenticated={true}
      />
    );
    const mainContainer = sideMenuHeader.root.findAllByType(View, {
      deep: false,
    })[0];

    const avatarContainer = mainContainer.props.children[0];
    const avatarView = avatarContainer.props.children[0];
    expect(avatarView.props.children.type).toEqual(ImageAsset);
    expect(avatarView.props.children.props.name).toEqual('sideMenuAvatarIcon');
  });

  it('should render only first name and last name when memberRxId is not present in case of limited members', () => {
    const sideMenuHeader = renderer.create(
      <SideMenuHeader
        isUserAuthenticated={true}
        memberProfileName='Keanu Reeves'
        onCloseSideMenu={jest.fn()}
      />
    );

    const mainContainer = sideMenuHeader.root.findAllByType(View, {
      deep: false,
    })[0];

    const avatarContainer = mainContainer.props.children[0];

    const memberInfo = avatarContainer.props.children[1];
    expect(memberInfo.type).toEqual(View);
    expect(memberInfo.props.style).toEqual(styles.memberRxContainerView);
  });
});
