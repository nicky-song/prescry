// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { HtmlView, IHtmlViewProps } from './html-view';

export default {
  title: 'Text/HtmlView',
  component: HtmlView,
};

const ArgsWrapper: Story<IHtmlViewProps> = (args) => (
  <HtmlView {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  htmlContent: '<p><a href="http://jsdf.co">&hearts; nice job!</a></p>',
  jsonHtmlCss: `{
    "a": {
      "fontWeight": 300,
      "color": "#FF3366"
    }
  }`
};
