// Copyright 2021 Prescryptive Health, Inc.

import { View } from 'react-native';
import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { MarketingCard } from './marketing.card';
import { marketingCardStyles } from './marketing.card.styles';
import { Spacing } from '../../../../theming/spacing';
import { ImageAsset } from '../../../image-asset/image-asset';
import { Heading } from '../../heading/heading';
import { BaseText } from '../../../text/base-text/base-text';
import { getChildren } from '../../../../testing/test.helper';

jest.mock('../../../image-asset/image-asset');

describe('MarketingCard', () => {
  it('should have correct card style', () => {
    const imageName = 'pillHandIcon';
    const cardTitle = 'Test title';
    const cardDescription = 'This is a test description.';

    const testRenderer = renderer.create(
      <MarketingCard
        imageName={imageName}
        title={cardTitle}
        description={cardDescription}
        headingLevel={5}
      />
    );

    const marketingCard = testRenderer.root.children[0] as ReactTestInstance;
    expect(marketingCard.type).toEqual(View);
    expect(marketingCard.props.testID).toEqual('marketingCardView');
    expect(marketingCard.props.style).toEqual([
      marketingCardStyles.marketingCardViewStyle,
      undefined,
    ]);
  });

  it('should use styles if passed in', () => {
    const imageName = 'pillHandIcon';
    const cardTitle = 'Test title';
    const cardDescription = 'This is a test description.';

    const testRenderer = renderer.create(
      <MarketingCard
        imageName={imageName}
        title={cardTitle}
        description={cardDescription}
        headingLevel={5}
        viewStyle={{ marginTop: Spacing.base }}
      />
    );

    const marketingCard = testRenderer.root.children[0] as ReactTestInstance;
    expect(marketingCard.props.style).toEqual([
      marketingCardStyles.marketingCardViewStyle,
      { marginTop: Spacing.base },
    ]);
  });

  it('should contain image asset', () => {
    const imageName = 'pillHandIcon';
    const cardTitle = 'Test title';
    const cardDescription = 'This is a test description.';

    const testRenderer = renderer.create(
      <MarketingCard
        imageName={imageName}
        title={cardTitle}
        description={cardDescription}
        headingLevel={5}
      />
    );

    const marketingCard = testRenderer.root.children[0] as ReactTestInstance;

    const marketingCardIcon = marketingCard.props.children[0];
    expect(marketingCardIcon.type).toEqual(ImageAsset);
    expect(marketingCardIcon.props.style).toEqual(
      marketingCardStyles.iconImageStyle
    );
    expect(marketingCardIcon.props.resizeMode).toEqual('contain');
    expect(marketingCardIcon.props.resizeMethod).toEqual('scale');
    expect(marketingCardIcon.props.name).toEqual(imageName);
  });

  it('should have correct marketing card content view', () => {
    const imageName = 'pillHandIcon';
    const cardTitle = 'Test title';
    const cardDescription = 'This is a test description.';

    const testRenderer = renderer.create(
      <MarketingCard
        imageName={imageName}
        title={cardTitle}
        description={cardDescription}
        headingLevel={5}
      />
    );

    const marketingCard = testRenderer.root.children[0] as ReactTestInstance;
    const marketingCardContentView = marketingCard.props.children[1];
    expect(marketingCardContentView.type).toEqual(View);
    expect(marketingCardContentView.props.testID).toEqual(
      'marketingCardContentView'
    );
    expect(marketingCardContentView.props.style).toEqual(
      marketingCardStyles.marketingCardContentViewStyle
    );
    expect(getChildren(marketingCardContentView).length).toEqual(2);
  });

  it('should have correct card content', () => {
    const imageName = 'pillHandIcon';
    const cardTitle = 'Test title';
    const cardDescription = 'This is a test description.';

    const testRenderer = renderer.create(
      <MarketingCard
        imageName={imageName}
        title={cardTitle}
        description={cardDescription}
        headingLevel={5}
      />
    );

    const marketingCard = testRenderer.root.children[0] as ReactTestInstance;
    const marketingCardContentView = marketingCard.props.children[1];

    const marketingCardTitle = marketingCardContentView.props.children[0];
    expect(marketingCardTitle.type).toEqual(Heading);
    expect(marketingCardTitle.props.level).toEqual(5);
    expect(marketingCardTitle.props.textStyle).toEqual(
      marketingCardStyles.marketingCardTitleTextStyle
    );
    expect(marketingCardTitle.props.children).toEqual(cardTitle);
    const marketingCardDescription = marketingCardContentView.props.children[1];
    expect(marketingCardDescription.type).toEqual(BaseText);
    expect(marketingCardDescription.props.style).toEqual(
      marketingCardStyles.marketingCardDescriptionTextStyle
    );
    expect(marketingCardDescription.props.children).toEqual(cardDescription);
  });
});
