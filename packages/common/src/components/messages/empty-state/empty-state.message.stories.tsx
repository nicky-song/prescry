// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  EmptyStateMessage,
  IEmptyStateMessageProps,
} from './empty-state.message';

export default {
  title: 'Messages/EmptyStateMessage',
  component: EmptyStateMessage,
};

const ArgsWrapper: Story<IEmptyStateMessageProps> = (args) => (
  <EmptyStateMessage {...args} />
);

export const Regular = ArgsWrapper.bind({});
Regular.args = {
  imageName: 'emptyClaimsImage',
  message: 'You have no claims',
  bottomSpacing: 'regular',
};

export const Wide = ArgsWrapper.bind({});
Wide.args = {
  imageName: 'emptyMedicineCabinet',
  message: 'All your prescriptions in one place',
  bottomSpacing: 'wide',
};
