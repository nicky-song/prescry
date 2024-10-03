// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { useEffect, useState } from 'react';
import { TextStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { ISessionContext } from '../../../../experiences/guest-experience/context-providers/session/session.context';
import { useSessionContext } from '../../../../experiences/guest-experience/context-providers/session/use-session-context.hook';
import { setCurrentLanguageDispatch } from '../../../../experiences/guest-experience/state/session/dispatch/set-current-language.dispatch';
import { defaultSessionState } from '../../../../experiences/guest-experience/state/session/session.state';
import { LanguagePicker } from './language.picker';
import { BasePicker } from '../base/base.picker';
import { languagePickerStyles } from './language.picker.styles';
import { Language, defaultLanguage } from '../../../../models/language';
import { updateURLWithFeatureFlagsAndLanguage } from '../../../../experiences/guest-experience/store/navigation/update-url-with-feature-flags-and-language';

jest.mock('../base/base.picker', () => ({
  BasePicker: () => <div />,
}));

jest.mock(
  '../../../../experiences/guest-experience/context-providers/session/use-session-context.hook'
);
const useSessionContextMock = useSessionContext as jest.Mock;

jest.mock(
  '../../../../experiences/guest-experience/state/session/dispatch/set-current-language.dispatch'
);
const setCurrentLanguageDispatchMock = setCurrentLanguageDispatch as jest.Mock;

jest.mock(
  '../../../../experiences/guest-experience/store/navigation/update-url-with-feature-flags-and-language'
);
const updateURLWithFeatureFlagsAndLanguageMock =
  updateURLWithFeatureFlagsAndLanguage as jest.Mock;

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;
const useStateMock = useState as jest.Mock;

const sessionDispatchMock = jest.fn();

interface IStateCalls {
  selectedValue: [string, jest.Mock];
  options: [Map<string, string>, jest.Mock];
}

const selectedValueMock: Language = 'English';

const defaultOptionsMock = new Map<string, string>([
  ['English', 'English'],
  ['Spanish', 'Spanish'],
]);

const pickerStyleMock: TextStyle = {
  backgroundColor: 'red',
};

function stateReset({
  selectedValue = [selectedValueMock, jest.fn()],
  options = [defaultOptionsMock, jest.fn()],
}: Partial<IStateCalls>) {
  useStateMock.mockReset();
  useStateMock.mockReturnValueOnce(selectedValue);
  useStateMock.mockReturnValueOnce(options);
}

describe('LanguagePicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const sessionContextMock: ISessionContext = {
      sessionState: defaultSessionState,
      sessionDispatch: sessionDispatchMock,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);

    stateReset({});
  });

  it('should render LanguagePicker correctly', () => {
    const testRenderer = renderer.create(
      <LanguagePicker textStyle={pickerStyleMock} />
    );
    expect((testRenderer.root.children[0] as ReactTestInstance).type).toEqual(
      BasePicker
    );
    const picker = testRenderer.root.findByType(BasePicker);
    expect(picker.props.onValueChange).toBeDefined();
    expect(picker.props.style).toEqual([
      languagePickerStyles.pickerTextStyle,
      pickerStyleMock,
    ]);
    expect(picker.props.enabled).toEqual(true);
    expect(picker.props.selectedValue).toEqual(defaultLanguage);
  });

  it('should set default language', () => {
    stateReset({ selectedValue: ['UnknownLanguage', jest.fn()] });
    const testRenderer = renderer.create(<LanguagePicker />);
    const picker = testRenderer.root.findByType(BasePicker);
    const onValueChange = picker.props.onValueChange;

    onValueChange('UnknownLanguage', 0);

    expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), [
      'UnknownLanguage',
    ]);

    const effectHandler = useEffectMock.mock.calls[0][0];
    effectHandler();

    const expectedOptions = new Map<string, string>([
      ['English', 'English'],
      ['Spanish', 'Spanish'],
    ]);

    expect(useStateMock).toHaveBeenCalledWith(expectedOptions);
    expect(setCurrentLanguageDispatchMock).toHaveBeenCalledWith(
      sessionDispatchMock,
      'English'
    );
    expect(updateURLWithFeatureFlagsAndLanguageMock).toHaveBeenCalledWith(
      '/',
      'en'
    );
  });

  it('should retain pathname', () => {
    stateReset({ selectedValue: ['UnknownLanguage', jest.fn()] });
    const testRenderer = renderer.create(<LanguagePicker />);
    const picker = testRenderer.root.findByType(BasePicker);
    const onValueChange = picker.props.onValueChange;

    onValueChange('UnknownLanguage', 0);

    expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), [
      'UnknownLanguage',
    ]);

    const effectHandler = useEffectMock.mock.calls[0][0];
    effectHandler();

    const expectedOptions = new Map<string, string>([
      ['English', 'English'],
      ['Spanish', 'Spanish'],
    ]);

    expect(useStateMock).toHaveBeenCalledWith(expectedOptions);
    expect(setCurrentLanguageDispatchMock).toHaveBeenCalledWith(
      sessionDispatchMock,
      'English'
    );
    expect(updateURLWithFeatureFlagsAndLanguageMock).toHaveBeenCalledWith(
      '/',
      'en'
    );
  });

  it('should set selected language if selectedValue changes', () => {
    stateReset({ selectedValue: ['Spanish', jest.fn()] });
    const testRenderer = renderer.create(<LanguagePicker />);
    const picker = testRenderer.root.findByType(BasePicker);
    const onValueChange = picker.props.onValueChange;

    onValueChange('Spanish', 0);

    expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), [
      'Spanish',
    ]);

    const effectHandler = useEffectMock.mock.calls[0][0];
    effectHandler();

    expect(setCurrentLanguageDispatchMock).toHaveBeenCalledWith(
      sessionDispatchMock,
      'Spanish'
    );
    expect(updateURLWithFeatureFlagsAndLanguageMock).toHaveBeenCalledWith(
      '/',
      'es'
    );
  });

  it('should set selected language if selectedValue changes to English', () => {
    stateReset({ selectedValue: ['English', jest.fn()] });
    const testRenderer = renderer.create(<LanguagePicker />);
    const picker = testRenderer.root.findByType(BasePicker);
    const onValueChange = picker.props.onValueChange;

    expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), [
      'English',
    ]);

    const effectHandler = useEffectMock.mock.calls[0][0];
    effectHandler();

    onValueChange('English', 0);

    expect(setCurrentLanguageDispatchMock).toHaveBeenCalledWith(
      sessionDispatchMock,
      'English'
    );
    expect(updateURLWithFeatureFlagsAndLanguageMock).toHaveBeenCalledWith(
      '/',
      'en'
    );
  });
});
