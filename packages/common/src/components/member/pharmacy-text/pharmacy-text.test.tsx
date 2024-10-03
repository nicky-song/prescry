// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { View } from 'react-native';
import { BaseText } from '../../text/base-text/base-text';
import { Heading } from '../heading/heading';
import { pharmacyTextStyles as styles } from './pharmacy-text.style';
import { PharmacyText, IPharmacyTextProps } from './pharmacy-text';
import { ITransferFlowContent } from '../../../experiences/guest-experience/screens/shopping/order-preview/transfer-flow.ui-content.model';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { useMembershipContext } from '../../../experiences/guest-experience/context-providers/membership/use-membership-context.hook';
import { FavoriteIconButton } from '../../buttons/favorite-icon/favorite-icon.button';
import { getChildren, getKey } from '../../../testing/test.helper';

jest.mock(
  '../../../experiences/guest-experience/context-providers/membership/use-membership-context.hook'
);
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock('../../buttons/favorite-icon/favorite-icon.button', () => ({
  ...jest.requireActual('../../buttons/favorite-icon/favorite-icon.button'),
  FavoriteIconButton: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);

const useContentMock = useContent as jest.Mock;

jest.mock('../../primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

const contentMock: Partial<ITransferFlowContent> = {
  couponDeliveryInfoDescription: 'coupon-delivery-info-description-mock',
  deliveryInfoDescription: 'delivery-info-description-mock',
};

const mockPharmacyOne: IPharmacyTextProps = {
  pharmacy: 'Fred Meyer Pharmacy #21',
};

const mockPharmacyTwo: IPharmacyTextProps = {
  pharmacy: 'Prescryptive Pharmacy #1',
  alternative: 'Visit myrx.io today!',
};

const mockPharmacyThree: IPharmacyTextProps = {
  pharmacy: 'Prescryptive Pharmacy #3',
  hasCoupon: true,
};

describe('PharmacyText', () => {
  const favoritedNcpdpMock = 'favorited-ncpdp-mock';
  const favoritedPharmaciesMock = [favoritedNcpdpMock];

  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: false,
    });

    useMembershipContextMock.mockReturnValue({
      membershipState: {
        account: { favoritedPharmacies: favoritedPharmaciesMock },
      },
    });
  });
  it('renders as expected View (default)', () => {
    const testRenderer = renderer.create(<PharmacyText {...mockPharmacyOne} />);
    const view = testRenderer.root.findByType(View);
    expect(view.type).toEqual(View);
    expect(view.props.children.length).toEqual(2);
  });
  it('renders as expected View (alternative)', () => {
    const testRenderer = renderer.create(<PharmacyText {...mockPharmacyTwo} />);
    const view = testRenderer.root.findByType(View);
    expect(view.type).toEqual(View);
    expect(view.props.children.length).toEqual(2);
  });
  it('renders with expected contents (default)', () => {
    const testRenderer = renderer.create(<PharmacyText {...mockPharmacyOne} />);
    const view = testRenderer.root.findByType(View);
    const headingView = getChildren(view)[0];
    const descriptionText = getChildren(view)[1];
    const headingText = getChildren(headingView)[0];
    const favoriteIconButton = getChildren(headingView)[1];

    expect(headingView.type).toEqual(View);
    expect(headingView.props.style).toEqual(styles.headingViewStyle);
    expect(headingText.type).toEqual(Heading);
    expect(headingText.props.translateContent).toEqual(false);
    expect(descriptionText.props.children).toEqual(
      contentMock.deliveryInfoDescription
    );
    expect(descriptionText.type).toEqual(BaseText);
    expect(headingText.props.children).toEqual(
      mockPharmacyOne.pharmacy.toUpperCase()
    );
    expect(favoriteIconButton).toBeFalsy();
  });
  it('renders with expected contents (favorite)', () => {
    const onFavoriteIconButtonPressMock = jest.fn();
    const testRenderer = renderer.create(
      <PharmacyText
        {...mockPharmacyOne}
        ncpdp={favoritedNcpdpMock}
        onFavoriteIconButtonPress={onFavoriteIconButtonPressMock}
      />
    );
    const view = testRenderer.root.findByType(View);
    const headingView = getChildren(view)[0];
    const descriptionText = getChildren(view)[1];
    const headingText = getChildren(headingView)[0];
    const favoriteIconButton = getChildren(headingView)[1];
    expect(headingText.type).toEqual(Heading);
    expect(descriptionText.props.children).toEqual(
      contentMock.deliveryInfoDescription
    );
    expect(descriptionText.type).toEqual(BaseText);
    expect(headingText.props.children).toEqual(
      mockPharmacyOne.pharmacy.toUpperCase()
    );
    expect(favoriteIconButton.type).toEqual(FavoriteIconButton);
    expect(favoriteIconButton.props.onPress).toEqual(
      onFavoriteIconButtonPressMock
    );
    expect(favoriteIconButton.props.ncpdp).toEqual(favoritedNcpdpMock);
    expect(favoriteIconButton.props.testID).toEqual(
      'favoriteIconButtonOnPharmacyText'
    );
    expect(getKey(favoriteIconButton)).toEqual(
      `${favoritedPharmaciesMock}${favoritedNcpdpMock}`
    );
  });
  it('renders with expected contents (alternative)', () => {
    const testRenderer = renderer.create(<PharmacyText {...mockPharmacyTwo} />);
    const view = testRenderer.root.findByType(View);
    const headingView = getChildren(view)[0];
    const descriptionText = getChildren(view)[1];
    const headingText = getChildren(headingView)[0];
    expect(headingText.type).toEqual(Heading);
    expect(descriptionText.type).toEqual(BaseText);
    expect(descriptionText.props.style).toEqual(styles.descriptionTextStyle);
    expect(headingText.props.children).toEqual(
      mockPharmacyTwo.pharmacy.toUpperCase()
    );
    expect(descriptionText.props.children).toEqual(mockPharmacyTwo.alternative);
  });

  it('renders with expected contents (hasCoupon)', () => {
    const testRenderer = renderer.create(
      <PharmacyText {...mockPharmacyThree} />
    );
    const view = testRenderer.root.findByType(View);
    const headingView = getChildren(view)[0];
    const descriptionText = getChildren(view)[1];
    const headingText = getChildren(headingView)[0];
    expect(headingText.type).toEqual(Heading);
    expect(descriptionText.type).toEqual(BaseText);

    expect(descriptionText.props.style).toEqual(styles.descriptionTextStyle);
    expect(headingText.props.children).toEqual(
      mockPharmacyThree.pharmacy.toUpperCase()
    );
    expect(descriptionText.props.children).toEqual(
      contentMock.couponDeliveryInfoDescription
    );
  });

  it('renders skeletons when isSkeleton is true', () => {
    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: true,
    });
    const testRenderer = renderer.create(<PharmacyText {...mockPharmacyOne} />);
    const view = testRenderer.root.findByType(View);
    const headingView = getChildren(view)[0];
    const descriptionText = getChildren(view)[1];
    const headingText = getChildren(headingView)[0];
    expect(headingText.type).toEqual(Heading);
    expect(headingText.props.isSkeleton).toEqual(true);
    expect(headingText.props.skeletonWidth).toEqual('long');

    expect(descriptionText.type).toEqual(BaseText);
    expect(descriptionText.props.isSkeleton).toEqual(true);
    expect(descriptionText.props.skeletonWidth).toEqual('medium');
  });
});
