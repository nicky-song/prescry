// Copyright 2021 Prescryptive Health, Inc.

import React, { FunctionComponent } from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { Heading } from '../heading/heading';
import { prescriptionTitleStyles } from './prescription-title.styles';
import { LineSeparator } from '../line-separator/line-separator';
import { prescriptionTitleContent } from './prescription-title.content';
import { SquareButton } from '../../buttons/square-button/square.button';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { goToUrl } from '../../../utils/link.helper';
import { DrugDetailsText } from '../../text/drug-details/drug-details.text';
import { ClaimAlertDrugDetailsText } from '../../text/claim-alert-drug-details/claim-alert-drug-details.text';

export interface IPrescriptionTitleProps {
  productName: string;
  strength?: string;
  unit?: string;
  quantity: number;
  refills?: number;
  formCode: string;
  supply?: number;
  infoLink?: string;
  headingLevel?: number;
  onPressButton?: () => void;
  hideSeparator?: boolean;
  isSkeleton?: boolean;
  isClaimAlert?: boolean;
  testID?: string;
  viewStyle?: ViewStyle;
}

export const PrescriptionTitle: FunctionComponent<IPrescriptionTitleProps> = ({
  productName,
  strength,
  quantity,
  refills,
  formCode,
  unit,
  supply,
  infoLink,
  headingLevel = 3,
  onPressButton,
  hideSeparator,
  isSkeleton,
  isClaimAlert,
  testID,
  viewStyle,
}) => {
  const goToInfoLinkUrl = async () => {
    if (infoLink) {
      return await goToUrl(infoLink);
    }
    return undefined;
  };

  const heading = (
    <Heading
      level={headingLevel}
      textStyle={prescriptionTitleStyles.headingTextStyle}
      isSkeleton={isSkeleton}
      skeletonWidth='long'
      translateContent={false}
    >
      {productName}
    </Heading>
  );

  const renderTitle = infoLink ? (
    <TouchableOpacity
      onPress={goToInfoLinkUrl}
      style={prescriptionTitleStyles.rowContainerViewStyle}
    >
      {heading}
      <FontAwesomeIcon
        name='external-link-alt'
        style={prescriptionTitleStyles.iconTextStyle}
      />
    </TouchableOpacity>
  ) : (
    heading
  );

  const renderEditButton = onPressButton ? (
    <SquareButton
      onPress={onPressButton}
      viewStyle={prescriptionTitleStyles.editButtonViewStyle}
      isSkeleton={isSkeleton}
      testID={testID}
    >
      {prescriptionTitleContent.editButtonLabel}
    </SquareButton>
  ) : null;

  const separator = hideSeparator ? null : (
    <LineSeparator viewStyle={prescriptionTitleStyles.separatorViewStyle} />
  );

  const drugDetailsTextProps = {
    strength,
    unit,
    quantity,
    formCode,
    refills,
    supply,
    viewStyle: prescriptionTitleStyles.detailsTextViewStyle,
  };

  const drugDetailsText = isClaimAlert ? (
    <ClaimAlertDrugDetailsText {...drugDetailsTextProps} />
  ) : (
    <DrugDetailsText {...drugDetailsTextProps} />
  );

  return (
    <View style={[viewStyle, prescriptionTitleStyles.containerViewStyle]}>
      {renderTitle}
      <View style={prescriptionTitleStyles.detailsContainerViewStyle}>
        {drugDetailsText}
        {renderEditButton}
      </View>
      {separator}
    </View>
  );
};
