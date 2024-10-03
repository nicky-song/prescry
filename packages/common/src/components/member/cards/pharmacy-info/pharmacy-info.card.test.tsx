// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { IAddress } from '../../../../models/address';
import { PharmacyInfoCard } from './pharmacy-info.card';
import {
  pharmacyInfoCardStyles,
  pharmacyInfoCardStyles as styles,
} from './pharmacy-info.card.styles';
import { ChevronCard } from '../../../cards/chevron/chevron.card';
import { BaseText } from '../../../text/base-text/base-text';
import { pharmacyInfoCardContent } from './pharmacy-info.card.content';
import { getChildren } from '../../../../testing/test.helper';
import { useMembershipContext } from '../../../../experiences/guest-experience/context-providers/membership/use-membership-context.hook';
import { PharmacyTagList } from '../../../tags/pharmacy/pharmacy-tag-list';
import { ProtectedBaseText } from '../../../text/protected-base-text/protected-base-text';

jest.mock('../../../tags/pharmacy/pharmacy-tag-list', () => ({
  PharmacyTagList: () => <div />,
}));

jest.mock(
  '../../../../experiences/guest-experience/context-providers/membership/use-membership-context.hook'
);
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock('../../../cards/chevron/chevron.card', () => ({
  ChevronCard: () => <div />,
}));

