// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { PrimaryColor } from '../../../theming/colors';
import { IconSize } from '../../../theming/icons';
import { CardContainer } from '../../containers/card/card.container';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { BaseText } from '../../text/base-text/base-text';
import { Heading } from '../../member/heading/heading';
import { LineSeparator } from '../../member/line-separator/line-separator';
import { ICardProps } from '../card-props';
import { expandableCardStyles } from './expandable.card.styles';

export type ExpandableCardState = 'collapsed' | 'expanded';

export interface IExpandableCardProps extends ICardProps {
  initialState?: ExpandableCardState;
  collapsedContent?: ReactNode | (() => ReactNode);
  collapsedTitle: string;
  expandedContent: ReactNode | (() => ReactNode);
  expandedTitle?: string;
  translateTitleContent?: boolean;
  testID?: string;
  hideLine?: boolean;
}

export const ExpandableCard = (props: IExpandableCardProps): ReactElement => {
  const {
    viewStyle,
    initialState,
    collapsedContent,
    collapsedTitle,
    expandedContent,
    expandedTitle,
    headingLevel = 3,
    isSingleton,
    isSkeleton,
    testID = 'expandableCard',
    hideLine,
    translateTitleContent,
  } = props;

  const [showFullCard, setShowFullCard] = useState<boolean>(
    initialState === 'expanded'
  );
  const toggleExpand = () => setShowFullCard(!showFullCard);

  const getContent = (): ReactNode => {
    const currentContent = showFullCard ? expandedContent : collapsedContent;
    return typeof currentContent === 'function'
      ? currentContent()
      : currentContent;
  };

  const title = showFullCard ? expandedTitle ?? collapsedTitle : collapsedTitle;

  const content = getContent();

  const iconName = showFullCard ? 'chevron-up' : 'chevron-down';
  const lineSeparator = !hideLine ? (
    <LineSeparator viewStyle={expandableCardStyles.lineSeparatorViewStyle} />
  ) : null;

  return (
    <CardContainer isSingleton={isSingleton} style={viewStyle} testID={testID}>
      <Heading level={headingLevel} translateContent={translateTitleContent}>
        <TouchableOpacity
          accessibilityRole='button'
          onPress={toggleExpand}
          style={expandableCardStyles.headingContainerViewStyle}
          testID={testID + 'Button'}
        >
          <BaseText
            inheritStyle={true}
            isSkeleton={isSkeleton}
            skeletonWidth='medium'
          >
            {title}
          </BaseText>
          <FontAwesomeIcon
            name={iconName}
            size={IconSize.big}
            color={PrimaryColor.darkBlue}
            style={expandableCardStyles.expandIconViewStyle}
          />
        </TouchableOpacity>
      </Heading>
      {content}
      {lineSeparator}
    </CardContainer>
  );
};
