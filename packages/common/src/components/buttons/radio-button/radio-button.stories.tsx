// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { IRadioButtonProps, RadioButton } from './radio-button';
import { FontSize } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export default {
  title: 'Buttons/RadioButton',
  component: RadioButton,
};

const ArgsWrapper: Story<IRadioButtonProps> = (args) => (
  <RadioButton {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  buttonLabel: 'Sample Label',
};

export const SubLabel = ArgsWrapper.bind({});
SubLabel.storyName = 'Sub label';
SubLabel.args = {
  buttonLabel: 'Sample Label',
  buttonSubLabel: 'Sample Sub Label',
  buttonTextStyle: { fontSize: FontSize.body },
  buttonTopTextStyle: { fontSize: FontSize.body },
  viewStyle: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonLabelGroupStyle: { marginLeft: Spacing.threeQuarters },
};