jest.mock('../../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

const onPressMock = jest.fn();
const addressMock: IAddress = {
  lineOne: '1234 Pharmacy Blvd',
  city: 'Redmond',
  state: 'WA',
  zip: '98052',
};
const distanceMock = 3.3;
const serviceStatusMock = 'Opens 6:00 am';
const viewStyleMock: ViewStyle = { backgroundColor: 'purple' };
const ncpdpMock = 'ncpdp-mock';
const favoriteNcpdpMock = 'favorite-ncpdp-mock';
const testIDMock = 'testIDMock';

describe('PharmacyInfoCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useMembershipContextMock.mockReturnValue({
      membershipState: {
        account: { favoritedPharmacies: [favoriteNcpdpMock] },
      },
    });
  });

  it.each([[undefined], [viewStyleMock]])(
    'renders as ChevronCard with expected props and components',
    (contentViewStyle?: ViewStyle) => {
      const testRenderer = renderer.create(
        <PharmacyInfoCard
          onPress={onPressMock}
          address={addressMock}
          ncpdp={favoriteNcpdpMock}
          distance={distanceMock}
          serviceStatus={serviceStatusMock}
          viewStyle={contentViewStyle}
        />
      );
      const view = testRenderer.root.children[0] as ReactTestInstance;

      expect(view.type).toEqual(View);
      expect(view.props.style).toEqual([
        pharmacyInfoCardStyles.contentViewStyle,
        contentViewStyle,
      ]);
      expect(getChildren(view).length).toEqual(2);

      const pharmacyTagList = getChildren(view)[0];

      expect(pharmacyTagList.type).toEqual(PharmacyTagList);
      expect(pharmacyTagList.props.isFavoritedPharmacy).toEqual(true);
      expect(pharmacyTagList.props.isBestValue).toEqual(undefined);
      expect(pharmacyTagList.props.isHomeDelivery).toEqual(undefined);
      expect(pharmacyTagList.props.viewStyle).toEqual(
        pharmacyInfoCardStyles.pharmacyTagListViewStyle
      );

      const chevronCard = getChildren(view)[1];
      const chevronCardChildren = getChildren(chevronCard);

      expect(chevronCardChildren.length).toEqual(1);

      const pharmacyInfoView = chevronCardChildren[0];
      const pharmacyInfoViewChildren = pharmacyInfoView.props.children;

      expect(pharmacyInfoViewChildren.length).toEqual(2);

      const addressText = pharmacyInfoViewChildren[0];
      const infoText = pharmacyInfoViewChildren[1];

      expect(chevronCard.type).toEqual(ChevronCard);
      expect(chevronCard.props.onPress).toEqual(onPressMock);
      expect(chevronCard.props.viewStyle).toEqual(
        pharmacyInfoCardStyles.chevronCardViewStyle
      );
      expect(pharmacyInfoView.type).toEqual(View);
      expect(addressText.type).toEqual(ProtectedBaseText);
      expect(infoText.type).toEqual(BaseText);
    }
  );

  it('renders children as View', () => {
    const testRenderer = renderer.create(
      <PharmacyInfoCard
        onPress={onPressMock}
        address={addressMock}
        ncpdp={ncpdpMock}
        distance={distanceMock}
        serviceStatus={serviceStatusMock}
        testID={testIDMock}
      />
    );
    const view = testRenderer.root.children[0] as ReactTestInstance;

    expect(view.type).toEqual(View);
    expect(view.props.style).toEqual([
      pharmacyInfoCardStyles.contentViewStyle,
      undefined,
    ]);
    expect(view.props.testID).toEqual(testIDMock);
    expect(getChildren(view).length).toEqual(2);

    const chevronCard = getChildren(view)[1];
    const chevronCardChildren = getChildren(chevronCard);

    expect(chevronCardChildren.length).toEqual(1);

    const pharmacyInfoView = chevronCardChildren[0];
    const pharmacyInfoViewChildren = getChildren(pharmacyInfoView);

    expect(pharmacyInfoView.type).toEqual(View);
    expect(pharmacyInfoView.props.style).toEqual(styles.pharmacyInfoViewStyle);
    expect(pharmacyInfoViewChildren.length).toEqual(2);
  });

  it('renders PharmacyTagList as null if not favorited', () => {
    const testRenderer = renderer.create(
      <PharmacyInfoCard
        onPress={onPressMock}
        address={addressMock}
        ncpdp={ncpdpMock}
        distance={distanceMock}
        serviceStatus={serviceStatusMock}
      />
    );
    const view = testRenderer.root.children[0] as ReactTestInstance;

    const pharmacyTagList = getChildren(view)[0];

    expect(pharmacyTagList.type).toEqual(PharmacyTagList);
    expect(pharmacyTagList.props.isFavoritedPharmacy).toEqual(false);
    expect(pharmacyTagList.props.viewStyle).toEqual(
      pharmacyInfoCardStyles.pharmacyTagListViewStyle
    );
    expect(pharmacyTagList.props.isHomeDelivery).toEqual(undefined);
    expect(pharmacyTagList.props.isBestValue).toEqual(undefined);
  });

  it('renders pharmacyInfoView as children', () => {
    const testRenderer = renderer.create(
      <PharmacyInfoCard
        onPress={onPressMock}
        address={addressMock}
        ncpdp={ncpdpMock}
        distance={distanceMock}
        serviceStatus={serviceStatusMock}
      />
    );
    const view = testRenderer.root.children[0] as ReactTestInstance;

    const chevronCard = getChildren(view)[1];
    const chevronCardChildren = getChildren(chevronCard);
    const pharmacyInfoView = chevronCardChildren[0];

    expect(pharmacyInfoView.type).toEqual(View);
    expect(pharmacyInfoView.props.style).toEqual(styles.pharmacyInfoViewStyle);
  });

  it('renders address text in pharmacyInfoView', () => {
    const testRenderer = renderer.create(
      <PharmacyInfoCard
        onPress={onPressMock}
        address={addressMock}
        ncpdp={ncpdpMock}
        distance={distanceMock}
        serviceStatus={serviceStatusMock}
      />
    );
    const view = testRenderer.root.children[0] as ReactTestInstance;

    const chevronCard = getChildren(view)[1];
    const pharmacyInfoView = getChildren(chevronCard)[0];

    const addressText = getChildren(pharmacyInfoView)[0];
    const addressLineOne = getChildren(addressText)[0];

    expect(addressText.type).toEqual(ProtectedBaseText);
    expect(addressText.props.style).toEqual(styles.addressTextStyle);
    expect(addressLineOne).toEqual(addressMock.lineOne);
  });

  it.each([[undefined], [distanceMock]])(
    'renders info text in pharmacyInfoView',
    (distance?: number) => {
      const testRenderer = renderer.create(
        <PharmacyInfoCard
          onPress={onPressMock}
          address={addressMock}
          ncpdp={ncpdpMock}
          distance={distance}
          serviceStatus={serviceStatusMock}
        />
      );
      const view = testRenderer.root.children[0] as ReactTestInstance;

      const chevronCard = getChildren(view)[1];
      const pharmacyInfoView = getChildren(chevronCard)[0];
      const pharmacyInfoViewChildren = getChildren(pharmacyInfoView);
      const infoText = pharmacyInfoViewChildren[1];

      expect(infoText.type).toEqual(BaseText);

      const distanceText =
        distance && pharmacyInfoCardContent.distanceText(distance);
      const pharmacyInfoText = getChildren(infoText)[0];

      expect(pharmacyInfoText).toEqual(
        distance !== undefined
          ? `${distanceText} | ${serviceStatusMock}`
          : serviceStatusMock
      );
    }
  );
});
