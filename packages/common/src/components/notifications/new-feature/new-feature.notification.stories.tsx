// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  NewFeatureNotification,
  INewFeatureNotificationProps,
} from './new-feature.notification';

export default {
  title: 'Notifications/NewFeatureNotification',
  component: NewFeatureNotification,
  argTypes: { onClose: { action: 'closed' } },
};

const ArgsWrapper: Story<INewFeatureNotificationProps> = (args) => (
  <NewFeatureNotification {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};
