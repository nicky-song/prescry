// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  UnfavoritingErrorNotification,
  IUnfavoritingErrorNotificationProps,
} from './unfavoriting-error.notification';

export default {
  title: 'Notifications/UnfavoritingErrorNotification',
  component: UnfavoritingErrorNotification,
  argTypes: { onClose: { action: 'closed' } },
};

const ArgsWrapper: Story<IUnfavoritingErrorNotificationProps> = (args) => (
  <UnfavoritingErrorNotification {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};
