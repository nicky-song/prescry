// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import dateFormatter from '../../../utils/formatters/date.formatter';
import { ProtectedView } from '../../containers/protected-view/protected-view';
import { TranslatableView } from '../../containers/translated-view/translatable-view';
import { BaseText } from '../../text/base-text/base-text';
import {
  IRecommendationBottomProps,
  RecommendationBottom,
} from './recommendation-bottom';
import { recommendationBottomContent } from './recommendation-bottom.content';
import { recommendationBottomStyles } from './recommendation-bottom.styles';

jest.mock('../../containers/protected-view/protected-view', () => ({
  ProtectedView: () => <div />,
}));

jest.mock('../../containers/translated-view/translatable-view', () => ({
  TranslatableView: () => <div />,
}));

const recommendationHeaderBottomProps: IRecommendationBottomProps = {
  orderDate: new Date('2019-12-01T10:46:40.884Z'),
  pharmacyCashPrice: 100.03,
  pharmacyName: 'medico',
  planPays: 80.23,
};

describe('RecommendationBottom', () => {
  it('should render sent to text with pharmacy name and order date', () => {
    const recommendationBottom = renderer.create(
      <RecommendationBottom {...recommendationHeaderBottomProps} />
    );

    const view = recommendationBottom.root.children[0] as ReactTestInstance;

    const translatableView = getChildren(view)[2];

    expect(translatableView.type).toEqual(TranslatableView);
    expect(translatableView.props.style).toEqual(
      recommendationBottomStyles.sentToViewStyle
    );
    expect(getChildren(translatableView).length).toEqual(3);

    const sentToText = getChildren(translatableView)[0];
    const pharmacyNameView = getChildren(translatableView)[1];
    const orderDateText = getChildren(translatableView)[2];

    expect(sentToText.type).toEqual(BaseText);
    expect(sentToText.props.style).toEqual(
      recommendationBottomStyles.sentToPharmacyText
    );
    expect(sentToText.props.children).toEqual(
      recommendationBottomContent.sentToText() + ' '
    );

    expect(pharmacyNameView.type).toEqual(ProtectedView);

    const pharmacyNameText = getChildren(pharmacyNameView)[0];

    expect(pharmacyNameText.type).toEqual(BaseText);
    expect(pharmacyNameText.props.style).toEqual(
      recommendationBottomStyles.sentToPharmacyText
    );

    expect(orderDateText.type).toEqual(BaseText);
    expect(orderDateText.props.style).toEqual(
      recommendationBottomStyles.sentToPharmacyText
    );
    expect(orderDateText.props.children).toEqual(
      'on ' +
        dateFormatter.formatToMDY(
          recommendationHeaderBottomProps.orderDate as Date
        )
    );
  });

  it('should have pharmacyCashPrice', () => {
    const recommendationHeaderBottom = renderer.create(
      <RecommendationBottom {...recommendationHeaderBottomProps} />
    );
    expect(
      recommendationHeaderBottom.root.findAllByType(BaseText)[1].props.children
    ).toBe('$100.03');
  });

  it('should have planPays', () => {
    const recommendationHeaderBottom = renderer.create(
      <RecommendationBottom {...recommendationHeaderBottomProps} />
    );
    expect(
      recommendationHeaderBottom.root.findAllByType(BaseText)[3].props.children
    ).toBe('$80.23');
  });
});
