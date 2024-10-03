// Copyright 2018 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { getNameInitials } from '../../../utils/formatters/get-name-initials-formatter';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';
import { profileAvatarStyles } from './profile-avatar.styles';

export interface IProfileAvatarProps {
  profileName: string;
  viewStyle?: StyleProp<ViewStyle>;
}

export const ProfileAvatar: React.FunctionComponent<IProfileAvatarProps> = ({
  viewStyle,
  profileName,
}: IProfileAvatarProps): ReactElement => {
  const nameInitials = getNameInitials(profileName);

  const containerViewStyle =
    profileAvatarStyles.containerMyPrescryptingBrandingViewStyle;
  const profileNameTextStyle =
    profileAvatarStyles.profileNameMyPrescryptingBrandingTextStyle;

  return (
    <View style={[containerViewStyle, viewStyle]} testID='ProfileAvatar'>
      <ProtectedBaseText style={profileNameTextStyle}>
        {nameInitials}
      </ProtectedBaseText>
    </View>
  );
};
