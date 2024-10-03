// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../../../../../theming/spacing';
import {
  IDrugWithPriceSectionStyles,
  drugWithPriceSectionStyles,
} from './drug-with-price.section.styles';

describe('drugWithPriceSectionStyles', () => {
  it('has expected content', () => {
    const expectedStyles: IDrugWithPriceSectionStyles = {
      priceContainerViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: Spacing.threeQuarters,
      },
      priceTextStyle: {
        textAlign: 'right',
        flex: 2,
      },
      planPaysContainerViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: Spacing.base,
      },
      planPriceTextStyle: { textAlign: 'right', flex: 2 },
    };

    expect(drugWithPriceSectionStyles).toEqual(expectedStyles);
  });
});
