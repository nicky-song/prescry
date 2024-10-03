// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { NotificationColor } from '../../../theming/colors';
import { PharmacyTagList } from './pharmacy-tag-list';
import { pharmacyTagListStyles } from './pharmacy-tag-list.styles';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { TagList } from '../../lists/tag/tag.list';
import { IBaseTagProps } from '../base/base.tag';

jest.mock('../../lists/tag/tag.list', () => ({
  TagList: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

describe('FavoriteTag', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValue({
      content: {
        favoriteTagLabel: 'favorite-tag-label-mock',
        bestValueLabel: 'best-value-label-mock',
        homeDeliveryLabel: 'home-delivery-label-mock',
      },
      isContentLoading: false,
    });
  });
  it.each([
    [true, true, true],
    [true, true, false],
    [true, false, true],
    [true, false, false],
    [false, true, true],
    [false, true, false],
    [false, false, true],
    [false, false, false],
    [true, undefined, undefined],
    [undefined, true, undefined],
    [undefined, undefined, true],
    [undefined, undefined, undefined],
  ])(
    'renders as TagList with expected props (isBestValue: %s, isFavoritedPharmacy: %s, isHomeDelivery: %s)',
    (
      isBestValue?: boolean,
      isFavoritedPharmacy?: boolean,
      isHomeDelivery?: boolean
    ) => {
      const favoriteTagLabelMock = 'favorite-tag-label-mock';
      const bestValueLabelMock = 'best-value-label-mock';
      const homeDeliveryLabelMock = 'home-delivery-label-mock';
      const isContentLoadingMock = false;

      useContentMock.mockReset();
      useContentMock.mockReturnValue({
        content: {
          favoriteTagLabel: favoriteTagLabelMock,
          bestValueLabel: bestValueLabelMock,
          homeDeliveryLabel: homeDeliveryLabelMock,
        },
        isContentLoading: isContentLoadingMock,
      });

      const viewStyleMock: ViewStyle = { borderColor: 'purple' };

      const expectedBestValueTagLabel = bestValueLabelMock;
      const expectedBestValueLabelTextStyle =
        pharmacyTagListStyles.bestValueLabelTextStyle;
      const expectedBestValueTagIsSkeleton = isContentLoadingMock;
      const expectedBestValueTagViewStyle =
        pharmacyTagListStyles.bestValueTagViewStyle;

      const expectedBestValueTagProps: IBaseTagProps = {
        label: expectedBestValueTagLabel,
        labelTextStyle: expectedBestValueLabelTextStyle,
        isSkeleton: expectedBestValueTagIsSkeleton,
        viewStyle: expectedBestValueTagViewStyle,
      };

      const expectedFavoritedPharmacyLabel = favoriteTagLabelMock;
      const expectedFavoritedPharmacyLabelTextStyle =
        pharmacyTagListStyles.favoritedPharmacyLabelTextStyle;
      const expectedFavoritedPharmacyIconName = 'heart';
      const expectedFavoritedPharmacyIconSolid = true;
      const expectedFavoritedPharmacyIconColor = NotificationColor.heartRed;
      const expectedFavoritedPharmacyIsSkeleton = isContentLoadingMock;
      const expectedFavoritedPharmacyViewStyle =
        pharmacyTagListStyles.favoritedPharmacyTagViewStyle;

      const expectedFavoritedPharmacyTagProps: IBaseTagProps = {
        label: expectedFavoritedPharmacyLabel,
        labelTextStyle: expectedFavoritedPharmacyLabelTextStyle,
        iconName: expectedFavoritedPharmacyIconName,
        iconSolid: expectedFavoritedPharmacyIconSolid,
        iconColor: expectedFavoritedPharmacyIconColor,
        isSkeleton: expectedFavoritedPharmacyIsSkeleton,
        viewStyle: expectedFavoritedPharmacyViewStyle,
      };

      const expectedHomeDeliveryLabel = homeDeliveryLabelMock;
      const expectedHomeDeliveryLabelTextStyle =
        pharmacyTagListStyles.homeDeliveryLabelTextStyle;
      const expectedHomeDeliveryIsSkeleton = isContentLoadingMock;
      const expectedHomeDeliveryViewStyle =
        pharmacyTagListStyles.homeDeliveryTagViewStyle;

      const expectedHomeDeliveryTagProps: IBaseTagProps = {
        label: expectedHomeDeliveryLabel,
        labelTextStyle: expectedHomeDeliveryLabelTextStyle,
        isSkeleton: expectedHomeDeliveryIsSkeleton,
        viewStyle: expectedHomeDeliveryViewStyle,
      };

      const testRenderer = renderer.create(
        <PharmacyTagList
          viewStyle={viewStyleMock}
          isFavoritedPharmacy={isFavoritedPharmacy}
          isBestValue={isBestValue}
          isHomeDelivery={isHomeDelivery}
        />
      );

      const tagList = testRenderer.root.children[0] as ReactTestInstance;

      if (!isBestValue && !isFavoritedPharmacy && !isHomeDelivery) {
        expect(tagList).toBeUndefined();
      } else {
        const expectedTags = [];

        if (isBestValue) {
          expectedTags.push(expectedBestValueTagProps);
        }

        if (isFavoritedPharmacy) {
          expectedTags.push(expectedFavoritedPharmacyTagProps);
        }

        if (isHomeDelivery) {
          expectedTags.push(expectedHomeDeliveryTagProps);
        }

        expect(tagList.type).toEqual(TagList);
        expect(tagList.props.tags).toEqual(expectedTags);
        expect(tagList.props.viewStyle).toEqual(viewStyleMock);
      }
    }
  );
});
