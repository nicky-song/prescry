// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { MarkdownText, IMarkdownTextProps } from './markdown-text';

export default {
  title: 'Text/MarkdownText',
  component: MarkdownText,
  argTypes: {
    onLinkPress: { action: 'onLinkPress' },
  },
};

const ArgsWrapper: Story<IMarkdownTextProps> = (args) => (
  <MarkdownText {...args} />
);

export const BoldAndItalic = ArgsWrapper.bind({});
BoldAndItalic.storyName = 'Bold and italic';
BoldAndItalic.args = {
  children: 'Sample markdown with some **bold** and *italic* text.',
};

export const Links = ArgsWrapper.bind({});
Links.args = {
  children:
    'Sample markdown with [a link](#alink) and [another link](#anotherLink).',
};

export const RedWithLinks = ArgsWrapper.bind({});
RedWithLinks.storyName = 'Red with links';
RedWithLinks.args = {
  color: 'red',
  children:
    'Sample markdown with [a link](#alink) and [another link](#anotherLink).',
};

export const SmallerFont = ArgsWrapper.bind({});
SmallerFont.storyName = 'Smaller font (14px)';
SmallerFont.args = {
  textStyle: { fontSize: 14 },
  children:
    'Sample markdown with [a link](#alink) and [another link](#anotherLink).',
};
