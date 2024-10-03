// Copyright 2022 Prescryptive Health, Inc.

import { BorderRadius } from '../../../theming/borders';
import { GrayScaleColor, NotificationColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import {
  ILocationAutocompleteInputStyles,
  locationAutocompleteInputStyles,
} from './location-autocomplete.input.styles';

describe('locationAutocompleteInputStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: ILocationAutocompleteInputStyles = {
      suggestionListStyle: {
        backgroundColor: GrayScaleColor.white,
        display: 'flex',
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: GrayScaleColor.borderLines,
        borderRadius: BorderRadius.half,
      },
      spinnerViewStyle: {
        paddingVertical: Spacing.times1pt5,
      },
      suggestionItemStyle: {
        padding: Spacing.threeQuarters,
        borderBottomWidth: 1,
        borderBottomColor: GrayScaleColor.borderLines,
      },
      suggestionItemNoBorderStyle: {
        borderBottomWidth: 0,
      },
      errorTextStyle: {
        color: NotificationColor.red,
        marginTop: Spacing.base,
      },
    };

    expect(locationAutocompleteInputStyles).toEqual(expectedStyles);
  });
});
