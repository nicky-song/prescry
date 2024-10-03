// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { BaseText } from '../../text/base-text/base-text';
import { ChevronCard } from '../chevron/chevron.card';
import { AlternativeSavingsCard } from './alternative-savings.card';
import { alternativeSavingsCardStyles } from './alternative-savings.card.styles';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { IAlternativeSavingsCardContent } from './alternative-savings.card.content';
import { NotificationColor } from '../../../theming/colors';

jest.mock('../../../utils/formatters/string.formatter', () => ({
  StringFormatter: {
    format: jest.fn().mockImplementation((contentValue: string) => {
      return contentValue;
    }),
  },
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

jest.mock('../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

jest.mock('../chevron/chevron.card', () => ({
  ChevronCard: () => <div />,
}));

const onPressMock = jest.fn();
const savingsAmountMock = 77;
const viewStyleMock = {};

const contentMock: IAlternativeSavingsCardContent = {
  message: 'message-mock',
};

describe('AlternativeSavingsCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: false,
    });
  });
  it('renders as ChevronCard with expected onPress & viewStyle', () => {
    const testRenderer = renderer.create(
      <AlternativeSavingsCard
        onPress={onPressMock}
        savingsAmount={savingsAmountMock}
        viewStyle={viewStyleMock}
      />
    );

    const alternativeSavingsCard = testRenderer.root
      .children[0] as ReactTestInstance;

    expect(alternativeSavingsCard.type).toEqual(ChevronCard);
    expect(alternativeSavingsCard.props.onPress).toEqual(onPressMock);
    expect(alternativeSavingsCard.props.viewStyle).toEqual([
      alternativeSavingsCardStyles.viewStyle,
      viewStyleMock,
    ]);
    expect(getChildren(alternativeSavingsCard).length).toEqual(1);
  });

  it('renders View as only child with expected style', () => {
    const testRenderer = renderer.create(
      <AlternativeSavingsCard
        onPress={onPressMock}
        savingsAmount={savingsAmountMock}
        viewStyle={viewStyleMock}
      />
    );

    const alternativeSavingsCard = testRenderer.root
      .children[0] as ReactTestInstance;

    const view = getChildren(alternativeSavingsCard)[0];

    expect(view.type).toEqual(View);
    expect(view.props.style).toEqual(
      alternativeSavingsCardStyles.contentViewStyle
    );
    expect(getChildren(view).length).toEqual(2);
  });

  it('renders FontAwesomeIcon as first element in View with expected name, solid, size, and color', () => {
    const testRenderer = renderer.create(
      <AlternativeSavingsCard
        onPress={onPressMock}
        savingsAmount={savingsAmountMock}
        viewStyle={viewStyleMock}
      />
    );

    const alternativeSavingsCard = testRenderer.root
      .children[0] as ReactTestInstance;

    const view = getChildren(alternativeSavingsCard)[0];

    const fontAwesomeIcon = getChildren(view)[0];

    expect(fontAwesomeIcon.type).toEqual(FontAwesomeIcon);
    expect(fontAwesomeIcon.props.name).toEqual('usd-circle');
    expect(fontAwesomeIcon.props.solid).toEqual(true);
    expect(fontAwesomeIcon.props.size).toEqual(17);
    expect(fontAwesomeIcon.props.color).toEqual(NotificationColor.darkGreen);
  });

  it('renders BaseText as second element in View with expected style and message as children', () => {
    const testRenderer = renderer.create(
      <AlternativeSavingsCard
        onPress={onPressMock}
        savingsAmount={savingsAmountMock}
        viewStyle={viewStyleMock}
      />
    );

    const alternativeSavingsCard = testRenderer.root
      .children[0] as ReactTestInstance;

    const view = getChildren(alternativeSavingsCard)[0];

    const baseText = getChildren(view)[1];

    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.style).toEqual(
      alternativeSavingsCardStyles.messageTextStyle
    );
    expect(baseText.props.children).toEqual(contentMock.message);
  });
});
