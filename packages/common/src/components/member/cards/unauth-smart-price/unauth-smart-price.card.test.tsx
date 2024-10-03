// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import { useContent } from '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { getChildren } from '../../../../testing/test.helper';
import { ImageAsset } from '../../../image-asset/image-asset';
import { BaseText } from '../../../text/base-text/base-text';
import { UnauthSmartPriceCard } from './unauth-smart-price.card';
import { unauthSmartPriceCardStyles } from './unauth-smart-price.card.styles';

jest.mock('../../../image-asset/image-asset', () => ({
  ImageAsset: () => <div />,
}));

jest.mock(
  '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

const mockStrapiContent = {
  content: {
    unauthSmartPriceCard: {
      defaultMessage: 'test-default-message',
      pcnValue: 'test-pcn-value',
      groupValue: 'test-group-value',
      binValue: 'test-bin-value',
    },
    digitalIdCard: {
      pcn: 'test-pcn-label',
      bin: 'test-bin-label',
      group: 'test-group-label',
      memberId: 'test-member-id-label',
    },
  },
};

describe('UnauthSmartPriceCard', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    useContentMock.mockReturnValue(mockStrapiContent);
  });
  it('renders outer container view with expected properties', () => {
    const testRenderer = renderer.create(<UnauthSmartPriceCard />);

    const cardContainerView = testRenderer.root.findByType(View);

    expect(cardContainerView.props.style).toEqual([
      unauthSmartPriceCardStyles.containerViewStyle,
      undefined,
    ]);
    expect(getChildren(cardContainerView).length).toEqual(2);
  });

  it('renders header container view with expected properties', () => {
    const testRenderer = renderer.create(<UnauthSmartPriceCard />);

    const cardContainerView = testRenderer.root.findByType(View);
    const header = getChildren(cardContainerView)[0];

    expect(header.props.style).toEqual(
      unauthSmartPriceCardStyles.headerViewStyle
    );
    expect(header.type).toEqual(View);
    expect(getChildren(header).length).toEqual(1);
  });

  it('renders header logo with expected properties ', () => {
    const testRenderer = renderer.create(<UnauthSmartPriceCard />);

    const cardContainerView = testRenderer.root.findByType(View);
    const header = getChildren(cardContainerView)[0];
    const headerImage = getChildren(header)[0];

    expect(headerImage.type).toEqual(ImageAsset);

    expect(headerImage.props.style).toEqual(
      unauthSmartPriceCardStyles.brandMyPrescryptiveImage
    );
    expect(headerImage.props.name).toEqual('headerMyPrescryptiveLogo');

    expect(headerImage.props.resizeMode).toEqual('contain');
  });

  it('renders inner details container view with expected properties', () => {
    const testRenderer = renderer.create(<UnauthSmartPriceCard />);

    const cardContainerView = testRenderer.root.findByType(View);
    const innerDetailsContainer = getChildren(cardContainerView)[1];

    expect(innerDetailsContainer.type).toEqual(View);
    expect(innerDetailsContainer.props.style).toEqual(
      unauthSmartPriceCardStyles.paddingStyle
    );
    expect(getChildren(innerDetailsContainer).length).toEqual(2);
  });

  it('renders top row view with expected properties', () => {
    const testRenderer = renderer.create(<UnauthSmartPriceCard />);

    const cardContainerView = testRenderer.root.findByType(View);
    const innerDetailsContainer = getChildren(cardContainerView)[1];
    const topRowContainer = getChildren(innerDetailsContainer)[0];
    const memberIdLabel = getChildren(topRowContainer)[0];
    const memberIdContent = getChildren(topRowContainer)[1];

    expect(topRowContainer.props.style).toEqual(
      unauthSmartPriceCardStyles.topRowViewStyle
    );
    expect(topRowContainer.props.testID).toEqual('UnauthSmartPriceMemberId');
    expect(getChildren(topRowContainer).length).toEqual(2);
    expect(memberIdLabel.type).toEqual(BaseText);
    expect(memberIdLabel.props.style).toEqual(
      unauthSmartPriceCardStyles.labelTextStyle
    );
    expect(memberIdLabel.props.children).toEqual(
      mockStrapiContent.content.digitalIdCard.memberId
    );
    expect(memberIdContent.type).toEqual(BaseText);
    expect(memberIdContent.props.style).toEqual(
      unauthSmartPriceCardStyles.contentTextStyle
    );
    expect(memberIdContent.props.children).toEqual(
      mockStrapiContent.content.unauthSmartPriceCard.defaultMessage
    );
  });

  it('renders bottom row view with expected properties', () => {
    const testRenderer = renderer.create(<UnauthSmartPriceCard />);

    const cardContainerView = testRenderer.root.findByType(View);
    const innerDetailsContainer = getChildren(cardContainerView)[1];
    const bottomRowContainer = getChildren(innerDetailsContainer)[1];

    expect(bottomRowContainer.props.testID).toEqual(
      'UnauthSmartPriceInformation'
    );
    expect(bottomRowContainer.props.style).toEqual(
      unauthSmartPriceCardStyles.lastRowViewStyle
    );
    expect(getChildren(bottomRowContainer).length).toEqual(3);
  });

  it('renders bottom row first item view with expected properties', () => {
    const testRenderer = renderer.create(<UnauthSmartPriceCard />);

    const cardContainerView = testRenderer.root.findByType(View);
    const innerDetailsContainer = getChildren(cardContainerView)[1];
    const bottomRowContainer = getChildren(innerDetailsContainer)[1];
    const firstItemContainer = getChildren(bottomRowContainer)[0];
    const firstItemLabel = getChildren(firstItemContainer)[0];
    const firstItemContent = getChildren(firstItemContainer)[1];

    expect(firstItemContainer.props.testID).toEqual('UnauthSmartPriceGroup');
    expect(firstItemContainer.props.style).toEqual(
      unauthSmartPriceCardStyles.firstItemViewStyle
    );
    expect(getChildren(firstItemContainer).length).toEqual(2);
    expect(firstItemLabel.type).toEqual(BaseText);
    expect(firstItemLabel.props.style).toEqual(
      unauthSmartPriceCardStyles.labelTextStyle
    );
    expect(firstItemLabel.props.children).toEqual(
      mockStrapiContent.content.digitalIdCard.group
    );
    expect(firstItemContent.type).toEqual(BaseText);
    expect(firstItemContent.props.style).toEqual(
      unauthSmartPriceCardStyles.contentTextStyle
    );
    expect(firstItemContent.props.children).toEqual(
      mockStrapiContent.content.unauthSmartPriceCard.groupValue
    );
  });

  it('renders bottom row second item view with expected properties', () => {
    const testRenderer = renderer.create(<UnauthSmartPriceCard />);

    const cardContainerView = testRenderer.root.findByType(View);
    const innerDetailsContainer = getChildren(cardContainerView)[1];
    const bottomRowContainer = getChildren(innerDetailsContainer)[1];
    const secondItemContainer = getChildren(bottomRowContainer)[1];
    const secondItemLabel = getChildren(secondItemContainer)[0];
    const secondItemContent = getChildren(secondItemContainer)[1];

    expect(secondItemContainer.props.testID).toEqual('UnauthSmartPriceBin');
    expect(secondItemContainer.props.style).toEqual(
      unauthSmartPriceCardStyles.dataViewStyle
    );
    expect(getChildren(secondItemContainer).length).toEqual(2);
    expect(secondItemLabel.type).toEqual(BaseText);
    expect(secondItemLabel.props.style).toEqual(
      unauthSmartPriceCardStyles.labelTextStyle
    );
    expect(secondItemLabel.props.children).toEqual(
      mockStrapiContent.content.digitalIdCard.bin
    );
    expect(secondItemContent.type).toEqual(BaseText);
    expect(secondItemContent.props.style).toEqual(
      unauthSmartPriceCardStyles.contentTextStyle
    );
    expect(secondItemContent.props.children).toEqual(
      mockStrapiContent.content.unauthSmartPriceCard.binValue
    );
  });

  it('renders bottom row third item view with expected properties', () => {
    const testRenderer = renderer.create(<UnauthSmartPriceCard />);

    const cardContainerView = testRenderer.root.findByType(View);
    const innerDetailsContainer = getChildren(cardContainerView)[1];
    const bottomRowContainer = getChildren(innerDetailsContainer)[1];
    const thirdItemContainer = getChildren(bottomRowContainer)[2];
    const thirdItemLabel = getChildren(thirdItemContainer)[0];
    const thirdItemContent = getChildren(thirdItemContainer)[1];

    expect(thirdItemContainer.props.testID).toEqual('UnauthSmartPricePCN');
    expect(thirdItemContainer.props.style).toEqual(
      unauthSmartPriceCardStyles.dataViewStyle
    );
    expect(getChildren(thirdItemContainer).length).toEqual(2);
    expect(thirdItemLabel.type).toEqual(BaseText);
    expect(thirdItemLabel.props.style).toEqual(
      unauthSmartPriceCardStyles.labelTextStyle
    );
    expect(thirdItemLabel.props.children).toEqual(
      mockStrapiContent.content.digitalIdCard.pcn
    );
    expect(thirdItemContent.type).toEqual(BaseText);
    expect(thirdItemContent.props.style).toEqual(
      unauthSmartPriceCardStyles.contentTextStyle
    );
    expect(thirdItemContent.props.children).toEqual(
      mockStrapiContent.content.unauthSmartPriceCard.pcnValue
    );
  });
});
