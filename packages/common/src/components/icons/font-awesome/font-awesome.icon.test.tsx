// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import {
  FontAwesomeIcon,
  initializeFontAwesomeIcon,
} from './font-awesome.icon';

describe('FontAwesomeIcon', () => {
  it('initializes icon component', () => {
    const ComponentMock = () => <div />;

    initializeFontAwesomeIcon(ComponentMock);

    expect(FontAwesomeIcon).toBe(ComponentMock);
  });
});
