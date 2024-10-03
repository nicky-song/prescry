// Copyright 2021 Prescryptive Health, Inc.

import { FontSize } from '../../../../../theming/fonts';
import { Spacing } from '../../../../../theming/spacing';
import {
  createAccountBodyStyles,
  ICreateAccountBodyStyles,
} from './create-account.body.styles';

describe('createAccountBodyStyles', () => {
  it('should have correct styles', () => {
    const expectedStyles: ICreateAccountBodyStyles = {
      textFieldsViewStyle: {
        marginTop: Spacing.times1pt5,
      },
      fullItemViewStyle: {
        marginTop: Spacing.times1pt5,
        justifyContent: 'flex-start',
        maxWidth: '100%',
        width: '100%',
      },
      createAccountBodyContainerViewStyle: {
        flexDirection: 'column',
      },
      dateWrapperViewStyle: {
        marginTop: Spacing.times1pt5,
      },
      fullNameViewStyle: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
      },
      leftItemViewStyle: {
        marginTop: Spacing.times1pt5,
        justifyContent: 'flex-start',
        maxWidth: '48%',
      },
      rightItemViewStyle: {
        marginTop: Spacing.times1pt5,
        justifyContent: 'flex-end',
        maxWidth: '48%',
      },
      termsAndConditionsViewStyle: {
        marginTop: Spacing.times2,
        marginBottom: Spacing.base,
      },
      termsAndConditionsBelowViewStyle: {
        marginTop: Spacing.base,
        marginBottom: Spacing.base,
      },
      attestAuthorizationViewStyle: {
        marginTop: Spacing.times2,
      },
      helpTextStyle: {
        marginTop: Spacing.threeQuarters,
        fontSize: FontSize.small,
      },
      errorTextStyle: {
        marginTop: Spacing.threeQuarters,
      },
    };

    expect(createAccountBodyStyles).toEqual(expectedStyles);
  });
});
