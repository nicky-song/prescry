// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { TouchableOpacity } from 'react-native';
import renderer from 'react-test-renderer';
import { PurpleScale } from '../../../theming/theme';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { BackSpaceButton, IBackSpaceButtonProps } from './backspace-button';

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

const backSpaceButtonProps: IBackSpaceButtonProps = {
  onPress: jest.fn(),
};

describe('BackSpaceButton', () => {
  it('should have OnPress action on BackSpaceButton click', () => {
    const backSpaceButton = renderer.create(
      <BackSpaceButton {...backSpaceButtonProps} testID='mockTestID' />
    );
    const props = backSpaceButton.root.findByType(TouchableOpacity)
      .props as IBackSpaceButtonProps;
    expect(props.onPress).toBe(backSpaceButtonProps.onPress);
    expect(props.testID).toEqual('mockTestID');
  });

  it('should have backspace icon when backspace button renders', () => {
    const backSpaceButton = renderer.create(
      <BackSpaceButton {...backSpaceButtonProps} />
    );
    const imageProps = backSpaceButton.root.findByType(FontAwesomeIcon).props;
    expect(imageProps.name).toBe('backspace');
    expect(imageProps.solid).toEqual(true);
    expect(imageProps.size).toBe(36);
    expect(imageProps.color).toBe(PurpleScale.darkest);
  });
});
