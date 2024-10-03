// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { ActionCard, IActionCardProps } from './action.card';

const onPress = () => {
  console.info('pressed'); // TODO: Figure out how to generate action.
};

export default {
  title: 'Cards/ActionCard',
  component: ActionCard,
};

const ArgsWrapper: Story<IActionCardProps> = (args) => <ActionCard {...args} />;

export const NoImage = ArgsWrapper.bind({});
NoImage.storyName = 'No image';
NoImage.args = {
  title: 'Sample title',
  subTitle: 'Sample sub-title',
  button: {
    label: 'Button label',
    onPress,
  },
};

export const WithImage = ArgsWrapper.bind({});
WithImage.storyName = 'With image';
WithImage.args = {
  imageName: 'stethoscopeIcon',
  title: 'Sample title',
  subTitle: 'Sample sub-title',
  button: {
    label: 'Button label',
    onPress,
  },
};

export const NoButton = ArgsWrapper.bind({});
NoButton.storyName = 'No button';
NoButton.args = {
  imageName: 'stethoscopeIcon',
  title: 'Sample title',
  subTitle: 'Sample sub-title',
};

export const AnotherPharmacyExample = ArgsWrapper.bind({});
AnotherPharmacyExample.storyName = 'Another pharmacy example';
AnotherPharmacyExample.args = {
  imageName: 'stethoscopeIcon',
  title: 'Prescription at another pharmacy?',
  subTitle: 'We’ll help you transfer it to get a better price.',
  button: {
    label: 'Get started',
    onPress,
  },
};
