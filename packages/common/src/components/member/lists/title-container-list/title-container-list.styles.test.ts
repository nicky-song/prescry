// Copyright 2020 Prescryptive Health, Inc.

import { Spacing } from '../../../../theming/spacing';
import {
  ITitleContainerListStyles,
  titleContainerListStyles,
} from './title-container-list.styles';

describe('titleContainerListStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: ITitleContainerListStyles = {
      titleTextStyle: {
        marginBottom: Spacing.base,
      },
    };

    expect(titleContainerListStyles).toEqual(expectedStyles);
  });
});
