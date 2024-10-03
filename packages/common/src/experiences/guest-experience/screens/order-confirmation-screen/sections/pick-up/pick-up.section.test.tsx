// Copyright 2021 Prescryptive Health, Inc.

import React, { useState } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { Heading } from '../../../../../../components/member/heading/heading';
import { SectionView } from '../../../../../../components/primitives/section-view';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { getNewDate } from '../../../../../../utils/date-time/get-new-date';
import { pharmacyDrugPrice1Mock } from '../../../../__mocks__/pharmacy-drug-price.mock';
import { PickUpSection } from './pick-up.section';
import { pickUpSectionStyles } from './pick-up.section.styles';
import { PrescriptionPharmacyInfo } from '../../../../../../components/member/prescription-pharmacy-info/prescription-pharmacy-info';
import { LineSeparator } from '../../../../../../components/member/line-separator/line-separator';
import { IOrderConfirmationScreenContent } from '../../order-confirmation.screen.content';
import { useContent } from '../../../../context-providers/session/ui-content-hooks/use-content';
import {
  FavoriteIconButton,
  FavoritingAction,
} from '../../../../../../components/buttons/favorite-icon/favorite-icon.button';
import { getChildren } from '../../../../../../testing/test.helper';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { rootStackNavigationMock } from '../../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

import { useFlags } from 'launchdarkly-react-client-sdk';

jest.mock('launchdarkly-react-client-sdk');
const useFlagsMock = useFlags as jest.Mock;

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));
const useStateMock = useState as jest.Mock;

jest.mock(
  '../../../../../../components/buttons/favorite-icon/favorite-icon.button',
  () => ({
    ...jest.requireActual(
      '../../../../../../components/buttons/favorite-icon/favorite-icon.button'
    ),
    FavoriteIconButton: () => <div />,
  })
);

jest.mock('../../../../context-providers/session/ui-content-hooks/use-content');

const useContentMock = useContent as jest.Mock;

