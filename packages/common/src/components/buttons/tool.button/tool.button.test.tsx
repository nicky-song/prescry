// Copyright 2021 Prescryptive Health, Inc.

import React, { ElementType } from 'react';
import renderer from 'react-test-renderer';
import { IconSize } from '../../../theming/icons';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { BaseText } from '../../text/base-text/base-text';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';
import { TranslatableBaseText } from '../../text/translated-base-text/translatable-base-text';
import { BaseButton } from '../base/base.button';
import { ToolButton } from './tool.button';
import { toolButtonStyles } from './tool.button.styles';

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

describe('ToolButton', () => {
  it.each([
    [undefined, BaseText],
    [true, TranslatableBaseText],
    [false, ProtectedBaseText],
  ])(
    'has the expected props (translateContent: %p; baseTextElementType: %p)',
    (
      translateContent: boolean | undefined,
      baseTextElementType: ElementType
    ) => {
      const mockOnPress = jest.fn();
      const mockIconName = 'map';
      const mockChildren = <div />;
      const mockIconTextStyle = { flex: 1 };
      const mockTextStyle = { flex: 1 };
      const testRenderer = renderer.create(
        <ToolButton
          onPress={mockOnPress}
          iconName={mockIconName}
          iconTextStyle={mockIconTextStyle}
          textStyle={mockTextStyle}
          children={mockChildren}
          translateContent={translateContent}
        />
      );
      const container = testRenderer.root.findByType(BaseButton);
      expect(container.props.children.length).toEqual(2);

      const icon = container.props.children[0];
      expect(icon.type).toEqual(FontAwesomeIcon);
      expect(icon.props.name).toEqual(mockIconName);
      expect(icon.props.size).toEqual(IconSize.medium);
      expect(icon.props.style).toEqual([
        toolButtonStyles.iconTextStyle,
        mockIconTextStyle,
      ]);

      const label = container.props.children[1];
      expect(label.type).toEqual(baseTextElementType);
      expect(label.props.children).toEqual(mockChildren);
      expect(label.props.style).toEqual([
        toolButtonStyles.toolButtonTextStyle,
        mockTextStyle,
      ]);
    }
  );

  it('base button should have expected props', () => {
    const mockOnPress = jest.fn();
    const mockIsDisabled = true;
    const mockViewStyle = { flex: 1 };
    const testRenderer = renderer.create(
      <ToolButton
        iconName='map'
        onPress={mockOnPress}
        disabled={mockIsDisabled}
        viewStyle={mockViewStyle}
      >
        Button
      </ToolButton>
    );
    const button = testRenderer.root.findByType(BaseButton);
    expect(button.props.disabled).toEqual(mockIsDisabled);
    expect(button.props.viewStyle).toEqual([
      toolButtonStyles.rowContainerViewStyle,
      mockViewStyle,
    ]);
  });

  it('Icon & BaseText have disabled style', () => {
    const mockOnPress = jest.fn();
    const mockIconTextStyle = { flex: 1 };
    const mockTextStyle = { flex: 1 };
    const testRenderer = renderer.create(
      <ToolButton
        onPress={mockOnPress}
        iconName='map'
        iconSize={IconSize.big}
        iconTextStyle={mockIconTextStyle}
        textStyle={mockTextStyle}
        disabled={true}
      >
        Button
      </ToolButton>
    );
    const container = testRenderer.root.findByType(BaseButton);
    const icon = container.props.children[0];

    expect(icon.props.style).toEqual(toolButtonStyles.iconDisabledTextStyle);
    expect(icon.props.size).toEqual(IconSize.big);

    const label = container.props.children[1];
    expect(label.props.style).toEqual([
      toolButtonStyles.toolButtonDisabledTextStyle,
      mockTextStyle,
    ]);
  });

  it('should call onPress on click', () => {
    const mockOnPress = jest.fn();

    const testRenderer = renderer.create(
      <ToolButton onPress={mockOnPress} iconName='map'>
        Button
      </ToolButton>
    );
    const button = testRenderer.root.findByType(BaseButton);
    expect(button.props.onPress).toEqual(mockOnPress);
  });
});
