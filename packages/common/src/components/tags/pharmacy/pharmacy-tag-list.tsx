// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { ViewStyle } from 'react-native';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IGlobalContent } from '../../../models/cms-content/global.content';
import { NotificationColor } from '../../../theming/colors';
import { TagList } from '../../lists/tag/tag.list';
import { IBaseTagProps } from '../base/base.tag';
import { pharmacyTagListStyles } from './pharmacy-tag-list.styles';

export interface IPharmacyTagList {
  viewStyle?: ViewStyle;
  isBestValue?: boolean;
  isFavoritedPharmacy?: boolean;
  isHomeDelivery?: boolean;
}
export const PharmacyTagList = ({
  viewStyle,
  isBestValue,
  isFavoritedPharmacy,
  isHomeDelivery,
}: IPharmacyTagList): ReactElement | null => {
  const groupKey = CmsGroupKey.global;
  const { content, isContentLoading } = useContent<IGlobalContent>(groupKey, 2);

  const bestValueTagLabel = content.bestValueLabel;

  const bestValueTagProps: IBaseTagProps | undefined = isBestValue
    ? {
        label: bestValueTagLabel,
        labelTextStyle: pharmacyTagListStyles.bestValueLabelTextStyle,
        isSkeleton: isContentLoading,
        viewStyle: pharmacyTagListStyles.bestValueTagViewStyle,
      }
    : undefined;

  const favoritedPharmacyTagLabel = content.favoriteTagLabel;
  const favoritedPharmacyTagIconName = 'heart';
  const favoritedPharmacyTagIconSolid = true;
  const favoritedPharmacyTagIconColor = NotificationColor.heartRed;

  const favoritedPharmacyTagProps: IBaseTagProps | undefined =
    isFavoritedPharmacy
      ? {
          label: favoritedPharmacyTagLabel,
          labelTextStyle: pharmacyTagListStyles.favoritedPharmacyLabelTextStyle,
          iconName: favoritedPharmacyTagIconName,
          iconSolid: favoritedPharmacyTagIconSolid,
          iconColor: favoritedPharmacyTagIconColor,
          isSkeleton: isContentLoading,
          viewStyle: pharmacyTagListStyles.favoritedPharmacyTagViewStyle,
        }
      : undefined;

  const homeDeliveryTagLabel = content.homeDeliveryLabel;

  const homeDeliveryTagProps: IBaseTagProps | undefined = isHomeDelivery
    ? {
        label: homeDeliveryTagLabel,
        labelTextStyle: pharmacyTagListStyles.homeDeliveryLabelTextStyle,
        isSkeleton: isContentLoading,
        viewStyle: pharmacyTagListStyles.homeDeliveryTagViewStyle,
      }
    : undefined;

  const baseTagProps: (IBaseTagProps | undefined)[] = [
    bestValueTagProps,
    favoritedPharmacyTagProps,
    homeDeliveryTagProps,
  ];

  const tagList: IBaseTagProps[] = [];

  baseTagProps.forEach((tagProps) => {
    if (tagProps !== undefined) tagList.push(tagProps);
  });

  if (!isBestValue && !isFavoritedPharmacy && !isHomeDelivery) {
    return null;
  }

  return <TagList tags={tagList} viewStyle={viewStyle} />;
};
