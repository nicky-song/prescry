// Copyright 2021 Prescryptive Health, Inc.

import {
  IApplicationHeaderLogoStyles,
  applicationHeaderLogoStyles,
} from './application-header-logo.styles';

describe('applicationHeaderLogoStyle', () => {
  it('has expected styles', () => {
    const expectedStyles: IApplicationHeaderLogoStyles = {
      imageMyPrescryptiveStyle: {
        height: 60,
        width: 150,
      },
    };

    expect(applicationHeaderLogoStyles).toEqual(expectedStyles);
  });
});
