// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../../../../theming/spacing';
import {
  sendLinkFormStyles,
  ISendLinkFormStyles,
} from './send-link.form.styles';

describe('sendLinkFormStyles', () => {
  it('has correct styles', () => {
    const expectedStyle: ISendLinkFormStyles = {
      containerViewStyle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      },
      sendLinkButtonViewStyle: {
        marginLeft: Spacing.base,
      },
      getALinkTextStyle: {
        marginBottom: Spacing.times1pt5,
      },
      phoneInputViewStyle: {
        maxWidth: 240,
      },
    };

    expect(sendLinkFormStyles).toEqual(expectedStyle);
  });
});
