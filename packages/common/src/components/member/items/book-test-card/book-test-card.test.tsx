// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import renderer from 'react-test-renderer';
import { bookTestCardStyle as styles } from './book-test-card.style';
import { BookTestCard } from './book-test-card';
import { MarkdownText } from '../../../text/markdown-text/markdown-text';
import { ITestContainer } from '../../../../testing/test.container';
import { ProtectedBaseText } from '../../../text/protected-base-text/protected-base-text';
import { ProtectedView } from '../../../containers/protected-view/protected-view';

jest.mock('../../../text/markdown-text/markdown-text', () => ({
  MarkdownText: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock('../../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

describe('BookTestCard', () => {
  it('renders clickable item in View container with expected properties', () => {
    const mockStyle: ViewStyle = { flex: 1 };
    const testRenderer = renderer.create(
      <BookTestCard
        title='Some Item'
        description='Some description'
        viewStyle={mockStyle}
      />
    );

    const button = testRenderer.root.findByType(TouchableOpacity);
    expect(button.props.style).toEqual(mockStyle);
    expect(button.props.onPress).toBeDefined();
    expect(button.props.onPress.name).toEqual('onTouchablePress');
  });

  it('renders clickable item Title in Text with expected properties', () => {
    const title = 'Some Item';
    const price = '99.99';
    const testIDMock = 'testIDMock';

    const testRenderer = renderer.create(
      <BookTestCard
        title={title}
        description='Some description'
        price={price}
        testID={testIDMock}
      />
    );

    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);
    expect(touchableOpacity.props.testID).toEqual(testIDMock);
    const buttonContentContainer = touchableOpacity.props.children;
    expect(buttonContentContainer.type).toEqual(View);
    expect(buttonContentContainer.props.style).toEqual(
      styles.contentContainerViewStyle
    );

    const textComponents =
      buttonContentContainer.props.children[0].props.children;
    const titleComponent = textComponents[0];

    expect(titleComponent.props.style).toEqual(styles.headerViewStyle);

    const titleText = titleComponent.props.children[0];
    expect(titleText.type).toEqual(ProtectedBaseText);
    expect(titleText.props.style).toEqual(styles.titleTextStyle);
    expect(titleText.props.children).toEqual(title);

    const priceText = titleComponent.props.children[1];
    expect(priceText.type).toEqual(Text);
    expect(priceText.props.style).toEqual(styles.priceTextStyle);
    expect(priceText.props.children).toEqual(price);
  });

  it('renders clickable item Title without price when price is null', () => {
    const title = 'Some Item';

    const testRenderer = renderer.create(
      <BookTestCard title={title} description='Some description' />
    );

    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);
    const buttonContentContainer = touchableOpacity.props.children;
    expect(buttonContentContainer.type).toEqual(View);
    expect(buttonContentContainer.props.style).toEqual(
      styles.contentContainerViewStyle
    );

    const textComponents =
      buttonContentContainer.props.children[0].props.children;
    const titleComponent = textComponents[0];

    expect(titleComponent.props.style).toEqual(styles.headerViewStyle);

    const titleText = titleComponent.props.children[0];
    expect(titleText.type).toEqual(ProtectedBaseText);
    expect(titleText.props.style).toEqual(styles.titleTextStyle);
    expect(titleText.props.children).toEqual(title);

    const priceText = titleComponent.props.children[1];
    expect(priceText).toEqual(null);
  });
  it('renders clickable item description in Text with expected properties', () => {
    const description = 'Some description';

    const testRenderer = renderer.create(
      <BookTestCard title='Some Item' description={description} />
    );

    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);
    const buttonContentContainer = touchableOpacity.props.children;

    const textComponents =
      buttonContentContainer.props.children[0].props.children;
    const protectedViewComponent = textComponents[1];
    expect(protectedViewComponent.type).toEqual(ProtectedView);

    const descriptionComponent = protectedViewComponent.props.children;
    expect(descriptionComponent.type).toEqual(MarkdownText);
    expect(descriptionComponent.props.textStyle).toEqual(
      styles.descriptionTextStyle
    );
    expect(descriptionComponent.props.children).toEqual(description);
  });

  it('renders clickable item callout label in Text with expected properties', () => {
    const calloutLabel = 'Book now!';

    const testRenderer = renderer.create(
      <BookTestCard calloutLabel={calloutLabel} />
    );

    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);
    const buttonContentContainer = touchableOpacity.props.children;

    const textComponents =
      buttonContentContainer.props.children[0].props.children;
    const calloutLabelComponent = textComponents[2];

    expect(calloutLabelComponent.props.style).toEqual(
      styles.calloutLabelTextStyle
    );
    expect(calloutLabelComponent.props.children).toEqual(calloutLabel);
  });
});
