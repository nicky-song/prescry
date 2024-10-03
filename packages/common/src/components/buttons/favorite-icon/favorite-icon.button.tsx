// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement, useEffect, useState } from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { useMembershipContext } from '../../../experiences/guest-experience/context-providers/membership/use-membership-context.hook';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { useIsMounted } from '../../../hooks/use-is-mounted/use-is-mounted.hook';
import { IGlobalContent } from '../../../models/cms-content/global.content';
import { NotificationColor } from '../../../theming/colors';
import { IconSize } from '../../../theming/icons';
import { isPharmacyFavorited } from '../../../utils/validators/is-pharmacy-favorited.validator';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { favoriteIconButtonStyles as styles } from './favorite-icon.button.styles';

export type FavoritingAction = 'favoriting' | 'unfavoriting';
export interface IFavoriteIconButtonProps {
  onPress: () => Promise<void>;
  ncpdp: string;
  viewStyle?: StyleProp<ViewStyle>;
  testID?: string;
  isDisabled?: boolean;
}

export const FavoriteIconButton = ({
  onPress,
  ncpdp,
  viewStyle,
  testID,
  isDisabled,
}: IFavoriteIconButtonProps): ReactElement => {
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  const isMounted = useIsMounted();

  const isSolid = isFavorited;
  const isRegular = !isFavorited;

  const {
    membershipState: {
      account: { favoritedPharmacies },
    },
  } = useMembershipContext();

  useEffect(() => {
    setIsFavorited(isPharmacyFavorited(ncpdp, favoritedPharmacies));
  }, [favoritedPharmacies]);

  const setFavoritingAction = async () => {
    if (isMounted.current) {
      setIsFavorited(!isFavorited);
      await onPress();
    }
  };

  const groupKey = CmsGroupKey.global;

  const {
    content: { favoriteIconButton, unfavoriteIconButton },
  } = useContent<IGlobalContent>(groupKey, 2);

  const accessibilityLabel = isFavorited
    ? unfavoriteIconButton
    : favoriteIconButton;

  return (
    <TouchableOpacity
      style={[styles.viewStyle, viewStyle]}
      onPress={setFavoritingAction}
      accessibilityLabel={accessibilityLabel}
      disabled={isDisabled}
      testID={testID}
    >
      <FontAwesomeIcon
        name='heart'
        solid={isSolid}
        regular={isRegular}
        color={NotificationColor.heartRed}
        size={IconSize.regular}
      />
    </TouchableOpacity>
  );
};
