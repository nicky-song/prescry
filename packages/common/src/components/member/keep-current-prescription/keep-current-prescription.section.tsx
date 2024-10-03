// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { BaseButton } from '../../buttons/base/base.button';
import { BaseText } from '../../text/base-text/base-text';
import { Heading } from '../heading/heading';
import { PharmacyHoursContainer } from '../pharmacy-hours-container/pharmacy-hours-container';
import { PrescriptionPharmacyInfo } from '../prescription-pharmacy-info/prescription-pharmacy-info';
import { IKeepCurrentPrescriptionSectionContent } from './keep-current-prescription.section.content';
import { keepCurrentPrescriptionSectionStyles } from './keep-current-prescription.section.styles';

export interface IKeepCurrentPrescriptionSectionProps {
  pharmacyName: string;
  pharmacyNcpdp: string;
  pharmacyAddress1: string;
  pharmacyCity: string;
  pharmacyZipCode: string;
  pharmacyState: string;
  pharmacyPhoneNumber: string;
  pharmacyHours: Map<string, string>;
  onKeepCurrentPrescriptionPress: () => void;
  viewStyle?: ViewStyle;
}

export const KeepCurrentPrescriptionSection = ({
  pharmacyName,
  pharmacyNcpdp,
  pharmacyAddress1,
  pharmacyCity,
  pharmacyZipCode,
  pharmacyState,
  pharmacyPhoneNumber,
  pharmacyHours,
  onKeepCurrentPrescriptionPress,
  viewStyle,
}: IKeepCurrentPrescriptionSectionProps) => {
  const { content, isContentLoading } =
    useContent<IKeepCurrentPrescriptionSectionContent>(
      CmsGroupKey.keepCurrentPrescriptionSection,
      2
    );

  return (
    <View style={viewStyle}>
      <Heading
        level={2}
        textStyle={keepCurrentPrescriptionSectionStyles.headingTextStyle}
        isSkeleton={isContentLoading}
      >
        {content.heading}
      </Heading>
      <BaseText
        style={keepCurrentPrescriptionSectionStyles.descriptionTextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='long'
      >
        {content.description}
      </BaseText>
      <PrescriptionPharmacyInfo
        phoneNumber={pharmacyPhoneNumber}
        pharmacyAddress1={pharmacyAddress1}
        pharmacyCity={pharmacyCity}
        pharmacyZipCode={pharmacyZipCode}
        pharmacyState={pharmacyState}
        title={pharmacyName}
        ncpdp={pharmacyNcpdp}
      />
      <PharmacyHoursContainer
        pharmacyHours={pharmacyHours}
        viewStyle={
          keepCurrentPrescriptionSectionStyles.pharmacyHoursContainerViewStyle
        }
      />
      <BaseButton
        onPress={onKeepCurrentPrescriptionPress}
        viewStyle={
          keepCurrentPrescriptionSectionStyles.keepCurrentPrescriptionButtonViewStyle
        }
        textStyle={
          keepCurrentPrescriptionSectionStyles.keepCurrentPrescriptionButtonTextStyle
        }
        testID='keepCurrentPrescriptionButton'
      >
        {content.buttonLabel}
      </BaseButton>
    </View>
  );
};
