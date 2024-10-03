// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { View, GestureResponderEvent } from 'react-native';
import markdownHelper from '../../../../utils/markdown/markdown.helper';
import { PrimaryCheckBox } from '../../../checkbox/primary-checkbox/primary-checkbox';
import { MarkdownText } from '../../../text/markdown-text/markdown-text';
import { linkCheckboxStyles } from './link.checkbox.styles';

export interface ILinkCheckboxProps {
  checkboxValue: string;
  onCheckboxPress: (checkboxChecked: boolean, checkboxValue: string) => void;
  onLinkPress: (url: string) => boolean;
  markdown: string;
  checkboxChecked?: boolean;
  testID?: string;
}

export const LinkCheckbox = ({
  checkboxValue,
  onCheckboxPress,
  onLinkPress,
  markdown,
  checkboxChecked,
  testID,
}: ILinkCheckboxProps): ReactElement => {
  const linkTextList = markdownHelper.getLinkText(markdown);

  const rejectIfContentHasClickEvent = (evt: GestureResponderEvent) => {
    const target = evt.nativeEvent.target as unknown as { innerText: string };

    if (linkTextList.indexOf(target?.innerText) !== -1) {
      evt.stopPropagation();
      return true;
    }

    return false;
  };

  return (
    <PrimaryCheckBox
      {...(testID && { testID: `${testID}LinkCheckBox` })}
      onPress={onCheckboxPress}
      checkBoxValue={checkboxValue}
      checkBoxChecked={checkboxChecked}
      checkBoxLabel={
        <View onStartShouldSetResponderCapture={rejectIfContentHasClickEvent}>
          <MarkdownText
            textStyle={linkCheckboxStyles.baseTextStyle}
            onLinkPress={onLinkPress}
          >
            {markdown}
          </MarkdownText>
        </View>
      }
    />
  );
};
