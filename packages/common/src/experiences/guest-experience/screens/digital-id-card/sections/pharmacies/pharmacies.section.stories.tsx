// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { PharmaciesSection } from './pharmacies.section';

export default {
  title: 'Sections/PharmaciesSection',
  component: PharmaciesSection,
};

const ArgsWrapper: Story = () => <PharmaciesSection />;

export const Default = ArgsWrapper.bind({});
