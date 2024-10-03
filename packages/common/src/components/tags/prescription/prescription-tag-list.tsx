// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { ViewStyle } from 'react-native';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IGlobalContent } from '../../../models/cms-content/global.content';
import { MoneyFormatter } from '../../../utils/formatters/money-formatter';
import { TagList } from '../../lists/tag/tag.list';
import { IBaseTagProps } from '../base/base.tag';
import { prescriptionTagListStyles } from './prescription-tag-list.styles';

export interface IPrescriptionTagListProps {
  viewStyle?: ViewStyle;
  memberSaves: number;
  planSaves: number;
}

export const PrescriptionTagList = ({
  viewStyle,
  memberSaves,
  planSaves,
}: IPrescriptionTagListProps): ReactElement | null => {
  const groupKey = CmsGroupKey.global;
  const { content, isContentLoading } = useContent<IGlobalContent>(groupKey, 2);

  const savingsAmountHandler = (savingsAmount: number) => {
    if (savingsAmount < 1) {
      return undefined;
    }

    return MoneyFormatter.format(savingsAmount, true);
  };

  if (!memberSaves && !planSaves) {
    return null;
  }

  const memberSavesTagLabel = memberSaves
    ? content.memberSavesTagLabel
    : undefined;

  const memberSavesTagProps: IBaseTagProps | undefined =
    memberSavesTagLabel !== undefined &&
    savingsAmountHandler(memberSaves) !== undefined
      ? {
          label: `${memberSavesTagLabel} ${savingsAmountHandler(memberSaves)}`,
          labelTextStyle: prescriptionTagListStyles.memberSavesTagTextStyle,
          isSkeleton: isContentLoading,
          viewStyle: prescriptionTagListStyles.memberSavesTagViewStyle,
          testID: 'memberSavesTag',
        }
      : undefined;

  const planSavesTagLabel = planSaves ? content.planSavesTagLabel : undefined;

  const planSavesTagProps: IBaseTagProps | undefined =
    planSavesTagLabel !== undefined &&
    savingsAmountHandler(planSaves) !== undefined
      ? {
          label: `${planSavesTagLabel} ${savingsAmountHandler(planSaves)}`,
          labelTextStyle: prescriptionTagListStyles.planSavesTagTextStyle,
          isSkeleton: isContentLoading,
          viewStyle: prescriptionTagListStyles.planSavesTagViewStyle,
          testID: 'planSavesTag',
        }
      : undefined;

  const baseTagProps: (IBaseTagProps | undefined)[] = [
    memberSavesTagProps,
    planSavesTagProps,
  ];

  const tagList: IBaseTagProps[] = [];

  baseTagProps.forEach((tagProps) => {
    if (tagProps !== undefined) tagList.push(tagProps);
  });

  return <TagList tags={tagList} viewStyle={viewStyle} />;
};
