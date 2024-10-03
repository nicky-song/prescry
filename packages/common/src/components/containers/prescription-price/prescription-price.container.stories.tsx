// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  PrescriptionPriceContainer,
  IPrescriptionPriceContainerProps,
} from './prescription-price.container';
import { BaseText } from '../../text/base-text/base-text';

export default {
  title: 'Containers/PrescriptionPriceContainer',
  component: PrescriptionPriceContainer,
};

const ArgsWrapper: Story<IPrescriptionPriceContainerProps> = (args) => (
  <PrescriptionPriceContainer {...args}>
    <BaseText>Sample content</BaseText>
  </PrescriptionPriceContainer>
);

export const Default = ArgsWrapper.bind({});
Default.args = {};

export const Plain = ArgsWrapper.bind({});
Plain.args = { containerFormat: 'plain' };
