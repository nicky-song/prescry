// Copyright 2023 Prescryptive Health, Inc.

import {
  attestAuthorizationCheckboxStyles,
  IAttestAuthorizationCheckboxStyles,
} from './attest-authorization.checkbox.styles';

describe('attestAuthorizationCheckboxStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IAttestAuthorizationCheckboxStyles = {
      checkBoxImageStyle: { alignSelf: 'flex-start' },
    };

    expect(attestAuthorizationCheckboxStyles).toEqual(expectedStyles);
  });
});
