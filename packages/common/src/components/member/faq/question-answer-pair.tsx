// Copyright 2021 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { View } from 'react-native';
import { BaseButton } from '../../buttons/base/base.button';
import { BaseText } from '../../text/base-text/base-text';
import { PurpleScale, FontSize } from '../../../theming/theme';
import { faqStyles as styles } from './faq.style';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';

export interface IQuestionAnswerPairProps {
  question: string;
  answer: string;
  isLast: boolean;
}

export const QuestionAnswerPair = (props: IQuestionAnswerPairProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleArrowPress = () => {
    setIsExpanded(!isExpanded);
  };

  const questionAnswerViewStyle = props.isLast
    ? styles.lastQuestionAnswerViewStyle
    : styles.questionAnswerViewStyle;

  return (
    <View style={questionAnswerViewStyle}>
      <View style={styles.questionViewStyle}>
        <BaseText style={styles.questionTextStyle}>{props.question}</BaseText>
        <BaseButton
          viewStyle={styles.arrowViewStyle}
          onPress={handleArrowPress}
        >
          {isExpanded ? (
            <FontAwesomeIcon
              name={'chevron-down'}
              size={FontSize.regular}
              color={PurpleScale.darkest}
            />
          ) : (
            <FontAwesomeIcon
              name={'chevron-up'}
              size={FontSize.regular}
              color={PurpleScale.darkest}
            />
          )}
        </BaseButton>
      </View>
      {isExpanded && (
        <View style={styles.answerViewStyle}>
          <BaseText>{props.answer}</BaseText>
        </View>
      )}
    </View>
  );
};
