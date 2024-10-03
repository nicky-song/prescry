// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { FAQ, IFAQProps, IQuestionAnswerPair } from './faq';

const mockCardOne: IQuestionAnswerPair = {
  question: 'Why was the JavaScript developer sad?',
  answer: "Because he didn't Node how to Express himself.",
};

const mockCardTwo: IQuestionAnswerPair = {
  question: 'Why did the developer go broke?',
  answer: 'Because he used up all his cache.',
};

const mockData: IQuestionAnswerPair[] = [mockCardOne, mockCardTwo];

export default {
  title: 'Prescription/FAQ',
  component: FAQ,
  args: { questionAnswerPairs: mockData },
};

const ArgsWrapper: Story<IFAQProps> = (args: IFAQProps) => <FAQ {...args} />;

export const Default = ArgsWrapper.bind({});
Default.args = {};
