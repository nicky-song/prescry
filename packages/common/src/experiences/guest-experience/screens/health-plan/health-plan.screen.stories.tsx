// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { HealthPlanScreen } from './health-plan.screen';

export default {
  title: 'story-group/HealthPlanScreen',
  component: HealthPlanScreen,
};

const ArgsWrapper: Story = (args) => <HealthPlanScreen {...args} />;

export const Default = ArgsWrapper.bind({});
Default.args = {};
