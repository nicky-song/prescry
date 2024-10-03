// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import { RxIdCardSection } from './rx-id-card.section';
import { RxGroupTypesEnum } from '../../../models/member-profile/member-profile-info';
import { rxIdCardSectionStyles } from './rx-id-card.section.styles';
import { Heading } from '../heading/heading';
import { BaseText } from '../../text/base-text/base-text';
import { RxIdCard } from '../../cards/rx-id-card/rx-id-card';
import { SectionView } from '../../primitives/section-view';
import { RxCardType } from '../../../models/rx-id-card';

jest.mock('../../cards/rx-id-card/rx-id-card', () => ({
  RxIdCard: () => <div />,
}));

jest.mock('../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock('../heading/heading', () => ({
  Heading: () => <div />,
}));

describe('RxIdCardSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockData = {
    title: 'Prescrptive Benefit Plan',
    description: 'Show your pharmacist this card to get this price.',
    profile: {
      firstName: 'Klein',
      lastName: 'Claire',
      dateOfBirth: '01-01-2000',
      identifier: '123456789',
      phoneNumber: '1112223333',
      primaryMemberRxId: 'T12345678901',
      primaryMemberFamilyId: 'T123456789',
      primaryMemberPersonCode: '01',
      rxGroupType: RxGroupTypesEnum.SIE,
      rxGroup: 'HMA01',
      rxSubGroup: '',
      rxBin: '610749',
      carrierPCN: 'PH',
    },
    cardType: 'pbm' as RxCardType,
  };

  it.each([
    ['testId', 'testId'],
    [undefined, 'rxIdCardSection'],
  ])(
    'renders container View with testId %p',
    (testIdMock: undefined | string, expected: string) => {
      const viewStyleMock: ViewStyle = { width: 1 };

      const testRenderer = renderer.create(
        <RxIdCardSection
          title={mockData.title}
          description={mockData.description}
          profile={mockData.profile}
          cardType={mockData.cardType}
          testID={testIdMock}
          viewStyle={viewStyleMock}
        ></RxIdCardSection>
      );

      const sectionView = testRenderer.root.children[0] as ReactTestInstance;

      expect(sectionView.type).toEqual(SectionView);
      expect(sectionView.props.style).toEqual([
        rxIdCardSectionStyles.cardSectionViewStyle,
        viewStyleMock,
      ]);
      expect(sectionView.props.testID).toEqual(expected);
    }
  );

  it('renders title ', () => {
    const testRenderer = renderer.create(
      <RxIdCardSection
        title={mockData.title}
        description={mockData.description}
        profile={mockData.profile}
        cardType={mockData.cardType}
        testID='testId'
        isSkeleton={false}
      ></RxIdCardSection>
    );

    const sectionView = testRenderer.root.children[0] as ReactTestInstance;
    const title = getChildren(sectionView)[0];

    expect(title.type).toEqual(Heading);
    expect(title.props.level).toEqual(2);
    expect(title.props.textStyle).toEqual(rxIdCardSectionStyles.titleTextStyle);
    expect(title.props.isSkeleton).toEqual(false);
    expect(title.props.children).toEqual(mockData.title);
  });

  it('renders description ', () => {
    const testRenderer = renderer.create(
      <RxIdCardSection
        title={mockData.title}
        description={mockData.description}
        profile={mockData.profile}
        cardType={mockData.cardType}
        testID='testId'
        isSkeleton={false}
      ></RxIdCardSection>
    );

    const sectionView = testRenderer.root.children[0] as ReactTestInstance;
    const description = getChildren(sectionView)[1];

    expect(description.type).toEqual(BaseText);
    expect(description.props.isSkeleton).toEqual(false);
    expect(description.props.style).toEqual(
      rxIdCardSectionStyles.descriptionViewStyle
    );
    expect(description.props.children).toEqual(mockData.description);
  });

  it('renders RxId card ', () => {
    const testRenderer = renderer.create(
      <RxIdCardSection
        title={mockData.title}
        description={mockData.description}
        profile={mockData.profile}
        cardType={mockData.cardType}
        testID='testId'
        isSkeleton={false}
      ></RxIdCardSection>
    );

    const sectionView = testRenderer.root.children[0] as ReactTestInstance;
    const rxIdCard = getChildren(sectionView)[2];

    expect(rxIdCard.type).toEqual(RxIdCard);
    expect(rxIdCard.props.profile).toEqual(mockData.profile);
    expect(rxIdCard.props.rxCardType).toEqual(mockData.cardType);
  });

  it('renders skeletons when isSkeleton true', () => {
    const testRenderer = renderer.create(
      <RxIdCardSection
        title={mockData.title}
        description={mockData.description}
        profile={mockData.profile}
        cardType={mockData.cardType}
        testID='testId'
        isSkeleton={true}
      ></RxIdCardSection>
    );

    const sectionView = testRenderer.root.children[0] as ReactTestInstance;
    const title = getChildren(sectionView)[0];
    const description = getChildren(sectionView)[1];

    expect(title.props.isSkeleton).toEqual(true);
    expect(description.props.isSkeleton).toEqual(true);
  });
});
