// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../../testing/test.helper';
import { FavoriteIconButton } from '../../../buttons/favorite-icon/favorite-icon.button';
import { BaseText } from '../../../text/base-text/base-text';
import { FavoritePharmacyCard } from './favorite-pharmacy.card';
import { favoritePharmacyCardStyles } from './favorite-pharmacy.card.styles';

jest.mock('../../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock('../../../buttons/favorite-icon/favorite-icon.button', () => ({
  FavoriteIconButton: () => <div />,
}));

describe('FavoritePharmacyCard', () => {
  const onPressMock = jest.fn();
  const pharmacyNameMock = 'pharmacy-name-mock';
  const pharmacyAddressMock = 'pharmacy-address-mock';
  const pharmacyNcpdpMock = 'pharmacy-ncpdp-mock';
  const viewStyleMock: ViewStyle = { backgroundColor: 'purple' };
  const isDisabledMock = false;
  const pharmacyTestIDMock = 'pharmacy-test-id-mock';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with expected View parent w/ favoritePharmacyCardViewStyle', () => {
    const testRenderer = renderer.create(
      <FavoritePharmacyCard
        onPress={onPressMock}
        pharmacyName={pharmacyNameMock}
        pharmacyAddress={pharmacyAddressMock}
        pharmacyNcpdp={pharmacyNcpdpMock}
        viewStyle={viewStyleMock}
        testID={pharmacyTestIDMock}
      />
    );

    const favoritePharmacyCardView = testRenderer.root
      .children[0] as ReactTestInstance;

    expect(favoritePharmacyCardView.type).toEqual(View);
    expect(favoritePharmacyCardView.props.style).toEqual([
      favoritePharmacyCardStyles.favoritePharmacyCardViewStyle,
      viewStyleMock,
    ]);
    expect(favoritePharmacyCardView.props.testID).toEqual(pharmacyTestIDMock);
    expect(getChildren(favoritePharmacyCardView).length).toEqual(2);
  });

  it('renders with expected pharmacy name and address View child w/ pharmacyNameAndAddressViewStyle', () => {
    const testRenderer = renderer.create(
      <FavoritePharmacyCard
        onPress={onPressMock}
        pharmacyName={pharmacyNameMock}
        pharmacyAddress={pharmacyAddressMock}
        pharmacyNcpdp={pharmacyNcpdpMock}
      />
    );

    const favoritePharmacyCardView = testRenderer.root
      .children[0] as ReactTestInstance;

    const pharmacyNameAndAddressView = getChildren(favoritePharmacyCardView)[0];

    expect(pharmacyNameAndAddressView.type).toEqual(View);
    expect(pharmacyNameAndAddressView.props.style).toEqual(
      favoritePharmacyCardStyles.pharmacyNameAndAddressViewStyle
    );
    expect(getChildren(pharmacyNameAndAddressView).length).toEqual(2);
  });

  it('renders with expected pharmacy name and address BaseText children w/ pharmacyNameTextStyle', () => {
    const testRenderer = renderer.create(
      <FavoritePharmacyCard
        onPress={onPressMock}
        pharmacyName={pharmacyNameMock}
        pharmacyAddress={pharmacyAddressMock}
        pharmacyNcpdp={pharmacyNcpdpMock}
      />
    );

    const favoritePharmacyCardView = testRenderer.root
      .children[0] as ReactTestInstance;

    const pharmacyNameAndAddressView = getChildren(favoritePharmacyCardView)[0];

    const pharmacyNameBaseText = getChildren(pharmacyNameAndAddressView)[0];
    const pharmacyAddressBaseText = getChildren(pharmacyNameAndAddressView)[1];

    expect(pharmacyNameBaseText.type).toEqual(BaseText);
    expect(pharmacyNameBaseText.props.style).toEqual(
      favoritePharmacyCardStyles.pharmacyNameTextStyle
    );
    expect(pharmacyNameBaseText.props.isSkeleton).toEqual(undefined);
    expect(pharmacyNameBaseText.props.skeletonWidth).toEqual('short');
    expect(pharmacyNameBaseText.props.children).toEqual(pharmacyNameMock);

    expect(pharmacyAddressBaseText.type).toEqual(BaseText);
    expect(pharmacyAddressBaseText.props.isSkeleton).toEqual(undefined);
    expect(pharmacyAddressBaseText.props.skeletonWidth).toEqual('long');
    expect(pharmacyAddressBaseText.props.children).toEqual(pharmacyAddressMock);
  });

  it('renders with expected FavoriteIconButton', async () => {
    const testRenderer = renderer.create(
      <FavoritePharmacyCard
        onPress={onPressMock}
        pharmacyName={pharmacyNameMock}
        pharmacyAddress={pharmacyAddressMock}
        pharmacyNcpdp={pharmacyNcpdpMock}
        isDisabled={isDisabledMock}
      />
    );

    const favoritePharmacyCardView = testRenderer.root
      .children[0] as ReactTestInstance;

    const favoriteIconButtonWrapperView = getChildren(
      favoritePharmacyCardView
    )[1];

    expect(favoriteIconButtonWrapperView.type).toEqual(View);
    expect(favoriteIconButtonWrapperView.props.style).toEqual(
      favoritePharmacyCardStyles.favoriteIconButtonWrapperViewStyle
    );
    expect(getChildren(favoriteIconButtonWrapperView).length).toEqual(1);

    const favoriteIconButton = getChildren(favoriteIconButtonWrapperView)[0];

    expect(favoriteIconButton.type).toEqual(FavoriteIconButton);
    expect(favoriteIconButton.props.onPress).toEqual(expect.any(Function));
    expect(favoriteIconButton.props.ncpdp).toEqual(pharmacyNcpdpMock);
    expect(favoriteIconButton.props.isDisabled).toEqual(isDisabledMock);

    await favoriteIconButton.props.onPress();

    expect(onPressMock).toHaveBeenCalled();
    expect(favoriteIconButton.props.testID).toEqual(
      'favoriteIconButtonOnFavoritePharmacyCard'
    );
  });
});
