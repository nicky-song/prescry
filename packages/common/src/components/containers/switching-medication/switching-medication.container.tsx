// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { ISwitchYourMedicationScreenContent } from '../../../experiences/guest-experience/screens/switch-your-medication/switch-your-medication.screen.content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { LineSeparator } from '../../member/line-separator/line-separator';
import {
  IPrescribedMedicationProps,
  PrescribedMedication,
} from '../../member/prescribed-medication/prescribed-medication';
import {
  IPrescriptionDetailsProps,
  PrescriptionDetails,
} from '../../member/prescription-details/prescription-details';
import { switchingMedicationContainerStyles } from './switching-medication.container.styles';

export interface ISwitchingMedicationContainerProps {
  prescribedMedicationProps: IPrescribedMedicationProps;
  prescriptionDetailsProps: IPrescriptionDetailsProps;
  viewStyle?: StyleProp<ViewStyle>;
}

export const SwitchingMedicationContainer = ({
  prescribedMedicationProps,
  prescriptionDetailsProps,
  viewStyle,
}: ISwitchingMedicationContainerProps): ReactElement => {
  const { content, isContentLoading } =
    useContent<ISwitchYourMedicationScreenContent>(
      CmsGroupKey.switchYourMedication,
      2
    );

  const { lineSeparatorViewStyle, prescriptionDetailsViewStyle } =
    switchingMedicationContainerStyles;

  return (
    <View style={[switchingMedicationContainerStyles.viewStyle, viewStyle]}>
      <PrescribedMedication {...prescribedMedicationProps} />
      <LineSeparator
        viewStyle={lineSeparatorViewStyle}
        label={content.switchingMedicationLabel}
        isSkeleton={isContentLoading}
      />
      <PrescriptionDetails
        {...prescriptionDetailsProps}
        viewStyle={prescriptionDetailsViewStyle}
      />
    </View>
  );
};
