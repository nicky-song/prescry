// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { StrokeCard, IStrokeCardProps } from './stroke.card';
import { BaseText } from '../../text/base-text/base-text';

export default {
  title: 'Cards/StrokeCard',
  component: StrokeCard,
};

const ArgsWrapper: Story<IStrokeCardProps> = (args) => <StrokeCard {...args} />;

export const Default = ArgsWrapper.bind({});
Default.args = {
  children: (
    <BaseText>
      Bacon ipsum dolor amet jowl doner prosciutto tri-tip. Tri-tip tail
      burgdoggen ball tip. Shoulder rump pancetta, bacon turducken short loin
      tenderloin meatloaf bresaola drumstick andouille ball tip. Short ribs
      prosciutto pig shankle pork loin fatback landjaeger flank tri-tip.
      Leberkas doner meatloaf pork belly flank swine fatback beef ribs ball tip
      cow rump chuck. Ribeye beef jowl boudin turducken. Frankfurter pancetta
      buffalo capicola shoulder landjaeger.
    </BaseText>
  ),
};
