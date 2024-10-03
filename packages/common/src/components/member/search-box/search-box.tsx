// Copyright 2021 Prescryptive Health, Inc.

import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import AddressValidator from '../../../utils/validators/address.validator';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { PrimaryTextInput } from '../../inputs/primary-text/primary-text.input';
import { searchBoxContent } from './search-box.content';
import { searchBoxStyle } from './search-box.style';
export interface ISearchBoxProps {
  onSearch: (input: string) => void;
  value?: string;
  testID?: string;
}
export const SearchBox = (props: ISearchBoxProps) => {
  const [input, setInput] = useState(props.value ?? '');
  const [isValidZipSearch, setIsValidZipSearch] = useState(false);
  const content = searchBoxContent;
  const styles = searchBoxStyle;
  const testID = props.testID ?? 'searchBox';

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (e.nativeEvent.key === 'Enter') {
      search();
    }
  };

  const setZipInput = (inputValue: string) => {
    if (inputValue.length <= 5) {
      if (AddressValidator.isZipAllDigits(inputValue)) {
        setInput(inputValue);
      }
      setIsValidZipSearch(AddressValidator.isZipValid(inputValue));
    }
  };

  const search = () => {
    props.onSearch(input);
  };

  return (
    <View style={styles.searchSectionStyle} testID={testID}>
      <PrimaryTextInput
        keyboardType={'phone-pad'}
        onChangeText={setZipInput}
        placeholder={content.placeholder}
        value={input}
        maxLength={5}
        onKeyPress={handleKeyPress}
        testID={`${testID}-input`}
      />
      <TouchableOpacity
        style={
          isValidZipSearch
            ? styles.searchIconHolderStyleEnabled
            : styles.searchIconHolderStyleDisabled
        }
        onPress={search}
        disabled={!isValidZipSearch}
        testID={`${testID}-search`}
      >
        <FontAwesomeIcon
          name='search'
          size={16}
          style={styles.searchIconStyle}
        />
      </TouchableOpacity>
    </View>
  );
};
