// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import renderer from 'react-test-renderer';
import { titleDescriptionCardItemStyle as styles } from './title-description-card-item.style';
import { TitleDescriptionCardItem } from './title-description-card-item';
import { FontAwesomeIcon } from '../../../icons/font-awesome/font-awesome.icon';

jest.mock('../../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

describe('TitleDescriptionCardItem', () => {
  it('renders clickable item in TouchableOpacity with expected properties', () => {
    const viewStyle: ViewStyle = {
      backgroundColor: 'red',
    };
    const testIDMock = 'testIDMock';

    const testRenderer = renderer.create(
      <TitleDescriptionCardItem
        title='Some Item'
        description='Some description'
        viewStyle={viewStyle}
        onPress={jest.fn()}
        testID={testIDMock}
      />
    );
    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);

    expect(touchableOpacity.props.style).toEqual([
      styles.cardViewStyle,
      viewStyle,
    ]);
    expect(touchableOpacity.props.children.length).toEqual(2);
    expect(touchableOpacity.props.onPress).toBeDefined();
    expect(touchableOpacity.props.onPress.name).toEqual('onTouchablePress');
    expect(touchableOpacity.props.testID).toEqual(testIDMock);
  });

  it('renders icon with expected properties', () => {
    const testRenderer = renderer.create(
      <TitleDescriptionCardItem
        title='Some Item'
        description='Some description'
        onPress={jest.fn()}
      />
    );
    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);

    const iconContainer = touchableOpacity.props.children[1];
    expect(iconContainer.type).toEqual(View);
    expect(iconContainer.props.style).toEqual(styles.iconContainerViewStyle);

    const icon = iconContainer.props.children;

    const iconImage = icon.props.children;
    expect(iconImage.type).toEqual(FontAwesomeIcon);
    expect(iconImage.props.name).toEqual('chevron-right');
    expect(iconImage.props.style).toEqual(styles.iconStyle);
  });

  it('renders clickable item Title in Text with expected properties', () => {
    const title = 'Some Item';

    const testRenderer = renderer.create(
      <TitleDescriptionCardItem title={title} description='Some description' />
    );

    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);
    const textComponents = touchableOpacity.findAllByType(Text);
    const titleComponent = textComponents[0];

    expect(titleComponent.props.style).toEqual(styles.titleTextStyle);
    expect(titleComponent.props.children).toEqual([title, null]);
  });

  it('renders clickable item description in Text with expected properties', () => {
    const description = 'Some description';

    const testRenderer = renderer.create(
      <TitleDescriptionCardItem title='Some Item' description={description} />
    );

    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);
    const textComponents = touchableOpacity.findAllByType(Text);
    const descriptionComponent = textComponents[1];

    expect(descriptionComponent.props.style).toEqual(
      styles.descriptionTextStyle
    );
    expect(descriptionComponent.props.children).toEqual([description, null]);
  });

  it('renders quantity in Title and date on Description', () => {
    const title = 'Some Item';
    const description = 'A simple description';
    const mockDate = new Date(2020, 10, 8);

    const testRenderer = renderer.create(
      <TitleDescriptionCardItem
        title={title}
        description={description}
        quantity={1000}
        eventDate={mockDate}
      />
    );

    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);
    const textComponents = touchableOpacity.findAllByType(Text);
    const titleComponent = textComponents[0];
    expect(titleComponent.props.children).toEqual([title, ' (1000)']);
    const descriptionComponent = textComponents[1];
    expect(descriptionComponent.props.children).toEqual([
      description,
      ' 11/08/20',
    ]);
  });

  it('should use code prop to set testID when it is passed', () => {
    const code = 'test-code';
    const title = 'Some Item';
    const description = 'A simple description';
    const mockDate = new Date(2020, 10, 8);

    const testRenderer = renderer.create(
      <TitleDescriptionCardItem
        code={code}
        title={title}
        description={description}
        quantity={1000}
        eventDate={mockDate}
      />
    );

    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);
    const viewComponent = touchableOpacity.props.children[0];
    expect(viewComponent.props.testID).toEqual(`card_${code}`);
  });

  it('should use title prop to set testID when code prop is not passed', () => {
    const title = 'Some Item';
    const description = 'A simple description';
    const mockDate = new Date(2020, 10, 8);

    const testRenderer = renderer.create(
      <TitleDescriptionCardItem
        title={title}
        description={description}
        quantity={1000}
        eventDate={mockDate}
      />
    );

    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);
    const viewComponent = touchableOpacity.props.children[0];
    expect(viewComponent.props.testID).toEqual(`card_${title}`);
  });
});
