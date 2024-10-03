// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import { ImageAsset } from '../../image-asset/image-asset';
import { claimAlertSavingDetailsStyle } from './claim-alert-saving-details.style';
import { MoneyFormatter } from '../../../utils/formatters/money-formatter';
import { IClaimsAlertSavingsProps } from '../../../experiences/guest-experience/claim-alert-screen/claim-alert-screen.content';
import { ImageInstanceNames } from '../../../theming/assets';
import { BaseText } from '../../text/base-text/base-text';
import { IconSize } from '../../../theming/icons';
import { NotificationColor } from '../../../theming/colors';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';

export const ClaimAlertSavingDetails = (props: IClaimsAlertSavingsProps) => {
  return (
    <View style={claimAlertSavingDetailsStyle.savingDetailsContainer}>
      <View style={claimAlertSavingDetailsStyle.savingDetailView}>
        <View style={claimAlertSavingDetailsStyle.imageContainerView}>
          {props.imageName === 'check-circle' ? (
            <FontAwesomeIcon
              name='check-circle'
              size={IconSize.medium}
              color={NotificationColor.green}
              solid={true}
            />
          ) : (
            <ImageAsset
              name={props.imageName as ImageInstanceNames}
              style={claimAlertSavingDetailsStyle.imageStyle}
            />
          )}
        </View>
        <BaseText
          children={props.heading}
          style={claimAlertSavingDetailsStyle.savingText}
        />
        {props.price ? (
          <BaseText
            children={MoneyFormatter.format(props.price)}
            style={claimAlertSavingDetailsStyle.savingPrice}
          />
        ) : null}
      </View>
      <View style={claimAlertSavingDetailsStyle.savingDescriptionContainer}>
        {props.subHeading ? (
          <View
            style={claimAlertSavingDetailsStyle.savingDescriptionTextContainer}
          >
            <BaseText
              children={props.subHeading}
              style={claimAlertSavingDetailsStyle.savingDescriptionText}
            />
          </View>
        ) : null}
        <View style={claimAlertSavingDetailsStyle.savingActionTextContainer}>
          <BaseText
            children={props.description}
            style={claimAlertSavingDetailsStyle.savingActionText}
          />
        </View>
      </View>
    </View>
  );
};