jest.mock('../../../../../../components/primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

const contentMock: Partial<IOrderConfirmationScreenContent> = {
  pickUpOpen24Hours: 'pick-up-open-24-hours-mock',
  pickUpOpen: 'pick-up-open-mock',
  pickUpClosed: 'pick-up-closed-mock',
  pickUpOpensAt: 'pick-up-opens-at-mock',
  pickUpClosesAt: 'pick-up-closes-at-mock',
  insuranceCardNoticeText: 'insurance-card-notice-text-mock',
  pickUpPreamble: 'pick-up-preample-mock',
};

jest.mock('../../../../../../utils/date-time/get-new-date');
const getNewDateMock = getNewDate as jest.Mock;

jest.mock(
  '../../../../../../components/member/prescription-pharmacy-info/prescription-pharmacy-info',
  () => ({
    PrescriptionPharmacyInfo: () => <div />,
  })
);

const onFavoriteIconButtonPressMock = jest.fn();

describe('PickUpSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getNewDateMock.mockReturnValue(new Date());

    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: false,
    });

    useStateMock.mockReturnValueOnce([false, jest.fn()]);
    useStateMock.mockReturnValueOnce([false, jest.fn()]);
    useStateMock.mockReturnValueOnce(['unfavoriting', jest.fn()]);

    useNavigationMock.mockReturnValue(rootStackNavigationMock);
    useFlagsMock.mockReturnValue({ usertpb: false });
  });

  it('renders in section', () => {
    const testRenderer = renderer.create(
      <PickUpSection
        onFavoriteIconButtonPress={onFavoriteIconButtonPressMock}
        pharmacy={pharmacyDrugPrice1Mock.pharmacy}
      />
    );

    const section = testRenderer.root.children[0] as ReactTestInstance;

    expect(section.type).toEqual(SectionView);
    expect(section.props.testID).toEqual('pickUpSection');
    expect(section.props.style).toEqual(pickUpSectionStyles.sectionViewStyle);
    expect(section.props.children.length).toEqual(5);
  });

  it('renders section separator', () => {
    const testRenderer = renderer.create(
      <PickUpSection
        onFavoriteIconButtonPress={onFavoriteIconButtonPressMock}
        pharmacy={pharmacyDrugPrice1Mock.pharmacy}
      />
    );

    const section = testRenderer.root.findByType(SectionView);
    const separator = section.props.children[0];

    expect(separator.type).toEqual(LineSeparator);
    expect(separator.props.viewStyle).toEqual(
      pickUpSectionStyles.separatorViewStyle
    );
  });

  it('renders title heading', () => {
    const testRenderer = renderer.create(
      <PickUpSection
        onFavoriteIconButtonPress={onFavoriteIconButtonPressMock}
        pharmacy={pharmacyDrugPrice1Mock.pharmacy}
      />
    );

    const section = testRenderer.root.findByType(SectionView);
    const titleHeading = section.props.children[1];

    expect(titleHeading.type).toEqual(Heading);
    expect(titleHeading.props.level).toEqual(2);
    expect(titleHeading.props.textStyle).toEqual(
      pickUpSectionStyles.heading2TextStyle
    );
    expect(titleHeading.props.children).toEqual(contentMock.pickUpHeading);
  });

  it.each([
    [true, true],
    [false, false],
    [true, undefined],
    [false, undefined],
    [true, false],
    [false, true],
  ])(
    'renders pre-amble with usertpb %p, hasInsurance %p',
    (usertpb: boolean, hasInsurance?: boolean) => {
      useFlagsMock.mockReturnValue({ usertpb });
      const testRenderer = renderer.create(
        <PickUpSection
          onFavoriteIconButtonPress={onFavoriteIconButtonPressMock}
          pharmacy={pharmacyDrugPrice1Mock.pharmacy}
          hasInsurance={hasInsurance}
        />
      );

      const section = testRenderer.root.findByType(SectionView);
      const preAmble = section.props.children[2];

      expect(preAmble.type).toEqual(BaseText);

      if (usertpb && hasInsurance) {
        expect(preAmble.props.children[0]).toEqual(contentMock.pickUpPreamble);

        expect(preAmble.props.children[2].type).toEqual(BaseText);
        expect(preAmble.props.children[2].props.weight).toEqual('semiBold');
        expect(preAmble.props.children[2].props.children).toEqual(
          contentMock.insuranceCardNoticeText
        );
      } else
        expect(preAmble.props.children).toEqual(contentMock.pickUpPreamble);
    }
  );

  it('should render insurance-card-notice-text when pricingOption is thirdParty', () => {
    const testRenderer = renderer.create(
      <PickUpSection
        onFavoriteIconButtonPress={onFavoriteIconButtonPressMock}
        pharmacy={pharmacyDrugPrice1Mock.pharmacy}
        pricingOption='thirdParty'
      />
    );

    const section = testRenderer.root.findByType(SectionView);
    const preAmble = section.props.children[2];

    expect(preAmble.type).toEqual(BaseText);

    expect(preAmble.props.children[0]).toEqual(contentMock.pickUpPreamble);

    expect(preAmble.props.children[2].type).toEqual(BaseText);
    expect(preAmble.props.children[2].props.weight).toEqual('semiBold');
    expect(preAmble.props.children[2].props.children).toEqual(
      contentMock.insuranceCardNoticeText
    );
  });

  it('renders pharmacy contact info', () => {
    const nowMock = new Date();
    getNewDateMock.mockReturnValue(nowMock);

    const pharmacyMock = pharmacyDrugPrice1Mock.pharmacy;
    const testRenderer = renderer.create(
      <PickUpSection
        onFavoriteIconButtonPress={onFavoriteIconButtonPressMock}
        pharmacy={pharmacyMock}
      />
    );

    const section = testRenderer.root.findByType(SectionView);
    const pharmacyInfo = section.props.children[4];

    expect(pharmacyInfo.type).toEqual(PrescriptionPharmacyInfo);

    expect(pharmacyInfo.props.phoneNumber).toEqual(pharmacyMock.phoneNumber);
    expect(pharmacyInfo.props.pharmacyAddress1).toEqual(
      pharmacyMock.address.lineOne
    );
    expect(pharmacyInfo.props.pharmacyCity).toEqual(pharmacyMock.address.city);
    expect(pharmacyInfo.props.pharmacyState).toEqual(
      pharmacyMock.address.state
    );
    expect(pharmacyInfo.props.pharmacyZipCode).toEqual(
      pharmacyMock.address.zip
    );
  });

  it('renders skeletons when isSkeleton is true', () => {
    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: true,
    });
    const testRenderer = renderer.create(
      <PickUpSection
        onFavoriteIconButtonPress={onFavoriteIconButtonPressMock}
        pharmacy={pharmacyDrugPrice1Mock.pharmacy}
      />
    );

    const section = testRenderer.root.findByType(SectionView);
    const titleHeading = section.props.children[1];

    expect(titleHeading.type).toEqual(Heading);
    expect(titleHeading.props.isSkeleton).toEqual(true);
    expect(titleHeading.props.skeletonWidth).toEqual('long');

    const preAmble = section.props.children[2];

    expect(preAmble.type).toEqual(BaseText);
    expect(preAmble.props.isSkeleton).toEqual(true);
    expect(preAmble.props.skeletonWidth).toEqual('medium');

    const pharmacyNameHeadingWithFavorite = section.props.children[3];

    expect(pharmacyNameHeadingWithFavorite.type).toEqual(View);
    expect(pharmacyNameHeadingWithFavorite.props.style).toEqual(
      pickUpSectionStyles.headingWithFavoriteViewStyle
    );

    const pharmacyNameHeading = getChildren(pharmacyNameHeadingWithFavorite)[0];
    const favoriteIconButton = getChildren(pharmacyNameHeadingWithFavorite)[1];

    expect(pharmacyNameHeading.type).toEqual(Heading);
    expect(pharmacyNameHeading.props.level).toEqual(3);
    expect(pharmacyNameHeading.props.textStyle).toEqual(
      pickUpSectionStyles.heading3TextStyle
    );

    expect(favoriteIconButton.type).toEqual(FavoriteIconButton);
    expect(favoriteIconButton.props.onPress).toEqual(expect.any(Function));

    const favoritingActionMock: FavoritingAction = 'favoriting';

    favoriteIconButton.props.onPress(favoritingActionMock);

    expect(onFavoriteIconButtonPressMock).toHaveBeenCalledTimes(1);

    expect(pharmacyNameHeading.type).toEqual(Heading);
    expect(pharmacyNameHeading.props.isSkeleton).toEqual(true);
    expect(pharmacyNameHeading.props.skeletonWidth).toEqual('long');

    const pharmacyInfo = section.props.children[4];

    expect(pharmacyInfo.type).toEqual(PrescriptionPharmacyInfo);

    expect(pharmacyInfo.props.isSkeleton).toEqual(true);
  });

  it('renders heading with FavoriteIconButton', () => {
    const setCurrentFavoritingStatusMock = jest.fn();

    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce([
      'success',
      setCurrentFavoritingStatusMock,
    ]);
    useStateMock.mockReturnValueOnce(['favoriting', jest.fn()]);

    const pharmacyMock = {
      ...pharmacyDrugPrice1Mock.pharmacy,
    };
    const testRenderer = renderer.create(
      <PickUpSection
        onFavoriteIconButtonPress={onFavoriteIconButtonPressMock}
        pharmacy={pharmacyMock}
      />
    );

    const section = testRenderer.root.findByType(SectionView);

    const pharmacyNameHeadingWithFavorite = getChildren(section)[3];

    expect(pharmacyNameHeadingWithFavorite.type).toEqual(View);
    expect(pharmacyNameHeadingWithFavorite.props.style).toEqual(
      pickUpSectionStyles.headingWithFavoriteViewStyle
    );

    const pharmacyNameHeading = getChildren(pharmacyNameHeadingWithFavorite)[0];
    const favoriteIconButton = getChildren(pharmacyNameHeadingWithFavorite)[1];

    expect(pharmacyNameHeading.type).toEqual(Heading);
    expect(pharmacyNameHeading.props.level).toEqual(3);
    expect(pharmacyNameHeading.props.textStyle).toEqual(
      pickUpSectionStyles.heading3TextStyle
    );
    expect(pharmacyNameHeading.props.children).toEqual(pharmacyMock.name);

    expect(favoriteIconButton.type).toEqual(FavoriteIconButton);
    expect(favoriteIconButton.props.ncpdp).toEqual(pharmacyMock.ncpdp);
    expect(favoriteIconButton.props.onPress).toEqual(expect.any(Function));
    expect(favoriteIconButton.props.testID).toEqual(
      'favoriteIconButtonInPickUpSection'
    );

    const favoritingActionMock: FavoritingAction = 'favoriting';

    favoriteIconButton.props.onPress(favoritingActionMock);

    expect(onFavoriteIconButtonPressMock).toHaveBeenCalledTimes(1);
  });
});
