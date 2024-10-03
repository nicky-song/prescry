// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { BaseNotification, IBaseNotificationProps } from './base.notification';
import { NotificationColor } from '../../../theming/colors';
import { IconSize } from '../../../theming/icons';

export default {
  title: 'Notifications/BaseNotification',
  component: BaseNotification,
  argTypes: { onClose: { action: 'closed' } },
};

const ArgsWrapper: Story<IBaseNotificationProps> = (args) => (
  <BaseNotification {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  iconName: 'heart',
  iconColor: NotificationColor.heartRed,
  iconSize: IconSize.regular,
  message:
    'When you find a pharmacy that you like, you can save it as a favorite. This makes it easier to find in the future.',
};
