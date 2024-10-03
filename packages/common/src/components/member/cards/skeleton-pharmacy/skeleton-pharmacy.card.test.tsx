// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer from 'react-test-renderer';
import { SkeletonBone } from '../../../primitives/skeleton-bone';
import { SkeletonPharmacyCard } from './skeleton-pharmacy.card';
import { skeletonPharmacyCardStyles } from './skeleton-pharmacy.card.styles';
import { PharmacyTagList } from '../../../tags/pharmacy/pharmacy-tag-list';

jest.mock('../../../tags/pharmacy/pharmacy-tag-list', () => ({
  PharmacyTagList: () => <div />,
}));

jest.mock('../prescription-value/prescription-value.card', () => ({
  renderPharmacyLabel: jest.fn().mockReturnValue('tag-container-render-mock'),
}));

jest.mock('../../../primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

describe('SkeletonPharmacyCard', () => {
  it.each([
    ['default', false, false],
    ['best price', true, false],
    ['line separator', false, true],
    ['best price + line separator', true, true],
  ])(
    'should render with expected props using %s props',
    (_variation: string, isBestPricePharmacy: boolean) => {
      const {
        skeletonPharmacyCardViewStyle,
        containerViewStyle,
        pharmacyNameViewStyle,
        pharmacyAddressViewStyle,
        distanceAndHoursViewStyle,
        priceViewStyle,
        firstBottomContentViewStyle,
        secondBottomContentViewStyle,
        pharmacyTagListViewStyle,
      } = skeletonPharmacyCardStyles;
      const layoutViewStyleList: ViewStyle[] = [
        pharmacyNameViewStyle,
        pharmacyAddressViewStyle,
        distanceAndHoursViewStyle,
        priceViewStyle,
        firstBottomContentViewStyle,
        secondBottomContentViewStyle,
      ];

      const testRenderer = renderer.create(
        <SkeletonPharmacyCard isBestPricePharmacy={isBestPricePharmacy} />
      );

      const skeletonPharmacyCard = testRenderer.root.findByType(View);

      expect(skeletonPharmacyCard.props.style).toEqual([
        skeletonPharmacyCardViewStyle,
        undefined,
      ]);

      const skeletonPharmacyCardContent = skeletonPharmacyCard.props.children;

      expect(skeletonPharmacyCardContent.length).toEqual(2);

      const pharmacyTagList = skeletonPharmacyCardContent[0];
      const skeletonBone = skeletonPharmacyCardContent[1];

      if (isBestPricePharmacy) {
        expect(pharmacyTagList.type).toEqual(PharmacyTagList);
        expect(pharmacyTagList.props.isBestValue).toEqual(true);
        expect(pharmacyTagList.props.viewStyle).toEqual(
          pharmacyTagListViewStyle
        );
      } else {
        expect(pharmacyTagList).toEqual(null);
      }

      expect(skeletonBone.type).toEqual(SkeletonBone);
      expect(skeletonBone.props.containerViewStyle).toEqual(containerViewStyle);
      expect(skeletonBone.props.layoutViewStyleList).toEqual(
        layoutViewStyleList
      );
    }
  );
});
