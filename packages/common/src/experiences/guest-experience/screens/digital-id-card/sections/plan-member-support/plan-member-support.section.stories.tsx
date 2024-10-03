// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { PlanMemberSupportSection } from './plan-member-support.section';

export default {
  title: 'Support/PlanMemberSupportSection',
  component: PlanMemberSupportSection,
};

const ArgsWrapper: Story = () => <PlanMemberSupportSection />;

export const Default = ArgsWrapper.bind({});
