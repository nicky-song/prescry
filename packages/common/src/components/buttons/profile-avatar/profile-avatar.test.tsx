// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import { getNameInitials } from '../../../utils/formatters/get-name-initials-formatter';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';
import { ProfileAvatar } from './profile-avatar';
import { profileAvatarStyles } from './profile-avatar.styles';

describe('ProfileAvatar', () => {
  it('renders in View container', () => {
    const customViewStyle: ViewStyle = {
      width: 1,
    };

    const testRenderer = renderer.create(
      <ProfileAvatar profileName='' viewStyle={customViewStyle} />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    expect(container.type).toEqual(View);
    expect(container.props.testID).toEqual('ProfileAvatar');

    expect(container.props.style).toEqual([
      profileAvatarStyles.containerMyPrescryptingBrandingViewStyle,
      customViewStyle,
    ]);

    expect(getChildren(container).length).toEqual(1);
  });

  it('renders profile initials', () => {
    const profileNameMock = 'John Doe';
    const testRenderer = renderer.create(
      <ProfileAvatar profileName={profileNameMock} />
    );

    const container = testRenderer.root.findByProps({
      testID: 'ProfileAvatar',
    });
    const text = getChildren(container)[0];

    expect(text.type).toEqual(ProtectedBaseText);

    expect(text.props.style).toEqual(
      profileAvatarStyles.profileNameMyPrescryptingBrandingTextStyle
    );

    expect(text.props.children).toEqual(getNameInitials(profileNameMock));
  });
});
