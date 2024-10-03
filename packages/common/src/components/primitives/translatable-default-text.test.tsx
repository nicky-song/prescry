// Copyright 2022 Prescryptive Health, Inc.

import React, { useRef, useEffect, useState } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { ViewStyle } from 'react-native';
import { TransPerfectConstants } from '../../models/transperfect';
import { TranslatableDefaultText } from './translatable-default-text';
import { DefaultText } from './default-text';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
  useRef: jest.fn(),
}));
const useStateMock = useState as jest.Mock;
const useEffectMock = useEffect as jest.Mock;
const useRefMock = useRef as jest.Mock;
const setClassAppliedMock = jest.fn();

const useRefMockReturn = {
  current: { setNativeProps: jest.fn() },
};

const nullCurrentRef = { current: null };
Object.defineProperty(nullCurrentRef, 'current', {
  get: jest.fn(() => null),
  set: jest.fn(() => null),
});

describe('TranslatableDefaultText', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    useStateMock.mockReturnValueOnce([false, setClassAppliedMock]);
  });

  it('renders as DefaultText and passes props', () => {
    const styleMock: ViewStyle = { backgroundColor: 'red' };
    useRefMock.mockReturnValue(useRefMockReturn);
    const testRenderer = renderer.create(
      <TranslatableDefaultText style={styleMock} children={undefined} />
    );

    const defaultText = testRenderer.root.children[0] as ReactTestInstance;

    expect(defaultText.type).toEqual(DefaultText);
    expect(defaultText.props.style).toEqual(styleMock);
  });

  it('does not call setClassApplied when textRef.current does not exist', () => {
    useRefMock.mockReturnValue(nullCurrentRef);
    const mockChildren = <div />;
    const testRenderer = renderer.create(
      <TranslatableDefaultText>{mockChildren}</TranslatableDefaultText>
    );

    const effectHandler = useEffectMock.mock.calls[0][0];
    effectHandler();

    const defaultText = testRenderer.root.children[0] as ReactTestInstance;

    expect(setClassAppliedMock).not.toHaveBeenCalled();
    expect(useRefMockReturn.current.setNativeProps).not.toHaveBeenCalled();
    expect(defaultText.type).toEqual(DefaultText);
    expect(defaultText.props.children).toEqual(undefined);
  });

  it('calls setClassApplied with true when textRef.current exists', () => {
    useRefMock.mockReturnValue(useRefMockReturn);
    renderer.create(<TranslatableDefaultText children={undefined} />);

    const effectHandler = useEffectMock.mock.calls[0][0];
    effectHandler();

    expect(setClassAppliedMock).toHaveBeenCalledWith(true);
    expect(useRefMockReturn.current.setNativeProps).toHaveBeenCalledWith({
      className: TransPerfectConstants.includeClass,
    });
  });

  it('passes children when classApplied', () => {
    useRefMock.mockReturnValue(useRefMockReturn);
    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce([true, jest.fn()]);
    const mockChildren = <div />;
    const testRenderer = renderer.create(
      <TranslatableDefaultText>{mockChildren}</TranslatableDefaultText>
    );

    const defaultText = testRenderer.root.children[0] as ReactTestInstance;
    const effectHandler = useEffectMock.mock.calls[0][0];
    effectHandler();

    expect(defaultText.type).toEqual(DefaultText);
    expect(defaultText.props.children).toEqual(mockChildren);
  });
});
