// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { ProfileAvatar, IProfileAvatarProps } from './profile-avatar';

export default {
  title: 'Identification/ProfileAvatar',
  component: ProfileAvatar,
};

const ArgsWrapper: Story<IProfileAvatarProps> = (args) => (
  <ProfileAvatar {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  profileName: 'Sample Name',
};
