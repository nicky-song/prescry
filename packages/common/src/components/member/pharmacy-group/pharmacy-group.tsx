// Copyright 2022 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { View, ViewStyle } from 'react-native';
import { IPharmacyDrugPrice } from '../../../models/pharmacy-drug-price';
import { ShowMoreButton } from '../../buttons/show-more/show-more.button';
import { pharmacyGroupStyles as styles } from './pharmacy-group.styles';
import { pharmacyGroupContent as content } from './pharmacy-group.content';
import { PharmacyInfoCard } from '../cards/pharmacy-info/pharmacy-info.card';
import { LineSeparator } from '../line-separator/line-separator';
import pickAPharmacyFormatter from '../../../utils/formatters/pick-a-pharmacy.formatter';
import { getNewDate } from '../../../utils/date-time/get-new-date';
import { IPickAPharmacyOnPress } from '../../../experiences/guest-experience/pick-a-pharmacy/pick-a-pharmacy';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { IOpenStatusContent } from '../../../utils/formatters/date.formatter';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';

export interface IPharmacyGroupProps {
  onPharmacyPress: (args: IPickAPharmacyOnPress) => void;
  pharmacyInfoList: IPharmacyDrugPrice[];
  viewStyle?: ViewStyle;
}

export const PharmacyGroup = ({
  onPharmacyPress,
  pharmacyInfoList,
  viewStyle,
}: IPharmacyGroupProps) => {
  const [showPharmacies, setShowPharmacies] = useState(false);

  const pharmacyOpenStatusGroupKey = CmsGroupKey.pharmacyOpenStatus;

  const { content: pharmacyOpenStatus } = useContent<IOpenStatusContent>(
    pharmacyOpenStatusGroupKey,
    2
  );

  const handlePress = () => {
    setShowPharmacies(!showPharmacies);
  };

  const pharmacyGroupSize = pharmacyInfoList.length;

  const showMoreButtonMessage = `${content.showMessage} ${pharmacyGroupSize} ${
    pharmacyGroupSize === 1
      ? content.singularLocationMessage
      : content.pluralLocationMessage
  }`;

  const now = getNewDate();

  return (
    <View style={[styles.pharmacyGroupViewStyle, viewStyle]}>
      <ShowMoreButton
        onPress={handlePress}
        message={showMoreButtonMessage}
        testID='pharmacyGroupShowMoreButton'
      />

      {showPharmacies &&
        pharmacyInfoList.map(
          (pharmacyDrugPrice: IPharmacyDrugPrice, index: number) => {
            const { ncpdp, hours, twentyFourHours } =
              pharmacyDrugPrice.pharmacy;

            const onPressHandler = () => {
              onPharmacyPress({
                ncpdp,
                isBestPrice: false,
                isBestValue: false,
                pharmacyDrugPrice,
              });
            };

            const openStatus = pickAPharmacyFormatter.formatOpenStatus(
              now,
              hours,
              twentyFourHours,
              pharmacyOpenStatus
            );

            return (
              <View style={styles.pharmacyInfoCardParentViewStyle} key={index}>
                <PharmacyInfoCard
                  onPress={onPressHandler}
                  address={pharmacyDrugPrice.pharmacy.address}
                  ncpdp={pharmacyDrugPrice.pharmacy.ncpdp}
                  distance={pharmacyDrugPrice.pharmacy.distance}
                  serviceStatus={openStatus}
                  viewStyle={styles.pharmacyInfoCardViewStyle}
                  testID={`pharmacyInfoCard-${pharmacyDrugPrice.pharmacy.ncpdp}`}
                />
                {index !== pharmacyGroupSize - 1 && (
                  <LineSeparator viewStyle={styles.lineSeparatorViewStyle} />
                )}
              </View>
            );
          }
        )}
    </View>
  );
};
