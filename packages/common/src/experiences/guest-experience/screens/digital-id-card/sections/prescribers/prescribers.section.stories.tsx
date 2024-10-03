// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { PrescribersSection } from './prescribers.section';

export default {
  title: 'Sections/PrescribersSection',
  component: PrescribersSection,
};

const ArgsWrapper: Story = () => <PrescribersSection />;

export const Default = ArgsWrapper.bind({});
