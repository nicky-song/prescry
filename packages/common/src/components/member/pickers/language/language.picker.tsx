// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactNode, useEffect, useState } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { useSessionContext } from '../../../../experiences/guest-experience/context-providers/session/use-session-context.hook';
import { setCurrentLanguageDispatch } from '../../../../experiences/guest-experience/state/session/dispatch/set-current-language.dispatch';
import { languagePickerContent } from './language.picker.content';
import { languagePickerStyles } from './language.picker.styles';
import { Picker } from '@react-native-picker/picker';
import { BasePicker } from '../base/base.picker';
import { ItemValue } from '@react-native-picker/picker/typings/Picker';
import {
  Language,
  defaultLanguage,
  LanguageCode,
} from '../../../../models/language';
import { updateURLWithFeatureFlagsAndLanguage } from '../../../../experiences/guest-experience/store/navigation/update-url-with-feature-flags-and-language';

export interface ILanguagePickerProps {
  textStyle?: StyleProp<TextStyle>;
}

export const LanguagePicker = (
  props: ILanguagePickerProps
): React.ReactElement => {
  const { textStyle } = props;

  const { sessionState, sessionDispatch } = useSessionContext();

  const [selectedValue, setSelectedValue] = useState(
    sessionState.currentLanguage
  );
  const [options, setOptions] = useState(languagePickerContent.defaultOptions);

  const setCurrentLanguage = (language: Language) => {
    setCurrentLanguageDispatch(sessionDispatch, language);
  };

  const updateQueryParamLanguage = (lang: LanguageCode) => {
    updateURLWithFeatureFlagsAndLanguage(location.pathname, lang);
  };

  useEffect(() => {
    switch (selectedValue) {
      case 'English':
        setCurrentLanguage(selectedValue);
        setOptions(languagePickerContent.defaultOptions);
        updateQueryParamLanguage('en');
        break;
      case 'Spanish':
        setCurrentLanguage(selectedValue);
        setOptions(languagePickerContent.spanishOptions);
        updateQueryParamLanguage('es');
        break;
      default:
        setCurrentLanguage(defaultLanguage);
        setOptions(languagePickerContent.defaultOptions);
        updateQueryParamLanguage('en');
        break;
    }
  }, [selectedValue]);

  const onSelect = (value: ItemValue, _valueIndex: number) => {
    setSelectedValue(value as Language);
  };

  const renderOptions = (): ReactNode[] => {
    const items: ReactNode[] = [];

    for (const [code, label] of options) {
      items.push(
        <Picker.Item key={`${code}-${label}`} label={label} value={code} />
      );
    }

    return items;
  };

  const { pickerTextStyle } = languagePickerStyles;

  return (
    <BasePicker
      onValueChange={onSelect}
      style={[pickerTextStyle, textStyle]}
      enabled={true}
      selectedValue={selectedValue}
    >
      {renderOptions()}
    </BasePicker>
  );
};
