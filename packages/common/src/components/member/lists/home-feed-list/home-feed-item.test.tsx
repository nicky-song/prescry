// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import renderer from 'react-test-renderer';
import { stylesheet } from '../../../../theming/member/stylesheet';
import { HomeFeedItem } from './home-feed-item';

describe('HomeFeedItem', () => {
  it('renders clickable item in View container with expected properties', () => {
    const containerViewStyle: ViewStyle = {
      alignItems: 'stretch',
      flexDirection: 'row',
    };

    const testRenderer = renderer.create(
      <HomeFeedItem caption='Some Item' description='Some description' />
    );

    const containerView = testRenderer.root.findByType(View);
    expect(containerView.props.style).toEqual(containerViewStyle);
  });

  it('renders clickable item in TouchableOpacity with expected properties', () => {
    const viewStyle: ViewStyle = {
      backgroundColor: 'red',
    };

    const testRenderer = renderer.create(
      <HomeFeedItem
        caption='Some Item'
        description='Some description'
        viewStyle={viewStyle}
      />
    );
    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);
    expect(touchableOpacity.type).toEqual(TouchableOpacity);
    expect(touchableOpacity.props.style).toEqual([
      stylesheet.homeFeedItemViewStyle,
      viewStyle,
    ]);
    expect(touchableOpacity.props.children.length).toEqual(2);
  });

  it('renders static item in View with expected properties', () => {
    const testIdMock = 'test-id-mock';
    rendersStaticItemInViewWithExpectedProperties(
      'Some description',
      2,
      stylesheet.homeFeedStaticItemViewStyle,
      testIdMock
    );
    rendersStaticItemInViewWithExpectedProperties(
      undefined,
      1,
      stylesheet.homeFeedStaticItemWithoutDescriptionViewStyle,
      testIdMock
    );
    rendersStaticItemInViewWithExpectedProperties(
      '',
      1,
      stylesheet.homeFeedStaticItemWithoutDescriptionViewStyle,
      testIdMock
    );
  });

  function rendersStaticItemInViewWithExpectedProperties(
    description: string | undefined,
    expectedTextComponentCount: number,
    expectedViewStyle: ViewStyle,
    testIDMock: string
  ) {
    const customViewStyle: ViewStyle = {
      backgroundColor: 'red',
    };

    const testRenderer = renderer.create(
      <HomeFeedItem
        caption='Some Item'
        description={description}
        viewStyle={customViewStyle}
        isStatic={true}
        testID={testIDMock}
      />
    );

    const view = testRenderer.root.findByType(View);
    expect(view.props.style).toEqual([expectedViewStyle, customViewStyle]);
    expect(view.props.testID).toEqual(testIDMock);

    const textComponents = view.findAllByType(Text);
    expect(textComponents.length).toEqual(expectedTextComponentCount);
  }

  it('renders clickable item caption in Text with expected properties', () => {
    const caption = 'Some Item';

    const testRenderer = renderer.create(
      <HomeFeedItem caption={caption} description='Some description' />
    );

    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);
    const textComponents = touchableOpacity.findAllByType(Text);
    const captionComponent = textComponents[0];

    expect(captionComponent.props.style).toEqual(
      stylesheet.homeFeedItemCaptionTextStyle
    );
    expect(captionComponent.props.children).toEqual(caption);
  });

  it('renders static item caption in Text with expected properties', () => {
    const caption = 'Some Item';

    const testRenderer = renderer.create(
      <HomeFeedItem
        caption={caption}
        description='Some description'
        isStatic={true}
      />
    );

    const view = testRenderer.root.findByType(View);
    const textComponents = view.findAllByType(Text);
    const captionComponent = textComponents[0];

    expect(captionComponent.props.style).toEqual(
      stylesheet.homeFeedStaticItemCaptionTextStyle
    );
    expect(captionComponent.props.children).toEqual(caption);
  });

  it('renders clickable item description in Text with expected properties', () => {
    const description = 'Some description';

    const testRenderer = renderer.create(
      <HomeFeedItem caption='Some Item' description={description} />
    );

    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);
    const textComponents = touchableOpacity.findAllByType(Text);
    const descriptionComponent = textComponents[1];

    expect(descriptionComponent.props.style).toEqual(
      stylesheet.homeFeedItemDescriptionTextStyle
    );
    expect(descriptionComponent.props.children).toEqual(description);
  });

  it('does not render clickable item description Text if no description specified', () => {
    const testRenderer = renderer.create(<HomeFeedItem caption='Some Item' />);

    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);
    const textComponents = touchableOpacity.findAllByType(Text);
    expect(textComponents.length).toEqual(1);
  });

  it('renders clickable item description in Text with expected properties', () => {
    const description = 'Some description';

    const testRenderer = renderer.create(
      <HomeFeedItem caption='Some Item' description={description} />
    );

    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);
    const textComponents = touchableOpacity.findAllByType(Text);
    const descriptionComponent = textComponents[1];

    expect(descriptionComponent.props.style).toEqual(
      stylesheet.homeFeedItemDescriptionTextStyle
    );
    expect(descriptionComponent.props.children).toEqual(description);
  });

  it('does not render static item caption Text if no caption specified', () => {
    const testRenderer = renderer.create(<HomeFeedItem isStatic={true} />);

    const view = testRenderer.root.findByType(View);
    const textComponents = view.findAllByType(Text);
    expect(textComponents.length).toEqual(0);
  });

  it('does not render static item description Text if no description specified', () => {
    const testRenderer = renderer.create(
      <HomeFeedItem caption='Some Item' isStatic={true} />
    );

    const view = testRenderer.root.findByType(View);
    const textComponents = view.findAllByType(Text);
    expect(textComponents.length).toEqual(1);
  });
});
